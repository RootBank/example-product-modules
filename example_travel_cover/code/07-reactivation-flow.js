// 07-reactivation-flow

/**
 * Get the reactivation options for inactive policies.
 * @param {PlatformPolicy} policy The policy to be reactivated.
 * @return {ReactivationOption[]} One of these options must be selected whenever an inactive policy is reactivated.
 */
const getReactivationOptions = (policy) => {
  const reactivationOption = new ReactivationOption({
    type: 'reactivation',
    description: 'A policy can be reactivated if it was cancelled.',
  });
  return [reactivationOption];
};

/**
 * Executed after a policy is linked to a claim.
 * @param {object} params
 * @param {PlatformPolicy} params.policy The policy linked to the claim.
 * @param {PlatformPolicyholder} params.policyholder The policyholder linked to the policy.
 * @param {ReactivationOption} params.reactivationOption The claim linked to the policy.
 */
const beforePolicyReactivated = ({
  policy,
  policyholder,
  reactivationOption,
}) => {
  if (policy.module.reactivation_count === 2) {
    throw new Error(
      'Policy has already been reactivated twice. Please issue a new policy.',
    );
  }
  if (policy.status === 'lapsed') {
    throw new Error(
      'Lapsed policies cannot be reactivated. Please issue a new policy.',
    );
  }
};

/**
 * Executed after a policy is reactivated.
 * @param {object} params
 * @param {PlatformPolicy} params.policy The policy that has been reactivated.
 * @param {PlatformPolicyholder} params.policyholder The policyholder linked to the policy
 * @param {ReactivationOption} params.reactivationOption The reactivation option selected.
 * @return {ProductModuleAction[]} The actions to be queued by the platform.
 */
const afterPolicyReactivated = ({
  policy,
  policyholder,
  reactivationOption,
}) => {
  let reactivationCount;

  if (policy.module.reactivation_count) {
    reactivationCount = policy.module.reactivation_count + 1;
  } else {
    reactivationCount = 1;
  }

  return [
    {
      name: 'update_policy',
      data: {
        module: {
          ...policy.module,
          has_been_reactivated: true, // This field is a regulatory requirement
          reactivation_date: moment().format(),
          reactivation_count: reactivationCount,
        },
      },
    },
  ];
};
