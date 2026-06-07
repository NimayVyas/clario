import { UserRole } from "../routes/routes";
import { isSupabaseConfigured, supabase } from "./supabaseClient";

const tokenKey = "clario.auth.token";
const authSourceKey = "clario.auth.source";
type AuthSource = "local" | "supabase";

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

function isValidRole(role: unknown): role is UserRole {
  return role === "candidate" || role === "employee" || role === "recruiter";
}

function mapSupabaseSession(session: NonNullable<Awaited<ReturnType<NonNullable<typeof supabase>["auth"]["getSession"]>>["data"]["session"]>, fallbackRole: UserRole): AuthSession {
  const metadataRole = session.user.user_metadata?.role || session.user.app_metadata?.role;
  const role = isValidRole(metadataRole) ? metadataRole : fallbackRole;
  return {
    token: session.access_token,
    user: {
      id: session.user.id,
      email: session.user.email || "",
      name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "Clario user",
      role,
      createdAt: session.user.created_at || new Date().toISOString(),
    },
  };
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

function storeAuthSource(source: AuthSource) {
  window.localStorage.setItem(authSourceKey, source);
}

export function clearStoredSession() {
  window.localStorage.removeItem(tokenKey);
  window.localStorage.removeItem(authSourceKey);
}

export async function login(params: { email: string; password: string; role: UserRole }) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: params.email,
      password: params.password,
    });
    if (!error && data.session) {
      const session = mapSupabaseSession(data.session, params.role);
      if (session.user.role !== params.role) {
        await supabase.auth.signOut();
        throw new Error(`This account is registered as ${session.user.role}, not ${params.role}.`);
      }
      storeSession(session);
      storeAuthSource("supabase");
      return session;
    }
    if (params.role === "candidate") throw new Error(error?.message || "Supabase login failed.");
  }

  const payload = await requestAuth("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(params),
  }) as AuthResponse;
  storeSession(payload.session);
  storeAuthSource("local");
  return payload.session;
}

export async function registerCandidate(params: { email: string; password: string; name?: string }) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.signUp({
      email: params.email,
      password: params.password,
      options: {
        data: {
          name: params.name,
          role: "candidate",
        },
      },
    });
    if (error) throw new Error(error.message);
    if (!data.session) {
      throw new Error("Supabase created the account. Confirm the email address, then sign in.");
    }
    const session = mapSupabaseSession(data.session, "candidate");
    storeSession(session);
    storeAuthSource("supabase");
    return session;
  }

  const payload = await requestAuth("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(params),
  }) as AuthResponse;
  storeSession(payload.session);
  storeAuthSource("local");
  return payload.session;
}

export async function fetchCurrentSession() {
  if (isSupabaseConfigured && supabase && window.localStorage.getItem(authSourceKey) === "supabase") {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
      clearStoredSession();
      return undefined;
    }
    const session = mapSupabaseSession(data.session, "candidate");
    storeSession(session);
    storeAuthSource("supabase");
    return session;
  }

  const token = getStoredToken();
  if (!token) return undefined;
  try {
    const payload = await requestAuth("/api/auth/session", {
      headers: { Authorization: `Bearer ${token}` },
    }) as AuthResponse;
    storeSession(payload.session);
    storeAuthSource("local");
    return payload.session;
  } catch (error) {
    clearStoredSession();
    throw error;
  }
}

export async function logout(session?: AuthSession) {
  if (isSupabaseConfigured && supabase && window.localStorage.getItem(authSourceKey) === "supabase") {
    await supabase.auth.signOut().catch(() => undefined);
    clearStoredSession();
    return;
  }

  const token = session?.token || getStoredToken();
  if (token) {
    await requestAuth("/api/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => undefined);
  }
  clearStoredSession();
}
