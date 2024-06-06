// @ts-nocheck

describe('Policy issue flow', function () {
  before(function () {
    quotePackageData = getQuoteData();
    applicationPackageData = getApplicationData();
  });

  // Quote hook
  describe('Quote hook', function () {
    it('should pass validation', function () {
      const validationResult = validateQuoteRequest(quotePackageData);
      expect(validationResult.error).to.equal(null);
    });
    it('should calculate the correct premium', function () {
      const validationResult = validateQuoteRequest(quotePackageData);
      const quotePackages = getQuote(quotePackageData);
      expect(quotePackages).to.be.an('array').of.length(1);
      expect(quotePackages[0].base_premium).to.equal(1782);
    });
  });

  // Application hook
  describe('Application hook', function () {
    it('should pass application data validation ', function () {
      const validationResult = validateApplicationRequest(applicationPackageData, undefined, undefined);
      expect(validationResult.error).to.equal(null);
    });
  });

  // // Policy issue hook
  // describe('Policy issue hook', function () {
  //   it('should match the supplied expected data for the policy', function () {
  //     expect(policy).to.deep.equal(expectedPolicyData([policy.module.pets[0].uuid, policy.module.pets[1].uuid]));
  //   });
  // });
});
