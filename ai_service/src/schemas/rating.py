import base64
from typing import Optional

from pydantic import BaseModel, Field
from fastapi import File, Form, UploadFile


class RatingPromptSchema(BaseModel):
    photo_before: str = Field(None, description="Base64 encoded image of the object before damage")
    photo_after: str = Field(None, description="Base64 encoded image of the object after damage")
    object_type: str = Field(..., description="Type of the object (e.g., Residential, Commercial, etc.)")
    description: Optional[str] = Field(None, description="Description of the object and its damage")
    area_size_sqm: Optional[float] = Field(None, description="Area size of the object in square meters")
    floors: Optional[int] = Field(None, description="Number of floors in the object")
    construction_year: Optional[int] = Field(None, description="Year the object was constructed")
    address: Optional[str] = Field(None, description="Address of the object")

class SchemaResponse(BaseModel):
    money_evaluation: int = 0
    description: str


def parse_rating_prompt_schema(
    photo_before: UploadFile = File(...),
    photo_after: UploadFile = File(...),
    object_type: str = Form(...),
    description: Optional[str] = Form(None),
    area_size_sqm: Optional[float] = Form(None),
    floors: Optional[int] = Form(None),
    construction_year: Optional[int] = Form(None),
    address: Optional[str] = Form(None),
) -> RatingPromptSchema:
    photo_before_base64 = base64.b64encode(photo_before.file.read()).decode("utf-8")
    photo_after_base64 = base64.b64encode(photo_after.file.read()).decode("utf-8")

    return RatingPromptSchema(
        photo_before=photo_before_base64,
        photo_after=photo_after_base64,
        object_type=object_type,
        description=description,
        area_size_sqm=area_size_sqm,
        floors=floors,
        construction_year=construction_year,
        address=address,
    )
