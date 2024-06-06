const subsetPolicyForAlterationHookTests = {
  package_name: "Single Pet Cover",
  sum_assured: 500000,
  base_premium: 1421,
  monthly_premium: 1421,
  start_date: "2024-06-07T05:48:05.000Z",
  end_date: null,
  module: {
    pets: [
      {
        name: "Cooper",
        breed: "German Shepherd",
        gender: "Male",
        travel: true,
        species: "Dog",
        vet_code: "V09210",
        birth_date: "2023-05-31T22:00:00.000Z",
        microchip_number: "M29101",
      },
    ],
    type: "demo_factory_pet_cover",
    discount: "-10%",
    area_code: "SW9",
    annual_limit: "£5,000",
    reimbursement: "90.0%",
    discount_options: {
      military: true,
      neutered: false,
      multi_pet: false,
      micro_chipped: true,
      affinity_group: false,
    },
    general_loadings: [],
    annual_deductible: "£200",
    policy_deactivations: 0,
    latest_policy_deactivation: null,
    latest_policy_reactivation: null,
    applied_anniversary_increases: 0,
  },
  charges: [],
};

const alterationRequestData = {
  changeCover: {
    alteration_hook_key: "change_cover",
    data: {
      area_code: "SW9",
      reimbursement: "80.0%",
      annual_deductible: "£200",
      annual_limit: "£5,000",
    },
    policy: { ...subsetPolicyForAlterationHookTests },
    policyholder: undefined, // unused
  },

  changeDiscounts: {
    alteration_hook_key: "change_discounts",
    data: {
      discount_options: {
        military: false,
        neutered: false,
        multi_pet: true,
        micro_chipped: true,
        affinity_group: true,
      },
    },
    policy: { ...subsetPolicyForAlterationHookTests },
    policyholder: undefined, // unused
  },

  changePets: {
    alteration_hook_key: "change_pets",
    data: {
      pets: [
        {
          name: "Cooper",
          species: "Dog",
          gender: "Male",
          breed: "German Shepherd",
          birth_date: "2023-05-31T22:00:00.000Z",
        },
      ],
    },
    policy: { ...subsetPolicyForAlterationHookTests },
    policyholder: undefined, // unused
  },
};
