from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from ...services.gemini_service import query_operational_assistant

router = APIRouter(prefix="/assistant", tags=["AI Operational Assistant"])

class AssistantQueryRequest(BaseModel):
    query: str
    context: Optional[str] = None

class AssistantQueryResponse(BaseModel):
    query: str
    response: str

@router.post("/query", response_model=AssistantQueryResponse)
def ask_assistant(payload: AssistantQueryRequest):
    answer = query_operational_assistant(payload.query, payload.context)
    return AssistantQueryResponse(
        query=payload.query,
        response=answer
    )
