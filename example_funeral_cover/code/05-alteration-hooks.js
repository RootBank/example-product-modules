// 05-alteration-hook.js
// Contains all functions relating to creating and applying alteration hooks

const updateCoveredLivesSchema = Joi.object()
  .keys({
    additional_lives_included: Joi.boolean().required(),
    main_life: Joi.object()
      .keys({
        date_of_birth: Joi.date().iso().required(),
        biological_sex: Joi.string().valid(['male', 'female']).required(),
        total_cover_amount: Joi.number()
          .integer()
          .min(20000 * 100)
          .max(100000 * 100)
          .required(),
      })
      .required(),
    additional_lives: Joi.when('additonal_lives_included', {
      is: Joi.valid([true]),
      then: Joi.array()
        .min(1)
        .max(10)
        .items(
          Joi.object().keys({
            age: Joi.number().required(),
            first_name: Joi.string().required(),
            last_name: Joi.string().required(),
            id_number: Joi.string().optional(),
            id: Joi.string().optional(),
            date_of_birth: Joi.date().iso().required(),
            biological_sex: Joi.string().valid(['male', 'female']).required(),
            total_cover_amount: Joi.when('age', {
              is: Joi.number().less(6),
              then: validMemberUnder6(),
            })
              .when('age', {
                is: Joi.number().less(14),
                then: validMemberUnder14(),
              })
              .when('age', {
                is: Joi.number().greater(13),
                then: validAdditionalLivesValues(),
              }),
            relationship: Joi.string().valid(relationshipOptions),
          }),
        )
        .optional(),
      otherwise: Joi.forbidden(),
    }),
  })
  .required();

const premiumWaiverSchema = Joi.object()
  .keys({
    undo: Joi.boolean().required(),
    main_member_date_of_death: Joi.when('undo', {
      is: true,
      then: Joi.dateOfBirth().optional(),
      otherwise: Joi.dateOfBirth().required(),
    }),
  })
  .required();

/**
 * Validates the alteration package request data.
 * @param {object} params
 * @param {string} params.alteration_hook_key The alteration hook identifier, as specified in `.root-config.json`.
 * @param {Record<string, any>} params.data The data received in the body of the
 *     [Create an alteration package](https://docs.rootplatform.com/reference/create-an-alteration-package-1) request
 *     (without the `key` property).
 * @param {PlatformPolicy} params.policy The policy to which the alteration package will be applied.
 * @param {PlatformPolicyholder} params.policyholder The policyholder linked to the policy.
 * @return {{error: any; result: any}} The [validation result](https://joi.dev/api/?v=12.1.0#validatevalue-schema-options-callback).
 *    If there are no errors, the `value` property will contain the validated data, which is passed to `getAlteration`.
 * @see {@link https://docs.rootplatform.com/docs/alteration-hooks Alteration hooks}
 */
const validateAlterationPackageRequest = ({
  alteration_hook_key,
  data,
  policy,
  policyholder,
}) => {
  // Add age to every additional life so that age can be validated against allowable cover amount
  const dataWithAge =
    data.additional_lives_included === true
      ? addAgeToAdditionalLife(data)
      : data;

  let result;
  switch (alteration_hook_key) {
    case 'update_covered_lives':
      result = Joi.validate(dataWithAge, updateCoveredLivesSchema, {
        abortEarly: false,
      });
      return result;
    case 'premium_waiver':
      result = Joi.validate(data, premiumWaiverSchema, {
        abortEarly: false,
      });
      return result;
    default:
      throw new Error(`Invalid alteration hook key "${alteration_hook_key}"`);
  }
};

/**
 * Finds the different different fields between the policy and alteration objects
 * @param {Record<string, any>} old_object The old policy object
 * @param {Record<string, any>} new_object The new alteration object
 * @return An array containing the names of all fields that have different values
 */
const findObjectDifferences = (old_object, new_object) => {
  let changes = Object.keys(new_object).filter(
    // looks at alteration object as this will have the only changable fields
    (key) =>
      JSON.stringify(new_object[key]) !== JSON.stringify(old_object[key]),
  ); //stringify to include the same object with different references

  // removes total_cover_amount, cover amounts handled under cover increases and decreases
  if (changes.includes('total_cover_amount')) {
    const indexOfChange = changes.indexOf('total_cover_amount');
    changes.splice(indexOfChange, 1);
  }

  return changes;
};

