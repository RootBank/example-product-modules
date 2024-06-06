/**
 * Validates the alteration package request data before passing it to the `getAlteration` function.
 * https://docs.rootplatform.com/docs/alteration-hooks
 */
const validateAlterationPackageRequest = ({
  alteration_hook_key,
  data,
  policy,
  policyholder,
}) => {
  let validationResult;
  switch (alteration_hook_key) {

    case 'change_package_type':
      return Joi.validate(
        data,
        Joi.object()
          .keys({
            // Nothing to validate on this request,
            // as we want to simply return to new alteration packages from existing data
          })
          .required(),
        { abortEarly: false },
      );

    case 'edit_bicycles':
      return Joi.validate(
        data,
        Joi.object()
          .keys({
            bicycles: Joi.array().items(
              Joi.object().keys({
                bike_make: Joi.string().required(),
                bike_value: Joi.number().required(),
                is_ebike: Joi.boolean().required(),
              })).required(),
          }).required(),
        { abortEarly: false },
      );

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
    case 'change_package_type':
      return getChangePackageTypeAlterationPackages({ alteration_hook_key, data, policy, policyholder });
    case 'edit_bicycles':
      return getEditBicyclesAlterationPackage({ alteration_hook_key, data, policy, policyholder });
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
  let alteredPolicy;
  switch (alteration_hook_key) {
    case 'change_package_type':
      alteredPolicy = new AlteredPolicy({
        package_name: alteration_package.change_description.includes('Basic') ? 'Basic Cover' : 'Comprehensive Cover',
        sum_assured: alteration_package.sum_assured,
        base_premium: alteration_package.monthly_premium,
        monthly_premium: alteration_package.monthly_premium,
        module: alteration_package.module,
        end_date: policy.end_date,
        start_date: policy.start_date,
      });
      return alteredPolicy;
    case 'edit_bicycles':
      alteredPolicy = new AlteredPolicy({
        package_name: policy.package_name,
        sum_assured: alteration_package.sum_assured,
        base_premium: alteration_package.monthly_premium,
        monthly_premium: alteration_package.monthly_premium,
        module: alteration_package.module,
        end_date: policy.end_date,
        start_date: policy.start_date,
      });
      return alteredPolicy;
    default:
      throw new Error(`Invalid alteration hook key "${alteration_hook_key}"`);
  }
};

const getChangePackageTypeAlterationPackages = ({ alteration_hook_key, data, policy, policyholder }) => {

  // Determine premiums for all packages
  const annualBasePremiumCents = policy.module.bicycles.reduce((acc, bike) => acc + getBikePremium(bike.bike_value, bike.is_ebike, false), 0);
  const annualComprehensivePremiumCents = policy.module.bicycles.reduce((acc, bike) => acc + getBikePremium(bike.bike_value, bike.is_ebike, true), 0);

  const packages = [
    new AlterationPackage({
      input_data: data,
      sum_assured: policy.sum_assured,
      monthly_premium: annualBasePremiumCents,
      change_description: 'Changed cover package to Basic Cover.',
      module: {
        ...policy.module,
        ...data,
      },
    }),
    new AlterationPackage({
      input_data: data,
      sum_assured: policy.sum_assured,
      monthly_premium: annualComprehensivePremiumCents,
      change_description: 'Changed cover package to Comprehensive Cover.',
      module: {
        ...policy.module,
        ...data,
      },
    })
  ];
  console.log(JSON.stringify(packages, null, 2)); // debugging

  return packages;
}

const getEditBicyclesAlterationPackage = ({ alteration_hook_key, data, policy, policyholder }) => {

  // Sum bike values
  const sumAssured = data.bicycles.reduce((acc, bike) => acc + bike.bike_value, 0);

  // Determine new updated premium for same package
  const isComprehensivePackage = policy.package_name === 'Comprehensive Cover';
  const annualPremiumCents = data.bicycles.reduce((acc, bike) => acc + getBikePremium(bike.bike_value, bike.is_ebike, isComprehensivePackage), 0);

  // Determine the changes between data.bicycles and policy.module.bicycles
  const addedBikes = data.bicycles.filter((bike) => !policy.module.bicycles.some((oldBike) => oldBike.bike_make === bike.bike_make));
  const removedBikes = policy.module.bicycles.filter((oldBike) => !data.bicycles.some((bike) => oldBike.bike_make === bike.bike_make));
  const changeDescription = `Added ${addedBikes.length} bikes and removed ${removedBikes.length} bikes.`;

  return new AlterationPackage({
    input_data: data,
    sum_assured: sumAssured,
    monthly_premium: annualPremiumCents,
    change_description: changeDescription,
    module: {
      ...policy.module,
      ...data,
    },
  });
};
