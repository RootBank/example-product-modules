/**
 * Generates a policy using the application, policyholder and billing day.
 * @param {PlatformApplication} application The application from which the policy will be issued.
 * @return {Policy} The policy that will be returned by the [Issue a policy](https://docs.rootplatform.com/reference/issue-a-policy-1) endpoint.
 * @see {@link https://docs.rootplatform.com/docs/policy-issue-hook Policy issue hook}
 */
const getPolicy = (application) => {
  const policy = new Policy({
    package_name: application.package_name,
    sum_assured: application.sum_assured,
    base_premium: application.monthly_premium,
    monthly_premium: application.monthly_premium,
    start_date: moment().add(1, 'day').format(), // policy starts the day after issue
    end_date: null, // no policy end date
    module: {
      policy_deactivations: 0,
      latest_policy_deactivation: null,
      latest_policy_reactivation: null,
      applied_anniversary_increases: 0,
      ...application.module,
    },
    charges: [],
  });
  return policy;
};
