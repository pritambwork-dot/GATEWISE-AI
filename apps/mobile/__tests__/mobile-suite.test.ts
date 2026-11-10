import { Colors, GatewiseThresholds, VerificationOutcome, GuardDecisionAction } from '../src/theme';
import { FIXTURE_VERIFICATION_STATES, FIXTURE_SOP_QA } from '../src/services/fixtures';
import { ProfileService } from '../src/services/profile.service';
import { VisitorService } from '../src/services/visitor.service';

describe('GATEWISE AI Mobile Guard Application Test Suite', () => {
  describe('Theme & Daylight Aesthetic Tokens', () => {
    it('enforces institutional daylight color tokens', () => {
      expect(Colors.background).toBe('#F4F8F5');
      expect(Colors.surface).toBe('#FFFFFF');
      expect(Colors.surfaceSecondary).toBe('#EDF4EF');
      expect(Colors.primary).toBe('#23865D');
      expect(Colors.deep).toBe('#176346');
    });

    it('enforces biometric decision thresholds', () => {
      expect(GatewiseThresholds.faceMatchAutoAdmit).toBe(0.90);
      expect(GatewiseThresholds.faceMatchCandidate).toBe(0.70);
      expect(GatewiseThresholds.minBlurScore).toBe(60.0);
    });

    it('declares sovereign guard decision actions', () => {
      expect(GuardDecisionAction.GRANT_ENTRY).toBe('GRANT_ENTRY');
      expect(GuardDecisionAction.DENY_ENTRY).toBe('DENY_ENTRY');
      expect(GuardDecisionAction.ESCALATE_TO_ADMIN).toBe('ESCALATE_TO_ADMIN');
      expect(GuardDecisionAction.REFER_TO_VISITOR_DESK).toBe('REFER_TO_VISITOR_DESK');
    });
  });

  describe('7 Verification States Coverage', () => {
    it('covers State A: Verified & Authorized (>=90%)', () => {
      const stateA = FIXTURE_VERIFICATION_STATES.STATE_A;
      expect(stateA.outcome).toBe(VerificationOutcome.VERIFIED_AUTHORIZED);
      expect(stateA.candidate).toBeDefined();
      expect(stateA.candidate!.similarityScore).toBeGreaterThanOrEqual(0.90);
      expect(stateA.authorization!.isAuthorized).toBe(true);
    });

    it('covers State B/F: Identified but Expired/Unauthorized', () => {
      const stateB = FIXTURE_VERIFICATION_STATES.STATE_B;
      expect(stateB.outcome).toBe(VerificationOutcome.AUTHORIZATION_EXPIRED);
      expect(stateB.candidate).toBeDefined();
      expect(stateB.authorization!.isAuthorized).toBe(false);
      expect(stateB.authorization!.restrictionReason).toBeDefined();
    });

    it('covers State C: Potential Match (70–89% requires physical ID inspection)', () => {
      const stateC = FIXTURE_VERIFICATION_STATES.STATE_C;
      expect(stateC.outcome).toBe(VerificationOutcome.POTENTIAL_MATCH);
      expect(stateC.candidate!.similarityScore).toBeGreaterThanOrEqual(0.70);
      expect(stateC.candidate!.similarityScore).toBeLessThan(0.90);
    });

    it('covers State D: Unknown Person (<70%)', () => {
      const stateD = FIXTURE_VERIFICATION_STATES.STATE_D;
      expect(stateD.outcome).toBe(VerificationOutcome.UNKNOWN_PERSON);
      expect(stateD.candidate).toBeUndefined();
    });

    it('covers State E: Image Quality Insufficient', () => {
      const stateE = FIXTURE_VERIFICATION_STATES.STATE_E;
      expect(stateE.outcome).toBe(VerificationOutcome.IMAGE_QUALITY_INSUFFICIENT);
      expect(stateE.faceDetected).toBe(false);
      expect(stateE.imageQualityScore).toBeLessThan(60.0);
    });

    it('covers State G: Offline Standby', () => {
      const stateG = FIXTURE_VERIFICATION_STATES.STATE_G;
      expect(stateG.outcome).toBe(VerificationOutcome.SERVICE_UNAVAILABLE);
    });
  });

  describe('SOP Knowledge Assistant Matcher', () => {
    it('returns vehicle protocol when queried about vehicles', () => {
      const res = ProfileService.matchFallbackSop('What is the protocol for delivery vehicle?');
      expect(res).toBe(FIXTURE_SOP_QA.vehicle);
    });

    it('returns VIP protocol for VIP inquiries', () => {
      const res = ProfileService.matchFallbackSop('How to handle VIP convoy arrival?');
      expect(res).toBe(FIXTURE_SOP_QA.vip);
    });

    it('returns expired card protocol for alumni or expired passes', () => {
      const res = ProfileService.matchFallbackSop('Student presents an expired card');
      expect(res).toBe(FIXTURE_SOP_QA.expired);
    });
  });

  describe('Visitor Pass Lifecycle', () => {
    it('manages check-in and check-out transitions', async () => {
      const newPass = await VisitorService.registerIntake({
        visitorName: 'Test Visitor',
        phone: '+91 99999 88888',
        idType: 'Aadhaar Card',
        idNumber: '123456789012',
        hostName: 'Dr. Test Host',
        hostDepartment: 'Computer Science',
        purpose: 'Technical Discussion',
        gateId: 'gate-post-02',
      });

      expect(newPass.passCode).toMatch(/^PASS-\d{4}$/);
      expect(newPass.status).toBe('CHECKED_IN');

      const checkedOut = await VisitorService.checkOutVisitor(newPass.passCode);
      expect(checkedOut.status).toBe('CHECKED_OUT');
      expect(checkedOut.checkOutTime).toBeDefined();
    });
  });
});
