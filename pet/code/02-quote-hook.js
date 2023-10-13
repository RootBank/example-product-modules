const quoteSchema = Joi.object().keys({
  pets: Joi.array()
    .items(
      Joi.object()
        .keys({
          name: Joi.string().min(1).max(250).required(),
          species: Joi.valid('dog', 'cat').required(),
          gender: Joi.valid('male', 'female').required(),
          breed: Joi.string()
            .when('species', {
              is: 'dog',
              then: Joi.valid(...dogBreeds).required(),
            })
            .when('species', {
              is: 'cat',
              then: Joi.valid(...catBreeds).required(),
            }),
          pet_size: Joi.string().valid(animalSizes)
            .when('breed', {
              is: 'mixed_breed',
              then: Joi.required(),
            }),
          birth_date: Joi.date().required(),
          cover_amount: Joi.number().integer().min(100000).max(1000000).valid(coverAmounts).required(),
          excess_amount: Joi.number().integer().min(5000).max(25000).valid(excessValues).required(),
          precondition: Joi.object() // Make sure all preconditions are false
            .keys({
              'Chronic disease': Joi.boolean().valid(false),
              Diabetes: Joi.boolean().valid(false),
              Epilepsy: Joi.boolean().valid(false),
              'Elbow or hip joint dysplasia': Joi.boolean().valid(false),
              'Physical disabilities': Joi.boolean().valid(false),
              Tumours: Joi.boolean().valid(false),
              'Thyroid disease': Joi.boolean().valid(false),
            }),
        })
        .required()
    )
    .required(),
});

/**
 * Validates the quote request data.
 * @param {Record<string, any>} data The data received in the body of the
 *     [Create a quote](https://docs.rootplatform.com/reference/getting-a-quote-2) request
 *     (without the `type` property).
 * @return {{error: any; result: any}} The [validation result](https://joi.dev/api/?v=12.1.0#validatevalue-schema-options-callback).
 *    If there are no errors, the `value` property will contain the validated data, which is passed to `getQuote`.
 * @see {@link https://docs.rootplatform.com/docs/quote-hook Quote hook}
 */
const validateQuoteRequest = (data) => {
  const result = Joi.validate(data, quoteSchema.required(), { abortEarly: false });
  return result;
};

/**
 * Generates an array of quote packages from the quote request data.
 * @param {Record<string, any>} data The validated data returned by `validateQuoteRequest` as `result.value`.
 * @return {QuotePackage[]} The quote package(s) that will be returned by the
 *     [Create a quote](https://docs.rootplatform.com/reference/getting-a-quote-2) endpoint.
 * @see {@link https://docs.rootplatform.com/docs/quote-hook Quote hook}
 */
const getQuote = (data) => {
  const rebuiltModuleData = buildModuleData(data);

  // // Determine sum assured (in pence/cents)
  const sum_assured = getAggregatedSumAssured(data.pets);

  // Apply premium calculation math
  const premium = getAggregatedPremium(rebuiltModuleData.pets);

  // Compile the quote package
  const quotePackage = new QuotePackage({
    // Below are standard fields for all products
    package_name: 'Pet', // The name of the "package" of cover
    sum_assured: sum_assured, // Set the total, aggregated cover amount
    base_premium: premium, // Should be an integer, pence/cents
    suggested_premium: premium, // Should be an integer, pence/cents
    billing_frequency: 'monthly', // Can be monthly or yearly
    module: {
      ...rebuiltModuleData,
    },
    input_data: { ...data }, // Clone the quote data for reuse in application schema
  });

  return [quotePackage];
};
