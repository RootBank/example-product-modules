/**
 * Validates the alteration package request data.
 * @param {object} params
 * @param {string} params.alteration_hook_key The alteration hook identifier, as specified in `.root-config.json`.
 * @param {Record<string, any>} params.data The data received in the body of the
 *     [Create an alteration package](https://docs.rootplatform.com/reference/create-an-alteration-package-1) request
 *     (without the `key` property).
 * @param {PlatformPolicy} params.policy The policy to which the alteration package will be applied.
 * @param {PlatformPolicyholder} params.policyholder The policyholder linked to the policy.
 * @return {{error: any; result: any}} The [validation result](https://joi.dev/api/?v=12.1.0#validatevalue-schema-options-callback).
 *    If there are no errors, the `value` property will contain the validated data, which is passed to `getAlteration`.
 * @see {@link https://docs.rootplatform.com/docs/alteration-hooks Alteration hooks}
 */
const validateAlterationPackageRequest = ({ alteration_hook_key, data, policy, policyholder }) => {
  switch (alteration_hook_key) {
    case 'change_pet_excess':
      const result = validateChangePetExcess({ data, policy, policyholder });
      return result;
    default:
      throw new Error(`Invalid alteration hook key "${alteration_hook_key}"`);
  }
};

/**
 * Generates an alteration package from the alteration package request data, policy and policyholder.
 * @param {object} params
 * @param {string} params.alteration_hook_key The alteration hook identifier, as specified in `.root-config.json`.
 * @param {Record<string, any>} params.data The validated data returned by `validateAlterationPackageRequest` as `result.value`.
 * @param {PlatformPolicy} params.policy The policy to which the alteration package will be applied.
 * @param {PlatformPolicyholder} params.policyholder The policyholder linked to the policy.
 * @return {AlterationPackage} Alteration package returned by the
 *     [Create an alteration package](https://docs.rootplatform.com/reference/create-an-alteration-package-1)
 *     endpoint.
 */
const getAlteration = ({ alteration_hook_key, data, policy }) => {
  switch (alteration_hook_key) {
    case 'change_pet_excess':
      const message = updatedExcessAlterationMessage(data.pets, policy.module.pets);
      // Rebuild Policy Module with updated excess data
      const updatedPolicyModule = updatePetExcess(data, policy.module);
      // Get updated quote
      const quotePackage = getQuote(updatedPolicyModule)[0];

      // Get alteration package
      const alterationPackage = new AlterationPackage({
        input_data: data,
        sum_assured: quotePackage.sum_assured,
        monthly_premium: quotePackage.suggested_premium,
        change_description: "Alteration: " + message,
        module: {
          ...quotePackage.module,
        },
      });
      return alterationPackage;
    default:
      throw new Error(`Invalid alteration hook key "${alteration_hook_key}"`);
  }
};

/**
 * Applies the alteration package to the policy.
 * Triggered by the [Apply alteration package](https://docs.rootplatform.com/reference/apply-alteration-package-1) endpoint.
 * @param {object} params
 * @param {string} params.alteration_hook_key The alteration hook identifier, as specified in `.root-config.json`.
 * @param {PlatformPolicy} params.policy The policy to which the alteration package will be applied.
 * @param {PlatformPolicyholder} params.policyholder The policyholder linked to the policy.
 * @param {PlatformAlterationPackage} params.alteration_package The alteration package to be applied to the policy.
 * @return {AlteredPolicy} The altered policy. This object is **not** returned over the endpoint.
 *    Instead, the alteration package is returned with a status of `applied`.
 */
const applyAlteration = ({ alteration_hook_key, policy, policyholder, alteration_package }) => {
  switch (alteration_hook_key) {
    case 'change_pet_excess':
      const alteredPolicy = new AlteredPolicy({
        package_name: policy.package_name,
        sum_assured: alteration_package.sum_assured,
        base_premium: alteration_package.monthly_premium,
        monthly_premium: alteration_package.monthly_premium,
        end_date: policy.end_date,
        start_date: policy.start_date,
        module: alteration_package.module,
        charges: []
      });
      return alteredPolicy;
    default:
      throw new Error(`Invalid alteration hook key "${alteration_hook_key}"`);
  }
};
