describe('Policy issue flow', function () {
  // Setup
  let quotePackage;
  let applicationPackage;
  before(function () {
    quotePackage = getQuote(quoteData)[0];
    applicationPackage = getApplication(
      applicationData,
      undefined,
      // @ts-ignore
      quotePackage,
    );
  });

  // Quote hook
  describe('Quote hook - happy path', function () {
    const validationResult = validateQuoteRequest(quoteData);
    it('valid data should pass validation', function () {
      expect(validationResult.error).to.equal(null);
    });
    it('Should create quote object', function () {
      expect(quotePackage).to.not.equal(undefined);
    });
    it('should return a suggested premium of £73.25 (in cents)', function () {
      expect(quotePackage.suggested_premium).to.equal(7325); // cents
    });
  });
  describe('Quote hook - negative testing', function () {
    const validationResult = validateQuoteRequest(quoteDataNegative);
    it("Should throw an error as main's biological sex is invalid value", function () {
      expect(validationResult.error.details[0].message).to.deep.equal(
        '"biological_sex" must be one of [male, female]',
      );
    });
    it('Should throw an error as max cover allowed is R100k', function () {
      expect(validationResult.error.details[1].message).to.deep.equal(
        '"total_cover_amount" must be less than or equal to 10000000',
      );
    });
    it('Should throw an error as relationship is an invalid value', function () {
      expect(validationResult.error.details[2].message).to.deep.equal(
        '"relationship" must be one of [spouse, partner, daughter, son, father, mother, brother, sister, mother_in_law, father_in_law, son_in_law, daughter_in_law, grandparent, aunt, uncle, cousin, employer, other]',
      );
    });
  });

  // Application hook
  describe('Application hook - happy path', function () {
    it('should pass application data validation ', function () {
      const validationResult = validateApplicationRequest(
        applicationData,
        undefined,
        quotePackage,
      );
      expect(validationResult.error).to.equal(null);
    });
    it('should return the correct module data', function () {
      expect(applicationPackage.package_name).to.equal('Funeral Cover');
    });
  });

  describe('Application hook - negative testing', function () {
    it('Should return an error as invalid key provided', function () {
      const validationResult = validateApplicationRequest(
        applicationDataNegative,
        undefined,
        quotePackage,
      );
      expect(validationResult.error.details[0].message).to.deep.equal(
        '"random_key" is not allowed',
      );
    });
    it('Should return an error as integer provided for joi.string()', function () {
      const validationResult = validateApplicationRequest(
        applicationDataNegative,
        undefined,
        quotePackage,
      );
      expect(validationResult.error.details[1].message).to.deep.equal(
        '"last_name" must be a string',
      );
    });
    it('Should return an error as element at the third position of the array [2] is not an object', function () {
      const validationResult = validateApplicationRequest(
        applicationDataNegative,
        undefined,
        quotePackage,
      );
      expect(validationResult.error.details[2].message).to.deep.equal(
        '"2" must be an object',
      );
    });
  });

  // Policy issue hook
  describe('Policy issue hook', function () {
    it('should create a policy with the correct parameters', function () {
      const policy = getPolicy(applicationPackage, undefined, undefined);
      expect(policy.package_name).to.equal('Funeral Cover');
      expect(policy.monthly_premium).to.equal(7325);
      expect(policy.sum_assured).to.equal(4000000);
    });
  });
});
