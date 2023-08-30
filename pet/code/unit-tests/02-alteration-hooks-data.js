/* global expect moment ReactivationOption InvalidRequestError AlteredPolicy AlterationPackage QuotePackage Application Policy generatePolicyNumber Joi RequotePolicy root */
// This file is used by the 'rp test -u' unit testing command and allows you to write and run unit tests locally.
// This file automatically get's commented out by the CLI tool when being pushed to Root.
// This ensures that it does not interfere with production execution.

const validAlterationData = {
  pet_name: 'nymeria',
  pet_breed: 'dire wolf',
  pet_gender: 'female',
  pet_colour: 'snow',
};

const invalidAlterationData = {
  pet_name: 12345,
  pet_breed: 'dire wolf',
  pet_gender: 'female',
  pet_colour: 'snow',
};

const examplePolicy = {
  policy_id: 'e13ce82a-5e8e-4f69-8d35-205402564de0',
  scheme_type: 'individual',
  created_at: '2021-12-15T07:52:21.463Z',
  created_by: {
    type: 'api_key',
    id: '47501113-548a-4acd-92bb-76bc881a75e8',
    owner_id: 'a494eb3e-8573-4429-ab37-613e341e6603',
  },
  policy_number: '8CE463A4A6',
  policyholder_id: 'c69954fc-9d37-43a9-8165-d72e71bd394b',
  package_name: 'Pet Cover',
  sum_assured: 3000000,
  base_premium: 7125,
  monthly_premium: 7125,
  billing_amount: 7125,
  billing_frequency: 'monthly',
  billing_month: null,
  billing_day: 1,
  next_billing_date: '2022-01-01T00:00:00.000Z',
  start_date: '2021-12-16T00:00:00.000Z',
  end_date: null,
  cancelled_at: null,
  reason_cancelled: null,
  app_data: null,
  module: {
    type: 'template_pet',
    species: 'dog',
    pet_name: 'Snuffles',
    pet_breed: 'Mixed breed',
    birth_year: 2020,
    pet_colour: 'Black',
    pet_gender: 'male',
    sterilised: true,
    cover_option: 'standard',
    high_risk_breed: true,
  },
  product_module_id: 'b4676d72-8c19-468c-bb5f-47e7f16280a7',
  product_module_definition_id: '549713d2-1b78-4453-bcfc-6915a116f97b',
  beneficiaries: [
    {
      beneficiary_id: '9f1fc4fc-bd13-4c49-b661-bf69071dacd4',
      policyholder_id: 'c69954fc-9d37-43a9-8165-d72e71bd394b',
      percentage: 100,
      relationship: 'policyholder',
    },
  ],
  schedule_versions: [],
  current_version: null,
  terms_uri: 'https://sandbox.root.co.za/v1/insurance/policies/e13ce82a-5e8e-4f69-8d35-205402564de0/terms/terms.pdf',
  policy_schedule_uri:
    'https://sandbox.root.co.za/v1/insurance/policies/e13ce82a-5e8e-4f69-8d35-205402564de0/schedule/schedule_latest.pdf',
  claim_ids: [],
  complaint_ids: [],
  status: 'pending_initial_payment',
  balance: -3677,
  currency: 'ZAR',
  status_updated_at: '2021-12-15T07:52:21.463Z',
  updated_at: '2021-12-15T07:52:21.488Z',
  covered_people: [],
  application_id: '4a769fdd-44dd-4265-b0fa-5ca03b6a1647',
};
