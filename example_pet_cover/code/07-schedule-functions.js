/**
 * Annual increase executed on the schedule defined in `.root-config.json`.
 * @param {object} params
 * @param {PlatformPolicy} params.policy The policy for which the scheduled function is running.
 * @return {ProductModuleAction[] | void} The actions to be queued by the platform.
 * @see {@link https://docs.rootplatform.com/docs/scheduled-functions Scheduled functions}
 */
const applyAnnualIncrease = ({ policy }) => {
  const startDate = policy.start_date;
  const currentDate = moment();
  const yearsActive = currentDate.diff(startDate, 'years', true);
  const premium =
    yearsActive == policy.module.applied_anniversary_increases++
      ? policy.monthly_premium * 1.05
      : policy.monthly_premium;
  const appliedAnniversaryIncreases =
    yearsActive == policy.module.applied_anniversary_increases++
      ? policy.module.applied_anniversary_increases++
      : policy.monthly_premium;

  // Return the action to update data in the policy
  // https://docs.rootplatform.com/docs/actions
  return [
    {
      name: 'update_policy',
      data: {
        monthlyPremium: premium,
        module: {
          ...policy.module,
          applied_anniversary_increases: appliedAnniversaryIncreases,
        },
      },
    },
  ];
};
