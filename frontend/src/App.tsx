import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import {
  fetchCurrentUser,
  updateCurrentUserProfile,
  fetchRestrictionRules,
  fetchMuscleFocuses,
  fetchMyPreferences,
  updateMyPreferences,
  login,
  registerUser,
  type UserProfile,
  type UserProfileUpdatePayload,
  type RestrictionRule,
  type MuscleFocus,
} from './api';

// Компоненты-заглушки
const Home = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900">
    <h2 className="text-4xl font-extrabold mb-4">Добро пожаловать в pro100gym!</h2>
    <p className="text-lg text-gray-600 mb-6">Ваш персональный тренер в кармане.</p>
    <Link
      to="/onboarding"
      className="px-6 py-3 rounded-md bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition"
    >
      Начать онбординг
    </Link>
  </div>
);

const About = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900">
    <h2 className="text-4xl font-extrabold mb-4">О нас</h2>
    <p className="text-lg text-gray-600">Мы помогаем вам достигать фитнес-целей.</p>
  </div>
);

const Dashboard = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900">
    <h2 className="text-4xl font-extrabold mb-4">Панель управления</h2>
    <p className="text-lg text-gray-600 mb-4">Здесь будет ваша статистика и тренировки.</p>
    <button
      type="button"
      onClick={() => {
        try {
          localStorage.removeItem('accessToken');
        } catch {
          // ignore
        }
        window.location.href = '/login';
      }}
      className="px-4 py-2 rounded-md bg-gray-800 text-white text-sm font-semibold hover:bg-gray-900"
    >
      Выйти
    </button>
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      const token = await login(username, password);
      localStorage.setItem('accessToken', token.access_token);
      navigate('/onboarding');
    } catch {
      setError('Не удалось выполнить вход. Проверьте логин и пароль.');
    } finally {
      setIsSubmitting(false);
    }
  };

	  return (
	    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900 px-4">
	      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8">
	        <h2 className="text-2xl font-extrabold mb-6 text-center">Вход</h2>
	        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="login-username">
              Логин
            </label>
            <input
              id="login-username"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="login-password">
              Пароль
            </label>
            <input
              id="login-password"
              type="password"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
	            />
	          </div>
	          {error && <p className="text-sm text-red-600">{error}</p>}
	          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-4 py-2 rounded-md text-sm font-semibold ${
              isSubmitting ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white'
            }`}
	            >
	            {isSubmitting ? 'Входим...' : 'Войти'}
	          </button>
	        </form>
	        <p className="mt-4 text-sm text-gray-600 text-center">
	          Нет аккаунта?{' '}
	          <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
	            Зарегистрироваться
	          </Link>
	        </p>
	      </div>
	    </div>
	  );
	};

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Пароли не совпадают.');
      return;
    }
    try {
      setIsSubmitting(true);
      setError(null);
      await registerUser({ username, email, password });
      navigate('/login');
    } catch {
      setError('Не удалось зарегистрироваться. Попробуйте другие данные.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8">
        <h2 className="text-2xl font-extrabold mb-6 text-center">Регистрация</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="register-username">
              Логин
            </label>
            <input
              id="register-username"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="register-email">
              Email
            </label>
            <input
              id="register-email"
              type="email"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="register-password">
              Пароль
            </label>
            <input
              id="register-password"
              type="password"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="register-confirm">
              Подтверждение пароля
            </label>
            <input
              id="register-confirm"
              type="password"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-4 py-2 rounded-md text-sm font-semibold ${
              isSubmitting ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white'
            }`}
          >
            {isSubmitting ? 'Отправляем...' : 'Зарегистрироваться'}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600 text-center">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
};

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [workoutsPerWeek, setWorkoutsPerWeek] = useState('');
  const [sessionDuration, setSessionDuration] = useState('');

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [restrictionRules, setRestrictionRules] = useState<RestrictionRule[]>([]);
  const [muscleFocuses, setMuscleFocuses] = useState<MuscleFocus[]>([]);
  const [selectedRestrictionIds, setSelectedRestrictionIds] = useState<number[]>([]);
  const [selectedMuscleFocusIds, setSelectedMuscleFocusIds] = useState<number[]>([]);
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true);
  const [preferencesError, setPreferencesError] = useState<string | null>(null);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);

  const [hasToken] = useState<boolean>(() => {
    try {
      return Boolean(localStorage.getItem('accessToken'));
    } catch {
      return false;
    }
  });

  const handleNext = async () => {
    if (step === 1) {
      const payload: UserProfileUpdatePayload = {};

      if (age) payload.age = Number(age);
      if (height) payload.height = Number(height);
      if (weight) payload.weight = Number(weight);
      if (fitnessGoal) payload.fitness_goal = fitnessGoal;
      if (experienceLevel) payload.experience_level = experienceLevel;
      if (workoutsPerWeek) payload.workouts_per_week = Number(workoutsPerWeek);
      if (sessionDuration) payload.session_duration = Number(sessionDuration);

      try {
        setIsSavingProfile(true);
        setSaveError(null);
        if (Object.keys(payload).length > 0) {
          await updateCurrentUserProfile(payload);
        }
        setStep(2);
      } catch {
        setSaveError('Не удалось сохранить профиль. Попробуйте ещё раз.');
      } finally {
        setIsSavingProfile(false);
      }
      return;
    }

    if (step === 2) {
      try {
        setIsSavingPreferences(true);
        setPreferencesError(null);
        await updateMyPreferences({
          restriction_rule_ids: selectedRestrictionIds,
          muscle_focus_ids: selectedMuscleFocusIds,
        });
        navigate('/dashboard');
      } catch {
        setPreferencesError('Не удалось сохранить предпочтения. Попробуйте ещё раз.');
      } finally {
        setIsSavingPreferences(false);
      }
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  useEffect(() => {
    let isMounted = true;

    fetchCurrentUser()
      .then((user: UserProfile | null) => {
        if (!isMounted || !user) return;

        if (user.age != null) setAge(String(user.age));
        if (user.height != null) setHeight(String(user.height));
        if (user.weight != null) setWeight(String(user.weight));
        if (user.fitness_goal != null) setFitnessGoal(user.fitness_goal);
        if (user.experience_level != null) setExperienceLevel(user.experience_level);
        if (user.workouts_per_week != null) setWorkoutsPerWeek(String(user.workouts_per_week));
        if (user.session_duration != null) setSessionDuration(String(user.session_duration));
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingProfile(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadPreferencesData() {
      try {
        setPreferencesError(null);
        const [rules, focuses, prefs] = await Promise.all([
          fetchRestrictionRules(),
          fetchMuscleFocuses(),
          fetchMyPreferences(),
        ]);

        if (!isMounted) return;

        setRestrictionRules(rules);
        setMuscleFocuses(focuses);

        if (prefs) {
          setSelectedRestrictionIds(prefs.restriction_rules.map((r) => r.id));
          setSelectedMuscleFocusIds(prefs.muscle_focuses.map((m) => m.id));
        }
      } catch {
        if (isMounted) {
          setPreferencesError('Не удалось загрузить предпочтения. Попробуйте обновить страницу.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingPreferences(false);
        }
      }
    }

    loadPreferencesData();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleRestriction = (id: number) => {
    setSelectedRestrictionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleMuscleFocus = (id: number) => {
    setSelectedMuscleFocusIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 text-gray-900 py-10 px-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm p-8">
        <h2 className="text-3xl font-extrabold mb-6 text-center">Онбординг</h2>

        {!hasToken && (
          <div className="space-y-4">
            <p className="text-gray-700">
              Для прохождения онбординга необходимо сначала выполнить вход в систему.
            </p>
            <Link
              to="/login"
              className="inline-flex px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
            >
              Перейти к форме входа
            </Link>
          </div>
        )}

        {hasToken && (
          <>
            <div className="flex items-center justify-center mb-8 space-x-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step === 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  1
                </div>
                <span className="text-sm font-medium text-gray-700">Профиль</span>
              </div>
              <div className="w-10 h-px bg-gray-300" />
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step === 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  2
                </div>
                <span className="text-sm font-medium text-gray-700">Предпочтения</span>
              </div>
            </div>

            <div className="mb-8">
              {step === 1 && (
                <form className="space-y-4">
                  <h3 className="text-xl font-semibold mb-4">Шаг 1. Данные профиля</h3>

                  {isLoadingProfile && (
                    <p className="text-sm text-gray-500">Загружаем ваши данные профиля...</p>
                  )}

                  {saveError && (
                    <p className="text-sm text-red-600">
                      {saveError}
                    </p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="age">
                        Возраст
                      </label>
                      <input
                        id="age"
                        type="number"
                        min={0}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="height">
                        Рост (см)
                      </label>
                      <input
                        id="height"
                        type="number"
                        min={0}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="weight">
                        Вес (кг)
                      </label>
                      <input
                        id="weight"
                        type="number"
                        min={0}
                        step="0.1"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fitnessGoal">
                        Цель тренировки
                      </label>
                      <select
                        id="fitnessGoal"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={fitnessGoal}
                        onChange={(e) => setFitnessGoal(e.target.value)}
                      >
                        <option value="">Выберите цель</option>
                        <option value="lose_weight">Похудение</option>
                        <option value="gain_muscle">Набор мышечной массы</option>
                        <option value="keep_fit">Поддержание формы</option>
                        <option value="strength">Увеличение силы</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="experienceLevel">
                        Опыт тренировок
                      </label>
                      <select
                        id="experienceLevel"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={experienceLevel}
                        onChange={(e) => setExperienceLevel(e.target.value)}
                      >
                        <option value="">Выберите уровень</option>
                        <option value="beginner">Новичок</option>
                        <option value="intermediate">Средний</option>
                        <option value="advanced">Продвинутый</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="workoutsPerWeek">
                        Тренировок в неделю
                      </label>
                      <input
                        id="workoutsPerWeek"
                        type="number"
                        min={1}
                        max={7}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={workoutsPerWeek}
                        onChange={(e) => setWorkoutsPerWeek(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sessionDuration">
                        Длительность тренировки (мин)
                      </label>
                      <input
                        id="sessionDuration"
                        type="number"
                        min={10}
                        max={180}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={sessionDuration}
                        onChange={(e) => setSessionDuration(e.target.value)}
                      />
                    </div>
                  </div>
                </form>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Шаг 2. Предпочтения и ограничения</h3>

                  {isLoadingPreferences && (
                    <p className="text-sm text-gray-500">Загружаем ваши предпочтения...</p>
                  )}

                  {preferencesError && (
                    <p className="text-sm text-red-600">
                      {preferencesError}
                    </p>
                  )}

                  {!isLoadingPreferences && (
                    <>
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Ограничения</h4>
                        {restrictionRules.length === 0 ? (
                          <p className="text-sm text-gray-500">Список ограничений пуст.</p>
                        ) : (
                          <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
                            {restrictionRules.map((rule) => (
                              <label key={rule.id} className="flex items-start space-x-2 text-sm">
                                <input
                                  type="checkbox"
                                  className="mt-1"
                                  checked={selectedRestrictionIds.includes(rule.id)}
                                  onChange={() => toggleRestriction(rule.id)}
                                />
                                <span>
                                  <span className="font-medium">{rule.name}</span>
                                  {rule.description && (
                                    <span className="block text-gray-500">{rule.description}</span>
                                  )}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold mb-2">Акценты на группы мышц</h4>
                        {muscleFocuses.length === 0 ? (
                          <p className="text-sm text-gray-500">Список акцентов пуст.</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {muscleFocuses.map((focus) => {
                              const selected = selectedMuscleFocusIds.includes(focus.id);
                              return (
                                <button
                                  key={focus.id}
                                  type="button"
                                  onClick={() => toggleMuscleFocus(focus.id)}
                                  className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                    selected
                                      ? 'bg-indigo-600 text-white border-indigo-600'
                                      : 'bg-white text-gray-700 border-gray-300'
                                  }`}
                                >
                                  {focus.name}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={goBack}
                disabled={step === 1}
                className={`px-4 py-2 rounded-md border text-sm font-medium ${
                  step === 1
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Назад
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={isSavingProfile || isSavingPreferences}
                className={`px-4 py-2 rounded-md text-sm font-semibold ${
                  isSavingProfile || isSavingPreferences
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isSavingProfile || isSavingPreferences ? 'Сохраняем...' : 'Далее'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

function App() {
  const hasToken = (() => {
    try {
      return Boolean(localStorage.getItem('accessToken'));
    } catch {
      return false;
    }
  })();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        {/* Навигационная панель */}
        <nav className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link to="/" className="text-2xl font-bold text-indigo-600">pro100gym</Link>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {!hasToken && (
                  <>
                    <Link to="/register" className="text-gray-600 hover:text-indigo-600 font-medium">Регистрация</Link>
                    <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium">Вход</Link>
                  </>
                )}
                {hasToken && (
                  <>
                    <Link to="/onboarding" className="text-gray-600 hover:text-indigo-600 font-medium">Онбординг</Link>
                    <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium">Панель управления</Link>
                  </>
                )}
                <Link to="/about" className="text-gray-600 hover:text-indigo-600 font-medium">О нас</Link>
              </div>
            </div>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/onboarding" element={<Onboarding />} />
          </Routes>
        </main>

        {/* Футер */}
        <footer className="bg-gray-800 text-gray-300 py-10 px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-7xl mx-auto">
            <p className="mb-4">&copy; {new Date().getFullYear()} pro100gym. Все права защищены.</p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">Приватность</a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">Условия</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
