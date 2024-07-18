// 08-lifecycle-hooks
// Contains all functions relating to claims hook functions

/**
 * Accurately formats the child_date_of_birth entered into the Claims Schema to account for GMT errors to enable .find() to work.
 * @param {PlatformClaim} claim The claim object.
 * @returns {string} The date with corrected date of birth.
 */
const correctClaimDateEntryForChildDob = (claim) => {
  const fixedClaimDate = moment(claim.block_states.child_date_of_birth.value)
    .add(2, 'h')
    .startOf('d')
    .format('YYYY-MM-DD');

  return fixedClaimDate;
};

/**
 * Finds the matching life on the policy against the claim information entered on the claims blocks.
 * @param {object} params
 * @param {PlatformClaim} params.claim The claim object.
 * @param {PlatformPolicy} params.policy The policy object.
 * @param {Record<string, any>[]} params.lives The path for the specific life.
 * @returns {Record<string, any>} The life object if found.
 */
const getCorrectLife = ({ claim, policy, lives }) => {
  if (claim.block_states.member_deceased.option_key === 'main_member') {
    return policy.module.main_life;
  }

  const claimIdNumber = claim.block_states.deceased_id_number.value;
  if (claimIdNumber) {
    let life = lives.find((life) => claimIdNumber === life.id_number);
    return life;
  }

  const claimChildDateOfBith = correctClaimDateEntryForChildDob(claim);
  let life = lives.find((life) => life.date_of_birth === claimChildDateOfBith);
  return life;
};

/**
 * Calls the claim enpoint to update the claim with the relevant member details tothe claims app_data.
 * @param {object} params
 * @param {PlatformClaim} params.claim The claim object.
 * @param {PlatformPolicy} params.policy The policy object.
 * @param {Record<string, any>[]} params.lives The path for the selected life.
 * @param {'main_member' | 'additional_life' } params.life The text definition of the life.
 */
const setAppData = async ({ claim, policy, lives, life }) => {
  const coveredLife = getCorrectLife({ claim, policy, lives });

  let accidentalCover;
  let naturalCover;
  let suicideCover;

  // Change denomination of currency
  if (coveredLife !== undefined) {
    accidentalCover = coveredLife.cover.accidental_cover_amount / 100;
    naturalCover = coveredLife.cover.natural_cover_amount / 100;
    suicideCover = coveredLife.cover.suicide_cover_amount / 100;
  }

  // Check whether the action is within the sandbox or production environment
  const [apiKey, host] = checkEnvironment();

  // Updates claim if life found, else sends error text if not found
  const errorMessage =
    'No matching life found on the policy with this id_number or date_of_birth';

  const data =
    coveredLife !== undefined
      ? {
          value: `Policy module data added to the claim for ${life}`,
          app_data: {
            benefits: {
              accidental_cover_amount: `The eligible payout amount for the life is ZAR ${accidentalCover} `,
              natural_cover_amount: `The eligible payout amount for the life is ZAR ${naturalCover} `,
              suicide_cover_amount: `The eligible payout amount for the life is ZAR ${suicideCover} `,
            },
          },
        }
      : {
          value: `Wiping Data`,
          app_data: {
            benefits: {
              accidental_cover_amount: errorMessage,
              natural_cover_amount: errorMessage,
              suicide_cover_amount: errorMessage,
            },
          },
        };

  await mainRootAPIRequest({
    host,
    method: 'PATCH',
    data,
    apiKey,
    path: `/claims/${claim.claim_id}`,
  });
};

/**
 * Fetch the life's benefit object and store on `claim.app_data`
 * @param {object} params The input parameter is an object consisting of the following values:
 * @param {PlatformClaim} params.claim The linked claim object
 * @param {PlatformPolicy} params.policy The linked policy object
 * @param {PlatformPolicyholder} params.policyholder The linked policyholder object
 */
const afterClaimBlockUpdated = async ({ claim, policy, policyholder }) => {
  const { block_states: blockStates } = claim; // Claim block path
  const { option_key: optionKey } = blockStates.member_deceased;
  let lives;

  switch (optionKey) {
    // If member_deceased is the policyholder
    case 'main_member':
      lives = [policy.module.main_life];
      await setAppData({ claim, policy, lives, life: 'main_member' });
      return;
    case 'other_insured':
      lives = policy.module.additional_lives;
      await setAppData({ claim, policy, lives, life: 'additional_life' });
      return;
    default:
      throw new Error('No deceased details provided');
  }
};

/**
 * Platform function: This is required to invoke the /claim endpoint in the Product module.
 * If this is not in the product module the API requests failed with an `Invalid response format for function 'validateClaimRequest'` error.
 * @param {object} data the information passed through to the claim endpoint.
 */
const validateClaimRequest = (data) => {
  return Joi.validate(data, Joi.object().required());
};