/**
 * List of rating factors that would change premium
 */
const ratingFactors = ['relationship', 'date_of_birth', 'biological_sex'];

/**
 * Applies all found changes to a members object.
 * @param {Record<string, any>} alterationObject The new alteration data.
 * @param {Record<string, any>} policyObject The old policy data.
 * @param {string[]} memberChanges The array of fields that need to be updated.
 * @returns {Record<string, any>} Member object with premium changes if an endorsement was applied.
 */
const applyChangesToObjects = (
  alterationObject,
  policyObject,
  memberChanges,
) => {
  let updatedMember = { ...policyObject };
  // apply change for each difference
  memberChanges.forEach((key) => {
    updatedMember = {
      ...updatedMember,
      [key]: alterationObject[key],
    };
  });

  //if there is a single endorsement then premium must be redone and tranches must be recalculated
  const isEndorsement = memberChanges.some((field) =>
    ratingFactors.includes(field),
  );

  let previousPremium = 0; // need to sum previous premiums as tranches are updated
  let previousCoverAmmount = 0; // need to sum previous cover amounts as tranches are updated
  const updatedTranches = isEndorsement
    ? policyObject.tranches.map((tranche) => {
        //if is an isEndorsement, update all tranche premiums
        previousCoverAmmount += tranche.cover_amount;
        const newPremium = getPremium({
          age: getAgeFromDateOfBirth(
            policyObject.date_of_birth,
            tranche.created_at,
          ),
          total_cover_amount: previousCoverAmmount,
          biological_sex: policyObject.biological_sex,
          relationship: policyObject.relationship,
        });

        const newTranche = {
          ...tranche,
          premium: newPremium - previousPremium,
        };
        previousPremium += newPremium;

        return newTranche;
      })
    : // if not an endorsement return current tranches
      policyObject.tranches;

  // get total premium for each member
  const totalPremium = sum(updatedTranches.map((tranche) => tranche.premium));

  return {
    ...updatedMember,
    ...(isEndorsement ? { tranches: updatedTranches } : {}),
    ...(isEndorsement ? { total_premium: totalPremium } : {}),
  };
};

/**
 * Handler function to to check if details should be changed for a member
 * @param {Record<string, any>} newMember The new member object from input
 * @param {Record<string, any>} oldMember The old member object from policy
 * @returns {Record<string, any>} The new updated member, or old member if there are no details changed
 */
const changeDetailsHandler = (newMember, oldMember) => {
  // Looks for changes between old and new memebers, if found, add [key] of field changed
  const memberChanges = findObjectDifferences(oldMember, newMember);
  if (memberChanges.length !== 0) {
    //if changes found, update member
    const updatedMember = applyChangesToObjects(
      newMember,
      oldMember,
      memberChanges,
    );
    return {
      ...updatedMember,
      events: addEvent(
        updatedMember,
        eventTypes.detailsUpdated,
        updatedMember.events,
      ),
    };
  } else {
    // if no changes found, return current
    return oldMember;
  }
};

/**
 * Updates tranches array when reducing cover.
 * @param {Record<string, any>} member The member that has their cover changed.
 * @param {Record<string, any>[]} tranches The tranches of the member before cover changed.
 * @returns {Record<string, any>[]} Latest updated tranches array.
 */
const updateTranches = (member, tranches) => {
  const totalCover = member.total_cover_amount;
  let currentTranches = [...tranches];

  // get the difference bettween total old cover amount and new cover amount
  let difference =
    sum(currentTranches.map((tranche) => tranche.cover_amount)) - totalCover;

  //
  for (let i = tranches.length - 1; i >= 0; i--) {
    if (tranches[i].cover_amount <= difference) {
      // if cover amount of latest tranche is less than current difference
      difference -= tranches[i].cover_amount; // get new difference
      currentTranches.splice(i, 1); // remove tranche

      if (difference === 0) {
        break; // break loop if difference is now 0
      }
    } else {
      // if cover amount of latest tranche is more than current difference
      const lastTranche = { ...tranches[i] }; // copy last tranche
      currentTranches.splice(i, 1); //remove last tranche

      const newTranche = createTranche({
        //00-helper-functions
        ...member,
        tranches: currentTranches,
      }); // create a new tranche with latest tranche s
      // overwrite ID and created at date
      const reducedTranche = {
        // overwrite with old tranche ID and create_at time
        ...newTranche,
        id: lastTranche.id,
        created_at: lastTranche.created_at,
      };
      currentTranches.push(reducedTranche); // append to latest tranches
      break;
    }
  }
  return currentTranches;
};

