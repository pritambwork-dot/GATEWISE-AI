import { VerificationOutcome, GuardDecisionAction, GatewiseRole } from '@gatewise/design-tokens';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: keyof typeof GatewiseRole;
  employeeId: string;
  avatarUrl?: string;
  assignedGate?: AssignedGate;
}

export interface AssignedGate {
  id: string;
  name: string;
  code: string;
  location: string;
  operatingHours: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'OFFLINE';
  assignedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}

export interface FaceVerificationRequest {
  gateId: string;
  timestamp: string;
  imageBase64: string; // JPEG/PNG compressed image
  ambientLightScore?: number;
}

export interface FaceMatchCandidate {
  identityId: string;
  personName: string;
  personId: string; // e.g. STU-2024-0492
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

export interface VerificationResultResponse {
  eventId: string;
  gateId: string;
  gateName: string;
  guardId: string;
  timestamp: string;
  outcome: keyof typeof VerificationOutcome;
  faceDetected: boolean;
  imageQualityScore: number; // 0-100
  qualityFeedback?: string[];
  candidate?: FaceMatchCandidate;
  authorization?: AuthorizationStatus;
  livePhotoThumbnailUrl?: string;
}

export interface GuardDecisionRequest {
  eventId: string;
  action: keyof typeof GuardDecisionAction;
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
  outcome: keyof typeof VerificationOutcome;
  decision: keyof typeof GuardDecisionAction;
  decisionTimestamp: string;
  similarityScore?: number;
  cryptographicSignature: string;
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
  photoBase64?: string;
}
