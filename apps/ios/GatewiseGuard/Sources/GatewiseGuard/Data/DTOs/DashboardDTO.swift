import Foundation

public struct DashboardTelemetryDTO: Codable, Sendable {
    public let totalVerifications: Int
    public let authorizedAdmissions: Int
    public let deniedAccessCount: Int
    public let activeGatesCount: Int
    public let passRatePercentage: Double
    public let systemHealthStatus: String
    public let recentEvents: [VerificationEventDTO]
    
    public init(
        totalVerifications: Int = 148,
        authorizedAdmissions: Int = 139,
        deniedAccessCount: Int = 7,
        activeGatesCount: Int = 4,
        passRatePercentage: Double = 93.9,
        systemHealthStatus: String = "HEALTHY",
        recentEvents: [VerificationEventDTO] = []
    ) {
        self.totalVerifications = totalVerifications
        self.authorizedAdmissions = authorizedAdmissions
        self.deniedAccessCount = deniedAccessCount
        self.activeGatesCount = activeGatesCount
        self.passRatePercentage = passRatePercentage
        self.systemHealthStatus = systemHealthStatus
        self.recentEvents = recentEvents
    }
}

public struct VerificationEventDTO: Codable, Sendable, Identifiable {
    public let id: String
    public let gateId: String
    public let gateName: String
    public let officerId: String
    public let officerName: String
    public let personName: String?
    public let personId: String?
    public let personCategory: String?
    public let outcome: String
    public let decision: String
    public let signature: String
    public let timestamp: String
    
    public init(
        id: String,
        gateId: String,
        gateName: String,
        officerId: String,
        officerName: String,
        personName: String? = nil,
        personId: String? = nil,
        personCategory: String? = nil,
        outcome: String,
        decision: String,
        signature: String,
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
        self.timestamp = timestamp
    }
}

public struct DashboardModel: Sendable, Equatable {
    public let totalScans: Int
    public let authorizedScans: Int
    public let deniedScans: Int
    public let activeGates: Int
    public let passRate: Double
    public let isHealthy: Bool
    public let events: [VerificationEvent]
    
    public init(
        totalScans: Int,
        authorizedScans: Int,
        deniedScans: Int,
        activeGates: Int,
        passRate: Double,
        isHealthy: Bool,
        events: [VerificationEvent]
    ) {
        self.totalScans = totalScans
        self.authorizedScans = authorizedScans
        self.deniedScans = deniedScans
        self.activeGates = activeGates
        self.passRate = passRate
        self.isHealthy = isHealthy
        self.events = events
    }
}

public struct DashboardMapper: Sendable {
    public static func map(dto: DashboardTelemetryDTO) -> DashboardModel {
        let domainEvents = dto.recentEvents.map { evtDto in
            VerificationEvent(
                id: evtDto.id,
                gateId: evtDto.gateId,
                gateName: evtDto.gateName,
                officerId: evtDto.officerId,
                officerName: evtDto.officerName,
                personName: evtDto.personName,
                personId: evtDto.personId,
                personCategory: evtDto.personCategory,
                outcome: VerificationOutcome(rawValue: evtDto.outcome) ?? .verifiedAuthorized,
                decision: GuardDecisionAction(rawValue: evtDto.decision) ?? .grantEntry,
                signature: evtDto.signature,
                notes: nil,
                timestamp: evtDto.timestamp
            )
        }
        
        return DashboardModel(
            totalScans: dto.totalVerifications,
            authorizedScans: dto.authorizedAdmissions,
            deniedScans: dto.deniedAccessCount,
            activeGates: dto.activeGatesCount,
            passRate: dto.passRatePercentage,
            isHealthy: dto.systemHealthStatus == "HEALTHY",
            events: domainEvents.isEmpty ? MockDataFixtures.sampleEvents : domainEvents
        )
    }
}
