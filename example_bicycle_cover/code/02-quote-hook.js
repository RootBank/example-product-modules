/**
 * Validate the quote request data before passing it to the `getQuote` function.
 * https://docs.rootplatform.com/docs/quote-hook#validating-the-quote-parameters
 */
const validateQuoteRequest = (data) => {
  const validationResult = Joi.validate(
    data,
    Joi.object()
      .keys({
        bicycles: Joi.array()
          .items(
            Joi.object().keys({
              bike_make: Joi.string().required(),
              bike_value: Joi.number().required(),
              is_ebike: Joi.boolean().required(),
            })
          )
          .required(),
        worldwide_cover: Joi.string().valid(["yes", "no"]).required(),
        racing_cover: Joi.string().valid(["yes", "no"]).required(),
        racing_level: Joi.string().when("racing_cover", {
          is: "Yes",
          then: Joi.string()
            .valid(["amateur", "intermediate", "professional"])
            .required(),
        }),
        excess: Joi.string().valid(["£50", "£100", "£200", "£300"]).required(),
        claims_history: Joi.string()
          .valid(["0", "1", "2", "3", "4+"])
          .required(),
        area_code: Joi.string().required(),
        discount_code: Joi.string().allow(null),
      })
      .required(),
    { abortEarly: false }
  );
  return validationResult;
};

/**
 * Generate an array of Quote Packages from the quote request data.
 * https://docs.rootplatform.com/docs/quote-hook#generating-a-quote-package
 */
const getQuote = (data) => {
  // Sum the bike values
  const sumAssured = data.bicycles.reduce(
    (acc, bike) => acc + bike.bike_value,
    0
  );
  console.log("Sum assured:", sumAssured); // debugging

  // Determine total premium
  let annualBasePremiumCents = data.bicycles.reduce(
    (acc, bike) => acc + getBikePremium(bike.bike_value, bike.is_ebike, false),
    0
  );
  let annualComprehensivePremiumCents = data.bicycles.reduce(
    (acc, bike) => acc + getBikePremium(bike.bike_value, bike.is_ebike, true),
    0
  );
  console.log("Annual base premium:", annualBasePremiumCents); // debugging
  console.log("Annual comprehensive premium:", annualComprehensivePremiumCents); // debugging

  // Apply loadings
  let generalLoadings = {};
  if (data.worldwide_cover === "yes") generalLoadings["worldwide_cover"] = 1.3;
  if (data.racing_cover === "yes") {
    if (data.racing_level === "amateur") generalLoadings["racing_cover"] = 1.3;
    if (data.racing_level === "intermediate")
      generalLoadings["racing_cover"] = 1.4;
    if (data.racing_level === "professional")
      generalLoadings["racing_cover"] = 1.5;
  }
  if (data.excess === "£300") generalLoadings["excess"] = 1.0;
  if (data.excess === "£200") generalLoadings["excess"] = 1.1;
  if (data.excess === "£100") generalLoadings["excess"] = 1.3;
  if (data.excess === "£50") generalLoadings["excess"] = 1.5;
  if (data.claims_history === "0") generalLoadings["claims_history"] = 1.0;
  if (data.claims_history === "1") generalLoadings["claims_history"] = 1.1;
  if (data.claims_history === "2") generalLoadings["claims_history"] = 1.3;
  if (data.claims_history === "3") generalLoadings["claims_history"] = 1.5;
  if (data.claims_history === "4+") generalLoadings["claims_history"] = 1.8;
  const totalGeneralLoading = Object.values(generalLoadings).reduce(
    (acc, val) => acc * val,
    1
  );
  annualBasePremiumCents *= totalGeneralLoading;
  annualComprehensivePremiumCents *= totalGeneralLoading;

  // Apply discount if relevant
  if (data.discount_code === "BIKE123") {
    const discount = 20; // 20% discount
    annualBasePremiumCents *= 1 - discount / 100;
    annualComprehensivePremiumCents *= 1 - discount / 100;
  }

  // Return two cover options
  return [
    // Option 1
    new QuotePackage({
      package_name: "Basic Bicycle Cover", // The name of the "package" of cover
      sum_assured: Math.round(sumAssured), // Set the total, aggregated cover amount
      base_premium: Math.round(annualBasePremiumCents / 12), // Should be an integer, cents
      suggested_premium: Math.round(annualBasePremiumCents / 12), // Should be an integer, cents
      billing_frequency: "monthly", // Can be monthly or yearly
      module: {
        // Save any data, calculations, or results here for future re-use.
        ...data,
        summary:
          "Basic theft cover, including personal accident and legal expenses.",
        benefits: {
          Theft: "Yes",
          "Worldwide cover": data.worldwide_cover === "yes" ? "Yes" : "No",
          "Legal expenses": "Yes",
          "Public liability": "No",
          "Personal accident": "No",
          "Accidental damage": "No",
          Vandalism: "No",
          "Race events": data.racing_cover === "yes" ? "Yes" : "No",
        },
        discount_value: data.discount_code === "BIKE123" ? "20%" : "0%",
        loadings: generalLoadings,
      },
      input_data: { ...data },
    }),
    // Option 2
    new QuotePackage({
      package_name: "Comprehensive Bicycle Cover", // The name of the "package" of cover
      sum_assured: Math.round(sumAssured), // Set the total, aggregated cover amount
      base_premium: Math.round(annualComprehensivePremiumCents / 12), // Should be an integer, cents
      suggested_premium: Math.round(annualComprehensivePremiumCents / 12), // Should be an integer, cents
      billing_frequency: "monthly", // Can be monthly or yearly
      module: {
        // Save any data, calculations, or results here for future re-use.
        ...data,
        summary:
          "Covers theft, personal accident, legal expenses, accidental damage, vandalism and race events.",
        benefits: {
          Theft: "Yes",
          "Worldwide cover": data.worldwide_cover === "yes" ? "Yes" : "No",
          "Legal expenses": "Yes",
          "Public liability": "Yes",
          "Personal accident": "Yes",
          "Accidental damage": "Yes",
          Vandalism: "Yes",
          "Race events": data.racing_cover === "yes" ? "Yes" : "No",
        },
        discount: data.discount_code === "BIKE123" ? { code_used: 'BIKE123', amount: '20%'} : "none",
        loadings: generalLoadings,
      },
      input_data: { ...data },
    }),
  ];
};
