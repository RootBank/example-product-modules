/**
 * Validate the quote request data before passing it to the `getQuote` function.
 * https://docs.rootplatform.com/reference/getting-a-quote-2
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
        postcode: Joi.string().required(),
      })
      .required(),
    { abortEarly: false },
  );
  return validationResult;
};

/**
 * Generate an array of Quote Packages from the quote request data.
 * https://docs.rootplatform.com/reference/getting-a-quote-2
 */
const getQuote = (data) => {

  // Sum the bike values
  const sumAssured = data.bicycles.reduce((acc, bike) => acc + bike.bike_value, 0);
  console.log('Sum assured:', sumAssured); // debugging

  // Determine total premium
  const annualBasePremiumCents = data.bicycles.reduce((acc, bike) => acc + getBikePremium(bike.bike_value, bike.is_ebike, false), 0);
  const annualComprehensivePremiumCents = data.bicycles.reduce((acc, bike) => acc + getBikePremium(bike.bike_value, bike.is_ebike, true), 0);
  console.log('Annual base premium:', annualBasePremiumCents); // debugging
  console.log('Annual comprehensive premium:', annualComprehensivePremiumCents); // debugging

  // Return two cover options
  return [
    // Option 1
    new QuotePackage({
      package_name: 'Basic Cover', // The name of the "package" of cover
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
          'Worldwide cover': 'Yes',
          '£200k legal expenses': 'Yes',
          '£1 million public liability': 'No',
          '£25k personal accident': 'No',
          'Accidental damange': 'No',
          'Vandalism': 'No',
          'Race events': 'No',
        }
      },
      input_data: { ...data },
    }),
    // Option 2
    new QuotePackage({
      package_name: 'Comprehensive Cover', // The name of the "package" of cover
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
          'Worldwide cover': 'Yes',
          '£200k legal expenses': 'Yes',
          '£1 million public liability': 'Yes',
          '£25k personal accident': 'Yes',
          'Accidental damange': 'Yes',
          'Vandalism': 'Yes',
          'Race events': 'Yes',
        }
      },
      input_data: { ...data },
    }),
  ];
};
