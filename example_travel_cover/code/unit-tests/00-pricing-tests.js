// Various example pricing tests
describe("Pricing tests", function () {
  describe("Single trip 1", function () {
    const quotePayload = {
      trip: "single_trip",
      destination: "europe",
      single_trip_extras: {
        wintersports: true,
        wedding: false,
        gadget_business: true,
        cruise: false,
        golf: false,
        excess_waiver: false,
        trip_disruption: false,
        extra_week: false,
      },
      trip_start_date: "2024-05-18",
      trip_end_date: "2024-05-24",
      cover_type: "adult",
      persons: [{ age: 30 }],
    };
    before(function () {
      validationResult = validateQuoteRequest(quotePayload);
      quotePackages = getQuote(quotePayload);
    });
    it("should pass input parameter validation", function () {
      expect(validationResult.error).to.equal(null);
    });
    it("should calculate correct premium for Bronze cover", function () {
      expect(quotePackages[0].suggested_premium).to.equal(2304);
    });
    it("should calculate correct premium for Silver cover", function () {
      expect(quotePackages[1].suggested_premium).to.equal(2776);
    });
    it("should calculate correct premium for Gold cover", function () {
      expect(quotePackages[2].suggested_premium).to.equal(3247);
    });
  });

  describe("Multi trip 1", function () {
    const quotePayload = {
      trip: "multi_trip",
      destination: "uk",
      multi_trip_extras: {
        wintersports: true,
        wedding: false,
        gadget_business: true,
        cruise: false,
        golf: true,
        excess_waiver: false,
        trip_disruption: false,
      },
      trip_start_date: "2024-05-18",
      cover_type: "adult",
      persons: [{ age: 30 }],
    };
    before(function () {
      validationResult = validateQuoteRequest(quotePayload);
      quotePackages = getQuote(quotePayload);
    });
    it("should pass input parameter validation", function () {
      expect(validationResult.error).to.equal(null);
    });
    it("should calculate correct premium for Bronze cover", function () {
      expect(quotePackages[0].suggested_premium).to.equal(5670);
    });
    it("should calculate correct premium for Silver cover", function () {
      expect(quotePackages[1].suggested_premium).to.equal(6070);
    });
    it("should calculate correct premium for Gold cover", function () {
      expect(quotePackages[2].suggested_premium).to.equal(6469);
    });
  });
});
