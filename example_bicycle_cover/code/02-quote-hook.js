/**
 * Validate the quote request data before passing it to the `getQuote` function.
 * https://docs.rootplatform.com/docs/quote-hook
 */
const validateQuoteRequest = (data) => {
  const validationResult = Joi.validate(
    data,
    Joi.object()
      .keys({
        bicycles: Joi.array().items(
          Joi.object().keys({
            bike_make: Joi.string().required(),
            bike_value: Joi.number().required(),
            is_ebike: Joi.boolean().required(),
          })).required(),
          worldwide_cover: Joi.string().valid(["yes", "no"]).required(),
          racing_cover: Joi.string().valid(["yes", "no"]).required(),
          area_code: Joi.string().required(),
      })
      .required(),
    { abortEarly: false },
  );
  return validationResult;
};

/**
 * Generate an array of Quote Packages from the quote request data.
 * https://docs.rootplatform.com/docs/quote-hook
 */
const getQuote = (data) => {

  // Sum the bike values
  const sumAssured = data.bicycles.reduce((acc, bike) => acc + bike.bike_value, 0);
  console.log('Sum assured:', sumAssured); // debugging

  // Determine total premium
  let annualBasePremiumCents = data.bicycles.reduce((acc, bike) => acc + getBikePremium(bike.bike_value, bike.is_ebike, false), 0);
  let annualComprehensivePremiumCents = data.bicycles.reduce((acc, bike) => acc + getBikePremium(bike.bike_value, bike.is_ebike, true), 0);
  console.log('Annual base premium:', annualBasePremiumCents); // debugging
  console.log('Annual comprehensive premium:', annualComprehensivePremiumCents); // debugging

  // Apply rating factors for worldwide and racing cover
  if (data.worldwide_cover === 'yes') {
    annualBasePremiumCents *= 1.3;
    annualComprehensivePremiumCents *= 1.3;
  }
  if (data.racing_cover === 'yes') {
    annualBasePremiumCents *= 1.4;
    annualComprehensivePremiumCents *= 1.4;
  }

  // Return two cover options
  return [
    // Option 1
    new QuotePackage({
      package_name: 'Basic Bicycle Cover', // The name of the "package" of cover
      sum_assured: Math.round(sumAssured), // Set the total, aggregated cover amount
      base_premium: Math.round(annualBasePremiumCents / 12), // Should be an integer, cents
      suggested_premium: Math.round(annualBasePremiumCents / 12), // Should be an integer, cents
      billing_frequency: 'monthly', // Can be monthly or yearly
      module: {
        // Save any data, calculations, or results here for future re-use.
        ...data,
        summary: 'Basic theft cover, including personal accident and legal expenses.',
        benefits: {
          'Theft': 'Yes',
          'Worldwide cover': (data.worldwide_cover === 'yes' ? 'Yes' : 'No'),
          '£200k legal expenses': 'Yes',
          '£1 million public liability': 'No',
          '£25k personal accident': 'No',
          'Accidental damage': 'No',
          'Vandalism': 'No',
          'Race events': (data.racing_cover === 'yes' ? 'Yes' : 'No'),
        }
      },
      input_data: { ...data },
    }),
    // Option 2
    new QuotePackage({
      package_name: 'Comprehensive Bicycle Cover', // The name of the "package" of cover
      sum_assured: Math.round(sumAssured), // Set the total, aggregated cover amount
      base_premium: Math.round(annualComprehensivePremiumCents / 12), // Should be an integer, cents
      suggested_premium: Math.round(annualComprehensivePremiumCents / 12), // Should be an integer, cents
      billing_frequency: 'monthly', // Can be monthly or yearly
      module: {
        // Save any data, calculations, or results here for future re-use.
        ...data,
        summary: 'Covers theft, personal accident, legal expenses, accidental damage, vandalism and race events.',
        benefits: {
          'Theft': 'Yes',
          'Worldwide cover': (data.worldwide_cover === 'yes' ? 'Yes' : 'No'),
          '£200k legal expenses': 'Yes',
          '£1 million public liability': 'Yes',
          '£25k personal accident': 'Yes',
          'Accidental damage': 'Yes',
          'Vandalism': 'Yes',
          'Race events': (data.racing_cover === 'yes' ? 'Yes' : 'No'),
        }
      },
      input_data: { ...data },
    }),
  ];
};
