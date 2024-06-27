/**
 * Validates the alteration package request data before passing it to the `getAlteration` function.
 * https://docs.rootplatform.com/docs/alteration-hooks#validating-an-alteration-package-request
 */
const validateAlterationPackageRequest = ({ alteration_hook_key, data }) => {
  switch (alteration_hook_key) {
    case 'update_excess':
      const result = Joi.validate(
        data,
        Joi.object()
          .keys({
            excess_amount: Joi.number()
              .integer()
              .valid([1000, 2000, 3000, 4000, 5000, 7500])
              .required(),
          })
          .required(),
        { abortEarly: false },
      );
      return result;
    default:
      throw new Error(`Invalid alteration hook key "${alteration_hook_key}"`);
  }
};

/**
 * Generates an alteration package from the alteration package request data, policy and policyholder.
 * https://docs.rootplatform.com/docs/alteration-hooks#creating-an-alteration-package
 */
const getAlteration = ({ alteration_hook_key, data, policy, policyholder }) => {
  switch (alteration_hook_key) {
    case 'update_excess':
      // calculate premium
      const basePremium = getPremium(
        policy.module.value,
        policy.module.gadget_type,
      );
      const excessAdjustedPremium = getExcessAdjustedPremium(
        basePremium,
        data.excess_amount,
      );
      const alterationPackage = new AlterationPackage({
        input_data: data,
        sum_assured: policy.module.value - data.excess_amount,
        monthly_premium: excessAdjustedPremium,
        change_description: 'Update excess payable for this gadget',
        module: {
          ...policy.module,
          ...data,
        },
      });
      return alterationPackage;
    default:
      throw new Error(`Invalid alteration hook key "${alteration_hook_key}"`);
  }
};

/**
 * Applies the alteration package to the policy.
 * https://docs.rootplatform.com/docs/alteration-hooks#applying-an-alteration-package-to-a-policy
 */
const applyAlteration = ({
  alteration_hook_key,
  policy,
  policyholder,
  alteration_package,
}) => {
  switch (alteration_hook_key) {
    case 'update_excess':
      const alteredPolicy = new AlteredPolicy({
        package_name: policy.package_name,
        sum_assured: policy.sum_assured,
        base_premium: policy.monthly_premium,
        monthly_premium: policy.monthly_premium,
        module: alteration_package.module,
        end_date: policy.end_date,
        start_date: policy.start_date,
      });
      return alteredPolicy;
    default:
      throw new Error(`Invalid alteration hook key "${alteration_hook_key}"`);
  }
};