/**
 * Handler function to to check if cover amounts should be changed for a member.
 * @param {Record<string, any>} newMember The new member object from input.
 * @param {Record<string, any>} oldMember The old member object from policy.
 * @returns Object containing the tranches of a member and the events array.
 */
const changeCoverHandler = (newMember, oldMember) => {
  // check if cover amount has changed
  const tranchesAndEvents =
    newMember.total_cover_amount !== oldMember.total_cover_amount
      ? newMember.total_cover_amount > oldMember.total_cover_amount
        ? // If new the cover amount is higher than the old cover amount:
          {
            // add new tranche
            tranches: oldMember.tranches.concat(
              createTranche({
                //00-helper-functions
                ...oldMember,
                total_cover_amount: newMember.total_cover_amount,
              }),
            ),
            // Add cover increased event
            events: addEvent(
              newMember,
              eventTypes.coverIncreased,
              oldMember.events,
            ),
          }
        : {
            tranches: updateTranches(newMember, [...oldMember.tranches]),
            events: addEvent(
              newMember,
              eventTypes.coverDecreased,
              oldMember.events,
            ),
          }
      : // returns old tranches and events array if no cover amount change
        { tranches: oldMember.tranches, events: oldMember.events };

  return tranchesAndEvents;
};

/**
 * Get the unique events from an array of events, based on the event ID.
 * @param {Record<string, any>[]} events The events array.
 * @returns {Record<string, any>[]} The unique events array.
 */
const getUniqueEvents = (events) => {
  const uniqueIds = [...new Set(events.map((item) => item.id))];
  const uniqueEvents = uniqueIds.map((id) => {
    return events.find((item) => item.id === id);
  });
  return uniqueEvents;
};

/**
 * Processes the alteration data to apply endorsements and amendments in the correct order.
 * @param {Record<string, any>} data The alteration request data.
 * @param {PlatformPolicy} policy The existing policy.
 * @returns {Record<string, any>} The updated data to overwrite the policy.
 */
