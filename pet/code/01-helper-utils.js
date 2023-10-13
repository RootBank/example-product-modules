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
      .split(/[,\s]+/g)
      .map((cell) => (isNaN(Number(cell)) ? cell : Number(cell)))
  );
  const headings = allRows[0];
  const rows = allRows.slice(1);
  const data = rows.map((row) =>
    row.reduce((acc, cur, i) => {
      acc[headings[i]] = cur;
      return acc;
    }, {})
  );
  return data;
};

/**
 * Generates a module data.
 * @param {Record<string, any>} data The validated data returned by `validateQuoteRequest` as `result.value`.
 * @return {Record<string, any>} The module data
 */
const buildModuleData = (data) => {
  const petsModuleData = data.pets.map((pet) => buildPetModuleData(pet));
  return {
    ...data,
    pets: petsModuleData,
  };
};

/**
 * Generates module data for a single pet
 * @param {Record<string, any>} pet The validated pet data
 * @return {Record<string, any>} The module data for a single per
 */
const buildPetModuleData = (pet) => {
  const uuid = pet.uuid ? pet.uuid : createUuid();

  let petData = {
    ...pet,
    uuid: uuid,
    name: pet.name,
    species: pet.species,
    birth_date: pet.birth_date,
    gender: pet.gender,
    breed: pet.breed,
    pet_age: moment().diff(moment(pet.birth_date), 'years'),
    cover_amount: pet.cover_amount,
    excess_amount: pet.excess_amount,
    pet_premium_amount: calcPremiumPerPet(pet),
    remaining_cover_limit_amount: pet.cover_amount,
  };

  if (pet.pet_size) {
    // @ts-ignore
    petData.pet_size = pet.pet_size;
  }

  return petData;
};

/**
 * Rebuild Application Module Data
 * @param {Record<string, any>} originalData The validated data returned by `validateApplicationRequest` as `result.value`.
 * @param {Record<string, any>} mergeData The validated data returned by `validateQuoteRequest` as `result.value`.
 * @return {Record<string, any>} The module data
 */
const buildApplicationModuleData = (originalData, mergeData) => {
  const petsModuleData = originalData.pets.map((pet, index) => buildPetApplicationModuleData(pet, mergeData[index]));
  return {
    pets: petsModuleData,
  };
};

/**
 * Generates application step module data for a single pet
 * @param {Record<string, any>} pet The validated pet data for a single pet
 * @param {Record<string, any>} mergeData The validated pet data for a single pet from the application step
 * @return {Record<string, any>} The module data for a single pet
 */
const buildPetApplicationModuleData = (pet, mergeData) => {
  let petData = {
    uuid: pet.uuid,
    name: pet.name,
    species: pet.species,
    birth_date: pet.birth_date,
    gender: pet.gender,
    breed: pet.breed,
    pet_age: pet.pet_age,
    cover_amount: pet.cover_amount,
    excess_amount: pet.excess_amount,
    pet_premium_amount: pet.pet_premium_amount,
    remaining_cover_limit_amount: pet.cover_amount,
    microchip: mergeData.microchip,
    vaccinations: mergeData.vaccinations,
    neutered: mergeData.neutered,
    environment: mergeData.environment,
    travel: mergeData.travel,
  };

  if (pet.pet_size) {
    petData.pet_size = pet.pet_size;
  }

  return petData;
};
