// Pricing

const getQuoteForSingleTrip = (data) => {
  const packages = [
    {
      name: "Bronze",
      sheet: new Sheet(bronzeCoverCSV),
    },
    {
      name: "Silver",
      sheet: new Sheet(silverCoverCSV),
    },
    {
      name: "Gold",
      sheet: new Sheet(goldCoverCSV),
    },
  ];
  const quotePackages = [];
  const tripDays = moment(data.trip_end_date).diff(
    data.trip_start_date,
    "days"
  );

  for (const package of packages) {
    // Determine what column the rates are in
    let ratesColumn = "G"; // default to most expensive in case there's an issue
    switch (data.destination) {
      case "uk":
        ratesColumn = "C";
        break;
      case "europe":
        ratesColumn = "D";
        break;
      case "australia_new_zealand":
        ratesColumn = "E";
        break;
      case "world_wide":
        ratesColumn = "F";
        break;
      case "world_wide_incl_usa_canada":
        ratesColumn = "G";
        break;
    }

    // Get base rate
    let baseRateRow = 6;
    if (tripDays <= 5) baseRateRow = 6;
    else if (tripDays <= 10) baseRateRow = 6;
    else if (tripDays <= 19) baseRateRow = 6;
    else baseRateRow = 6;
    const baseRate = parseFloat(package.sheet.getCell(`${ratesColumn}${baseRateRow}`));

    // Get extras rate
    let extrasRate = 0;
    if (data.single_trip_extras.wedding)
      extrasRate += (parseFloat(package.sheet.getCell(`${ratesColumn}14`)) || 0);
    if (data.single_trip_extras.gadget_business)
      extrasRate += (parseFloat(package.sheet.getCell(`${ratesColumn}15`)) || 0);
    if (data.single_trip_extras.cruise)
      extrasRate += (parseFloat(package.sheet.getCell(`${ratesColumn}16`)) || 0);
    if (data.single_trip_extras.golf)
      extrasRate += (parseFloat(package.sheet.getCell(`${ratesColumn}17`)) || 0);
    if (data.single_trip_extras.excess_waiver)
      extrasRate += (parseFloat(package.sheet.getCell(`${ratesColumn}18`)) || 0);
    if (data.single_trip_extras.trip_disruption)
      extrasRate += (parseFloat(package.sheet.getCell(`${ratesColumn}19`)) || 0);
    if (data.single_trip_extras.extra_week)
      extrasRate += (parseFloat(package.sheet.getCell(`${ratesColumn}13`)) || 0);

    // Get winter sports loading
    const winterSportsLoading = data.single_trip_extras.wintersports
      ? 1.75 // 75% loading
      : 1; // no loading

    // Calculate the rate per person based on age
    const perPersonRates = data.persons.map((p, index) => {
      // console.log("Calculating rate for person", index + 1, p);
      let ageLoading = 1;
      if (p.age < 18) ageLoading = 0.5;
      else if (70 <= p.age && p.age <= 74) ageLoading = 2;
      else if (75 <= p.age) ageLoading = 3;
      return baseRate * winterSportsLoading * ageLoading + extrasRate;
    });

    // console.log("Per person rates:", perPersonRates);

    // Sum all the peoples rates together
    const totalRates = perPersonRates.reduce((a, b) => a + b, 0);

    // Calculate the total govt levy on policies over €20
    const govtLevy = totalRates > 20 ? 0.05 * totalRates : 0;

    const premium = totalRates + govtLevy;

    quotePackages.push(
      new QuotePackage({
        package_name: `Single Trip ${package.name} Cover`,
        sum_assured: 100, // This is a placeholder amount
        base_premium: Math.round(premium * 100), // Cents
        suggested_premium: Math.round(premium * 100), // Cents
        billing_frequency: "once_off", // once_off, monthly, yearly
        module: {
          ...data,
          rates: {
            base: baseRate,
            extras: extrasRate,
            winter_sports_loading: winterSportsLoading,
            per_person: perPersonRates,
            total: totalRates,
            govt_levy: govtLevy,
          },
        },
        input_data: { ...data },
      })
    );
  }
  // console.log('quotePackages', quotePackages);
  return quotePackages;
};
