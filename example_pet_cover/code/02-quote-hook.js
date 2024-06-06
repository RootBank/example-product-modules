/**
 * Validate the quote request data before passing it to the `getQuote` function.
 * https://docs.rootplatform.com/docs/quote-hook
 */
const validateQuoteRequest = (data) => {
  const result = Joi.validate(
    data,
    Joi.object()
      .keys({
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
  return result;
};

/**
 * Generate an array of Quote Packages from the quote request data.
 * https://docs.rootplatform.com/reference/getting-a-quote-2
 */
const getQuote = (data) => {
  // Determine sum assured (in pence/cents)
  const sumAssured =
    parseInt(data.annual_limit.replace(/[^0-9.-]+/g, ""), 10) * 100;
  let annualPremium = 0;

  // Loop through all pets
  for (let pet of data.pets) {
    const age = Math.floor(
      (new Date() - new Date(pet.birth_date)) / 1000 / 60 / 60 / 24 / 365.25
    ); // age last birthday

    // Calculate the premium for the pet
    let petPremium = 100 * 100; // base annual premium for pet in pence/cents
    const breedCode = breedsSheet
      .getRange("B2:C359")
      .find((row) => row[0] === pet.breed)[1];
    petPremium *= pricingFactorBreedSheet
      .getRange("A2:B61")
      .find((row) => row[0] === breedCode)[1];
    petPremium *= pricingFactorGenderSheet
      .getRange("A2:C5")
      .find((row) => row[0] === pet.species && row[1] === pet.gender)[2];
    petPremium *= pricingFactorAgeSheet
      .getRange("A2:C31")
      .find((row) => row[0] === pet.species && row[1] === age + "")[2];

    // Add the pet premium to the total premium
    annualPremium += petPremium;
  }

  // Calculate general loadings
  let generalLoadings = [];
  // generalLoadings['area_code'] = pricingFactorAreaSheet.getRange("A2:C34153").find(row => row[0] === data.area_code)[2];
  generalLoadings["reimbursement"] = pricingFactorReimbursementSheet
    .getRange("A2:B5")
    .find((row) => row[0] === data.reimbursement)[1];
  generalLoadings["annual_deductible"] = pricingFactorAnnualDeductibleSheet
    .getRange("A2:B15")
    .find((row) => row[0] === data.annual_deductible)[1];
  generalLoadings["annual_limit"] = pricingFactorAnnualLimitSheet
    .getRange("A2:B9")
    .find((row) => row[0] === data.annual_limit)[1];
  const totalGeneralLoading = Object.values(generalLoadings).reduce(
    (acc, val) => acc * val,
    1
  );
  annualPremium *= totalGeneralLoading;

  // Calculate discounts
  let discount = 0;
  for (let discount_option of Object.keys(data.discount_options)) {
    if (data.discount_options[discount_option]) {
      const titleCaseDiscountOption = discount_option
        .replace(/_/g, " ")
        .replace(/\b\w/g, (match) => match.toUpperCase());
      const cell = discountsSheet
        .getRange("A2:B10")
        .find((row) => row[0] === titleCaseDiscountOption)[1];
      discount +=
        parseInt(cell.replace("(", "-").replace(/[^0-9.-]+/g, "")) / 100;
    }
  }
  annualPremium *= 1 - discount;

  // How to access an external pricing service:
  // const response = await fetch('https://api.ExamplePricingEngine.com/v1/quote', { method: 'POST', body: JSON.stringify(data) });
  // const result = await response.json();

  let packageName = "Single Pet Cover";
  if (data.pets.length > 1) packageName = "Multi Pet Cover";

  // Create a Quote Package per quote option or cover package
  return [
    new QuotePackage({
      package_name: packageName, // The name of the "package" of cover (for display purposes)
      sum_assured: sumAssured, // Set the total, aggregated cover amount (for display purposes)
      base_premium: Math.round(annualPremium / 12), // pence/cents integer
      suggested_premium: Math.round(annualPremium / 12), // pence/cents integer
      billing_frequency: "monthly", // Can be monthly, yearly or once_off
      module: {
        ...data, // Store all the data we've received
        generalLoadings,
        discount: discount * 100 + "%",
      },
      input_data: { ...data }, // Clone the quote data for reuse in application schema
    }),
  ];
};
