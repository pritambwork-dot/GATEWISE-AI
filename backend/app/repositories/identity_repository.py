from typing import Optional, List
from sqlalchemy.orm import Session
from ..models.entities import InstitutionalIdentity, IdentityReferencePhoto, FaceEmbedding

class IdentityRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_person_id(self, person_id: str) -> Optional[InstitutionalIdentity]:
        return self.db.query(InstitutionalIdentity).filter(InstitutionalIdentity.person_id == person_id).first()

    def list_identities(self, category: Optional[str] = None, search: Optional[str] = None, limit: int = 100) -> List[InstitutionalIdentity]:
        query = self.db.query(InstitutionalIdentity)
        if category:
            query = query.filter(InstitutionalIdentity.category == category)
        if search:
            query = query.filter(
                (InstitutionalIdentity.full_name.ilike(f"%{search}%")) |
                (InstitutionalIdentity.person_id.ilike(f"%{search}%")) |
                (InstitutionalIdentity.department.ilike(f"%{search}%"))
            )
        return query.limit(limit).all()

    def get_all_embeddings(self) -> List[FaceEmbedding]:
        return self.db.query(FaceEmbedding).all()
