// 02-quote-hook.js
// Contains all functions relating to quote generation

/**
 * Validates the quote request data.
 * @param {Record<string, any>} data The data received in the body of the
 *     [Create a quote](https://docs.rootplatform.com/reference/getting-a-quote-2) request
 *     (without the `type` property).
 * @return {{error: any; result: any}} The [validation result](https://joi.dev/api/?v=12.1.0#validatevalue-schema-options-callback).
 *    If there are no errors, the `value` property will contain the validated data, which is passed to `getQuote`.
 * @see {@link https://docs.rootplatform.com/docs/quote-hook Quote hook}
 */
function validateQuoteRequest(data) {
  // Add age to every additional life so that age can be validated against allowable cover amount
  const dataWithAge =
    data.additional_lives_included === true
      ? addAgeToAdditionalLife(data)
      : data;

  const result = Joi.validate(
    dataWithAge,
    Joi.object()
      .keys({
        additional_lives_included: Joi.boolean().required(),
        main_life: Joi.object()
          .keys({
            date_of_birth: Joi.date()
              .iso()
              .max(moment().format('YYYY-MM-DD'))
              .required(),
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
                date_of_birth: Joi.date()
                  .iso()
                  .max(moment().format('YYYY-MM-DD'))
                  .required(),
                biological_sex: Joi.string()
                  .valid(['male', 'female'])
                  .required(),
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
      .required(),
    { abortEarly: false },
  );

  return result;
}

/**
 * Validation helper to check ages fall within their acceptable range.
 * @param {Record<string, any>} data The quote request data.
 */
const validateDateOfBirthAge = (data) => {
  const mainMinAge = 18;
  const mainMaxAge = 64;
  const mainLifeDateOfBirth = data.main_life.date_of_birth;
  const mainLifeAge = getAgeFromDateOfBirth(mainLifeDateOfBirth);

  if (mainLifeAge < mainMinAge || mainLifeAge > mainMaxAge) {
    throw new Error(
      `Main life age is ${mainLifeAge}. The minimum allowable age of the main life is 18 and maximum age is 64. Please choose a different main life.`,
    );
  }

  const additionalMinAge = 0;
  const additionalMaxAge = 85;

  if (data.additional_lives) {
    for (const additionalLife of data.additional_lives) {
      const additionalLifeAge = getAgeFromDateOfBirth(
        additionalLife.date_of_birth,
      );
      if (
        additionalLifeAge < additionalMinAge ||
        additionalLifeAge > additionalMaxAge
      ) {
        throw new Error(
          `Life with date of birth ${moment(
            additionalLife.date_of_birth,
          ).format(
            'YYYY-MM-DD',
          )} has an age of ${additionalLifeAge}. The maximum age for an additional life is 85. Please remove the additional life.`,
        );
      }
    }
  }
};

/**
 * Handler that sets up the the initial tranches for all the covered lives on the policy.
 * @param {Record<string, any>} data The quote request data.
 * @returns {Record<string, any>} The quote request data with tranches added to every covered life.
 */
const setUpInitialTranches = (data) => {
  const mainLife = {
    id: createUuid(),
    ...data.main_life,
    tranches: [].concat(createTranche(data.main_life)), //00-helper-functions
  };

  const additionalLives =
    data.additional_lives_included === true
      ? data.additional_lives.map((additionalLife) => ({
          id: createUuid(),
          ...additionalLife,
          tranches: [].concat(createTranche(additionalLife)), //00-helper-functions
        }))
      : [];

  const updatedData = {
    ...data,
    main_life: mainLife,
    ...(data.additional_lives_included === true
      ? { additional_lives: additionalLives }
      : {}),
  };
  return updatedData;
};

/**
 * Calculated the cover for a specific waiting period.
 * @param {Record<string, any>[]} tranches The array of tranche objects.
 * @param {number} months The waiting period in months.
 * @param {string} today The date to compare, defaults to today.
 * @returns {number} The cover amount applicable to the wating period.
 */
const getWaitingPeriodCover = (tranches, months, today = moment().format()) => {
  const now = today;

  const waitingPeriodCover = sum(
    tranches
      .filter(
        (tranche) =>
          moment(now).diff(moment(tranche.created_at), 'months') >= months,
      )
      .map((tranche) => tranche.cover_amount),
  );
  return waitingPeriodCover;
};

/**
 * Add an event to the end of the event array stored in a members object.
 * @param {Record<string, any>} member The member object
 * @param {string} eventType The type of event to be added
 * @param {{id: string; type: string; total_cover: number; date: string }[]} events
 *     The events array of the member, defaults to emply array for new members
 * @returns The events array with latest event
 */
const addEvent = (member, eventType, events = []) => {
  const newEvent = {
    id: createUuid(),
    type: eventType,
    total_cover: member.total_cover_amount,
    date: moment().format(),
  };

  const updatedEvents = [...events, newEvent];

  return updatedEvents;
};

/**
 * Types of events tracked on policy
 */
const eventTypes = {
  coverInitialised: 'cover_initiated',
  coverIncreased: 'cover_increased',
  coverDecreased: 'cover_decreased',
  detailsUpdated: 'details_updated',
};

/**
 * Adds the initial events array to each life.
 * @param {Record<string, any>} data The input data.
 * @returns {Record<string, any>} The quote data with a member-level events array for each covered life.
 */
const getInitialEventsForLives = (data) => {
  const updatedMainLife = {
    ...data.main_life,
    events: addEvent(data.main_life, eventTypes.coverInitialised),
  };

  const updatedAdditionalLives =
    data.additional_lives_included === true
      ? data.additional_lives.map((life) => ({
          ...life,
          events: addEvent(life, eventTypes.coverInitialised),
        }))
      : [];

  const updatedData = {
    ...data,
    main_life: updatedMainLife,
    ...(data.additional_lives_included === true
      ? { additional_lives: updatedAdditionalLives }
      : {}),
  };

  return updatedData;
};

/**
 * Generates an array of quote packages from the quote request data.
 * @param {Record<string, any>} data The validated data returned by `validateQuoteRequest` as `result.value`.
 * @return {QuotePackage[]} The quote package(s) that will be returned by the
 *     [Create a quote](https://docs.rootplatform.com/reference/getting-a-quote-2) endpoint.
 * @see {@link https://docs.rootplatform.com/docs/quote-hook Quote hook}
 */
const getQuote = (data) => {
  // Validate ages
  validateDateOfBirthAge(data);

  // Removes the age added for validation purposes
  const dataAgeRemoved =
    data.additional_lives_included === true
      ? removeAgeFromAdditionalLife(data)
      : data;

  const dataAddMemberTranches = setUpInitialTranches(dataAgeRemoved);

  const dataAddMemberTotalPremium = getTotalPremiumForAllLives(
    dataAddMemberTranches,
  ); //00-helper-functions

  const dataAddMemberTotalCoverAmount = getTotalCoverAmountForAllLives(
    dataAddMemberTotalPremium,
  ); //00-helper-functions

  const dataAddMemberBenefitBreakdown = getMemberBenefitBreakdown(
    dataAddMemberTotalCoverAmount,
  ); //00-helper-functions

  const dataAddMemberEvents = getInitialEventsForLives(
    dataAddMemberBenefitBreakdown,
  );

  const totalPremium = getTotalPremium(dataAddMemberEvents); //00-helper-functions
  const totalSumAssured = getTotalCoverAmount(dataAddMemberEvents); //00-helper-functions

  const quotePackage = new QuotePackage({
    // Below are standard fields for all products
    package_name: 'Funeral Cover',
    sum_assured: totalSumAssured,
    base_premium: totalPremium,
    suggested_premium: totalPremium,
    billing_frequency: 'monthly',
    module: {
      // Save any data, calculations, or results here for future re-use.
      ...dataAddMemberEvents,
    },
    input_data: { ...data },
  });

  return [quotePackage];
};
