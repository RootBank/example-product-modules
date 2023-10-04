const getQuoteData = () => ({
  "pets": [
    {
      "name": "Spot",
      "type": "dog",
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
      "type": "cat",
      "birth_date": "2008-04-12T08:46:39.0Z",
      "gender": "female",
      "breed": "siamese",
      "pet_size": "small",
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
