// NOT NEEDED?
/**
 * The raw CSV rates table for dogs
 */
const dogRates = `age,low_risk,high_risk
0  0.6   1.2
1  0.84  1.5
2  1.08  1.8
3  1.32  2.1
4  1.56  2.4
5  1.8   2.7
6  2.04  3
7  2.28  3.3
8  2.52  3.6
9  2.76  3.9
10 3     4.2`;

// NOT NEEDED?
/**
 * The raw CSV rates table for cats
 */
const catRates = `age,low_risk,high_risk
0  0.48  1.08
1  0.66  1.32
2  0.84  1.56
3  1.02  1.8
4  1.2   2.04
5  1.38  2.28
6  1.56  2.52
7  1.74  2.76
8  1.92  3
9  2.1   3.24
10 2.28  3.48`;

// NOT NEEDED?
/**
 * Returns the risk rate for a dog, given its age and breed risk
 * @param {number} pet_age The age of the dog (integer between 0 and 10 inclusive)
 * @returns {number} The rate for the dog
 */
const getDogRate = (pet_age) => getObjectFromCsv(dogRates)[pet_age]['low_risk'];

// NOT NEEDED?
/**
 * Returns the risk rate for a cat, given its age and breed risk
 * @param {number} pet_age The age of the cat (integer between 0 and 10 inclusive)
 * @returns {number} The rate for the cat
 */
const getCatRate = (pet_age) => getObjectFromCsv(catRates)[pet_age]['low_risk'];

// Valid Excess Values
const excessValues = [
    5000,
    10000,
    15000,
    20000,
    25000,
];

// Valid Excess Values
const coverAmounts = [
    100000,
    200000,
    400000,
    600000,
    800000,
    1000000,
];

// Dog Breeds
const dogBreeds = [
    "alaskan_husky",
    "border_collie",
    "boston_terrier",
    "german_shepherd",
    "golden_retriever",
    "great_dane",
    "tamed_wolf",
    "mixed_breed",
]

const catBreeds = [
    "british_shorthair",
    "burmese",
    "persian",
    "siamese",
    "mixed_breed",
]

const animalSizes = [
    "small",
    "medium",
    "large",
]

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
400000    2709
600000    3386
800000    3764
1000000   4993
`;

const claimContribution = `excess,multiplier
0   2
5000 1.8
10000 1.4
20000 1.2
25000 1
`