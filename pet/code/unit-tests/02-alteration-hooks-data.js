const validAlterationData = {
  "pets": [
    {
      "excess_amount": 20000
    },
    {
      "excess_amount": 10000
    }
  ]
};

const invalidAlterationData = {
  "pets": [
    {
      "excess_amount": 26000
    },
    {
      "excess_amount": 0
    }
  ]
};

const excessAlterationPackage = (petUuids, expectedAlterationMessage) => ({
  "input_data": {
    "pets": [
      {
        "excess_amount": 20000
      },
      {
        "excess_amount": 10000
      }
    ]
  },
  "sum_assured": 1600000,
  "monthly_premium": 15532,
  "change_description": `Alteration: ${expectedAlterationMessage}`,
  "module": {
    "policy_deactivations": 0,
    "latest_policy_deactivation": null,
    "latest_policy_reactivation": null,
    "applied_anniversary_increases": 0,
    "pets": [
      {
        "uuid": petUuids[0],
        "name": "Spot",
        "species": "dog",
        "birth_date": "2020-04-12T08:46:39.0Z",
        "gender": "male",
        "breed": "mixed_breed",
        "pet_size": "large",
        "pet_age": 3,
        "cover_amount": 600000,
        "excess_amount": 20000,
        "pet_premium_amount": 6095,
        "remaining_cover_limit_amount": 600000,
        "microchip": false,
        "environment": "outdoors",
        "neutered": true,
        "travel": true,
        "vaccinations": true
      },
      {
        "uuid": petUuids[1],
        "name": "Snowey",
        "species": "cat",
        "birth_date": "2008-04-12T08:46:39.0Z",
        "gender": "female",
        "breed": "siamese",
        "pet_age": 15,
        "cover_amount": 1000000,
        "excess_amount": 10000,
        "pet_premium_amount": 9437,
        "remaining_cover_limit_amount": 1000000,
        "environment": "indoors",
        "microchip": false,
        "neutered": true,
        "travel": false,
        "vaccinations": true,
      }
    ]
  }
});
