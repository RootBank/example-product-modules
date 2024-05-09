/**
 * Get the reactivation options for inactive policies.
 * @param {PlatformPolicy} policy The policy to be reactivated.
 * @return {ReactivationOption[]} One of these options must be selected whenever an inactive policy is reactivated.
 * @see {@link https://docs.rootplatform.com/docs/reactivation-hook#defining-reactivation-options Reactivation Options}
 */
const getReactivationOptions = (policy) => {
  const settlementAmount = policy.balance < 0 ? -policy.balance : 0;

  return [
    new ReactivationOption({
      type: 'reactivation',
      settlementAmount,
      description: 'For a policy to be reactivated, all arrear premiums will immediately be due.',
      minimumBalanceRequired: true,
    }),
  ];
};

/**
 * Checks if the policy can be reactivated/reinstated or not.
 * Note: The below code can be refactored to allow for more specific criteria for different reactivation types.
 *       For example, the reactivation option selected (Defined above) can be used in a Switch Statement or handler to perform different checks
 * @param {object} param
 * @param {PlatformPolicy} param.policy The policy object
 * @param {ReactivationOption} param.reactivationOption The type of reactivation, defined above
 * @see {@link https://docs.rootplatform.com/docs/lifecycle-hooks#before-policy-reactivated Lifecycle Hook - Before Policy Reactivated}
 */
const beforePolicyReactivated = async ({ policy, reactivationOption }) => {
  // Provides the statues that a policy must be in order to be reactivated.
  // Note: Due to there being no hooks for a policy being changed to not_taken_up or expired, you cannot set a time limit for this status
  const isPolicyStatusReactivatable = ['lapsed', 'cancelled', 'not_taken_up', 'expired'].includes(
    policy.status,
  );
  const reactivationCount = policy.module.reactivation_count; // can be an integer from 0 to 2
  const latestDeactivation = policy.module.latest_policy_deactivation; // can be null or a date
  const today = moment();

  // Ensure the policy is only lapsed or cancelled.
  if (!isPolicyStatusReactivatable) {
    throw new Error(
      `Policy with status ${policy.status} cannot be reactivated. Policy status must be one of ['lapsed', 'cancelled', 'not_taken_up', 'expired'].`,
    );
  }

  // Ensure the policy has not reached the maximum amount of reactivations (Limit of 2 reactivations)
  if (reactivationCount > 2) {
    throw new Error(
      `This policy has reached the maximum amount of reactivations and therefore cannot be reactivated again.`,
    );
  }

  // Ensure the policy was not cancelled more than 2 months ago
  if (latestDeactivation && policy.status === 'cancelled') {
    const dateDifference = today.diff(latestDeactivation, 'months');

    if (dateDifference > 2) {
      throw new Error(
        'Policy was cancelled more than 2 months ago and therefore cannot be reactivated.',
      );
    }
  }

  // Ensure the policy was not lapsed more than 2 months ago
  if (latestDeactivation && policy.status === 'lapsed') {
    const dateDifference = today.diff(latestDeactivation, 'months');
    if (dateDifference > 2) {
      throw new Error(
        'Policy was lapsed more than 2 months ago and therefore cannot be reactivated.',
      );
    }
  }
};

/**
 * Updates module data after policy reactivation to add policy_reactivation and latest_policy_reactivation date.
 * @param {object} param
 * @param {PlatformPolicy} param.policy The policy object
 * @return {array}
 * @see {@link https://docs.rootplatform.com/docs/lifecycle-hooks#after-policy-reactivated Lifecycle Hook - After Policy Reactivated}
 */
function afterPolicyReactivated({ policy }) {
  return [
    {
      name: 'update_policy_module_data',
      data: {
        policy_reactivations: policy.module.policy_reactivations++,
        latest_policy_reactivation: moment(),
      },
    },
  ];
}

/**
 * Updates module data after policy lapse to add latest_policy_deactivation date.
 * @return {array}
 * @see {@link https://docs.rootplatform.com/docs/lifecycle-hooks#after-policy-lapsed Lifecycle Hook - After Policy Lapsed}
 */
function afterPolicyLapsed() {
  return [
    {
      name: 'update_policy_module_data',
      data: {
        latest_policy_deactivation: moment(),
      },
    },
  ];
}

/**
 * Updates module data after policy cancellation to add latest_policy_deactivation date.
 * @return {array}
 * @see {@link https://docs.rootplatform.com/docs/lifecycle-hooks#after-policy-cancelled Lifecycle Hook - After Policy Cancelled}
 */
function afterPolicyCancelled() {
  return [
    {
      name: 'update_policy_module_data',
      data: {
        latest_policy_deactivation: moment(),
      },
    },
  ];
}
