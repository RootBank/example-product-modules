// Pricing

const getQuoteForMultiTrip = (data) => {
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

  for (const package of packages) {
    // Determine what column the rates are in
    let ratesColumn = "G"; // default to most expensive in case there's an issue
    switch (data.destination) {
      case "uk":
        ratesColumn = "E";
        break;
      case "europe":
        ratesColumn = "E";
        break;
      case "australia_new_zealand":
        ratesColumn = "F";
        break;
      case "world_wide":
        ratesColumn = "F";
        break;
      case "world_wide_incl_usa_canada":
        ratesColumn = "F";
        break;
    }

    // Get base rate
    let baseRateRow;
    if (data.cover_type === "adult") baseRateRow = 35;
    else if (data.cover_type === "couple") baseRateRow = 36;
    else baseRateRow = 37;
    // Windersports rates
    if (data.multi_trip_extras.wintersports) baseRateRow += 6; // jump 6 rows down to next table
    const baseRate = parseFloat(
      package.sheet.getCell(`${ratesColumn}${baseRateRow}`)
    );

    // Get extras rate
    let extrasRate = 0;
    if (data.multi_trip_extras.wedding)
      extrasRate += parseFloat(package.sheet.getCell(`${ratesColumn}46`)) || 0;
    if (data.multi_trip_extras.gadget_business)
      extrasRate += parseFloat(package.sheet.getCell(`${ratesColumn}49`)) || 0;
    if (data.multi_trip_extras.cruise)
      extrasRate += parseFloat(package.sheet.getCell(`${ratesColumn}50`)) || 0;
    if (data.multi_trip_extras.golf)
      extrasRate += parseFloat(package.sheet.getCell(`${ratesColumn}47`)) || 0;
    if (data.multi_trip_extras.excess_waiver)
      extrasRate += parseFloat(package.sheet.getCell(`${ratesColumn}48`)) || 0;
    if (data.multi_trip_extras.trip_disruption)
      extrasRate += parseFloat(package.sheet.getCell(`${ratesColumn}51`)) || 0;

    // Calculate the rate per person based on age
    const perPersonRates = data.persons.map((p, index) => {
      let ageLoading = 1;
      if (p.age < 18) ageLoading = 0.5;
      else if (70 <= p.age && p.age <= 74) ageLoading = 2;
      else if (75 <= p.age) ageLoading = 4;
      return baseRate * ageLoading + extrasRate;
    });

    // Sum all the peoples rates together
    const totalRates = perPersonRates.reduce((a, b) => a + b, 0);

    // Calculate the total govt levy on policies over €20
    const govtLevy = totalRates > 20 ? 0.05 * totalRates : 0;

    const premium = totalRates + govtLevy;

    quotePackages.push(
      new QuotePackage({
        package_name: `Multi Trip ${package.name} Cover`,
        sum_assured: 100, // This is a placeholder amount
        base_premium: Math.round(premium * 100), // Cents
        suggested_premium: Math.round(premium * 100), // Cents
        billing_frequency: "once_off", // once_off, monthly, yearly
        module: {
          ...data,
          rates: {
            base: baseRate,
            extras: extrasRate,
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
