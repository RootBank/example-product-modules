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
    // @ts-ignore
    applicationPackageData = getApplicationData();
    // @ts-ignore
    applicationPackage = getApplication(applicationPackageData, undefined, ...quotePackage);
    // @ts-ignore
    policy = getPolicy(applicationPackage, undefined, undefined);
  });

  // Quote hook
  describe('Quote hook', function () {
    it('valid data should pass validation', function () {
      const validationResult = validateQuoteRequest(quotePackageData);
      expect(validationResult.error).to.equal(null);
    });

    it('should return a suggested premium of £128.36 (in pence)', function () {
      expect(quotePackage[0].suggested_premium).to.equal(12836); // cents
    });
  });

  // Application hook
  describe('Application hook', function () {
    it('should pass application data validation ', function () {
      const validationResult = validateApplicationRequest(applicationPackageData, undefined, undefined);
      expect(validationResult.error).to.equal(null);
    });
    it('should return the correct pet module data', function () {
      // First Pet Expectations
      expect(applicationPackage.module.pets[0].name).to.equal('Spot');
      expect(applicationPackage.module.pets[0].type).to.equal('dog');
      expect(applicationPackage.module.pets[0].birth_date).to.equal('2020-04-12T08:46:39.0Z');
      expect(applicationPackage.module.pets[0].gender).to.equal('male');
      expect(applicationPackage.module.pets[0].breed).to.equal('mixed_breed');
      expect(applicationPackage.module.pets[0].pet_size).to.equal('large');
      expect(applicationPackage.module.pets[0].pet_age).to.equal(3);
      expect(applicationPackage.module.pets[0].cover_amount).to.equal(600000);
      expect(applicationPackage.module.pets[0].excess_amount).to.equal(20000);
      expect(applicationPackage.module.pets[0].pet_premium_amount).to.equal(6095);
      expect(applicationPackage.module.pets[0].remaining_cover_limit_amount).to.equal(600000);
      expect(applicationPackage.module.pets[0].microchip).to.equal(false);
      expect(applicationPackage.module.pets[0].vaccinations).to.equal(true);
      expect(applicationPackage.module.pets[0].neutered).to.equal(true);
      expect(applicationPackage.module.pets[0].environment).to.equal('outdoors');
      expect(applicationPackage.module.pets[0].travel).to.equal(true);
      // Second Pet Expectations
      expect(applicationPackage.module.pets[1].name).to.equal('Snowey');
      expect(applicationPackage.module.pets[1].type).to.equal('cat');
      expect(applicationPackage.module.pets[1].birth_date).to.equal('2008-04-12T08:46:39.0Z');
      expect(applicationPackage.module.pets[1].gender).to.equal('female');
      expect(applicationPackage.module.pets[1].breed).to.equal('siamese');
      expect(applicationPackage.module.pets[1].pet_size).to.equal('small');
      expect(applicationPackage.module.pets[1].pet_age).to.equal(15);
      expect(applicationPackage.module.pets[1].cover_amount).to.equal(1000000);
      expect(applicationPackage.module.pets[1].excess_amount).to.equal(25000);
      expect(applicationPackage.module.pets[1].pet_premium_amount).to.equal(6741);
      expect(applicationPackage.module.pets[1].remaining_cover_limit_amount).to.equal(1000000);
      expect(applicationPackage.module.pets[1].microchip).to.equal(false);
      expect(applicationPackage.module.pets[1].vaccinations).to.equal(true);
      expect(applicationPackage.module.pets[1].neutered).to.equal(true);
      expect(applicationPackage.module.pets[1].environment).to.equal('indoors');
      expect(applicationPackage.module.pets[1].travel).to.equal(false);
    });
    it('should return the correct main application data', function () {
      // Application data
      expect(applicationPackage.sum_assured).to.equal(1600000);
      expect(applicationPackage.base_premium).to.equal(12836);
      expect(applicationPackage.monthly_premium).to.equal(12836);
    });
  });

  // Policy issue hook
  describe('Policy issue hook', function () {
    it('should create a policy with the correct parameters', function () {
      // Policy data
      expect(policy.package_name).to.equal("Pet");
      expect(policy.sum_assured).to.equal(1600000);
      expect(policy.base_premium).to.equal(12836);
      expect(policy.monthly_premium).to.equal(12836);
      expect(policy.start_date).to.equal(moment().add(1, 'day').format());
      expect(policy.end_date).to.equal(null);
      // First Pet Expectations
      expect(policy.module.pets[0].name).to.equal('Spot');
      expect(policy.module.pets[0].type).to.equal('dog');
      expect(policy.module.pets[0].birth_date).to.equal('2020-04-12T08:46:39.0Z');
      expect(policy.module.pets[0].gender).to.equal('male');
      expect(policy.module.pets[0].breed).to.equal('mixed_breed');
      expect(policy.module.pets[0].pet_size).to.equal('large');
      expect(policy.module.pets[0].pet_age).to.equal(3);
      expect(policy.module.pets[0].cover_amount).to.equal(600000);
      expect(policy.module.pets[0].excess_amount).to.equal(20000);
      expect(policy.module.pets[0].pet_premium_amount).to.equal(6095);
      expect(policy.module.pets[0].remaining_cover_limit_amount).to.equal(600000);
      expect(policy.module.pets[0].microchip).to.equal(false);
      expect(policy.module.pets[0].vaccinations).to.equal(true);
      expect(policy.module.pets[0].neutered).to.equal(true);
      expect(policy.module.pets[0].environment).to.equal('outdoors');
      expect(policy.module.pets[0].travel).to.equal(true);
      // Second Pet Expectations
      expect(policy.module.pets[1].name).to.equal('Snowey');
      expect(policy.module.pets[1].type).to.equal('cat');
      expect(policy.module.pets[1].birth_date).to.equal('2008-04-12T08:46:39.0Z');
      expect(policy.module.pets[1].gender).to.equal('female');
      expect(policy.module.pets[1].breed).to.equal('siamese');
      expect(policy.module.pets[1].pet_size).to.equal('small');
      expect(policy.module.pets[1].pet_age).to.equal(15);
      expect(policy.module.pets[1].cover_amount).to.equal(1000000);
      expect(policy.module.pets[1].excess_amount).to.equal(25000);
      expect(policy.module.pets[1].pet_premium_amount).to.equal(6741);
      expect(policy.module.pets[1].remaining_cover_limit_amount).to.equal(1000000);
      expect(policy.module.pets[1].microchip).to.equal(false);
      expect(policy.module.pets[1].vaccinations).to.equal(true);
      expect(policy.module.pets[1].neutered).to.equal(true);
      expect(policy.module.pets[1].environment).to.equal('indoors');
      expect(policy.module.pets[1].travel).to.equal(false);
    });
  });
});
