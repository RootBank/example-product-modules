// Example quote data
const quoteData = {
  main_life: {
    total_cover_amount: 2000000,
    biological_sex: 'female',
    date_of_birth: moment().subtract(26, 'years').format('YYYY-MM-DD'),
  },
  additional_lives_included: true,
  additional_lives: [
    {
      relationship: 'brother',
      total_cover_amount: 1000000,
      biological_sex: 'male',
      date_of_birth: moment().subtract(26, 'years').format('YYYY-MM-DD'),
    },
    {
      relationship: 'sister',
      total_cover_amount: 1000000,
      biological_sex: 'female',
      date_of_birth: moment().subtract(26, 'years').format('YYYY-MM-DD'),
    },
  ],
};

const quoteDataNegative = {
  main_life: {
    total_cover_amount: 2000000,
    biological_sex: 'unknown',
    date_of_birth: '1996-05-05',
  },
  additional_lives_included: true,
  additional_lives: [
    {
      relationship: 'brother',
      total_cover_amount: 1000000,
      biological_sex: 'female',
      date_of_birth: '1996-05-05',
    },
    {
      relationship: 'hello',
      total_cover_amount: 50000000,
      biological_sex: 'female',
      date_of_birth: '1996-05-05',
    },
  ],
};

// Example application data
const applicationData = {
  additional_lives: [
    {
      first_name: 'Name1',
      last_name: 'Surname1',
      id_number: '9605054800088',
    },
    {
      first_name: 'Name2',
      last_name: 'Surname2',
      id_number: '9605054800088',
    },
  ],
};

const applicationDataNegative = {
  additional_lives: [
    {
      first_name: 'Name1',
      last_name: 'Surname1',
      id_number: '9605054800088',
      random_key: 'random_value',
    },
    {
      first_name: 'Name2',
      last_name: 10000,
      id_number: '9605054800088',
    },
    'hello',
  ],
};
