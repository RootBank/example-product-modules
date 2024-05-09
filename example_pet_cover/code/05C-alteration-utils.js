/**
 * Generates the update description for the alteration package
 * @param {Record<string, any>} alterationPets The pet data from the alteration hook
 * @param {Record<string, any>} policyPets The policy pet data to be updated
 * @return {string} The updated description of alterations to the policy
 */
const updatedCoverAlterationMessage = (alterationPets, policyPets) => {
  let message = '';
  alterationPets.forEach((pet, index) => {
    let updatedBothCoverAmount = false;
    if (pet.cover_amount !== policyPets[index].cover_amount) {
      message += `Updated ${policyPets[index].name}'s cover amount to £${Math.round(pet.cover_amount / 100)}`;
      updatedBothCoverAmount = true;
    }
    if (pet.excess_amount !== policyPets[index].excess_amount) {
      if (updatedBothCoverAmount) message += ' and';
      else message += `Updated ${policyPets[index].name}'s`;
      message += ` excess amount to £${Math.round(pet.excess_amount / 100)}.`;
    }
  });

  return message;
};

/**
 * Update the existing policy module with the new excess amounts from the alteration hook
 * @param {Record<string, any>} data The pet data from the alteration hook
 * @param {Record<string, any>} policyModule The policy module data to be updated
 * @return {Record<string, any>} The updated module data for the package
 */
const updatePetCover = (data, policyModule) => {
  let updatedPolicyModule = { ...policyModule };
  updatedPolicyModule.pets = updatedPolicyModule.pets.map((pet, index) => {
    pet.cover_amount = data.pets[index].cover_amount;
    pet.excess_amount = data.pets[index].excess_amount;
    return pet;
  });

  return updatedPolicyModule;
};
