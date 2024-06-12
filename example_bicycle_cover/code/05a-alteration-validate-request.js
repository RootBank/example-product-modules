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
            worldwide_cover: Joi.string().valid(["yes", "no"]).required(),
            racing_cover: Joi.string().valid(["yes", "no"]).required(),
            racing_level: Joi.string().when("racing_cover", {
              is: "Yes",
              then: Joi.string()
                .valid(["amateur", "intermediate", "professional"])
                .required(),
            }),
            excess: Joi.string()
              .valid(["£50", "£100", "£200", "£300"])
              .required(),
            claims_history: Joi.string()
              .valid(["0", "1", "2", "3", "4+"])
              .required(),
            area_code: Joi.string().required(),
          })
          .required(),
        {
          abortEarly: false,
        }
      );

    case "apply_discount":
      return Joi.validate(
        data,
        Joi.object()
          .keys({
            // Discount code
            discount_code: Joi.string().allow(null),
          })
          .required(),
        {
          abortEarly: false,
        }
      );

    case "change_bicycles":
      return Joi.validate(
        data,
        Joi.object()
          .keys({
            // Bicycles
            bicycles: Joi.array()
              .items(
                Joi.object().keys({
                  bike_make: Joi.string().required(),
                  bike_value: Joi.number().required(),
                  is_ebike: Joi.boolean().required(),
                })
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
