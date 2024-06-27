describe('Policy issue flow', function () {
  // Setup
  let quotePackage;
  before(function () {
    quotePackage = getQuote(quoteData)[0];
  });

  // Quote hook
  describe('Quote hook', function () {
    it('valid data should pass validation', function () {
      const validationResult = validateQuoteRequest(quoteData);
      expect(validationResult.error).to.equal(null);
    });

    it('should return a suggested premium of £5.98', function () {
      expect(quotePackage.suggested_premium).to.equal(598); // cents
    });
  });

  /*
  // Application hook
  describe('Application hook', function () {
    it('should pass application data validation ', function () {
      const validationResult = validateApplicationRequest(applicationData);
      expect(validationResult.error).to.equal(null);
    });
    it('should return the correct module data', function () {
      expect(applicationPackage.module.SOME_PROPERTY).to.equal(
        '<SOME_PROPERTY>',
      );
    });
  });

  // Policy issue hook
  describe('Policy issue hook', function () {
    it('should create a policy with the correct parameters', function () {
      const policy = getPolicy(applicationPackage);
      expect(policy.package_name).to.equal('<CORRECT PACKAGE NAME>');
      expect(policy.monthly_premium).to.equal(1234);
      expect(policy.sum_assured).to.equal(12345678);
    });
  });
  */
});
