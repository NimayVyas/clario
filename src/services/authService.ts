import { UserRole } from "../routes/routes";

const tokenKey = "clario.auth.token";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthSession {
  token: string;
  user: AuthenticatedUser;
}

interface AuthResponse {
  session: AuthSession;
}

async function requestAuth(path: string, options: RequestInit = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Authentication failed.");
  return payload;
}

export function getStoredToken() {
  return window.localStorage.getItem(tokenKey);
}

export function storeSession(session: AuthSession) {
  window.localStorage.setItem(tokenKey, session.token);
}

export function clearStoredSession() {
  window.localStorage.removeItem(tokenKey);
}

export async function login(params: { email: string; password: string; role: UserRole }) {
  const payload = await requestAuth("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(params),
  }) as AuthResponse;
  storeSession(payload.session);
  return payload.session;
}

export async function registerCandidate(params: { email: string; password: string; name?: string }) {
  const payload = await requestAuth("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(params),
  }) as AuthResponse;
  storeSession(payload.session);
  return payload.session;
}

export async function fetchCurrentSession() {
  const token = getStoredToken();
  if (!token) return undefined;
  try {
    const payload = await requestAuth("/api/auth/session", {
      headers: { Authorization: `Bearer ${token}` },
    }) as AuthResponse;
    storeSession(payload.session);
    return payload.session;
  } catch (error) {
    clearStoredSession();
    throw error;
  }
}

export async function logout(session?: AuthSession) {
  const token = session?.token || getStoredToken();
  if (token) {
    await requestAuth("/api/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => undefined);
  }
  clearStoredSession();
}
