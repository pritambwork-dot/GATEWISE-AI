import {
  VerificationOutcome,
  GuardDecisionAction,
  GatewiseRole,
} from '@gatewise/design-tokens';

export { VerificationOutcome, GuardDecisionAction, GatewiseRole };

export type VerificationOutcomeType = keyof typeof VerificationOutcome;
export type GuardDecisionActionType = keyof typeof GuardDecisionAction;
export type GatewiseRoleType = keyof typeof GatewiseRole;

export interface AssignedGate {
  id: string;
  name: string;
  code: string;
  location: string;
  operatingHours: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'OFFLINE';
  assignedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: GatewiseRoleType;
  employeeId: string;
  avatarUrl?: string;
  assignedGate?: AssignedGate;
}

export interface AuthSession {
  accessToken: string;
  user: UserProfile;
  assignedGate: AssignedGate;
}

export interface FaceMatchCandidate {
  identityId: string;
  personName: string;
  personId: string; // STU-2024-0492
  category: string; // Student, Faculty, Staff, Contractor, Visitor
  department: string;
  referencePhotoUrl: string;
  similarityScore: number; // 0.0 to 1.0
}

export interface AuthorizationStatus {
  isAuthorized: boolean;
  clearanceLevel: string;
  validFrom: string;
  validUntil: string;
  permittedGates: string[];
  restrictionReason?: string;
}

export interface VerificationResult {
  eventId: string;
  gateId: string;
  gateName: string;
  guardId: string;
  timestamp: string;
  outcome: VerificationOutcomeType;
  faceDetected: boolean;
  imageQualityScore: number;
  qualityFeedback?: string[];
  candidate?: FaceMatchCandidate;
  authorization?: AuthorizationStatus;
  livePhotoThumbnailUrl?: string;
  capturedImageUri?: string;
}

export interface GuardDecisionSubmission {
  eventId: string;
  action: GuardDecisionActionType;
  notes?: string;
  overrideReason?: string;
}

export interface VerificationEventRecord {
  id: string;
  timestamp: string;
  gateId: string;
  gateName: string;
  guardId: string;
  guardName: string;
  personId?: string;
  personName?: string;
  personCategory?: string;
  outcome: VerificationOutcomeType;
  decision?: GuardDecisionActionType;
  similarityScore?: number;
  decisionReason?: string;
  cryptographicSignature: string;
  syncStatus?: 'SYNCED' | 'PENDING' | 'LOCAL';
}

export interface VisitorPass {
  id: string;
  passCode: string;
  visitorName: string;
  phone: string;
  idType: string;
  idNumber: string;
  hostName: string;
  hostDepartment: string;
  purpose: string;
  validDate: string;
  validUntilTime: string;
  status: 'EXPECTED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'EXPIRED';
  checkInTime?: string;
  checkOutTime?: string;
}

export interface VisitorIntakePayload {
  visitorName: string;
  phone: string;
  idType: string;
  idNumber: string;
  hostName: string;
  hostDepartment: string;
  purpose: string;
  gateId: string;
}

export interface TerminalHealth {
  batteryPercent: number;
  isCharging: boolean;
  latencyMs: number;
  isOnline: boolean;
  pendingSyncCount: number;
  modelVersion: string;
  appVersion: string;
  stationName: string;
  stationCode: string;
}

export interface VerificationStep {
  id: number;
  name: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
}
