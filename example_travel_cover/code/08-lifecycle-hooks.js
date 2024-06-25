// 08-lifecycle-hooks

/**
 * Executed after a claim decision is acknowledged by the claims supervisor.
 * @param {object} params The object provided by the Root platform
 * @param {PlatformPolicy} params.policy - the related policy to the claim
 * @param {PlatformPolicyholder} params.policyholder The policyholder linked to the policy
 * @param {PlatformClaim} params.claim - the claim being updated
 * @return {Promise<ProductModuleAction[] | void>} An array of actions to be queued by the platform
 */
const afterClaimDecisionAcknowledged = async ({
  policy,
  policyholder,
  claim,
}) => {
  if (
    claim.approval_status !== 'approved' &&
    claim.approval_status !== 'goodwill'
  ) {
    return;
  }
  //Check whether the action is within the sandbox or production environment
  const [apiKey, host] = checkEnvironment();

  //Update the payout_amount block on the claim with the policy's sum assured value
  const data = [
    {
      key: 'payout_amount',
      block_state: {
        type: 'input.currency',
        value: policy.sum_assured,
      },
    },
  ];

  await mainRootAPIRequest({
    host,
    method: 'PATCH',
    data,
    apiKey,
    path: `/claims/${claim.claim_id}/blocks`,
  });

  //Update the module data on the policy to save the claim date as the date the action occured and the has_been_claimed boolean.
  return [
    {
      name: 'update_policy',
      data: {
        module: {
          ...policy.module,
          has_been_claimed: true, // This field is a regulatory requirement
          claim_date: moment().format(),
        },
      },
    },
    //Then lapse the policy
    { name: 'lapse_policy' },
  ];
};

/**
 * Platform function: This is required to invoke the /claim endpoint in the Product module.
 * If this is not in the product module the API requests failed with an `Invalid response format for function 'validateClaimRequest'` error.
 * @param {*} data the information passed through to the claim endpoint
 */
const validateClaimRequest = (data) => {
  return Joi.validate(data, Joi.object().required());
};
