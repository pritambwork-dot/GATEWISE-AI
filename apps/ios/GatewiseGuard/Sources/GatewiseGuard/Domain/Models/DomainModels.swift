import Foundation

// MARK: - User & Authentication Models
public struct UserProfile: Codable, Sendable, Identifiable, Equatable {
    public let id: String
    public let employeeId: String
    public let fullName: String
    public let role: UserRole
    public let email: String?
    public let phone: String?
    
    public init(
        id: String,
        employeeId: String,
        fullName: String,
        role: UserRole,
        email: String? = nil,
        phone: String? = nil
    ) {
        self.id = id
        self.employeeId = employeeId
        self.fullName = fullName
        self.role = role
        self.email = email
        self.phone = phone
    }
}

public struct AuthResponse: Codable, Sendable {
    public let token: String
    public let user: UserProfile
    public let assignedGate: GateStation
    public let shiftName: String?
    
    public init(token: String, user: UserProfile, assignedGate: GateStation, shiftName: String? = nil) {
        self.token = token
        self.user = user
        self.assignedGate = assignedGate
        self.shiftName = shiftName
    }
}

// MARK: - Gate Station Model
public struct GateStation: Codable, Sendable, Identifiable, Equatable {
    public let id: String
    public let code: String
    public let name: String
    public let location: String
    public let status: String
    public let isLocked: Bool
    
    public init(
        id: String,
        code: String,
        name: String,
        location: String,
        status: String = "ACTIVE",
        isLocked: Bool = true
    ) {
        self.id = id
        self.code = code
        self.name = name
        self.location = location
        self.status = status
        self.isLocked = isLocked
    }
}

// MARK: - Biometric Verification Models
public struct SubjectCandidate: Codable, Sendable, Equatable {
    public let personId: String
    public let personName: String
    public let department: String
    public let category: String
    public let referencePhotoUrl: String?
    public let similarityScore: Double
    
    public init(
        personId: String,
        personName: String,
        department: String,
        category: String,
        referencePhotoUrl: String? = nil,
        similarityScore: Double
    ) {
        self.personId = personId
        self.personName = personName
        self.department = department
        self.category = category
        self.referencePhotoUrl = referencePhotoUrl
        self.similarityScore = similarityScore
    }
}

public struct ClearanceAuthorization: Codable, Sendable, Equatable {
    public let isAuthorized: Bool
    public let restrictionReason: String?
    public let clearanceLevel: String
    public let validUntil: String?
    
    public init(
        isAuthorized: Bool,
        restrictionReason: String? = nil,
        clearanceLevel: String = "STANDARD_STUDENT",
        validUntil: String? = nil
    ) {
        self.isAuthorized = isAuthorized
        self.restrictionReason = restrictionReason
        self.clearanceLevel = clearanceLevel
        self.validUntil = validUntil
    }
}

public struct VerificationResult: Codable, Sendable, Identifiable, Equatable {
    public let id: String
    public let outcome: VerificationOutcome
    public let candidate: SubjectCandidate?
    public let authorization: ClearanceAuthorization?
    public let imageQualityScore: Double
    public let faceDetected: Bool
    public let capturedFrameUri: String?
    public let timestamp: String
    
    public init(
        id: String = UUID().uuidString,
        outcome: VerificationOutcome,
        candidate: SubjectCandidate? = nil,
        authorization: ClearanceAuthorization? = nil,
        imageQualityScore: Double = 94.5,
        faceDetected: Bool = true,
        capturedFrameUri: String? = nil,
        timestamp: String = ISO8601DateFormatter().string(from: Date())
    ) {
        self.id = id
        self.outcome = outcome
        self.candidate = candidate
        self.authorization = authorization
        self.imageQualityScore = imageQualityScore
        self.faceDetected = faceDetected
        self.capturedFrameUri = capturedFrameUri
        self.timestamp = timestamp
    }
}

// MARK: - Verification Event & Decision Model
public struct VerificationEvent: Codable, Sendable, Identifiable, Equatable {
    public let id: String
    public let gateId: String
    public let gateName: String
    public let officerId: String
    public let officerName: String
    public let personName: String?
    public let personId: String?
    public let personCategory: String?
    public let outcome: VerificationOutcome
    public let decision: GuardDecisionAction
    public let signature: String
    public let notes: String?
    public let timestamp: String
    
    public init(
        id: String,
        gateId: String,
        gateName: String,
        officerId: String,
        officerName: String,
        personName: String?,
        personId: String?,
        personCategory: String?,
        outcome: VerificationOutcome,
        decision: GuardDecisionAction,
        signature: String,
        notes: String? = nil,
        timestamp: String
    ) {
        self.id = id
        self.gateId = gateId
        self.gateName = gateName
        self.officerId = officerId
        self.officerName = officerName
        self.personName = personName
        self.personId = personId
        self.personCategory = personCategory
        self.outcome = outcome
        self.decision = decision
        self.signature = signature
        self.notes = notes
        self.timestamp = timestamp
    }
}

// MARK: - Visitor Pass Model
public struct VisitorPass: Codable, Sendable, Identifiable, Equatable {
    public let id: String
    public let passCode: String
    public let visitorName: String
    public let phone: String
    public let idType: String
    public let idNumber: String
    public let hostName: String
    public let hostDepartment: String
    public let purpose: String
    public let gateId: String
    public let status: String // CHECKED_IN, CHECKED_OUT
    public let checkInTime: String
    public let checkOutTime: String?
    
    public init(
        id: String,
        passCode: String,
        visitorName: String,
        phone: String,
        idType: String,
        idNumber: String,
        hostName: String,
        hostDepartment: String,
        purpose: String,
        gateId: String,
        status: String = "CHECKED_IN",
        checkInTime: String = ISO8601DateFormatter().string(from: Date()),
        checkOutTime: String? = nil
    ) {
        self.id = id
        self.passCode = passCode
        self.visitorName = visitorName
        self.phone = phone
        self.idType = idType
        self.idNumber = idNumber
        self.hostName = hostName
        self.hostDepartment = hostDepartment
        self.purpose = purpose
        self.gateId = gateId
        self.status = status
        self.checkInTime = checkInTime
        self.checkOutTime = checkOutTime
    }
}

// MARK: - Terminal Health Diagnostics
public struct TerminalHealth: Codable, Sendable, Equatable {
    public let batteryPercent: Int
    public let latencyMs: Int
    public let offlineSyncBuffer: Int
    public let inferenceModel: String
    public let appBuild: String
    
    public init(
        batteryPercent: Int = 92,
        latencyMs: Int = 38,
        offlineSyncBuffer: Int = 0,
        inferenceModel: String = "SFace-128D + YuNet (FastAPI Core)",
        appBuild: String = "v1.0.0 (Build 120 · Native iOS 26)"
    ) {
        self.batteryPercent = batteryPercent
        self.latencyMs = latencyMs
        self.offlineSyncBuffer = offlineSyncBuffer
        self.inferenceModel = inferenceModel
        self.appBuild = appBuild
    }
}
