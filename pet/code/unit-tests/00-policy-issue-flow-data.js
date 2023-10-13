const getQuoteData = () => ({
  "pets": [
    {
      "name": "Spot",
      "species": "dog",
      "birth_date": "2020-04-12T08:46:39.0Z",
      "gender": "male",
      "breed": "mixed_breed",
      "pet_size": "large",
      "cover_amount": 600000,
      "excess_amount": 20000,
      "precondition": {
        "Chronic disease": false,
        "Epilepsy": false,
        "Elbow or hip joint dysplasia": false,
        "Physical disabilities": false,
        "Tumours": false
      }
    },
    {
      "name": "Snowey",
      "species": "cat",
      "birth_date": "2008-04-12T08:46:39.0Z",
      "gender": "female",
      "breed": "siamese",
      "cover_amount": 1000000,
      "excess_amount": 25000,
      "precondition": {
        "Chronic disease": false,
        "Epilepsy": false,
        "Elbow or hip joint dysplasia": false,
        "Physical disabilities": false,
        "Tumours": false
      }
    }
  ]
}
)

// Example application data
const getApplicationData = () => ({
  "pets": [
    {
      "microchip": false,
      "vaccinations": true,
      "neutered": true,
      "environment": "outdoors",
      "travel": true
    },
    {
      "microchip": false,
      "vaccinations": true,
      "neutered": true,
      "environment": "indoors",
      "travel": false
    }
  ]
}
)

const expectedQuoteData = (petUuids) => ([
  {
    package_name: "Pet",
    sum_assured: 1600000,
    base_premium: 12836,
    suggested_premium: 12836,
    billing_frequency: "monthly",
    module: {
      pets: [
        {
          uuid: petUuids[0],
          name: "Spot",
          species: "dog",
          birth_date: "2020-04-12T08:46:39.0Z",
          gender: "male",
          breed: "mixed_breed",
          pet_size: "large",
          pet_age: 3,
          cover_amount: 600000,
          excess_amount: 20000,
          pet_premium_amount: 6095,
          remaining_cover_limit_amount: 600000,
          precondition: {
            "Chronic disease": false,
            "Elbow or hip joint dysplasia": false,
            "Epilepsy": false,
            "Physical disabilities": false,
            "Tumours": false
          }
        },
        {
          uuid: petUuids[1],
          name: "Snowey",
          species: "cat",
          birth_date: "2008-04-12T08:46:39.0Z",
          gender: "female",
          breed: "siamese",
          pet_age: 15,
          cover_amount: 1000000,
          excess_amount: 25000,
          pet_premium_amount: 6741,
          remaining_cover_limit_amount: 1000000,
          precondition: {
            "Chronic disease": false,
            "Elbow or hip joint dysplasia": false,
            "Epilepsy": false,
            "Physical disabilities": false,
            "Tumours": false
          }
        }
      ]
    },
    input_data: {
      pets: [
        {
          name: "Spot",
          species: "dog",
          birth_date: "2020-04-12T08:46:39.0Z",
          gender: "male",
          breed: "mixed_breed",
          pet_size: "large",
          cover_amount: 600000,
          excess_amount: 20000,
          precondition: {
            "Chronic disease": false,
            "Epilepsy": false,
            "Elbow or hip joint dysplasia": false,
            "Physical disabilities": false,
            "Tumours": false
          }
        },
        {
          name: "Snowey",
          species: "cat",
          birth_date: "2008-04-12T08:46:39.0Z",
          gender: "female",
          breed: "siamese",
          cover_amount: 1000000,
          excess_amount: 25000,
          precondition: {
            "Chronic disease": false,
            "Epilepsy": false,
            "Elbow or hip joint dysplasia": false,
            "Physical disabilities": false,
            "Tumours": false
          }
        }
      ]
    }
  }
])

const expectedApplicationData = (petUuids) => ({
  package_name: "Pet",
  sum_assured: 1600000,
  base_premium: 12836,
  monthly_premium: 12836,
  input_data: {
    pets: [
      {
        microchip: false,
        vaccinations: true,
        neutered: true,
        environment: "outdoors",
        travel: true
      },
      {
        microchip: false,
        vaccinations: true,
        neutered: true,
        environment: "indoors",
        travel: false
      }
    ]
  },
  module: {
    pets: [
      {
        uuid: petUuids[0],
        name: "Spot",
        species: "dog",
        birth_date: "2020-04-12T08:46:39.0Z",
        gender: "male",
        breed: "mixed_breed",
        pet_size: "large",
        pet_age: 3,
        cover_amount: 600000,
        excess_amount: 20000,
        pet_premium_amount: 6095,
        remaining_cover_limit_amount: 600000,
        microchip: false,
        vaccinations: true,
        neutered: true,
        environment: "outdoors",
        travel: true
      },
      {
        uuid: petUuids[1],
        name: "Snowey",
        species: "cat",
        birth_date: "2008-04-12T08:46:39.0Z",
        gender: "female",
        breed: "siamese",
        pet_age: 15,
        cover_amount: 1000000,
        excess_amount: 25000,
        pet_premium_amount: 6741,
        remaining_cover_limit_amount: 1000000,
        microchip: false,
        vaccinations: true,
        neutered: true,
        environment: "indoors",
        travel: false
      }
    ]
  }
})

const expectedPolicyData = (petUuids) => ({
  package_name: "Pet",
  sum_assured: 1600000,
  base_premium: 12836,
  monthly_premium: 12836,
  start_date: moment().add(1, 'day').format(),
  end_date: null,
  module: {
    applied_anniversary_increases: 0,
    latest_policy_deactivation: null,
    latest_policy_reactivation: null,
    policy_deactivations: 0,
    pets: [
      {
        uuid: petUuids[0],
        name: "Spot",
        species: "dog",
        birth_date: "2020-04-12T08:46:39.0Z",
        gender: "male",
        breed: "mixed_breed",
        pet_size: "large",
        pet_age: 3,
        cover_amount: 600000,
        excess_amount: 20000,
        pet_premium_amount: 6095,
        remaining_cover_limit_amount: 600000,
        microchip: false,
        vaccinations: true,
        neutered: true,
        environment: "outdoors",
        travel: true
      },
      {
        uuid: petUuids[1],
        name: "Snowey",
        species: "cat",
        birth_date: "2008-04-12T08:46:39.0Z",
        gender: "female",
        breed: "siamese",
        pet_age: 15,
        cover_amount: 1000000,
        excess_amount: 25000,
        pet_premium_amount: 6741,
        remaining_cover_limit_amount: 1000000,
        microchip: false,
        vaccinations: true,
        neutered: true,
        environment: "indoors",
        travel: false
      }
    ]
  },
  charges: []
})
