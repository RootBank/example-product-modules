/**
 * Validate the quote request data before passing it to the `getQuote` function.
 * https://docs.rootplatform.com/docs/quote-hook#validating-the-quote-parameters
 */
const validateQuoteRequest = (data) => {
  const result = Joi.validate(
    data,
    Joi.object()
      .keys({

        // Devices
        devices: Joi.array()
        .items(
          Joi.object().keys({
            device_type: Joi.string().valid(Object.keys(deviceTypeLoadings)).required(),
            value: Joi.number().integer().positive().min(5000).max(1000000).required(),
          }))
        .required(),

        // Cover details
        cover_type: Joi.string().valid(["theft", "comprehensive"]).required(),
        loaner_device: Joi.when("cover_type", {
          is: "comprehensive",
          then: Joi.boolean().required(),
          otherwise: Joi.forbidden(),
        }),
        excess: Joi.string().valid(["£50", "£100", "£200", "£300"]).required(),
        claims_history: Joi.string()
          .valid(["0", "1", "2", "3", "4+"])
          .required(),
        area_code: Joi.string().required(),

        // Discounts
        discount_code: Joi.string().allow(null),
      })
      .required(),
    { abortEarly: false },
  );
  return result;
};

/**
 * Generate an array of Quote Packages from the quote request data.
 * https://docs.rootplatform.com/docs/quote-hook#generating-a-quote-package
 */
const getQuote = (data) => {

  // Calculate premium
  const devicePremiums = [];
  for (const device of data.devices) {
    let devicePremium = device.value * 0.08 / 12; // 8% of device value before loadings (nice and simple), divided by 12 for monthly premium
    devicePremium *= deviceTypeLoadings[device.device_type];
    devicePremium *= excessLoadings[data.excess];
    devicePremium *= coverPackageLoadings[data.cover_type];
    devicePremium *= claimsHistoryLoadings[data.claims_history];
    devicePremium *= data.cover_type === "comprehensive" ? loanerDeviceLoading : 1;
    devicePremiums.push(devicePremium);
  }
  const totalSumAssured = Math.round(data.devices.reduce((acc, device) => acc + device.value, 0));
  let totalPremium = Math.round(devicePremiums.reduce((acc, premium) => acc + premium, 0));

  // Apply discount if relevant
  if (data.discount_code === "DEVICE123") {
    const discount = 20; // 20% discount
    totalPremium = Math.round(totalPremium * (1 - discount / 100));
  }

  const quotePackage = new QuotePackage({
    // Below are standard fields for all products
    package_name: 'Device Cover', // The name of the "package" of cover
    sum_assured: totalSumAssured, // Set the total, aggregated cover amount
    base_premium: totalPremium, // Should be an integer, cents
    suggested_premium: totalPremium, // Should be an integer, cents
    billing_frequency: 'monthly', // Can be monthly or yearly
    module: {
      // Save any data, calculations, or results here for future re-use.
      ...data,
      discount_value: data.discount_code === "DEVICE123" ? "20%" : "0%",
    },
    input_data: { ...data },
  });

  return [quotePackage];
};
