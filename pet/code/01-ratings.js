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

/**
 * Returns the risk rate for a dog, given its age and breed risk
 * @param {number} pet_age The age of the dog (integer between 0 and 10 inclusive)
 * @returns {number} The rate for the dog
 */
const getDogRate = (pet_age) => getObjectFromCsv(dogRates)[pet_age]['low_risk'];

/**
 * Returns the risk rate for a cat, given its age and breed risk
 * @param {number} pet_age The age of the cat (integer between 0 and 10 inclusive)
 * @returns {number} The rate for the cat
 */
const getCatRate = (pet_age) => getObjectFromCsv(catRates)[pet_age]['low_risk'];
