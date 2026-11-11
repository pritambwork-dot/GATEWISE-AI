import Foundation

public enum VerificationOutcome: String, Codable, Sendable, CaseIterable {
    case verifiedAuthorized = "VERIFIED_AUTHORIZED"
    case authorizationExpired = "AUTHORIZATION_EXPIRED"
    case identifiedUnauthorized = "IDENTIFIED_UNAUTHORIZED"
    case potentialMatch = "POTENTIAL_MATCH"
    case unknownPerson = "UNKNOWN_PERSON"
    case imageQualityInsufficient = "IMAGE_QUALITY_INSUFFICIENT"
    case serviceUnavailable = "SERVICE_UNAVAILABLE"
    
    public var displayName: String {
        switch self {
        case .verifiedAuthorized:
            return "Verified & Authorized"
        case .authorizationExpired:
            return "Authorization Expired"
        case .identifiedUnauthorized:
            return "Identified Unauthorized"
        case .potentialMatch:
            return "Potential Match (70–89%)"
        case .unknownPerson:
            return "Unknown Person"
        case .imageQualityInsufficient:
            return "Image Quality Insufficient"
        case .serviceUnavailable:
            return "Offline Standby"
        }
    }
}

public enum GuardDecisionAction: String, Codable, Sendable, CaseIterable {
    case grantEntry = "GRANT_ENTRY"
    case denyEntry = "DENY_ENTRY"
    case escalateToAdmin = "ESCALATE_TO_ADMIN"
    case referToVisitorDesk = "REFER_TO_VISITOR_DESK"
    
    public var title: String {
        switch self {
        case .grantEntry:
            return "Grant Physical Entry"
        case .denyEntry:
            return "Deny Access & Turn Away"
        case .escalateToAdmin:
            return "Escalate to Command Centre"
        case .referToVisitorDesk:
            return "Refer to Visitor Desk"
        }
    }
    
    public var subtitle: String {
        switch self {
        case .grantEntry:
            return "Open barrier gate and admit subject to campus."
        case .denyEntry:
            return "Refuse passage due to credentials or institutional restriction."
        case .escalateToAdmin:
            return "Dispatch high-priority incident alert to Central Security Desk."
        case .referToVisitorDesk:
            return "Direct subject to Desk A for temporary guest pass registration."
        }
    }
    
    public var iconName: String {
        switch self {
        case .grantEntry:
            return "checkmark.circle.fill"
        case .denyEntry:
            return "xmark.octagon.fill"
        case .escalateToAdmin:
            return "exclamationmark.shield.fill"
        case .referToVisitorDesk:
            return "person.crop.circle.badge.plus"
        }
    }
}

public enum UserRole: String, Codable, Sendable {
    case securityGuard = "SECURITY_GUARD"
    case securityAdmin = "SECURITY_ADMIN"
    case gateSupervisor = "GATE_SUPERVISOR"
}
