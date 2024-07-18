// 07-reactivation-flow
// Contains all functions relating to the reactivation functionality

/**
 * Get the reactivation options for inactive policies.
 * @param {PlatformPolicy} policy The policy to be reactivated.
 * @return {ReactivationOption[]} One of these options must be selected whenever an inactive policy is reactivated.
 */
const getReactivationOptions = (policy) => {
  return [
    new ReactivationOption({
      type: 'reactivation',
      description:
        'Only policies that either were cancelled or lapsed in the last 3 months can be recommenced.',
      minimumBalanceRequired: false,
    }),
  ];
};

/**
 * Verifies that
 * - the policy status is `lapsed` or `cancelled`
 * - the policy was active within the last three months
 * - the policy has not been reactivated before
 * @param {object} params
 * @param {PlatformPolicy} params.policy The policy to be reactivated
 * @param {PlatformPolicyholder} params.policyholder The policyholder linked to the policy
 * @param {ReactivationOption} params.reactivationOption The reactivation option used to reactivate the policy
 * @param {string} params.dateForTesting Used by unit tests only to set the date
 */
const beforePolicyReactivated = ({
  policy,
  policyholder,
  reactivationOption,
  dateForTesting,
}) => {
  const now = dateForTesting ? dateForTesting : moment().format('YYYY-MM-DD');

  // Check policy status is either Cancelled or Lapsedlapsed
  if (policy.module.has_been_reactivated) {
    throw new Error(`Policy can only be reactivated once`);
  }

  const isPolicyLapsedOrCancelled = ['lapsed', 'cancelled'].includes(
    policy.status,
  );
  if (!isPolicyLapsedOrCancelled) {
    throw new Error(
      `Policy with status '${policy.status}' cannot be reactivated. Policy status must be either 'cancelled' or 'lapsed'.`,
    );
  }

  // Check that policy status was changed within the last three months
  const threeMonthsAfterLastUpdate = moment(policy.status_updated_at)
    .add(3, 'months')
    .format('YYYY-MM-DD');

  if (moment(now).isAfter(threeMonthsAfterLastUpdate)) {
    throw new Error(
      `Policy can only be reactivated within 3 months of lapse. Policy status was last updated on ${moment(
        policy.status_updated_at,
      ).format('YYYY-MM-DD')}`,
    );
  }
};

/**
 * Executed after a policy has been reactivated
 * @param {object} params
 * @param {PlatformPolicy} params.policy The policy that has been reactivated
 * @param {PlatformPolicyholder} params.policyholder The policyholder linked to the policy
 * @param {ReactivationOption} params.reactivationOption The reactivation option used to reactivate the policy
 * @returns {ProductModuleAction[] | void } Action ot update policy with CBR fields
 */
const afterPolicyReactivated = ({
  policy,
  policyholder,
  reactivationOption,
}) => {
  if (reactivationOption.type === 'reactivation') {
    return [
      {
        name: 'update_policy',
        data: {
          module: {
            ...policy.module,
            has_been_reactivated: true, // This field is a regulatory requirement
          },
        },
      },
    ];
  }
};
