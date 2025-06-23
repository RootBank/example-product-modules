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
  const validationResult = Joi.validate(
    data,
    Joi.object()
      .keys({
        // keys and validation
      })
      .required(),
    { abortEarly: false },
  );
  return validationResult;
};

/**
 * Generates an array of quote packages from the quote request data.
 * @param {Record<string, any>} data The validated data returned by `validateQuoteRequest` as `result.value`.
 * @return {QuotePackage[]} The quote package(s) that will be returned by the
 *     [Create a quote](https://docs.rootplatform.com/reference/getting-a-quote-2) endpoint.
 * @see {@link https://docs.rootplatform.com/docs/quote-hook Quote hook}
 */
const getQuote = (data) => {
  const quotePackage = new QuotePackage({
    // Below are standard fields for all products
    package_name: '<PACKAGE NAME>', // The name of the "package" of cover
    sum_assured: 10000 * 100, // Set the total, aggregated cover amount
    base_premium: 100 * 100, // Should be an integer, cents
    suggested_premium: 100 * 100, // Should be an integer, cents
    billing_frequency: 'monthly', // Can be monthly or yearly
    module: {
      // Save any data, calculations, or results here for future re-use.
      ...data,
    },
    input_data: { ...data },
  });
  return [quotePackage];
};
