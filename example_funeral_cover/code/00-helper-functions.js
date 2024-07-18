// 00-helper-functions
// Contains all functions used across muptiple workflows

/**
 * Sums an array of intergers
 * @param {number[]} n Array of integers to be added
 * @returns Accumulated total
 */
const sum = (n) => n.reduce((acc, curr) => acc + curr, 0);

/**
 * Calculates the age of a member from their date of birth
 * @param {string} dateOfBirth ISO date of birth of the member
 * @param {string} dateForAge Date from which to check their age, defaults to today if undefined
 * @returns Age rounded down to the nearest year
 */
const getAgeFromDateOfBirth = (dateOfBirth, dateForAge = moment().format()) => {
  return moment(dateForAge).diff(moment(dateOfBirth), 'years');
};

/**
 * Converts a string like this
 * ```
 * age,low_risk,high_risk
 * 0,0.10,0.20
 * 1,0.14,0.25
 * ```
 * into an object like this
 * ```
 * {
 *   0: {
 *     low_risk: 0.10
 *     high_risk: 0.20
 *   },
 *   1: {
 *     low_risk: 0.14
 *     high_risk: 0.25
 *   }
 * }
 * ```
 * String values are converted to numbers where possible.
 * @param {string} csv Raw comma-separated values
 * @returns {Record<string, any>} Data represented as an object
 */
const getObjectFromCsv = (csv) => {
  const allRows = csv.split('\n').map((row) =>
    row
      .trim()
      .split(/[,]+/g)
      .map((cell) => (isNaN(Number(cell)) ? cell : Number(cell))),
  );
  const headings = allRows[0];
  const rows = allRows.slice(1);
  const data = rows.map((row) =>
    row.reduce((acc, cur, i) => {
      acc[headings[i]] = cur;
      return acc;
    }, {}),
  );
  return data;
};

/**
 * Joi helper validation to allow only null or undefined
 */
const joiNull = Joi.forbidden().allow(null);

/**
 * Adds the additional life's age to the input parameters
 * @param {Record<string, any>} data The request body data received over the endpoint
 * @returns {Record<string, any>} The data object with ages added to each additional life
 */
const addAgeToAdditionalLife = (data) => {
  const updatedAdditionalLives = data.additional_lives.map(
    (additional_life) => ({
      ...additional_life,
      age: getAgeFromDateOfBirth(additional_life.date_of_birth),
    }),
  );

  const updatedData = {
    ...data,
    additional_lives: updatedAdditionalLives,
  };

  return updatedData;
};

/**
 * Removes the additional life's age from the input parameters
 * @param {Record<string, any>} data The data to have age of additioanl lives removed
 * @returns {Record<string, any>} The data object with age removed from each additional life
 */
const removeAgeFromAdditionalLife = (data) => {
  const updatedAdditionalLives = data.additional_lives.map(
    (additional_life) => ({
      date_of_birth: additional_life.date_of_birth,
      biological_sex: additional_life.biological_sex,
      total_cover_amount: additional_life.total_cover_amount,
      relationship: additional_life.relationship,
      ...(additional_life.id_number
        ? { id_number: additional_life.id_number }
        : {}), // to use in alteration flow
      ...(additional_life.id ? { id: additional_life.id } : {}), // to use in alteration flow
      ...(additional_life.first_name
        ? { first_name: additional_life.first_name }
        : {}), // to use in alteration flow
      ...(additional_life.last_name
        ? { last_name: additional_life.last_name }
        : {}), // to use in alteration flow
    }),
  );

  const updatedData = {
    ...data,
    additional_lives: updatedAdditionalLives,
  };

  return updatedData;
};

/**
 * Returns allowed benefit level for an additional member under 6 years old.
 */
const validMemberUnder6 = () => {
  return Joi.number().min(1000000).max(2000000).required();
};

/**
 * Returns allowed benefit level for an additional member under 14 years old.
 */
const validMemberUnder14 = () => {
  return Joi.number().min(1000000).max(3000000).required();
};

/**
 * Returns the allowed benefit level for an additional family member over or equal to 14 years old.
 */
const validAdditionalLivesValues = () => {
  return Joi.number().min(1000000).max(10000000).required();
};

/**
 * Joi Validation helper list of allowable relationship options for additional lives.
 */
const relationshipOptions = [
  'spouse',
  'partner',
  'daughter',
  'son',
  'father',
  'mother',
  'brother',
  'sister',
  'mother_in_law',
  'father_in_law',
  'son_in_law',
  'daughter_in_law',
  'grandparent',
  'aunt',
  'uncle',
  'cousin',
  'employer',
  'other',
];

/**
 * Creates a new tranche for a covered life using cover amounts and premiums.
 * @param {Record<string, any>} coveredLife The member for which a new tranche is created.
 * @returns The newly created tranche.
 */
const createTranche = (coveredLife) => {
  const { date_of_birth, total_cover_amount, biological_sex, relationship } =
    coveredLife;
  const tranchePremium = getPremium({
    age: getAgeFromDateOfBirth(coveredLife.date_of_birth),
    total_cover_amount,
    biological_sex,
    relationship,
  });

  // Grab intial premiums, if initial tranche defaults to 0
  const intialPremium = coveredLife.tranches
    ? sum(coveredLife.tranches.map((tranche) => tranche.premium))
    : 0;
  // Grab intial cover amounts, if initial tranche defaults to 0
  const intialCover = coveredLife.tranches
    ? sum(coveredLife.tranches.map((tranche) => tranche.cover_amount))
    : 0;

  return {
    id: createUuid(),
    created_at: moment().format(),
    premium: tranchePremium - intialPremium,
    cover_amount: coveredLife.total_cover_amount - intialCover,
  };
};

