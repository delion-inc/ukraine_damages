from typing import Any

from fastapi import APIRouter, Header, Depends, HTTPException

from schemas.rating import RatingPromptSchema, SchemaResponse
from tools.ai_response import get_ai_response

router = APIRouter()

@router.post("/response", description="Get response from AI service", response_model=SchemaResponse)
async def ai_evaluate(prompt: RatingPromptSchema):
    return await get_ai_response(prompt)