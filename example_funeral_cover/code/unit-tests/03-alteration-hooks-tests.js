describe('Update Covered Lives Alteration Hook', function () {
  const alterationHookKey = 'update_covered_lives';
  describe('Update Covered Lives Alteration Hook Validation Tests', function () {
    describe('Validation should pass ', function () {
      it('Should not throw an error', function () {
        expect(() =>
          validateAlterationPackageRequest({
            alteration_hook_key: alterationHookKey,
            data: validAlterationData,
            policy: undefined,
            policyholder: undefined,
          }),
        ).to.not.throw();
      });
    });
    describe('Validation should fail ', function () {
      let failedAlteration;
      before(function () {
        failedAlteration = validateAlterationPackageRequest({
          alteration_hook_key: alterationHookKey,
          data: invalidAlterationData,
          policy: undefined,
          policyholder: undefined,
        });
      });
      it('Should throw an error when main life is above the cover amount maximum (R100 000)', function () {
        expect(failedAlteration.error.details[0].message).to.deep.equal(
          '"total_cover_amount" must be less than or equal to 10000000',
        );
      });
      it('Should throw an error when additional life is below the cover amount minimum (R10 000)', function () {
        expect(failedAlteration.error.details[3].message).to.deep.equal(
          '"total_cover_amount" must be larger than or equal to 1000000',
        );
      });
      it('Should throw an error when additional life is above the cover amount maximum (R100 000)', function () {
        expect(failedAlteration.error.details[2].message).to.deep.equal(
          '"total_cover_amount" must be less than or equal to 10000000',
        );
      });
    });
  });

  describe('Update Covered Lives Alteration Hook Functionality Tests', function () {
    let alterationPackage;
    let alteredPolicy;
    before(function () {
      alterationPackage = getAlteration({
        alteration_hook_key: alterationHookKey,
        data: validAlterationData,
        // @ts-ignore
        policy: examplePolicy,
        // @ts-ignore
        policyholder: examplePolicyholder,
      });
      alteredPolicy = applyAlteration({
        alteration_hook_key: alterationHookKey,
        // @ts-ignore
        policy: examplePolicy,
        // @ts-ignore
        policyholder: examplePolicyholder,
        // @ts-ignore
        alteration_package: alterationPackage,
      });
    });
    it('All cover amounts should have been updated', function () {
      expect(alteredPolicy.module.main_life.total_cover_amount).to.not.equal(
        examplePolicy.module.main_life.total_cover_amount,
      );
      expect(
        alteredPolicy.module.additional_lives[0].total_cover_amount,
      ).to.not.equal(
        examplePolicy.module.additional_lives[0].total_cover_amount,
      );
      expect(
        alteredPolicy.module.additional_lives[1].total_cover_amount,
      ).to.not.equal(
        examplePolicy.module.additional_lives[1].total_cover_amount,
      );
    });
    it('New tranche should be created for the main member', function () {
      expect(alteredPolicy.module.main_life.tranches.length).to.be.greaterThan(
        examplePolicy.module.main_life.tranches.length,
      );
    });
    it('The cover amount in the tranche and total cover amount should be reduced for the first additional life: R15k cover reduced to R12k', function () {
      expect(
        alteredPolicy.module.additional_lives[0].tranches[0].cover_amount,
      ).to.be.lessThan(
        examplePolicy.module.additional_lives[0].tranches[0].cover_amount,
      );
    });
    it('A tranche should be removed and the cover amount in the previous tranche should be reduced ', function () {
      expect(
        alteredPolicy.module.additional_lives[1].tranches.length,
      ).to.be.lessThan(
        examplePolicy.module.additional_lives[1].tranches.length,
      );
      expect(
        alteredPolicy.module.additional_lives[1].tranches[0].cover_amount,
      ).to.be.lessThan(
        examplePolicy.module.additional_lives[1].tranches[0].cover_amount,
      );
    });
  });
});

describe('Premium Waiver', function () {
  const alterationHookKey2 = 'premium_waiver';
  describe('Premium Waiver Validation Tests', function () {
    describe('Validation should pass ', function () {
      it('Should not throw an error', function () {
        expect(() =>
          validateAlterationPackageRequest({
            alteration_hook_key: alterationHookKey2,
            data: premiumWaiverAlterationData,
            policy: undefined,
            policyholder: undefined,
          }),
        ).to.not.throw();
      });
    });
    describe('Validation should fail ', function () {
      let failedAlteration2;
      before(function () {
        failedAlteration2 = validateAlterationPackageRequest({
          alteration_hook_key: alterationHookKey2,
          data: failedPremiumWaiverAlterationData,
          policy: undefined,
          policyholder: undefined,
        });
      });
      it('Should throw an error when undo is false and the main_date_of_death is not given', function () {
        expect(failedAlteration2.error.details[0].message).to.deep.equal(
          '"main_member_date_of_death" is required',
        );
      });
    });

    describe('Premium Waiver Alteration Hook Functionality Tests', function () {
      let alterationPackage;
      let alteredPolicy;
      let alterationPackage2;
      let alteredPolicy2;
      before(function () {
        alterationPackage = getAlteration({
          alteration_hook_key: alterationHookKey2,
          data: premiumWaiverAlterationData,
          // @ts-ignore
          policy: examplePolicy,
          // @ts-ignore
          policyholder: examplePolicyholder,
        });
        alteredPolicy = applyAlteration({
          alteration_hook_key: alterationHookKey2,
          // @ts-ignore
          policy: examplePolicy,
          // @ts-ignore
          policyholder: examplePolicyholder,
          // @ts-ignore
          alteration_package: alterationPackage,
        });
        alterationPackage2 = getAlteration({
          alteration_hook_key: alterationHookKey2,
          data: premiumWaiverAlterationDataApplied,
          // @ts-ignore
          policy: examplePolicy2,
          // @ts-ignore
          policyholder: examplePolicyholder,
        });
        alteredPolicy2 = applyAlteration({
          alteration_hook_key: alterationHookKey2,
          // @ts-ignore
          policy: examplePolicy2,
          // @ts-ignore
          policyholder: examplePolicyholder,
          // @ts-ignore
          alteration_package: alterationPackage2,
        });
      });
      it('Policy end date should not be added', function () {
        expect(alteredPolicy.module.hasOwnProperty('end_date')).to.equal(false);
      });
      it('Policy alterations should not be allowed on the policy ', function () {
        expect(alteredPolicy.module.policy_alteration_allowed).to.equal(false);
      });
      it('Policy end date should be added', function () {
        expect(alteredPolicy2.module.hasOwnProperty('end_date')).to.equal(
          false,
        );
      });
      it('Policy alterations should be allowed on the policy ', function () {
        expect(alteredPolicy2.module.policy_alteration_allowed).to.equal(true);
      });
    });
  });
});