/**
 * Calculates all death benefit variants for the life
 * @param {Record<string, any>[]} tranches the tranches stored on the life.
 * @returns Accidental, Natural and Suicide cover amounts.
 */
const updateLifeBenefitLevels = (tranches) => {
  const accidentalCover = getWaitingPeriodCover(tranches, 0);
  const naturalCover = getWaitingPeriodCover(tranches, 6);
  const suicideCover = getWaitingPeriodCover(tranches, 12);
  return {
    accidental_cover_amount: accidentalCover,
    natural_cover_amount: naturalCover,
    suicide_cover_amount: suicideCover,
  };
};

/**
 * Sums the cover amount for each member from the tranche-level and adds it to the member-level object
 * @param {Record<string, any>} data The input data with tranches added
 * @returns {Record<string, any>} The quote data with a member-level cover amount for each covered life
 */
const getTotalCoverAmountForAllLives = (data) => {
  const updatedMainLife = {
    ...data.main_life,
    total_cover_amount: sum(
      data.main_life.tranches.map((tranche) => tranche.cover_amount),
    ),
  };

  const updatedAdditionalLives =
    data.additional_lives_included === true
      ? data.additional_lives.map((life) => ({
          ...life,
          total_cover_amount: sum(
            life.tranches.map((tranche) => tranche.cover_amount),
          ),
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
 * Adds the benefit breakdown to the lives.
 * @param {Record<string, any>} data The information for all covered lives.
 * @returns {Record<string, any>} The addition of the benefits object breakdown to each life on the policy.
 */
const getMemberBenefitBreakdown = (data) => {
  const updatedMainLife = {
    ...data.main_life,
    cover: updateLifeBenefitLevels(data.main_life.tranches), //00-helper-functions
  };

  const updatedAdditionalLives =
    data.additional_lives_included === true
      ? data.additional_lives.map((life) => ({
          ...life,
          cover: updateLifeBenefitLevels(life.tranches), //00-helper-functions
        }))
      : [];

  const updatedData = {
    ...data,
    main_life: updatedMainLife,
    ...(data.additional_lives_included === true
      ? {
          additional_lives: updatedAdditionalLives,
        }
      : {}),
  };

  return updatedData;
};

/**
 * Sums the premium for each member from the tranche-level and adds it to the member-level object.
 * @param {Record<string, any>} data The input data which contains tranches.
 * @returns {Record<string, any>} The quote data with a member-level premium for each covered life.
 */
const getTotalPremiumForAllLives = (data) => {
  const updatedMainLife = {
    ...data.main_life,
    total_premium: sum(
      data.main_life.tranches.map((tranche) => tranche.premium),
    ),
  };

  const updatedAdditionalLives =
    data.additional_lives_included === true
      ? data.additional_lives.map((life) => ({
          ...life,
          total_premium: sum(life.tranches.map((tranche) => tranche.premium)),
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
 * Sums the cover amount across all members.
 * @param {Record<string, any>} data The request data that includes tranches, total premiums and total cover amounts for each member.
 * @returns {number} The total cover amount across all members.
 */
const getTotalCoverAmount = (data) => {
  const mainCoverAmount = data.main_life.total_cover_amount;

  const coveredLivesCoverAmount =
    data.additional_lives_included === true
      ? sum(data.additional_lives.map((life) => life.total_cover_amount))
      : 0;

  const totalCoverAmount = mainCoverAmount + coveredLivesCoverAmount;

  return totalCoverAmount;
};

/**
 * Sums the premium across all members.
 * @param {Record<string, any>} data The request data that includes tranches, total premiums and total cover amounts for each member.
 * @returns {number} The total premium across all members.
 */
const getTotalPremium = (data) => {
  const mainPremium = data.main_life.total_premium;

  const coveredLivesPremium =
    data.additional_lives_included === true
      ? sum(data.additional_lives.map((life) => life.total_premium))
      : 0;

  const totalPremium = mainPremium + coveredLivesPremium;

  return totalPremium;
};

/**
 * Checks which environment is being used for the API request
 * @returns {[string, 'sandbox' | 'api']} The API key and host for the relevant environment
 */
const checkEnvironment = () => {
  if (process.env.ENVIRONMENT === 'sandbox') {
    const apiKey = API_KEY_SANDBOX;
    const host = 'sandbox';
    return [apiKey, host];
  }

  if (process.env.ENVIRONMENT === 'production') {
    const apiKey = API_KEY_PRODUCTION;
    const host = 'api';
    return [apiKey, host];
  }
};

/**
 * Makes an API request to the root platform
 * @param {object} params
 * @param {'api' | 'sandbox'} params.host The environment where the request will be made
 * @param {string} params.method The type of request ['PUT','PATCH','GET', 'POST']
 * @param {any} params.data The request body
 * @param {string} params.apiKey The apiKey for the relevant environment
 * @param {string} params.path The path for the request
 * @return {Promise<any>} The response from the API request
 */
const mainRootAPIRequest = async ({ host, method, data, apiKey, path }) => {
  try {
    const response = await fetch(
      `https://${host}.rootplatform.com/v1/insurance${path}`,
      {
        method: `${method}`,
        body: method === 'GET' ? undefined : JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(apiKey).toString('base64')}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error(`API request failed with error code: ${response}`);
    }
    let json = await response.json();
    return json;
  } catch (error) {
    // catch API errors
    console.log(error.toString());
  }
};
