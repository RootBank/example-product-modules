/**
 * Validate the application request data before passing it to the `getApplication` function.
 * https://docs.rootplatform.com/docs/application-hook
 */
const validateApplicationRequest = (data, policyholder, quote_package) => {
  // Custom validation can be specified in the function body
  const result = Joi.validate(
    data,
    Joi.object()
      .keys({
        devices: Joi.array()
          .items(
            Joi.object().keys({
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
  return result;
};

/**
 * Generates an Application from the application request data, policyholder and quote package.
 * https://docs.rootplatform.com/docs/application-hook
 */
const getApplication = (data, policyholder, quote_package) => {
  // Merge the device data
  const devices = quote_package.module.devices.map((device, index) => ({
    ...device,
    ...data.devices[index],
  }));

  const application = new Application({
    // The top-level fields are standard across all product modules
    package_name: quote_package.package_name,
    sum_assured: quote_package.sum_assured,
    base_premium: quote_package.base_premium,
    monthly_premium: quote_package.suggested_premium,
    input_data: { ...data },
    module: {
      // The module object is used to store product-specific fields
      ...quote_package.module,
      ...data,
      devices,
    },
  });
  return application;
};
