/**
 * Calculate premium per pet
 * @param {Record<string, any>} pet
 * @returns premium for a single pet
 */
const calcPremiumPerPet = (pet) => {
  // Animal type multiplier (Cats are more risk averse than dogs)
  const typeMultiplier = pet.species == 'cat' ? 0.8 : 1;
  // Gender multiplier (Female pets are more risk averse)
  const genderMultiplier = pet.gender == 'female' ? 0.9 : 1;
  // Pet age mutliplier (Pets older than 5 years yield 50% higher risk)
  const ageMultiplier = moment().diff(moment(pet.birth_date), 'years') > 5 ? 1.5 : 1;
  // Pet breed/size multiplier (Create a multiplier based on the risk of the pet)
  const riskMultiplier = getRiskMultiplier(pet);
  // Get the base premium as determined by cover amount
  const basePremium = getBasePremium(pet.cover_amount);

  // Calculate the full premium after multipliers
  const premium =
    basePremium *
    typeMultiplier *
    genderMultiplier *
    ageMultiplier *
    riskMultiplier *
    getExcessMultiplier(pet.excess_amount);

  return Math.round(premium);
};

/**
 * Get the risk multiplier of the individual pet
 * @param {Object} pet The individual pet module data.
 * @return {Number} The multiplier of the pet from the risk.
 */
const getRiskMultiplier = (pet) => {
  // Get risk object from CSV
  const riskObject = getObjectFromCsv(riskRatings);
  // Find breed risk
  let breedRisk = Object.values(riskObject).find((entry) => entry.breed === pet.breed);
  breedRisk = breedRisk != undefined ? breedRisk.risk : getRiskFromSize(pet.pet_size);
  // Calculate breed multiplier
  let breedRiskMultiplier;
  switch (breedRisk) {
    case 'high':
      breedRiskMultiplier = 1.5;
      break;
    case 'medium':
      breedRiskMultiplier = 1.25;
      break;
    case 'low':
      breedRiskMultiplier = 1;
      break;
    default:
      breedRiskMultiplier = 1.25;
      break;
  }

  return breedRiskMultiplier;
};

/**
 * Return the risk based on size, used in the event of a mixed breed pet
 * @param {String} size The size of the pet.
 * @return {String} The risk of the pet based off the size.
 */
const getRiskFromSize = (size) => {
  let risk;
  switch (size) {
    case 'large':
      risk = 'high';
      break;
    case 'medium':
      risk = 'medium';
      break;
    default:
      risk = 'low';
      break;
  }
  return risk;
};

/**
 * Retrieve the base premium of the pet to apply multipliers to
 * @param {Record<string, any>} coverAmount The cover amount of the pet.
 * @return {Number} Base premium of pet based off cover amount.
 */
const getBasePremium = (coverAmount) => {
  // Get base premium object from CSV
  const basePremiumObject = getObjectFromCsv(premiumToCoverAmount);
  // Find cover amount
  const basePremium = Object.values(basePremiumObject).find((entry) => entry.cover_amount == coverAmount);

  return basePremium.base_premium;
};

/**
 * Calculate Quoted Sum Assured of all pets together
 * @param {Object} pets The pets module data.
 * @return {Number} Total policy cover amount/sum assured.
 */
const getAggregatedSumAssured = (pets) => {
  let total_cover_amount = 0;
  pets.forEach((pet) => {
    total_cover_amount += pet.cover_amount;
  });
  return total_cover_amount;
};

/**
 * Calculate the premium of the entire quote from all pets individual premiums
 * @param {Record<string, any>} pets The pets module data.
 * @return {Number} Total policy premium.
 */
const getAggregatedPremium = (pets) => {
  let total_premium_amount = 0;
  pets.forEach((pet) => {
    total_premium_amount += pet.pet_premium_amount;
  });
  return total_premium_amount;
};

/**
 * Get multiplier based of chosen excess
 * @param {Number} excess The chosen excess for the pet.
 * @return {Number} Excess based multiplier
 */
const getExcessMultiplier = (excess) => {
  // Convert excess csv to object
  const multiplierObject = getObjectFromCsv(claimContribution);
  // Find excess multiplier
  const multiplier = Object.values(multiplierObject).find((entry) => entry.excess === excess);

  return multiplier.multiplier;
};
