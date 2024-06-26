/**
 * Validates the alteration package request data before passing it to the `getAlteration` function.
 * https://docs.rootplatform.com/docs/alteration-hooks
 */
const validateAlterationPackageRequest = ({ alteration_hook_key, data }) => {
  switch (alteration_hook_key) {
    case "edit_policy":
      return validateQuoteRequest(data);
    default:
      throw new Error(`Invalid alteration hook key "${alteration_hook_key}"`);
  }
};

/**
 * Generates an alteration package from the alteration package request data, policy and policyholder.
 * https://docs.rootplatform.com/docs/alteration-hooks
 */
const getAlteration = ({ alteration_hook_key, data, policy, policyholder }) => {
  switch (alteration_hook_key) {
    case "edit_policy":
      const updatedQuotes = getQuote(data);
      console.log("Updated Quotes:", updatedQuotes);
      const alterationPackages = [];
      for (const quote of updatedQuotes) {
        alterationPackages.push(
          new AlterationPackage({
            input_data: data,
            sum_assured: quote.sum_assured,
            monthly_premium: quote.suggested_premium,
            change_description: "Policy edited.",
            module: quote.module,
          })
        );
      }
      console.log("Alteration packages:", alterationPackages);
      return alterationPackages[0];
    default:
      throw new Error(`Invalid alteration hook key "${alteration_hook_key}"`);
  }
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
    case "edit_policy":
      const alteredPolicy = new AlteredPolicy({
        package_name: policy.package_name,
        sum_assured: policy.sum_assured,
        base_premium: policy.monthly_premium,
        monthly_premium: policy.monthly_premium,
        module: alteration_package.module,
        end_date: policy.end_date,
        start_date: policy.start_date,
      });
      return alteredPolicy;
    default:
      throw new Error(`Invalid alteration hook key "${alteration_hook_key}"`);
  }
};
