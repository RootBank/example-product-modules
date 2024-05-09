/**
 * Validates the alteration package request for "Change Pet Excess"
 * @param {object} params
 * @param {Record<string, any>} params.data The data received in the body of the
 *     [Create an alteration package](https://docs.rootplatform.com/reference/create-an-alteration-package-1) request
 *     (without the `key` property).
 * @param {PlatformPolicy} params.policy The policy to which the alteration package will be applied.
 * @param {PlatformPolicyholder} params.policyholder The policyholder linked to the policy.
 * @return {{error: any; result: any}} The [validation result](https://joi.dev/api/?v=12.1.0#validatevalue-schema-options-callback).
 *    If there are no errors, the `value` property will contain the validated data, which is passed to `getAlteration`.
 * @see {@link https://docs.rootplatform.com/docs/alteration-hooks Alteration hooks}
 */
const validateChangePetCover = ({ data, policy, policyholder }) => {
  const changePetExcessSchema = Joi.object().keys({
    pets: Joi.array()
      .items(
        Joi.object()
          .keys({
            name: Joi.string(),
            cover_amount: Joi.number().integer().min(100000).max(1000000).required(),
            excess_amount: Joi.number().integer().min(5000).max(25000).required(),
          })
          .required(),
      )
      .required(),
  });

  const validateAction = Joi.validate(data, changePetExcessSchema.required(), {
    abortEarly: false,
  });

  return validateAction;
};
