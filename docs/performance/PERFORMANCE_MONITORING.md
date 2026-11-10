# GATEWISE AI 1.0 — Performance Observability & Monitoring Specification
**Telemetry Architecture, Metrics Collection & Correlation Guidelines**  
*Release Version: 1.0.0 | Date: November 2026*

---

## 1. Observability Architecture

GATEWISE AI implements end-to-end performance tracing across Mobile Guard Terminals, FastAPI Backend, and the Desktop Command Centre without compromising biometric privacy:

```
[Mobile Guard Terminal] ──► X-Request-ID & Idempotency-Key
          │
          ▼
   [FastAPI Gateway] ─────► X-Response-Time-Ms (HTTP Response Header)
          │
          ├──► Prometheus / OpenTelemetry Metrics Exporter
          └──► Real-Time SSE Broadcaster ──► [Desktop Command Centre]
```

---

## 2. Key Telemetry Metrics & Alerting Thresholds

### 2.1 Android Guard Terminal Metrics

| Metric Name | Measurement Source | Target Threshold | Critical Alert Trigger |
| :--- | :--- | :--- | :--- |
| `app_cold_start_ms` | Native OS / React Native startup | $< 1,500\,\text{ms}$ | $> 3,000\,\text{ms}$ |
| `camera_init_latency_ms` | `useCameraPermissions` to preview ready | $< 250\,\text{ms}$ | $> 800\,\text{ms}$ |
| `capture_shutter_delay_ms` | Shutter tap to frame freeze | $< 80\,\text{ms}$ | $> 250\,\text{ms}$ |
| `viewfinder_fps` | Frame rate during active alignment | $\ge 58\,\text{FPS}$ | $< 45\,\text{FPS}$ |
| `offline_buffer_count` | Unsynchronized verification events | $0$ (Normal) | $> 500$ events |

### 2.2 Backend & Computer Vision Metrics

| Metric Name | Measurement Source | Target Threshold | Critical Alert Trigger |
| :--- | :--- | :--- | :--- |
| `http_request_duration_ms` | `add_performance_tracing_headers` | $p95 < 25\,\text{ms}$ | $p95 > 300\,\text{ms}$ |
| `cv_yunet_latency_ms` | FacePipeline detector timer | $p95 < 35\,\text{ms}$ | $p95 > 120\,\text{ms}$ |
| `cv_sface_latency_ms` | FacePipeline feature timer | $p95 < 25\,\text{ms}$ | $p95 > 80\,\text{ms}$ |
| `vector_search_latency_ms` | `ReferenceEmbeddingCache` | $p95 < 0.01\,\text{ms}$ | $p95 > 5.0\,\text{ms}$ |
| `embedding_cache_version` | In-memory version tracker | Incremental | Cache miss on query |
| `db_pool_utilization` | SQLAlchemy engine pool status | $< 50\%$ | $> 85\%$ of pool |

### 2.3 Desktop & Web Telemetry

| Metric Name | Measurement Source | Target Threshold | Critical Alert Trigger |
| :--- | :--- | :--- | :--- |
| `sse_event_delivery_ms` | Event commit to client DOM update | $< 10\,\text{ms}$ | $> 1,000\,\text{ms}$ |
| `sse_connection_status` | `EventSource` onopen/onerror | `OPEN` | Repeated disconnections |
| `web_lcp_seconds` | Core Web Vitals (Largest Contentful Paint) | $< 1.8\,\text{s}$ | $> 2.5\,\text{s}$ |
| `web_cls_score` | Cumulative Layout Shift | $< 0.05$ | $> 0.10$ |

---

## 3. Privacy & Data Redaction Enforcement

To comply with institutional privacy mandates and GDPR/DPDP biometric standards:
1. **Zero Biometrics in Traces:** Logs and tracing spans NEVER serialize raw camera images, facial crops, or 128-D embedding float vectors.
2. **Sanitized IDs:** Only non-reversible institutional identifiers (`STU-2024-0492`, `FAC-0219`) and opaque UUIDv4 event IDs are emitted.
3. **Correlation Headers:** Traces use `X-Request-ID` headers to stitch frontend and backend events without capturing user credentials.
