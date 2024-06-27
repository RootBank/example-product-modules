/**
 * Validates the alteration package request data before passing it to the `getAlteration` function.
 * https://docs.rootplatform.com/docs/alteration-hooks#validating-an-alteration-package-request
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
            cover_type: Joi.string()
              .valid(["theft", "comprehensive"])
              .required(),
            loaner_device: Joi.when("cover_type", {
              is: "comprehensive",
              then: Joi.boolean().required(),
              otherwise: Joi.forbidden(),
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

    case "change_devices":
      return Joi.validate(
        data,
        Joi.object()
          .keys({
            // Devices
            devices: Joi.array()
              .items(
                Joi.object().keys({
                  device_type: Joi.string()
                    .valid(Object.keys(deviceTypeLoadings))
                    .required(),
                  value: Joi.number()
                    .integer()
                    .positive()
                    .min(5000)
                    .max(1000000)
                    .required(),
                  make: Joi.string().required(),
                  model: Joi.string().required(),
                  serial_number: Joi.string().required(),
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
