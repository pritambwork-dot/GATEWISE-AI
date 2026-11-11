# MIGRATION AUDIT 04: API & CONTRACT INVENTORY
## REST API & Realtime Endpoints Mapped to Native Swift 6 Networking

**Audited By:** AGENT 01 & AGENT 04  
**Base URL:** `http://localhost:8000/api/v1` (configurable via `GatewiseAPIClient`)  
**Date:** 2026-11-11  

---

### 1. REST Endpoints Catalog

| Endpoint | Method | Purpose | Request Body | Response Schema | Swift APIEndpoint |
|---|---|---|---|---|---|
| `/auth/login` | `POST` | Officer authentication & gate station lock | `{"employee_id": str, "password": str}` | `AuthResponse` (`token`, `user`, `assigned_gate`, `shift_name`) | `.login` |
| `/auth/logout` | `POST` | Session termination & gate unlock | None | `{"status": "success"}` | `.logout` |
| `/auth/session` | `GET` | Validate current JWT session token | None (Bearer header) | `UserProfile` | `.verifySession` |
| `/verify/face` | `POST` | Ingest live captured photo for verification | `{"gate_id": str, "image_base64": str, "timestamp": str}` | `VerificationResult` (`outcome`, `candidate`, `authorization`, `quality_score`) | `.verifyPhoto` |
| `/verify/decision`| `POST` | Record guard entry decision with HMAC seal | `{"event_id": str, "action": str, "signature": str, "notes": str?}` | `VerificationEvent` | `.commitDecision` |
| `/events/recent` | `GET` | Fetch audit timeline for active station | Query params: `gate_id`, `limit` | `[VerificationEvent]` | `.recentEvents` |
| `/events/stream` | `GET` | Server-Sent Events (SSE) live feed | Query params: `gate_id` | Text Stream `data: {...}` | `RealtimeManager.subscribe` |
| `/visitors` | `GET` | Retrieve active visitor badges | Query params: `gate_id`, `status` | `[VisitorPass]` | `.getActiveVisitors` |
| `/visitors/intake`| `POST` | Register walk-in campus visitor | `{"visitor_name": str, "phone": str, "id_type": str, "id_number": str, "host_name": str, ...}` | `VisitorPass` (`pass_code`, `status: "CHECKED_IN"`) | `.registerVisitor` |
| `/visitors/{id}/checkout` | `POST` | Process visitor departure | None | `VisitorPass` (`status: "CHECKED_OUT"`) | `.checkoutVisitor` |
| `/terminal/health` | `GET` | Hardware relay & sensor diagnostics | Query params: `terminal_id` | `TerminalHealth` (`relay_status`, `fps`, `lux`, `battery`) | `.terminalHealth` |
| `/sop/query` | `POST` | AI SOP Knowledge Base Assistant | `{"query": str}` | `{"answer": str, "protocol_id": str}` | `.querySop` |

---

### 2. Request / Response Data Contracts

All native models conform to `Codable` and `Sendable`. Example of `FaceVerificationRequest`:

```swift
public struct FaceVerificationRequest: Codable, Sendable {
    public let gateId: String
    public let timestamp: String
    public let imageBase64: String
    public let ambientLightScore: Double?
}
```

And `VerificationResult`:

```swift
public struct VerificationResult: Codable, Sendable, Identifiable {
    public let id: String
    public let gateId: String
    public let outcome: VerificationOutcome
    public let faceDetected: Bool
    public let imageQualityScore: Double
    public let candidate: SubjectCandidate?
    public let authorization: AuthorizationStatus?
    public let qualityFeedback: [String]
    public let timestamp: String
}
```

---

### 3. Error Handling Architecture

The native `GatewiseAPIClient` maps HTTP status codes into typed `NetworkError` instances:
- `400`: `NetworkError.badRequest(message)`
- `401`: `NetworkError.unauthorized` (triggers automatic session invalidation and login screen redirection)
- `403`: `NetworkError.forbidden` (user clearance level insufficient)
- `404`: `NetworkError.notFound`
- `500+`: `NetworkError.serverError(statusCode)`
- Timeout/Offline: `NetworkError.offline` (automatically routes to local deterministic cached fixtures)
