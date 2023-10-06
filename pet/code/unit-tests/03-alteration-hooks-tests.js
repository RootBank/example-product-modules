// describe('Amendment altration hook', function () {
//   const alterationHookKey = 'amendment';

//   it('valid data should pass validation', function () {
//     // @ts-ignore
//     const validationResult = validateAlterationPackageRequest({
//       alteration_hook_key: alterationHookKey,
//       data: validAlterationData,
//     });
//     expect(validationResult.error).to.equal(null);
//   });

//   it('invalid pet name should generate validation error', function () {
//     // @ts-ignore
//     const validationResult = validateAlterationPackageRequest({
//       alteration_hook_key: alterationHookKey,
//       data: invalidAlterationData,
//     });
//     expect(validationResult.error.message).to.equal(`child "pet_name" fails because ["pet_name" must be a string]`);
//   });

//   it('should update the pet breed to "dire wolf"', function () {
//     const alterationPackage = getAlteration({
//       alteration_hook_key: alterationHookKey,
//       data: validAlterationData,
//       // @ts-ignore
//       policy: examplePolicy,
//     });
//     expect(alterationPackage.module.pet_breed).to.equal('dire wolf');
//   });
// });
