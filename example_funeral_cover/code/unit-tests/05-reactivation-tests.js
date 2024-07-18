const dateOverThreeMonths = moment().subtract(4, 'months').format('YYYY-MM-DD');
const dateWithinThreeMonths = moment()
  .subtract(2, 'months')
  .format('YYYY-MM-DD');
describe('Before Policy Reactivated', function () {
  describe('Policy is cancelled', function () {
    it('Should not throw an error as the policy is cancelled which is an allowed state', function () {
      expect(() =>
        beforePolicyReactivated({
          // @ts-ignore
          policy: cancelledPolicy,
          dateForTesting: dateWithinThreeMonths,
        }),
      ).to.not.throw();
    });
  });
  describe('Policy is lapsed', function () {
    it('Should not throw an error as the policy is lapsed which is an allowed state', function () {
      expect(() =>
        beforePolicyReactivated({
          // @ts-ignore
          policy: lapsedPolicy,
          dateForTesting: dateWithinThreeMonths,
        }),
      ).to.not.throw();
    });
  });
  describe('Policy is expired', function () {
    it('Should throw an error as the policy is expired which is not allowed', function () {
      expect(() =>
        beforePolicyReactivated({
          // @ts-ignore
          policy: expiredPolicy,
          dateForTesting: dateWithinThreeMonths,
        }),
      ).to.throw(
        `Policy with status 'expired' cannot be reactivated. Policy status must be either 'cancelled' or 'lapsed'`,
      );
    });
  });
  describe('Policy is not taken up', function () {
    it('Should throw an error as the policy is not taken up which is not allowed', function () {
      expect(() =>
        beforePolicyReactivated({
          // @ts-ignore
          policy: notTakenUpPolicy,
          dateForTesting: dateWithinThreeMonths,
        }),
      ).to.throw(
        `Policy with status 'not_taken_up' cannot be reactivated. Policy status must be either 'cancelled' or 'lapsed'.`,
      );
    });
  });
  describe('Policy is active', function () {
    it('Should throw an error when the policy is active', function () {
      expect(() =>
        beforePolicyReactivated({
          // @ts-ignore
          policy: activePolicy,
          dateForTesting: dateWithinThreeMonths,
        }),
      ).to.throw(
        `Policy with status 'active' cannot be reactivated. Policy status must be either 'cancelled' or 'lapsed'`,
      );
    });
  });
  describe('Policy was last updated within three months', function () {
    it('Should not throw an error', function () {
      expect(() =>
        beforePolicyReactivated({
          // @ts-ignore
          policy: lapsedPolicy,
          dateForTesting: dateWithinThreeMonths,
        }),
      ).to.not.throw();
    });
  });
  describe('Policy was last updated outside of three months', function () {
    it('Should throw an error', function () {
      expect(() =>
        beforePolicyReactivated({
          // @ts-ignore
          policy: lapsedPolicyOld,
        }),
      ).to.throw(
        `Policy can only be reactivated within 3 months of lapse. Policy status was last updated on ${moment(
          lapsedPolicyOld.status_updated_at,
        ).format('YYYY-MM-DD')}`,
      );
    });
  });
  describe('Policy has not yet been reactivated', function () {
    it('Should not throw an error', function () {
      expect(() =>
        beforePolicyReactivated({
          // @ts-ignore
          policy: lapsedPolicy,
          dateForTesting: dateOverThreeMonths,
        }),
      ).to.not.throw();
    });
  });
  describe('Policy has already been reactivated', function () {
    it('Should throw an error', function () {
      expect(() =>
        beforePolicyReactivated({
          // @ts-ignore
          policy: alreadyReactivated,
          dateForTesting: dateOverThreeMonths,
        }),
      ).to.throw();
    });
  });
});