const updateCoveredLives = (data, policy) => {
  // Check incoming data:
  // 1st check if details change,
  // this details chek will also add or remove new members
  // 2nd check if cover amounts change

  // check for all details changed for main life except cover amounts
  const mainDetailsChecked = changeDetailsHandler(
    data.main_life,
    policy.module.main_life,
  );

  // check for all details changed for additional lives except cover amounts
  const additionalLivesDetailsChecked =
    data.additional_lives_included === true
      ? data.additional_lives.map((life) => {
          if (life.hasOwnProperty('id')) {
            // if life has ID it already existed on the policy
            // Grab life using ID
            const [oldLife] = policy.module.additional_lives.filter(
              (member) => member.id === life.id,
            );
            // Update details for old life using new life data
            return changeDetailsHandler(life, oldLife);
          } else {
            // if life has no ID it is a new member
            const newLifeTranches = [].concat(createTranche(life)); //00-helper-functions
            const newLife = {
              ...life,
              id: createUuid(),
              tranches: newLifeTranches,
              total_premium: sum(
                newLifeTranches.map((tranche) => tranche.premium),
              ),
              cover: updateLifeBenefitLevels(newLifeTranches), //00-helper-functions
              events: addEvent(life, eventTypes.coverInitialised), //00-helper-functions
            };
            return newLife;
          }
        })
      : [];

  // check for cover amounts changed for main life, and return updated tranches and events array
  const mainCoverTranchesAndEvents = changeCoverHandler(
    data.main_life,
    policy.module.main_life,
  );

  // check for cover amounts changed for additional lives, and return updated tranches and events array
  const additionalLivesCoverCheckedAndEvents =
    data.additional_lives_included === true
      ? data.additional_lives.map((life, index) => {
          // if life has ID it already existed on the policy
          if (life.hasOwnProperty('id')) {
            const [oldLife] = policy.module.additional_lives.filter(
              (member) => member.id === life.id,
            );
            return changeCoverHandler(life, oldLife);
          } else {
            // if no ID yet exists, then no cover amounts to update.
            return {
              tranches: additionalLivesDetailsChecked[index].tranches,
              events: additionalLivesDetailsChecked[index].events,
            };
          }
        })
      : [];

  const mainDataCombined = {
    ...mainDetailsChecked,
    tranches: mainCoverTranchesAndEvents.tranches,
    events: getUniqueEvents([
      ...mainDetailsChecked.events,
      ...mainCoverTranchesAndEvents.events,
    ]),
  };

  const additionalLivesDataCombined = additionalLivesDetailsChecked.map(
    (member, index) => ({
      ...member,
      tranches: additionalLivesCoverCheckedAndEvents[index].tranches,
      events: getUniqueEvents([
        ...member.events,
        ...additionalLivesCoverCheckedAndEvents[index].events,
      ]),
    }),
  );

  const updatedData = {
    ...data,
    main_life: mainDataCombined,
    additional_lives: additionalLivesDataCombined,
  };

  const updateCoverAmountData = getTotalCoverAmountForAllLives(updatedData); //00-helper-functions

  const updatePremiumData = getTotalPremiumForAllLives(updateCoverAmountData); //00-helper-functions

  const updateBenefitData = getMemberBenefitBreakdown(updatePremiumData); //00-helper-functions

  return updateBenefitData;
};

/**
 * Generates an alteration package for the `update_covered_lives` alteration hook.
 * @param {object} params
 * @param {Record<string, any>} params.data The validated data returned by `validateAlterationPackageRequest` as `result.value`.
 * @param {PlatformPolicy} params.policy The policy to which the alteration package will be applied.
 * @return {AlterationPackage} Alteration package returned by the
 *     [Create an alteration package](https://docs.rootplatform.com/reference/create-an-alteration-package-1)
 *     endpoint.
 */
const getUpdateCoveredLivesAlteration = ({ policy, data }) => {
  if (policy.module.policy_alteration_allowed === false) {
    // Policy locked after premium waiver alteration
    throw new Error('Policy is locked to alterations');
  }

  // Removes the age added for validation purposes
  const dataAgeRemoved =
    data.additional_lives_included === true
      ? removeAgeFromAdditionalLife(data)
      : data;

  // Send all data to be checked and updated
  const alterationData = updateCoveredLives(dataAgeRemoved, policy);

  // Get new premium and cover amounts
  const totalPremium = getTotalPremium(alterationData); //00-helper-functions
  const totalCoveraAmount = getTotalCoverAmount(alterationData); //00-helper-functions

  const alterationPackage = new AlterationPackage({
    input_data: data,
    sum_assured: totalCoveraAmount,
    monthly_premium: totalPremium,
    change_description: 'Amend and endorse covered lives details',
    module: {
      ...policy.module,
      ...alterationData,
    },
  });

  return alterationPackage;
};

/**
 * Generates an alteration package for the `premium_waiver` alteration hook.
 * @param {object} params
 * @param {Record<string, any>} params.data The validated data returned by `validateAlterationPackageRequest` as `result.value`.
 * @param {PlatformPolicy} params.policy The policy to which the alteration package will be applied.
 * @return {AlterationPackage} Alteration package returned by the
 *     [Create an alteration package](https://docs.rootplatform.com/reference/create-an-alteration-package-1)
 *     endpoint.
 */
