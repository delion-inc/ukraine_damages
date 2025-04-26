from typing import Optional, List, Union

from pydantic import BaseModel, Field


class RatingPromptSchema(BaseModel):
    region: str = Field(..., description="Region of Ukraine")
    type_of_infrastructure: str = Field(..., description="Type of infrastructure (e.g., residential building, school, hospital, etc.)")
    date_of_event: str = Field(..., description="Date of damage (YYYY-MM-DD)")
    extent_of_damage: str = Field(..., description="Extent of damage (e.g., minor, moderate, severe)")
    description: Optional[str] = Field(default=None, description="Description of the damage")
    source_link: Optional[str] = Field(default=None, description="Link to the source of information")


class SchemaResponse(BaseModel):
    money_evaluation: int = 0
    can_be_repaired: bool = False