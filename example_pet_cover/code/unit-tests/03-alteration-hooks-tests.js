// @ts-nocheck

describe('Alteration hooks', function () {

  describe('Change cover', function () {
    it('should pass validation', function () {
      const validationResult = validateAlterationPackageRequest(alterationRequestData.changeCover);
      expect(validationResult.error).to.equal(null);
    });
    it('should calculate the correct premium', function () {
      const validationResult = validateAlterationPackageRequest(alterationRequestData.changeCover);
      const alterationPackage = getAlteration(alterationRequestData.changeCover);
      expect(alterationPackage.monthly_premium).to.equal(1279);
    });
  });

  describe('Change discounts', function () {
    it('should pass validation', function () {
      const validationResult = validateAlterationPackageRequest(alterationRequestData.changeDiscounts);
      expect(validationResult.error).to.equal(null);
    });
    it('should calculate the correct premium', function () {
      const validationResult = validateAlterationPackageRequest(alterationRequestData.changeDiscounts);
      const alterationPackage = getAlteration(alterationRequestData.changeDiscounts);
      expect(alterationPackage.monthly_premium).to.equal(1680);
    });
  });

  describe('Change pets', function () {
    it('should pass validation', function () {
      const validationResult = validateAlterationPackageRequest(alterationRequestData.changePets);
      expect(validationResult.error).to.equal(null);
    });
    it('should calculate the correct premium', function () {
      const validationResult = validateAlterationPackageRequest(alterationRequestData.changePets);
      const alterationPackage = getAlteration(alterationRequestData.changePets);
      expect(alterationPackage.monthly_premium).to.equal(1421);
    });
  });
});
