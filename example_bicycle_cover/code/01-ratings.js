// 01-ratings.js

// add all rating tables, csv and calculation functions here

// Premium calculation function at the top

// Tables and ratings below

const getBikePremium = (bikeValue, isEBike, isComprehensive) => {

  // Determine total premium
  const normalBikeRate = 0.1; // 10%
  const eBikeRate = 0.15; // 15%
  const comprehensiveCoverMultiplier = 1.5; // 50% more expensive
  console.log('getBikePremium', bikeValue, isEBike, isComprehensive); // debugging

  const premium = bikeValue * (isEBike ? eBikeRate : normalBikeRate) * (isComprehensive ? comprehensiveCoverMultiplier : 1);
  
  return Math.round(premium);
};
