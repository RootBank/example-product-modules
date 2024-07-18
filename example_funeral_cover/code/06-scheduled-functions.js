// 06-scheduled-functions
// Contains all functions relating to scheduled functions

/**
 * Checks the anniversary increase for each member.
 * @param {Record<string, any>} life The life having its anniversary premium checked.
 * @param {string} today The date for the function to check anniversary against, defaults to today.
 * @returns {Record<string, any>} Life with updated premiums on their tranches
 */
const anniversaryIncrease = (life, today = moment().format()) => {
  const now = today;

  const tranches = life.tranches;

  const updatedTranches = tranches.map((tranche) => {
    const yearsInForce = moment(now)
      .startOf('year')
      .clone()
      .diff(moment(tranche.created_at), 'years');
    const shouldHavePremiumIncreased = yearsInForce >= 1;
    const basePremium = tranche.base_premium
      ? tranche.base_premium
      : tranche.premium;

    // If it should have an increase, increase premium by 5% and add base_premium field
    return shouldHavePremiumIncreased
      ? {
          ...tranche,
          base_premium: basePremium,
          premium: Math.round(basePremium * 1.05 ** yearsInForce),
        }
      : tranche;
  });

  return {
    ...life,
    tranches: updatedTranches,
  };
};

/**
 * Scheduled function that checks and updates the policy premium on 1st of January every year.
 * @param {object} params
 * @param {PlatformPolicy} params.policy The policy to be checked.
 * @param {PlatformPolicyholder} params.policyholder The policyholder linked to the policy.
 * @param {string} params.today The date for the function to assess the policy on, defaults to today.
 * @returns {ProductModuleAction[] | void} The actions array that updates the policy.
 */
const handleAnniversaryLogic = ({
  policy,
  policyholder,
  today = moment().format(),
}) => {
  const now = today;

  // If not the 1st of Jan, exit function
  if (moment(now).month() !== 1 && moment(now).date() !== 1) {
    return;
  }

  const mainLife = { ...policy.module.main_life };
  const additionalLives = policy.module.additional_lives_included
    ? [...policy.module.additional_lives]
    : [];

  // Check main member for anniversary increases
  const updatedMain = anniversaryIncrease(mainLife, now);

  // Check additional lives for anniversary increases
  const updatedAdditionlLives = additionalLives.map((add_life) => {
    return anniversaryIncrease(add_life, now);
  });

  const updatedData = {
    ...policy.module,
    main_life: updatedMain,
    additional_lives: updatedAdditionlLives,
  };

  // Update the premium on each member level
  const updatedPremiumData = getTotalPremiumForAllLives(updatedData); // 00-helper-fucntions

  // Get premium on policy level
  const newPremium = getTotalPremium(updatedPremiumData); // 00-helper-fucntions

  // Check if theres been any change on main life
  const hasMainChanged =
    JSON.stringify(mainLife) !== JSON.stringify(updatedMain);

  // Check if theres been any change on additional lives
  const haveAdditionalLivesChanged =
    JSON.stringify(additionalLives) !== JSON.stringify(updatedAdditionlLives);

  if (!hasMainChanged && !haveAdditionalLivesChanged) {
    return;
  }

  return [
    {
      name: 'update_policy',
      data: {
        monthlyPremium: newPremium,
        module: {
          ...policy.module,
          ...(hasMainChanged ? { main_life: updatedMain } : {}),
          ...(haveAdditionalLivesChanged
            ? { additional_lives: updatedAdditionlLives }
            : {}),
        },
      },
    },
  ];
};
