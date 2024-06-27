/**
 * Generate a policy using the application and policyholder
 * https://docs.rootplatform.com/docs/policy-issue-hook
 */
const getPolicy = (application, policyholder, billing_day) => {
  const policy = new Policy({
    package_name: application.package_name,
    sum_assured: application.sum_assured,
    base_premium: application.base_premium,
    monthly_premium: application.monthly_premium,
    start_date: moment().add(1, 'day').format(), // policy starts the day after issue
    end_date: moment().add(1, 'year').format(), // valid for 1 year
    module: {
      ...application.module,
    },
  });
  return policy;
};
