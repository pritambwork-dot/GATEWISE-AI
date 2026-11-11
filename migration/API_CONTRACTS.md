# CONTRACT: API ENDPOINTS & SIGNATURES
**Status:** Frozen  
**Lead Orchestrator:** Lead Agent  
**Base URL:** `http://localhost:8000/api/v1`  
**Date:** 2026-11-11  

---

### 1. REST Endpoints Specification

```swift
public enum APIEndpoint {
    case login
    case logout
    case verifySession
    case verifyPhoto(gateId: String)
    case commitDecision
    case recentEvents(gateId: String, limit: Int)
    case getActiveVisitors(gateId: String)
    case registerVisitor
    case checkoutVisitor(passId: String)
    case terminalHealth(terminalId: String)
    case querySop
}
```

---

### 2. Payload Schemas

#### 2.1 Login Request (`POST /api/v1/auth/login`)
```json
{
  "employee_id": "SEC-G014",
  "password": "guard123"
}
```
**Response (200 OK)**:
```json
{
  "token": "mock-jwt-token-...",
  "user": {
    "id": "USR-G014",
    "employeeId": "SEC-G014",
    "fullName": "Officer Ramesh Verma",
    "badgeNumber": "BG-8842",
    "role": "SECURITY_GUARD",
    "assignedGateId": "gate-post-02"
  },
  "assigned_gate": {
    "id": "gate-post-02",
    "code": "GATE-MAIN-02",
    "name": "Main Campus Gate · Post 02",
    "locationZone": "Zone 1 (Vehicular & Pedestrian)",
    "operatingHours": "24/7",
    "status": "ACTIVE"
  },
  "shift_name": "Shift A (Morning 06:00 – 14:00)"
}
```

#### 2.2 Verify Face (`POST /api/v1/verify/face`)
```json
{
  "gate_id": "gate-post-02",
  "image_base64": "<base64_string>",
  "timestamp": "2026-11-11T07:00:00Z"
}
```

#### 2.3 Commit Decision (`POST /api/v1/verify/decision`)
```json
{
  "event_id": "EVT-84920194",
  "action": "GRANT_ENTRY",
  "signature": "7a8b9c...64char_hex...",
  "notes": "Verified against ID badge"
}
```
