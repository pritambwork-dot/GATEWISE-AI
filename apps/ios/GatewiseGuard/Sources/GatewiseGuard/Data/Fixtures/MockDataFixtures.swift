import Foundation

public struct MockDataFixtures: Sendable {
    public static let sampleGate = GateStation(
        id: "gate-post-02",
        code: "GATE-MAIN-02",
        name: "Main Campus Gate · Post 02",
        location: "North Sector Perimeter",
        status: "ACTIVE",
        isLocked: true
    )
    
    public static let sampleGuard = UserProfile(
        id: "usr-guard-014",
        employeeId: "SEC-G014",
        fullName: "Officer Ramesh Verma",
        role: .securityGuard,
        email: "ramesh.verma@gatewise.ac.in",
        phone: "+91 94370 12345"
    )
    
    // MARK: - 7 Verification Simulation States
    public static let stateA = VerificationResult(
        id: "sim-state-a",
        outcome: .verifiedAuthorized,
        candidate: SubjectCandidate(
            personId: "STU-2024-089",
            personName: "Aarav Sharma",
            department: "MBA Operations Management",
            category: "STUDENT",
            referencePhotoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
            similarityScore: 0.942
        ),
        authorization: ClearanceAuthorization(
            isAuthorized: true,
            restrictionReason: nil,
            clearanceLevel: "STUDENT_FULL_CAMPUS",
            validUntil: "2026-06-30"
        ),
        imageQualityScore: 96.8,
        faceDetected: true
    )
    
    public static let stateB = VerificationResult(
        id: "sim-state-b",
        outcome: .authorizationExpired,
        candidate: SubjectCandidate(
            personId: "ALM-2021-014",
            personName: "Priyanka Sen",
            department: "Alumni Batch 2021",
            category: "ALUMNI",
            referencePhotoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
            similarityScore: 0.915
        ),
        authorization: ClearanceAuthorization(
            isAuthorized: false,
            restrictionReason: "Graduated Alumni status; physical smartcard access expired on 2023-12-31.",
            clearanceLevel: "EXPIRED_ALUMNI",
            validUntil: "2023-12-31"
        ),
        imageQualityScore: 92.4,
        faceDetected: true
    )
    
    public static let stateC = VerificationResult(
        id: "sim-state-c",
        outcome: .potentialMatch,
        candidate: SubjectCandidate(
            personId: "RES-2023-042",
            personName: "Vikram Malhotra",
            department: "Doctoral Research Fellow",
            category: "RESEARCH_SCHOLAR",
            referencePhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
            similarityScore: 0.784
        ),
        authorization: ClearanceAuthorization(
            isAuthorized: true,
            restrictionReason: "Moderate confidence match (78.4%). Guard ID verification required.",
            clearanceLevel: "RESEARCH_SCHOLAR",
            validUntil: "2026-12-31"
        ),
        imageQualityScore: 88.0,
        faceDetected: true
    )
    
    public static let stateD = VerificationResult(
        id: "sim-state-d",
        outcome: .unknownPerson,
        candidate: nil,
        authorization: nil,
        imageQualityScore: 91.2,
        faceDetected: true
    )
    
    public static let stateE = VerificationResult(
        id: "sim-state-e",
        outcome: .imageQualityInsufficient,
        candidate: nil,
        authorization: nil,
        imageQualityScore: 42.0,
        faceDetected: false
    )
    
    public static let stateG = VerificationResult(
        id: "sim-state-g",
        outcome: .serviceUnavailable,
        candidate: nil,
        authorization: nil,
        imageQualityScore: 0.0,
        faceDetected: false
    )
    
    // MARK: - Sample Verification Events
    public static let sampleEvents: [VerificationEvent] = [
        VerificationEvent(
            id: "EVT-2026111106-001",
            gateId: "gate-post-02",
            gateName: "Main Campus Gate · Post 02",
            officerId: "SEC-G014",
            officerName: "Officer Ramesh Verma",
            personName: "Aarav Sharma",
            personId: "STU-2024-089",
            personCategory: "STUDENT",
            outcome: .verifiedAuthorized,
            decision: .grantEntry,
            signature: "9bca927bbf770eb2777ac58786b1665bcde7375bcdfc208f43105382ce12c3c3",
            notes: "Verified identity with 94.2% match. Barrier opened.",
            timestamp: "11:42 AM"
        ),
        VerificationEvent(
            id: "EVT-2026111106-002",
            gateId: "gate-post-02",
            gateName: "Main Campus Gate · Post 02",
            officerId: "SEC-G014",
            officerName: "Officer Ramesh Verma",
            personName: "Priyanka Sen",
            personId: "ALM-2021-014",
            personCategory: "ALUMNI",
            outcome: .authorizationExpired,
            decision: .referToVisitorDesk,
            signature: "8fbc927a4120bb33441bc58786b1665bcde7375bcdfc208f43105382ce12c111",
            notes: "Alumni pass expired. Directed to Visitor Registration Desk A.",
            timestamp: "11:28 AM"
        ),
        VerificationEvent(
            id: "EVT-2026111106-003",
            gateId: "gate-post-02",
            gateName: "Main Campus Gate · Post 02",
            officerId: "SEC-G014",
            officerName: "Officer Ramesh Verma",
            personName: "Unregistered Guest",
            personId: "N/A",
            personCategory: "VISITOR",
            outcome: .unknownPerson,
            decision: .denyEntry,
            signature: "77ac927bbf770eb2777ac58786b1665bcde7375bcdfc208f43105382ce12ffff",
            notes: "Subject refused visitor registration. Entry denied.",
            timestamp: "10:55 AM"
        )
    ]
    
    // MARK: - Sample Visitor Passes
    public static let sampleVisitors: [VisitorPass] = [
        VisitorPass(
            id: "vis-001",
            passCode: "PASS-4215",
            visitorName: "Vikramaditya Das",
            phone: "+91 98765 43210",
            idType: "Aadhaar Card",
            idNumber: "123456789012",
            hostName: "Prof. Alok Tripathi",
            hostDepartment: "Computer Science",
            purpose: "Academic Guest Lecture",
            gateId: "gate-post-02",
            status: "CHECKED_IN",
            checkInTime: "10:15 AM",
            checkOutTime: nil
        ),
        VisitorPass(
            id: "vis-002",
            passCode: "PASS-1092",
            visitorName: "Sunita Roy",
            phone: "+91 94371 88990",
            idType: "Driving License",
            idNumber: "OD-15-2019-0091",
            hostName: "Dr. Rajesh Iyer",
            hostDepartment: "Dean Academics",
            purpose: "Vendor IT Evaluation",
            gateId: "gate-post-02",
            status: "CHECKED_OUT",
            checkInTime: "08:45 AM",
            checkOutTime: "11:30 AM"
        )
    ]
    
    // MARK: - SOP Assistant Answers
    public static let sopAnswers: [String: String] = [
        "vehicle": "Vehicular Intake SOP: Direct commercial or unregistered vehicles to Holding Bay B. Check cargo bill of lading, record driver license, and call host department for escort clearance before opening the barrier.",
        "vip": "VIP Convoy Protocol: Escort convoy directly to Faculty Block Forecourt via Gate Post 01. Notify Chief Administrative Officer and Security Control Room immediately upon arrival.",
        "expired": "Expired Access SOP: Inform individual of card expiration. Offer temporary 1-day escort pass if visiting official faculty, or direct to Student Affairs Counter for biometric re-enrollment.",
        "default": "Standard Protocol: For anomalies or unlisted exceptions, verify government ID, log a referral entry in GATEWISE, and contact Security Control Room at ext. 4401."
    ]
}
