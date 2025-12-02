from pydantic import BaseModel, EmailStr
from typing import Any, Optional, Dict
from decimal import Decimal


class StandardResponse(BaseModel):
    status_code: int
    error: Optional[Any] = None
    data: Optional[Any] = None
    path: Optional[str] = None
    meta: Optional[Dict[str, Any]] = None
    request_id: Optional[str] = None


# --- JWT Схемы ---
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


# --- Схемы пользователя ---
class UserBase(BaseModel):
    username: str
    email: EmailStr
    telegram_id: Optional[int] = None


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    weight: Optional[Decimal] = None
    height: Optional[int] = None
    age: Optional[int] = None
    fitness_goal: Optional[str] = None
    experience_level: Optional[str] = None
    workouts_per_week: Optional[int] = None
    session_duration: Optional[int] = None

    class Config:
        from_attributes = True


class UserProfileUpdate(BaseModel):
    weight: Optional[Decimal] = None
    height: Optional[int] = None
    age: Optional[int] = None
    fitness_goal: Optional[str] = None
    experience_level: Optional[str] = None
    workouts_per_week: Optional[int] = None
    session_duration: Optional[int] = None
