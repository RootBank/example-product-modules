/**
 * Validates the alteration package request data before passing it to the `getAlteration` function.
 * https://docs.rootplatform.com/docs/alteration-hooks
 */
const validateAlterationPackageRequest = ({
  alteration_hook_key,
  data,
  policy,
  policyholder,
}) => {
  switch (alteration_hook_key) {
    case "change_cover":
      return Joi.validate(
        data,
        Joi.object()
          .keys({
            // Cover details
            area_code: Joi.string().required(), // Joi.valid(pricingFactorAreaSheet.getRange("A2:A34153")).required(), // Demo list of codes
            reimbursement: Joi.valid(
              pricingFactorReimbursementSheet.getRange("A2:A5").flat()
            ).required(),
            annual_deductible: Joi.valid(
              pricingFactorAnnualDeductibleSheet.getRange("A2:A15").flat()
            ).required(),
            annual_limit: Joi.valid(
              pricingFactorAnnualLimitSheet.getRange("A2:A9").flat()
            ).required(),
          })
          .required(),
        { abortEarly: false }
      );

    case "change_discounts":
      return Joi.validate(
        data,
        Joi.object()
          .keys({
            // Discounts
            discount_options: Joi.object(
              discountsSheet
                .getRange("A2:A10")
                .flat()
                // convert to snake_case
                .map((discount) => discount.toLowerCase().replace(/\s+/g, "_"))
                .reduce((acc, key) => {
                  acc[key] = Joi.boolean();
                  return acc;
                }, {})
            ).required(),
          })
          .required(),
        { abortEarly: false }
      );

    case "change_pets":
      return Joi.validate(
        data,
        Joi.object()
          .keys({
            // Pets
            pets: Joi.array()
              .items(
                Joi.object()
                  .keys({
                    // Pet details
                    name: Joi.string().min(1).max(50).required(),
                    species: Joi.valid("Dog", "Cat").required(),
                    gender: Joi.valid("Male", "Female").required(),
                    breed: Joi.string().when("species", {
                      is: "Cat",
                      then: Joi.valid(
                        breedsSheet.getRange("B287:B359").flat()
                      ).required(),
                      otherwise: Joi.valid(
                        breedsSheet.getRange("B2:B286").flat()
                      ).required(),
                    }),
                    birth_date: Joi.date().required(),
                  })
                  .required()
              )
              .required(),
          })
          .required(),
        { abortEarly: false }
      );

    default:
      throw new Error(`Invalid alteration hook key "${alteration_hook_key}"`);
  }
};
