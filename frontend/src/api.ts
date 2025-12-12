const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

function getAccessToken(): string | null {
  try {
    return localStorage.getItem('accessToken');
  } catch {
    return null;
  }
}

async function parseJson<T>(response: Response): Promise<T> {
  const payload = await response.json();
  if (payload && typeof payload === 'object' && 'data' in (payload as any)) {
    return (payload as any).data as T;
  }
  return payload as T;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  age: number | null;
  height: number | null;
  weight: number | null;
  fitness_goal: string | null;
  experience_level: string | null;
  workouts_per_week: number | null;
  session_duration: number | null;
}

export interface UserProfileUpdatePayload {
  age?: number;
  height?: number;
  weight?: number;
  fitness_goal?: string;
  experience_level?: string;
  workouts_per_week?: number;
  session_duration?: number;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

export interface UserCreatePayload {
  username: string;
  email: string;
  password: string;
}

export interface RestrictionRule {
  id: number;
  slug: string;
  name: string;
  description: string | null;
}

export interface MuscleFocus {
  id: number;
  slug: string;
  name: string;
  muscle_group_id: number;
  priority_modifier: number;
}

export interface UserPreferencesResponse {
  restriction_rules: RestrictionRule[];
  muscle_focuses: MuscleFocus[];
}

export async function fetchCurrentUser(): Promise<UserProfile | null> {
  const token = getAccessToken();
  if (!token) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  return await parseJson<UserProfile>(response);
}

export async function login(username: string, password: string): Promise<AuthToken> {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    throw new Error('Failed to login');
  }

  return await parseJson<AuthToken>(response);
}

export async function registerUser(payload: UserCreatePayload): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to register');
  }

  return await parseJson<UserProfile>(response);
}

export async function updateCurrentUserProfile(
  data: UserProfileUpdatePayload,
): Promise<UserProfile | null> {
  const token = getAccessToken();
  if (!token) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update profile');
  }

  return await parseJson<UserProfile>(response);
}

export async function fetchRestrictionRules(): Promise<RestrictionRule[]> {
  const response = await fetch(`${API_BASE_URL}/options/restriction-rules`);
  if (!response.ok) {
    throw new Error('Failed to load restriction rules');
  }
  return await parseJson<RestrictionRule[]>(response);
}

export async function fetchMuscleFocuses(): Promise<MuscleFocus[]> {
  const response = await fetch(`${API_BASE_URL}/options/muscle-focuses`);
  if (!response.ok) {
    throw new Error('Failed to load muscle focuses');
  }
  return await parseJson<MuscleFocus[]>(response);
}

export async function fetchMyPreferences(): Promise<UserPreferencesResponse | null> {
  const token = getAccessToken();
  if (!token) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/preferences/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  return await parseJson<UserPreferencesResponse>(response);
}

export async function updateMyPreferences(params: {
  restriction_rule_ids: number[];
  muscle_focus_ids: number[];
}): Promise<UserPreferencesResponse | null> {
  const token = getAccessToken();
  if (!token) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/preferences/me`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Failed to update preferences');
  }

  return await parseJson<UserPreferencesResponse>(response);
}
