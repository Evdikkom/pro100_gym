from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi_cache.decorator import cache

from app.db import get_session
from app.schemas.preferences import RestrictionRule, MuscleFocus
from app.crud import options as crud_options

router = APIRouter(prefix="/options", tags=["Options"])


@router.get("/restriction-rules", response_model=List[RestrictionRule], summary="Получить список всех правил ограничений")
@cache(expire=3600)  # Кэш на 1 час
async def get_restriction_rules(db: AsyncSession = Depends(get_session)):
    """
    Возвращает полный список доступных правил ограничений, которые могут быть применены к тренировочному плану.
    """
    rules_from_db = await crud_options.get_all_restriction_rules(db)
    # Вручную преобразуем модели SQLAlchemy в схемы Pydantic перед возвратом
    return [RestrictionRule.model_validate(rule) for rule in rules_from_db]


@router.get("/muscle-focuses", response_model=List[MuscleFocus], summary="Получить список всех акцентов на мышечные группы")
@cache(expire=3600)  # Кэш на 1 час
async def get_muscle_focuses(db: AsyncSession = Depends(get_session)):
    """
    Возвращает полный список доступных вариантов акцентов на мышечные группы,
    которые пользователь может выбрать для своего тренировочного плана.
    """
    focuses_from_db = await crud_options.get_all_muscle_focuses(db)
    # Вручную преобразуем модели SQLAlchemy в схемы Pydantic перед возвратом
    return [MuscleFocus.model_validate(focus) for focus in focuses_from_db]
