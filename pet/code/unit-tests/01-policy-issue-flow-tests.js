describe('Policy issue flow', function () {
  // Setup
  let quotePackage;
  let quotePackageData;
  let applicationPackage;
  let applicationPackageData;
  let policy;

  before(function () {
    quotePackageData = getQuoteData();
    quotePackage = getQuote(quotePackageData);
    console.log("\n\nQUOTE PACKAGE:\n")
    console.log(JSON.stringify(quotePackage));
    applicationPackageData = getApplicationData();
    // @ts-ignore
    applicationPackage = getApplication(applicationPackageData, undefined, ...quotePackage);
    // console.log("\n\nAPPLICATION PACKAGE:\n");
    // console.log(JSON.stringify(applicationPackage));
    // @ts-ignore
    policy = getPolicy(applicationPackage, undefined, undefined);
    // console.log("\n\nPOLICY:\n");
    // console.log(JSON.stringify(policy));
  });

  // Quote hook
  describe('Quote hook', function () {
    it('valid data should pass validation', function () {
      const validationResult = validateQuoteRequest(quotePackageData);
      expect(validationResult.error).to.equal(null);
    });

    it('should match the supplied expected data for the quote package', function () {
      expect(quotePackage).to.deep.equal(expectedQuoteData([quotePackage[0].module.pets[0].uuid, quotePackage[0].module.pets[1].uuid]));
    });
  });

  // Application hook
  describe('Application hook', function () {
    it('should pass application data validation ', function () {
      const validationResult = validateApplicationRequest(applicationPackageData, undefined, undefined);
      expect(validationResult.error).to.equal(null);
    });
    it('should match the supplied expected data for the application package', function () {
      expect(applicationPackage).to.deep.equal(expectedApplicationData([applicationPackage.module.pets[0].uuid, applicationPackage.module.pets[1].uuid]));
    });
  });

  // Policy issue hook
  describe('Policy issue hook', function () {
    it('should match the supplied expected data for the policy', function () {
      expect(policy).to.deep.equal(expectedPolicyData([policy.module.pets[0].uuid, policy.module.pets[1].uuid]));
    });
  });
});
