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
    start_date: application.module.trip_start_date,
    end_date: application.module.trip_end_date || null,
    module: {
      ...application.module,
    },
  });
  return policy;
};
