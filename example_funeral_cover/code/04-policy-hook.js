// 04-policy-hook.js
// Contains all functions relating to policy generation

/**
 * Generates a policy using the application, policyholder and billing day.
 * @param {PlatformApplication} application The application from which the policy will be issued.
 * @param {PlatformPolicyholder} policyholder The policyholder that will be linked to the policy.
 * @param {number} billing_day The billing day is specified when a payment method is linked to an application or policy.
 *     If no payment method has been linked at the time of policy issue, the billing day defaults to 1.
 * @return {Policy} The policy that will be returned by the [Issue a policy](https://docs.rootplatform.com/reference/issue-a-policy-1) endpoint.
 * @see {@link https://docs.rootplatform.com/docs/policy-issue-hook Policy issue hook}
 */
const getPolicy = (application, policyholder, billing_day) => {
  const startDate = moment().add(1, 'day').format(); // policy starts the day after issue

  const policy = new Policy({
    package_name: application.package_name,
    sum_assured: application.sum_assured,
    base_premium: application.base_premium,
    monthly_premium: application.monthly_premium,
    start_date: startDate,
    end_date: null,
    module: {
      policy_alteration_allowed: true, // blocks or allows policy alterations
      ...application.module,
    },
  });

  return policy;
};
