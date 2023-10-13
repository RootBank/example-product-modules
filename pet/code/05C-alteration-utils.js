/**
 * Generates the update description for the alteration package
 * @param {Record<string, any>} alterationPets The pet data from the alteration hook
 * @param {Record<string, any>} policyPets The policy pet data to be updated
 * @return {string} The updated description of alterations to the policy
 */
const updatedExcessAlterationMessage = (alterationPets, policyPets) => {
    let message = "";
    let changeCount = 0;
    policyPets.forEach((pet, index) => {
        if (pet.excess_amount !== alterationPets[index].excess_amount) {
            changeCount++;
            message += `(${changeCount}) Pet ${pet.name} (${pet.uuid}) excess updated from £${pet.excess_amount / 100} to £${alterationPets[index].excess_amount / 100}. `;
        }
    });

    return message;
}

/**
 * Update the existing policy module with the new excess amounts from the alteration hook
 * @param {Record<string, any>} data The pet data from the alteration hook
 * @param {Record<string, any>} policyModule The policy module data to be updated
 * @return {Record<string, any>} The updated module data for the package
 */
const updatePetExcess = (data, policyModule) => {
    let updatedPolicyModule = { ...policyModule };
    updatedPolicyModule.pets = updatedPolicyModule.pets.map((pet, index) => {
        pet.excess_amount = data.pets[index].excess_amount;
        return pet;
    });

    return updatedPolicyModule;
}
