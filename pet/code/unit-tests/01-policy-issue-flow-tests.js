describe('Policy issue flow', function () {
  // Setup
  let quotePackage;
  let applicationPackage;
  before(function () {
    quotePackage = getQuote(quoteData)[0];
    // @ts-ignore
    applicationPackage = getApplication(applicationData, undefined, quotePackage);
  });

  // Quote hook
  describe('Quote hook', function () {
    it('valid data should pass validation', function () {
      const validationResult = validateQuoteRequest(quoteData);
      expect(validationResult.error).to.equal(null);
    });

    it('should return a suggested premium of £42.75 (in pence)', function () {
      expect(quotePackage.suggested_premium).to.equal(4275); // cents
    });
  });

  // Application hook
  describe('Application hook', function () {
    it('should pass application data validation ', function () {
      const validationResult = validateApplicationRequest(applicationData, undefined, undefined);
      expect(validationResult.error).to.equal(null);
    });
    it('should return the correct module data', function () {
      expect(applicationPackage.module.pet_name).to.equal('nymeria');
      expect(applicationPackage.module.pet_gender).to.equal('female');
      expect(applicationPackage.module.pet_breed).to.equal('dire wolf');
      expect(applicationPackage.module.pet_colour).to.equal('snow');
    });
  });

  // Policy issue hook
  describe('Policy issue hook', function () {
    it('should create a policy with the correct parameters', function () {
      const policy = getPolicy(applicationPackage, undefined, undefined);
      expect(policy.package_name).to.equal('Pet Cover');
      expect(policy.monthly_premium).to.equal(4275);
      expect(policy.sum_assured).to.equal(300000);
    });
  });
});
