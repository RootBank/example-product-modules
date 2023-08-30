// Example quote data
const quoteData = {
  species: 'dog',
  cover_option: 'standard',
  birth_year: moment().subtract(1, 'year').format('YYYY'), //This prevents the tests breaking over a period of time
  breed_risk: 'high_risk',
  sterilised: 'yes',
};

// Example application data
const applicationData = {
  pet_name: 'nymeria',
  pet_breed: 'dire wolf',
  pet_gender: 'female',
  pet_colour: 'snow',
};
