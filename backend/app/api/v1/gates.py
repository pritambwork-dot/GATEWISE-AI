from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ...core.database import get_db
from ...models.entities import Gate
from ...schemas.auth import AssignedGateSchema

router = APIRouter(prefix="/gates", tags=["Campus Gates"])

@router.get("/")
def list_gates(db: Session = Depends(get_db)):
    gates = db.query(Gate).all()
    return gates

@router.get("/{gate_id}")
def get_gate(gate_id: str, db: Session = Depends(get_db)):
    gate = db.query(Gate).filter(Gate.id == gate_id).first()
    if not gate:
        raise HTTPException(status_code=404, detail="Gate not found")
    return gate
