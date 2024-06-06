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
      changeDescription = `cover changed to ${data.area_code}, ${data.reimbursement}, ${data.annual_deductible}, ${data.annual_limit}.`;
      // Merge new data into existing data, override if key exists
      quoteData = { ...quoteData, ...data };
      break;

    case "change_discounts":
      const keys = Object.keys(data.discount_options) || ["no discount"];
      changeDescription = `discounts changed to ${keys.join(", ")}.`;
      // Merge new data into existing data, override if key exists
      quoteData = { ...quoteData, ...data };
      break;

    case "change_pets":
      const petNames = data.pets.map((pet) => pet.name);
      changeDescription = `pets changed to include ${petNames.join(", ")}.`;
      // Merge old pets' extra data into new pets
      const newPets = data.pets.map((newPet) => {
        const oldPet = quoteData.pets.find((pet) => pet.name === newPet.name);
        return { ...oldPet, ...newPet };
      });
      quoteData = { ...quoteData, pets: newPets };
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
    case "change_discounts":
    case "change_pets":
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
