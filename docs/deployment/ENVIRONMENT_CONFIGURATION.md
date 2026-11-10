# GATEWISE AI — Environment Configuration Specification
**Classification:** DevOps & Security Operations Manual  
**Applies To:** Development, Staging, and Production Deployments

---

## 1. Environment Variable Taxonomy

Variables are strictly categorized into **Confidential Backend Secrets** and **Public Frontend Variables**. Under no circumstances should backend secrets be prefixed with `NEXT_PUBLIC_` or `EXPO_PUBLIC_`.

```
CONFIDENTIAL SECRETS (Server-Only)       PUBLIC ENDPOINTS (Client-Safe)
├─ SECRET_KEY                            ├─ NEXT_PUBLIC_API_URL
├─ POSTGRES_PASSWORD                     └─ EXPO_PUBLIC_API_URL
├─ GOOGLE_CLIENT_SECRET
└─ GEMINI_API_KEY
```

---

## 2. Configuration Matrix by Environment

| Variable Name | Required | Development | Staging | Production | Description |
|---|---|---|---|---|---|
| `APP_ENV` | Yes | `development` | `staging` | `production` | Active runtime environment. |
| `LOG_LEVEL` | No | `DEBUG` | `INFO` | `WARNING` | Python standard logging verbosity. |
| `DATABASE_URL` | Yes | `sqlite:///backend/gatewise.db` | `postgresql://...` | `postgresql://...` | Database connection string. Must use pgvector on staging/prod. |
| `DATABASE_POOL_SIZE` | No | `5` | `10` | `15` | SQLAlchemy connection pool size. |
| `SECRET_KEY` | Yes | Dev default | 64-char Hex | 64-char Hex | Master cryptographic secret for JWT and HMAC-SHA256 signing. |
| `ACCESS_TOKEN_EXPIRE_MINUTES`| No | `480` (8 hrs) | `480` | `480` | Duration of guard/admin shift tokens. |
| `CORS_ORIGINS` | Yes | `*` | Staging domains | Institutional domains | Comma-delimited list of allowed browser origins. |
| `GOOGLE_CLIENT_ID` | Conditional | Empty or OAuth ID | OAuth ID | Institutional Service Acct | Google Workspace OAuth client identifier. |
| `GOOGLE_CLIENT_SECRET` | Conditional | Empty or Secret | OAuth Secret | Institutional Secret | Confidential Google Workspace secret. |
| `GOOGLE_DRIVE_FOLDER_ID` | Conditional | Seed directory | Staging folder | Approved Master Folder | Drive folder containing reference identity portraits. |
| `GATEWISE_ASSISTANT_ENABLED` | No | `true` | `true` | Institutional choice | Enable or disable the Gemini AI policy assistant. |
| `GEMINI_API_KEY` | Conditional | Optional | Developer key | Enterprise key | Google Gen AI Developer API key. |
| `GEMINI_MODEL` | No | `gemini-1.5-flash` | `gemini-1.5-flash` | `gemini-1.5-flash` | LLM model identifier. |
| `GEMINI_MAX_REQUESTS_PER_MINUTE` | No | `30` | `30` | `30` | Sliding-window per-user quota limit. |
| `GEMINI_DAILY_REQUEST_LIMIT` | No | `1500` | `1500` | `1500` | Absolute daily budget cap. |
| `NEXT_PUBLIC_API_URL` | Yes | `http://localhost:8000/api/v1` | `https://staging-api...` | `https://api.gatewiseai...` | Browser API base endpoint. |
| `EXPO_PUBLIC_API_URL` | Yes | `http://10.0.2.2:8000/api/v1` | `https://staging-api...` | `https://api.gatewiseai...` | Android Guard App backend endpoint. |

---

## 3. Cryptographic Secret Generation Procedures

All staging and production secrets must be generated using cryptographically secure random entropy:

```bash
# Generate 256-bit cryptographic secrets (SECRET_KEY, POSTGRES_PASSWORD)
openssl rand -hex 32

# Verify generated string length (must be 64 characters)
openssl rand -hex 32 | tr -d '\n' | wc -c
```

---

## 4. Secret Storage & Operational Hygiene

1. **Zero Secret Check-in:** `.env` and `.env.*.local` files are ignored in `.gitignore`.
2. **Automated Pre-Commit Scanning:** The `scripts/security_secret_scan.py` script automatically verifies that no live keys or connection strings are committed.
3. **Key Rotation Protocol:** In the event of an operational compromise:
   - Generate a new `SECRET_KEY`.
   - Update the container environment or secret vault.
   - Restart backend workers. All existing JWT sessions will be invalidated immediately, requiring users to re-authenticate with their passwords.
