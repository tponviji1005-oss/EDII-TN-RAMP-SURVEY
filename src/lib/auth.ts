const AUTH_KEY = "edii-ramp-auth";
const DATA_KEY = "edii-ramp-surveys";

interface UserSession {
  name: string;
  username: string;
}

export interface SurveyRecord {
  id: string;
  name: string;
  gender: string;
  aadhaar: string;
  social: string;
  mobile: string;
  category: string;
  q1: string;
  q2: string;
  feedback: string;
  createdAt: string;
}

const VALID_USER: UserSession = {
  username: "viji",
  name: "Viji",
};

const VALID_PASSWORD = "Ponviji@1005";

function isBrowser() {
  return typeof window !== "undefined";
}

export function tryLogin(username: string, password: string): boolean {
  if (!isBrowser()) return false;

  if (username === VALID_USER.username && password === VALID_PASSWORD) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(VALID_USER));
    return true;
  }

  return false;
}

export function currentUser(): UserSession | null {
  if (!isBrowser()) return null;

  const data = localStorage.getItem(AUTH_KEY);
  if (!data) return null;

  try {
    return JSON.parse(data) as UserSession;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (!isBrowser()) return;
  localStorage.removeItem(AUTH_KEY);
}

export function saveSurvey(data: Omit<SurveyRecord, "id" | "createdAt">) {
  if (!isBrowser()) return;

  const existing = fetchAllSurveys();
  const newSurvey: SurveyRecord = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  existing.unshift(newSurvey);
  localStorage.setItem(DATA_KEY, JSON.stringify(existing));
}

export function fetchAllSurveys(): SurveyRecord[] {
  if (!isBrowser()) return [];

  const raw = localStorage.getItem(DATA_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as SurveyRecord[];
  } catch {
    return [];
  }
}