const getPremiumWaiverAlteration = ({ data, policy }) => {
  const dateOfDeath = data.main_member_date_of_death;
  let policyEndDate = moment(dateOfDeath).add(6, 'months').format();
  let zeroPremium = 0;
  let policyAlterationAllowed = false;

  // Can't undo if no death was recorded
  if (policy.module.policy_alteration_allowed === true && data.undo === true) {
    throw new Error('Policy was not locked and cannot be unlocked');
  }

  // This overrites the policy end date, recalculates the premium and unlocks the policy for alterations
  if (policy.module.policy_alteration_allowed === false && data.undo === true) {
    policyEndDate = null;
    zeroPremium = getTotalPremium(policy.module); // 00-helper-functions
    policyAlterationAllowed = true;
  }

  const alterationPackage = new AlterationPackage({
    input_data: {
      data,
    },
    sum_assured: policy.sum_assured,
    monthly_premium: zeroPremium,
    change_description: 'Premium waiver on death of main member',
    module: {
      ...policy.module,
      ...data,
      policy_end_date: policyEndDate,
      policy_alteration_allowed: policyAlterationAllowed,
    },
  });

  return alterationPackage;
};

/**
 * Generates an alteration package from the alteration package request data, policy and policyholder.
 * @param {object} params
 * @param {string} params.alteration_hook_key The alteration hook identifier, as specified in `.root-config.json`.
 * @param {Record<string, any>} params.data The validated data returned by `validateAlterationPackageRequest` as `result.value`.
 * @param {PlatformPolicy} params.policy The policy to which the alteration package will be applied.
 * @param {PlatformPolicyholder} params.policyholder The policyholder linked to the policy.
 * @return {AlterationPackage} Alteration package returned by the
 *     [Create an alteration package](https://docs.rootplatform.com/reference/create-an-alteration-package-1)
 *     endpoint.
 * @see {@link https://docs.rootplatform.com/docs/alteration-hooks Alteration hooks}
 */
const getAlteration = ({ alteration_hook_key, data, policy, policyholder }) => {
  let alterationPackage;
  switch (alteration_hook_key) {
    case 'update_covered_lives': // this is the amendment and endorsement alteration
      alterationPackage = getUpdateCoveredLivesAlteration({ policy, data });
      return alterationPackage;
    case 'premium_waiver': // this locks the policy in the event of a main member death, stops billing, and ends the policy in 6 months
      alterationPackage = getPremiumWaiverAlteration({ data, policy });
      return alterationPackage;
    default:
      throw new Error(`Invalid alteration hook key "${alteration_hook_key}"`);
  }
};

/**
 * Applies the alteration package to the policy.
 * Triggered by the [Apply alteration package](https://docs.rootplatform.com/reference/apply-alteration-package-1) endpoint.
 * @param {object} params
 * @param {string} params.alteration_hook_key The alteration hook identifier, as specified in `.root-config.json`.
 * @param {PlatformPolicy} params.policy The policy to which the alteration package will be applied.
 * @param {PlatformPolicyholder} params.policyholder The policyholder linked to the policy.
 * @param {PlatformAlterationPackage} params.alteration_package The alteration package to be applied to the policy.
 * @return {AlteredPolicy} The altered policy. This object is **not** returned over the endpoint.
 *    Instead, the alteration package is returned with a status of `applied`.
 * @see {@link https://docs.rootplatform.com/docs/alteration-hooks Alteration hooks}
 */
const applyAlteration = ({
  alteration_hook_key,
  policy,
  policyholder,
  alteration_package,
}) => {
  let alteredPolicy;
  switch (alteration_hook_key) {
    case 'update_covered_lives':
      alteredPolicy = new AlteredPolicy({
        package_name: policy.package_name,
        sum_assured: alteration_package.sum_assured,
        base_premium: alteration_package.monthly_premium,
        monthly_premium: alteration_package.monthly_premium,
        module: alteration_package.module,
        end_date: policy.end_date,
        start_date: policy.start_date,
      });
      return alteredPolicy;
    case 'premium_waiver':
      // remove end_date from module data
      const endDate = alteration_package.module.policy_end_date;
      const newModule = alteration_package.module;
      delete newModule.policy_end_date;

      alteredPolicy = new AlteredPolicy({
        package_name: policy.package_name,
        sum_assured: alteration_package.sum_assured,
        base_premium: alteration_package.monthly_premium,
        monthly_premium: alteration_package.monthly_premium,
        module: newModule,
        end_date: endDate,
        start_date: policy.start_date,
      });

      return alteredPolicy;
    default:
      throw new Error(`Invalid alteration hook key "${alteration_hook_key}"`);
  }
};
