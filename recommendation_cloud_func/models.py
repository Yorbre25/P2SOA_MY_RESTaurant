from pydantic import BaseModel,Field
from typing import Optional
class Meal(BaseModel):
    main_dish: Optional[str] = Field(default=None, example="Pasta")
    drink: Optional[str] = Field(default=None, example="")
    dessert: Optional[str] = Field(default=None, example="")
