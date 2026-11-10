from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
from .core.config import settings
from .core.database import engine, Base, SessionLocal
from .core.logging import setup_logging, logger
from .security.passwords import get_password_hash
from .models.entities import (
    User, Gate, GuardGateAssignment, VisitorPass,
    VerificationEvent, EnrollmentRequest
)
from .services.drive_sync_service import run_drive_sync
from .api.v1 import (
    auth, verification, identities, visitors,
    enrollment, activity, gates, assistant, analytics, repository,
    guards, audit, notifications, releases
)

def seed_initial_data():
    db = SessionLocal()
    try:
        # 1. Seed Super Admin
        super_admin = db.query(User).filter(User.employee_id == "SUPER-001").first()
        if not super_admin:
            super_admin = User(
                id="user-super-001",
                email="admin.super@iimsambalpur.ac.in",
                password_hash=get_password_hash("super123"),
                full_name="Director S. K. Mahapatra",
                role="SUPER_ADMIN",
                employee_id="SUPER-001",
                account_status="ACTIVE",
                mfa_enabled=True
            )
            db.add(super_admin)
            db.commit()

        # 2. Seed Admin
        admin = db.query(User).filter(User.employee_id == "ADM-001").first()
        if not admin:
            admin = User(
                id="user-admin-001",
                email="admin.security@iimsambalpur.ac.in",
                password_hash=get_password_hash("admin123"),
                full_name="Dr. Rajesh Iyer",
                role="ADMIN",
                employee_id="ADM-001",
                avatar_url="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
                account_status="ACTIVE",
                mfa_enabled=True
            )
            db.add(admin)
            db.commit()
        else:
            if not admin.password_hash.startswith("$argon2id$"):
                admin.password_hash = get_password_hash("admin123")
                db.commit()

        # 3. Seed Security Guard
        guard = db.query(User).filter(User.employee_id == "SEC-G014").first()
        if not guard:
            guard = User(
                id="user-guard-014",
                email="vikram.singh@security.iimsambalpur.ac.in",
                password_hash=get_password_hash("guard123"),
                full_name="Officer Ramesh Verma",
                role="SECURITY_GUARD",
                employee_id="SEC-G014",
                avatar_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
                account_status="ACTIVE",
                mfa_enabled=False
            )
            db.add(guard)
            db.commit()
            db.refresh(guard)
        else:
            if not guard.password_hash.startswith("$argon2id$"):
                guard.password_hash = get_password_hash("guard123")
                guard.full_name = "Officer Ramesh Verma"
                db.commit()

        # 4. Seed Gates
        main_gate = db.query(Gate).filter(Gate.gate_code == "GATE-MAIN-02").first()
        if not main_gate:
            main_gate = db.query(Gate).filter(Gate.id == "gate-main-02").first()
        if not main_gate:
            main_gate = Gate(
                id="gate-main-02",
                gate_name="Main Campus Gate · Post 02",
                gate_code="GATE-MAIN-02",
                location="Ring Road North Entrance",
                operating_hours="24/7 Continuous",
                status="ACTIVE"
            )
            db.add(main_gate)
            db.commit()
            db.refresh(main_gate)

        gate_acad = db.query(Gate).filter(Gate.gate_code == "GATE-ACAD-01").first()
        if not gate_acad:
            gate_acad = Gate(
                id="gate-acad-01",
                gate_name="Academic Quad Gate · Post 01",
                gate_code="GATE-ACAD-01",
                location="Management Block South",
                operating_hours="06:00 - 23:00",
                status="ACTIVE"
            )
            db.add(gate_acad)
            db.commit()

        # 5. Mandatory Guard Gate Assignment: SEC-G014 to Post 02
        assignment = db.query(GuardGateAssignment).filter(
            GuardGateAssignment.guard_id == guard.id,
            GuardGateAssignment.status == "ACTIVE"
        ).first()
        if not assignment:
            assignment = GuardGateAssignment(
                id="assign-g014-main02",
                guard_id=guard.id,
                gate_id=main_gate.id,
                shift_name="Shift A (Morning 06:00 - 14:00)",
                status="ACTIVE",
                assigned_by=admin.id
            )
            db.add(assignment)
            db.commit()

        # 6. Synchronize Google Drive Identities & Reference Photos
        run_drive_sync(db, admin_id=admin.id)

        # 7. Seed Pre-approved Visitor Passes
        existing_visitor = db.query(VisitorPass).first()
        if not existing_visitor:
            v1 = VisitorPass(
                pass_code="PASS-8921",
                visitor_name="Sanjay Khurana",
                phone="+91 98200 12345",
                contact_details="+91 98200 12345",
                id_type="Aadhaar Card",
                id_number="XXXX-XXXX-4912",
                host_name="Prof. Devendra Kumar",
                host_department="Operations & Supply Chain",
                visit_purpose="Guest Lecture & Industry Advisory Board Meeting",
                purpose="Guest Lecture & Industry Advisory Board Meeting",
                valid_date=datetime.now(timezone.utc).strftime("%Y-%m-%d"),
                valid_until_time="18:00",
                approval_status="EXPECTED",
                status="EXPECTED",
                gate_id=main_gate.id,
                created_by=admin.id
            )
            db.add(v1)
            db.commit()

    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging()
    logger.info("Initializing GATEWISE AI backend services and database schema...")
    Base.metadata.create_all(bind=engine)
    seed_initial_data()
    logger.info("GATEWISE AI backend operational.")
    yield
    logger.info("Shutting down GATEWISE AI backend.")

app = FastAPI(
    title="GATEWISE AI — Core Backend",
    version=settings.VERSION,
    description="Institutional Gate Verification & Visitor Identification API for IIM Sambalpur.",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Cross-Origin Resource Sharing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Register API v1 Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(verification.router, prefix=settings.API_V1_STR)
app.include_router(identities.router, prefix=settings.API_V1_STR)
app.include_router(visitors.router, prefix=settings.API_V1_STR)
app.include_router(enrollment.router, prefix=settings.API_V1_STR)
app.include_router(activity.router, prefix=settings.API_V1_STR)
app.include_router(gates.router, prefix=settings.API_V1_STR)
app.include_router(repository.router, prefix=settings.API_V1_STR)
app.include_router(assistant.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(guards.router, prefix=settings.API_V1_STR)
app.include_router(audit.router, prefix=settings.API_V1_STR)
app.include_router(notifications.router, prefix=settings.API_V1_STR)
app.include_router(releases.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "service": "GATEWISE AI Institutional Core",
        "version": settings.VERSION,
        "institution": "IIM Sambalpur",
        "status": "OPERATIONAL",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {
        "status": "HEALTHY",
        "service": "GATEWISE AI",
        "version": settings.VERSION,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
