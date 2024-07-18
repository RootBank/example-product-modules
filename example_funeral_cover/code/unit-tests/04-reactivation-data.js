const cancelledPolicy = {
  policy_id: '3f48a924-4842-405e-a1db-7552cec51696',
  scheme_type: 'individual',
  created_at: '2022-02-23T13:49:17.507Z',
  created_by: {
    type: 'api_key',
    id: '0c0ad35d-c5b9-4d4b-81ee-ae15a526aee4',
    owner_id: 'bf96b659-bc7c-4dc1-b476-8e99a21b4eca',
  },
  policy_number: '91E093DFBA',
  policyholder_id: 'f04c4b2b-ce62-42fb-88e7-d548f0156476',
  package_name: 'Root Funeral',
  status: 'cancelled',
  status_updated_at: moment().subtract(2, 'months').format('YYYY-MM-DD'),
  module: {
    //has_policy_been_reactivated does not exist
  },
};

const lapsedPolicy = {
  policy_id: '3f48a924-4842-405e-a1db-7552cec51696',
  scheme_type: 'individual',
  created_at: '2022-02-23T13:49:17.507Z',
  created_by: {
    type: 'api_key',
    id: '0c0ad35d-c5b9-4d4b-81ee-ae15a526aee4',
    owner_id: 'bf96b659-bc7c-4dc1-b476-8e99a21b4eca',
  },
  policy_number: '91E093DFBA',
  policyholder_id: 'f04c4b2b-ce62-42fb-88e7-d548f0156476',
  package_name: 'Root Funeral',
  status: 'lapsed',
  status_updated_at: moment().subtract(2, 'months'),
  module: {
    //has_policy_been_reactivated does not exist
  },
};

const expiredPolicy = {
  policy_id: '3f48a924-4842-405e-a1db-7552cec51696',
  scheme_type: 'individual',
  created_at: '2022-02-23T13:49:17.507Z',
  created_by: {
    type: 'api_key',
    id: '0c0ad35d-c5b9-4d4b-81ee-ae15a526aee4',
    owner_id: 'bf96b659-bc7c-4dc1-b476-8e99a21b4eca',
  },
  policy_number: '91E093DFBA',
  policyholder_id: 'f04c4b2b-ce62-42fb-88e7-d548f0156476',
  package_name: 'Root Funeral',
  status: 'expired',
  status_updated_at: '2022-05-06',
  module: {
    //has_policy_been_reactivated does not exist
  },
};

const notTakenUpPolicy = {
  policy_id: '3f48a924-4842-405e-a1db-7552cec51696',
  scheme_type: 'individual',
  created_at: '2022-02-23T13:49:17.507Z',
  created_by: {
    type: 'api_key',
    id: '0c0ad35d-c5b9-4d4b-81ee-ae15a526aee4',
    owner_id: 'bf96b659-bc7c-4dc1-b476-8e99a21b4eca',
  },
  policy_number: '91E093DFBA',
  policyholder_id: 'f04c4b2b-ce62-42fb-88e7-d548f0156476',
  package_name: 'Root Funeral',
  status: 'not_taken_up',
  status_updated_at: '2022-05-06',
  module: {
    //has_policy_been_reactivated does not exist
  },
};

const activePolicy = {
  policy_id: '3f48a924-4842-405e-a1db-7552cec51696',
  scheme_type: 'individual',
  created_at: '2022-02-23T13:49:17.507Z',
  created_by: {
    type: 'api_key',
    id: '0c0ad35d-c5b9-4d4b-81ee-ae15a526aee4',
    owner_id: 'bf96b659-bc7c-4dc1-b476-8e99a21b4eca',
  },
  policy_number: '91E093DFBA',
  policyholder_id: 'f04c4b2b-ce62-42fb-88e7-d548f0156476',
  package_name: 'Root Funeral',
  status: 'active',
  status_updated_at: '2022-05-06',
  module: {
    //has_policy_been_reactivated does not exist
  },
};

const lapsedPolicyOld = {
  policy_id: '3f48a924-4842-405e-a1db-7552cec51696',
  scheme_type: 'individual',
  created_at: '2022-02-23T13:49:17.507Z',
  created_by: {
    type: 'api_key',
    id: '0c0ad35d-c5b9-4d4b-81ee-ae15a526aee4',
    owner_id: 'bf96b659-bc7c-4dc1-b476-8e99a21b4eca',
  },
  policy_number: '91E093DFBA',
  policyholder_id: 'f04c4b2b-ce62-42fb-88e7-d548f0156476',
  package_name: 'Root Funeral',
  status: 'lapsed',
  status_updated_at: moment().subtract(8, 'months').format('YYYY-MM-DD'),
  module: {
    //has_policy_been_reactivated does not exist
  },
};

const alreadyReactivated = {
  policy_id: '3f48a924-4842-405e-a1db-7552cec51696',
  scheme_type: 'individual',
  created_at: '2022-02-23T13:49:17.507Z',
  created_by: {
    type: 'api_key',
    id: '0c0ad35d-c5b9-4d4b-81ee-ae15a526aee4',
    owner_id: 'bf96b659-bc7c-4dc1-b476-8e99a21b4eca',
  },
  policy_number: '91E093DFBA',
  policyholder_id: 'f04c4b2b-ce62-42fb-88e7-d548f0156476',
  package_name: 'Root Funeral',
  status: 'lapsed',
  status_updated_at: '2021-12-22',
  module: {
    has_been_reactivated: true,
  },
};
