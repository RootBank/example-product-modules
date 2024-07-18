const validAlterationData = {
  main_life: {
    id: '9d20fb61-8b32-4d4f-a8e6-3674c813d0ae',
    total_cover_amount: 2500000,
    biological_sex: 'male',
    date_of_birth: '1996-05-05',
  },
  additional_lives_included: true,
  additional_lives: [
    {
      id: '71c75f84-f90b-4385-b3f0-b654a5f2433a',
      relationship: 'brother',
      total_cover_amount: 1200000,
      biological_sex: 'female',
      date_of_birth: '1996-05-05',
      first_name: 'Name101',
      last_name: 'Surname1',
      id_number: '9605054800088',
    },
    {
      id: '901a6863-d506-4636-8af6-1e5024098b94',
      relationship: 'sister',
      total_cover_amount: 1000000,
      biological_sex: 'female',
      date_of_birth: '1996-05-05',
      first_name: 'Name2',
      last_name: 'Surname2',
      id_number: '9605054800088',
    },
    {
      relationship: 'brother',
      total_cover_amount: 1600000,
      biological_sex: 'female',
      date_of_birth: '1996-05-05',
      first_name: 'Name3',
      last_name: 'Surname3',
      id_number: '9605054800088',
    },
  ],
};

const invalidAlterationData = {
  main_life: {
    id: '9d20fb61-8b32-4d4f-a8e6-3674c813d0ae',
    total_cover_amount: 25000000,
    biological_sex: 'female',
    date_of_birth: '1996-05-05',
  },
  additional_lives_included: true,
  additional_lives: [
    {
      id: '71c75f84-f90b-4385-b3f0-b654a5f2433a',
      relationship: 'brother',
      total_cover_amount: 80000000,
      biological_sex: 'female',
      date_of_birth: '1996-05-05',
      first_name: 'Name101',
      last_name: 'Surname1',
      id_number: '9605054800088',
    },
    {
      id: '901a6863-d506-4636-8af6-1e5024098b94',
      relationship: 'sister',
      total_cover_amount: 800000,
      biological_sex: 'female',
      date_of_birth: '1996-05-05',
      first_name: 'Name2',
      last_name: 'Surname2',
      id_number: '9605054800088',
    },
    {
      relationship: 'brother',
      total_cover_amount: 1600000,
      biological_sex: 'female',
      date_of_birth: '1996-05-05',
      first_name: 'Name3',
      last_name: 'Surname3',
      id_number: '9605054800088',
    },
  ],
};

const premiumWaiverAlterationData = {
  undo: false,
  main_member_date_of_death: '2022-06-20',
};

const premiumWaiverAlterationDataApplied = {
  undo: true,
  main_member_date_of_death: '2022-06-20',
};
const failedPremiumWaiverAlterationData = {
  undo: false,
};

const examplePolicy = {
  policy_number: '8CE463A4A6',
  package_name: 'Funeral Cover',
  sum_assured: 4000000,
  base_premium: 77057,
  monthly_premium: 77057,
  start_date: '2022-06-23T17:57:23.992Z',
  end_date: null,
  module: {
    policy_alteration_allowed: true,
    main_life: {
      id: '9d20fb61-8b32-4d4f-a8e6-3674c813d0ae',
      total_cover_amount: 2000000,
      biological_sex: 'female',
      date_of_birth: '1996-05-05',
      tranches: [
        {
          id: '4b5c218a-57e3-4580-875e-f38a80cc95ed',
          created_at: '2022-06-22T17:57:23.967Z',
          premium: 30823,
          cover_amount: 2000000,
        },
      ],
      total_premium: 30823,
      cover: {
        accidental_cover_amount: 2000000,
        natural_cover_amount: 0,
        suicide_cover_amount: 0,
      },
      events: [
        {
          type: 'cover_initiated',
          total_cover: 2000000,
          date: '2022-06-22T17:57:23.970Z',
        },
      ],
    },
    additional_lives_included: true,
    additional_lives: [
      {
        id: '71c75f84-f90b-4385-b3f0-b654a5f2433a',
        relationship: 'brother',
        total_cover_amount: 1500000,
        biological_sex: 'female',
        date_of_birth: '1996-05-05',
        tranches: [
          {
            id: 'e0530630-4980-4a93-b0d9-13717cc90fca',
            created_at: '2022-06-22T17:57:23.968Z',
            premium: 23117,
            cover_amount: 1500000,
          },
        ],
        total_premium: 23117,
        cover: {
          accidental_cover_amount: 1500000,
          natural_cover_amount: 0,
          suicide_cover_amount: 0,
        },
        events: [
          {
            type: 'cover_initiated',
            total_cover: 1500000,
            date: '2022-06-22T17:57:23.970Z',
          },
        ],
        first_name: 'Name1',
        last_name: 'Surname1',
        id_number: '9605054800088',
      },
      {
        id: '901a6863-d506-4636-8af6-1e5024098b94',
        relationship: 'sister',
        total_cover_amount: 2000000,
        biological_sex: 'female',
        date_of_birth: '1996-05-05',
        tranches: [
          {
            id: 'f66a5b4a-d4d3-409e-9584-23be10155253',
            created_at: '2022-06-22T17:57:23.969Z',
            premium: 23117,
            cover_amount: 1200000,
          },
          {
            id: 'f66a5b4a-d4d3-409e-9584-23be10155253',
            created_at: '2022-06-22T17:57:23.969Z',
            premium: 23117,
            cover_amount: 1000000,
          },
        ],
        total_premium: 46234,
        cover: {
          accidental_cover_amount: 2000000,
          natural_cover_amount: 0,
          suicide_cover_amount: 0,
        },
        events: [
          {
            type: 'cover_initiated',
            total_cover: 2000000,
            date: '2022-06-22T17:57:23.970Z',
          },
        ],
        first_name: 'Name2',
        last_name: 'Surname2',
        id_number: '9605054800088',
      },
    ],
  },
};

