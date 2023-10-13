// @ts-nocheck
describe('Change pet excess altration hook', function () {
    // Alteration key for this test
    const alterationHookKey = 'change_pet_excess';
    // Setup (EAH = ExcessAlterationHook)
    let quotePackageEAH;
    let quotePackageDataEAH;
    let applicationPackageEAH;
    let applicationPackageDataEAH;
    let policyPackageEAH;
    let validationResultEAH;
    let alterationPackageEAH;
    let expectedAlterationPackageEAH;
    let appliedAlterationPackageEAH;

    before(function () {
        // Quote Data to generate package
        quotePackageDataEAH = getQuoteData();
        // Quote Package
        quotePackageEAH = getQuote(quotePackageDataEAH);
        // Application Data to generate package
        applicationPackageDataEAH = getApplicationData();
        // Application Package
        applicationPackageEAH = getApplication(applicationPackageDataEAH, undefined, quotePackageEAH[0]);
        // Policy Package
        policyPackageEAH = getPolicy(applicationPackageEAH);
        // Alteration input validation
        validationResultEAH = validateAlterationPackageRequest({
            alteration_hook_key: alterationHookKey,
            data: validAlterationData,
        });
        // Inavlid Alteration input validation (Should return error)
        invalidationResultEAH = validateAlterationPackageRequest({
            alteration_hook_key: alterationHookKey,
            data: invalidAlterationData,
        });
        // Alteration Package
        alterationPackageEAH = getAlteration({
            alteration_hook_key: alterationHookKey,
            data: validAlterationData,
            // @ts-ignore
            policy: { ...policyPackageEAH },
        });
        // Applied Alteration Package
        appliedAlterationPackageEAH = applyAlteration({
            alteration_hook_key: alterationHookKey,
            policy: { ...policyPackageEAH },
            alteration_package: alterationPackageEAH
        });

        // Expected Alteration Package JSON
        messageForExpectedAlterationPackageEAH = updatedExcessAlterationMessage(validAlterationData.pets, policyPackageEAH.module.pets);
        expectedAlterationPackageEAH = excessAlterationPackage([policyPackageEAH.module.pets[0].uuid, policyPackageEAH.module.pets[1].uuid], messageForExpectedAlterationPackageEAH)

        // console.log("Quote: " + JSON.stringify(quotePackageEAH))
        // console.log("Application: " + JSON.stringify(applicationPackageEAH));
        // console.log("Policy: " + JSON.stringify(policyPackageEAH))
        // console.log("Alteration: " + JSON.stringify(alterationPackageEAH))
        // console.log("AppliedAlteration: " + JSON.stringify(appliedAlterationPackageEAH))
    });

    it('valid data should pass validation', function () {
        expect(validationResultEAH.error).to.equal(null);
    });

    it('invalid data should not pass validation', function () {
        expect(invalidationResultEAH.error.message).to.not.equal(null);
    });

    // it('should return valid alteration package', function () {
    //     expect(alterationPackageEAH).to.deep.equal(expectedAlterationPackageEAH);
    // });
});
