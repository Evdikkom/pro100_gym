# fsm_onboarding.py
from aiogram import Router, F, types
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.fsm.state import StatesGroup, State
from aiogram.fsm.context import FSMContext
from training_manager import user_data  # словарь для хранения активности
from datetime import datetime, timedelta

router = Router()

# === FSM онбординга ===
class Onboarding(StatesGroup):
    name = State()
    age = State()
    height = State()
    weight = State()
    goal = State()

# Клавиатура выбора цели
goal_keyboard = InlineKeyboardMarkup(
    inline_keyboard=[
        [InlineKeyboardButton(text="🔥 Похудеть", callback_data="goal:lose")],
        [InlineKeyboardButton(text="💪 Набрать массу", callback_data="goal:gain")],
        [InlineKeyboardButton(text="⚖️ Поддержание формы", callback_data="goal:maintain")],
    ]
)

# Клавиатура выбора дня начала тренировки (дни недели)
week_days = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"]
training_day_kb = InlineKeyboardMarkup(
    inline_keyboard=[
        [InlineKeyboardButton(text=day, callback_data=f"training_day:{i}") for i, day in enumerate(week_days[:3])],
        [InlineKeyboardButton(text=day, callback_data=f"training_day:{i}") for i, day in enumerate(week_days[3:6], 3)],
        [InlineKeyboardButton(text=week_days[6], callback_data=f"training_day:6")]
    ]
)

# === ОБРАБОТКА ===
@router.message(F.text == "🧩 Онбординг")
async def onboarding_start(message: Message, state: FSMContext):
    user_data[message.from_user.id] = {"last_active": datetime.now(), "training_day": None}
    await state.set_state(Onboarding.name)
    await message.answer("Как вас зовут?")

@router.message(Onboarding.name)
async def onboarding_name(message: Message, state: FSMContext):
    user_data[message.from_user.id]["last_active"] = datetime.now()
    await state.update_data(name=message.text)
    await state.set_state(Onboarding.age)
    await message.answer("Сколько вам лет?")

@router.message(Onboarding.age)
async def onboarding_age(message: Message, state: FSMContext):
    user_data[message.from_user.id]["last_active"] = datetime.now()
    if not message.text.isdigit():
        return await message.answer("Введите число!")
    await state.update_data(age=int(message.text))
    await state.set_state(Onboarding.height)
    await message.answer("Введите ваш рост (см):")

@router.message(Onboarding.height)
async def onboarding_height(message: Message, state: FSMContext):
    user_data[message.from_user.id]["last_active"] = datetime.now()
    if not message.text.isdigit():
        return await message.answer("Введите число!")
    await state.update_data(height=int(message.text))
    await state.set_state(Onboarding.weight)
    await message.answer("Введите ваш вес (кг):")

@router.message(Onboarding.weight)
async def onboarding_weight(message: Message, state: FSMContext):
    user_data[message.from_user.id]["last_active"] = datetime.now()
    if not message.text.isdigit():
        return await message.answer("Введите число!")
    await state.update_data(weight=int(message.text))
    await message.answer("🎯 Выберите вашу цель:", reply_markup=goal_keyboard)

# === CALLBACK ДЛЯ ЦЕЛИ ===
@router.callback_query(F.data.startswith("goal:"))
async def goal_selected(callback: types.CallbackQuery, state: FSMContext):
    user_id = callback.from_user.id
    user_data[user_id]["last_active"] = datetime.now()
    goal = callback.data.split(":")[1]
    await state.update_data(goal=goal)

    # Снимаем состояние онбординга
    await state.set_state(None)
    # Предлагаем выбрать день начала тренировки
    await callback.message.answer(
        "Отлично! Теперь выберите, когда начнете тренироваться:",
        reply_markup=training_day_kb
    )
    await callback.answer()

# === CALLBACK ДЛЯ ВЫБОРА ДНЯ НАЧАЛА ТРЕНИРОВКИ ===
@router.callback_query(F.data.startswith("training_day:"))
async def training_day_selected(callback: types.CallbackQuery):
    user_id = callback.from_user.id
    day_index = int(callback.data.split(":")[1])
    today_weekday = datetime.now().weekday()  # 0 = Понедельник

    # Вычисляем дату следующей выбранной тренировки
    if day_index >= today_weekday:
        days_until = day_index - today_weekday
    else:
        days_until = 7 - (today_weekday - day_index)
    training_date = datetime.now() + timedelta(days=days_until)

    user_data[user_id]["training_day"] = training_date
    user_data[user_id]["last_active"] = datetime.now()

    await callback.message.answer(
        f"Отлично! Тренировка запланирована на {week_days[day_index]}, "
        f"{training_date.strftime('%d.%m.%Y')} 💪"
    )
    await callback.answer()