const examplePolicy2 = {
  policy_number: '8CE463A4A6',
  package_name: 'Funeral Cover',
  sum_assured: 4000000,
  base_premium: 77057,
  monthly_premium: 77057,
  start_date: '2022-06-23T17:57:23.992Z',
  end_date: null,
  module: {
    policy_alteration_allowed: false,
    main_life: {
      id: '9d20fb61-8b32-4d4f-a8e6-3674c813d0ae',
      total_cover_amount: 2000000,
      biological_sex: 'female',
      date_of_birth: '1996-05-05',
      tranches: [
        {
          id: '4b5c218a-57e3-4580-875e-f38a80cc95ed',
          created_at: '2022-06-22T17:57:23.967Z',
          premium: 30823,
          cover_amount: 2000000,
        },
      ],
      total_premium: 30823,
      cover: {
        accidental_cover_amount: 2000000,
        natural_cover_amount: 0,
        suicide_cover_amount: 0,
      },
      events: [
        {
          type: 'cover_initiated',
          total_cover: 2000000,
          date: '2022-06-22T17:57:23.970Z',
        },
      ],
    },
    additional_lives_included: true,
    additional_lives: [
      {
        id: '71c75f84-f90b-4385-b3f0-b654a5f2433a',
        relationship: 'brother',
        total_cover_amount: 1000000,
        biological_sex: 'female',
        date_of_birth: '1996-05-05',
        tranches: [
          {
            id: 'e0530630-4980-4a93-b0d9-13717cc90fca',
            created_at: '2022-06-22T17:57:23.968Z',
            premium: 23117,
            cover_amount: 1000000,
          },
        ],
        total_premium: 23117,
        cover: {
          accidental_cover_amount: 1000000,
          natural_cover_amount: 0,
          suicide_cover_amount: 0,
        },
        events: [
          {
            type: 'cover_initiated',
            total_cover: 1000000,
            date: '2022-06-22T17:57:23.970Z',
          },
        ],
        first_name: 'Name1',
        last_name: 'Surname1',
        id_number: '9605054800088',
      },
      {
        id: '901a6863-d506-4636-8af6-1e5024098b94',
        relationship: 'sister',
        total_cover_amount: 2000000,
        biological_sex: 'female',
        date_of_birth: '1996-05-05',
        tranches: [
          {
            id: 'f66a5b4a-d4d3-409e-9584-23be10155253',
            created_at: '2022-06-22T17:57:23.969Z',
            premium: 23117,
            cover_amount: 1000000,
          },
          {
            id: 'f66a5b4a-d4d3-409e-9584-23be10155253',
            created_at: '2022-06-22T17:57:23.969Z',
            premium: 23117,
            cover_amount: 1000000,
          },
        ],
        total_premium: 46234,
        cover: {
          accidental_cover_amount: 1000000,
          natural_cover_amount: 0,
          suicide_cover_amount: 0,
        },
        events: [
          {
            type: 'cover_initiated',
            total_cover: 1000000,
            date: '2022-06-22T17:57:23.970Z',
          },
        ],
        first_name: 'Name2',
        last_name: 'Surname2',
        id_number: '9605054800088',
      },
    ],
  },
};

const examplePolicyholder = {
  policyholder_id: '80f2bfa1-4992-4ee2-a9e3-4315b405b8a3',
  type: 'individual',
  first_name: 'Diana',
  last_name: 'Windsor',
  id: {
    type: 'id',
    number: '9704010316089',
    country: 'ZA',
  },
  email: 'test@test.co.za',
  cellphone: null,
  phone_other: null,
  date_of_birth: '19970401',
  gender: 'female',
  created_at: '2022-06-23T08:08:08.304Z',
  app_data: null,
  policy_ids: [],
  created_by: {
    type: 'api_key',
    id: '8c80048e-1a47-4d35-92f0-503c2fb5ed8d',
    ownerId: 'bf96b659-bc7c-4dc1-b476-8e99a21b4eca',
  },
  address: {
    line_1: '2b wheelan street',
    line_2: 'rondabosch',
    suburb: 'Cape Town',
    city: 'Cape Town',
    country: 'SD',
    area_code: '12121234',
  },
  updated_at: '2022-06-23T08:08:08.307Z',
};
