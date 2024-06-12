/**
 * Generates an alteration package from the alteration package request data, policy and policyholder.
 * https://docs.rootplatform.com/docs/alteration-hooks
 */
const getAlteration = ({ alteration_hook_key, data, policy, policyholder }) => {
  let changeDescription = "";
  let quoteData = policy.module;

  // Build up change message and new quote data before using it to get a new quote
  switch (alteration_hook_key) {
    case "change_cover":
      changeDescription = `cover changed to ${data.worldwide_cover} worldwide cover, ${data.racing_cover} racing cover, ${data.racing_level} racing level, ${data.excess} excess, ${data.claims_history} claims history, ${data.area_code} area code.`;
      // Merge new data into existing data, override if key exists
      quoteData = { ...quoteData, ...data };
      break;

    case "apply_discount":
      changeDescription = `discounts changed to include code ${data.discount_code}.`;
      // Merge new data into existing data, override if key exists
      quoteData = { ...quoteData, ...data };
      break;

    case "change_bicycles":
      const bikeNames = data.bicycles.map((b) => b.bike_make);
      changeDescription = `bicycles changed to include ${bikeNames.join(", ")}.`;
      // Merge old bikes' extra data into new bikes
      const newBicycles = data.bicycles.map((newBicycle) => {
        const oldBicycle = quoteData.bicycles.find((bicycle) => bicycle.name === newBicycle.name);
        return { ...oldBicycle, ...oldBicycle };
      });
      quoteData = { ...quoteData, bicycles: newBicycles };
      break;

    default:
      throw new Error(`Invalid alteration hook key "${alteration_hook_key}"`);
  }

  // Get an alteration package based on new data
  const quotePackage = getQuote(quoteData)[0];
  return new AlterationPackage({
    input_data: data,
    sum_assured: quotePackage.sum_assured,
    monthly_premium: quotePackage.suggested_premium,
    change_description: "Alteration: " + changeDescription,
    module: {
      ...quotePackage.module,
    },
  });
};

/**
 * Applies the alteration package to the policy.
 * https://docs.rootplatform.com/docs/alteration-hooks
 */
const applyAlteration = ({
  alteration_hook_key,
  policy,
  policyholder,
  alteration_package,
}) => {
  switch (alteration_hook_key) {
    case "change_cover":
    case "apply_discount":
    case "change_bicycles":
      return new AlteredPolicy({
        package_name: policy.package_name,
        sum_assured: alteration_package.sum_assured,
        base_premium: alteration_package.monthly_premium,
        monthly_premium: alteration_package.monthly_premium,
        end_date: policy.end_date,
        start_date: policy.start_date,
        module: alteration_package.module,
      });
    default:
      throw new Error(`Invalid alteration hook key "${alteration_hook_key}"`);
  }
};
