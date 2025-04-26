from fastapi import APIRouter, Header, Depends, HTTPException

from schemas.rating import RatingPromptSchema, SchemaResponse, parse_rating_prompt_schema
from tools.ai_tool import DamageEvaluation

router = APIRouter()


@router.post("/response", description="Get response from AI service", response_model=SchemaResponse)
async def ai_evaluate(prompt: RatingPromptSchema = Depends(parse_rating_prompt_schema)):
    obj = DamageEvaluation()
    response = obj.run(prompt)
    return response