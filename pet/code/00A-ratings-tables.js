// Valid Excess Values
const excessValues = [0, 5000, 10000, 20000, 25000];

// Valid Excess Values
const coverAmounts = [100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000, 1000000];

// Dog Breeds
const dogBreeds = [
  'alaskan_husky',
  'border_collie',
  'boston_terrier',
  'german_shepherd',
  'golden_retriever',
  'great_dane',
  'tamed_wolf',
  'mixed_breed',
];

// Valid breeds of cats
const catBreeds = ['british_shorthair', 'burmese', 'persian', 'siamese', 'mixed_breed'];

// Valid Animal Sizes
const animalSizes = ['small', 'medium', 'large'];

/**
 * Breeds risk csv
 */
const riskRatings = `breed,risk
alaskan_husky       high
border_collie       low
boston_terrier      medium
german_shepherd     medium
golden_retriever    low
great_dane          medium
tamed_wolf          high
british_shorthair   medium
burmese             low
persian             low
siamese             medium
`;

const premiumToCoverAmount = `cover_amount,base_premium
100000    1069
200000    1741
300000    2225
400000    2709
500000    3047
600000    3386
700000    3575
800000    3764
900000    4378
1000000   4993
`;

const claimContribution = `excess,multiplier
0   2
5000 1.8
10000 1.4
20000 1.2
25000 1
`;
