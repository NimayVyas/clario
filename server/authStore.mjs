import crypto from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "data");
const statePath = path.join(dataDir, "auth-state.json");
let mutationQueue = Promise.resolve();

const seedUsers = [
  {
    id: "usr-employee-ops",
    email: "ops@clario.com",
    name: "Clario Ops",
    role: "employee",
    passwordHash: hashPassword("clario123"),
    createdAt: "2026-06-07T00:00:00.000Z",
  },
  {
    id: "usr-recruiter-demo",
    email: "recruiter@example.com",
    name: "Demo Recruiter",
    role: "recruiter",
    passwordHash: hashPassword("clario123"),
    createdAt: "2026-06-07T00:00:00.000Z",
  },
];

function hashPassword(password) {
  return crypto.createHash("sha256").update(`clario-demo:${password}`).digest("hex");
}

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
  };
}

async function readState() {
  try {
    const raw = await readFile(statePath, "utf8");
    const parsed = JSON.parse(raw);
    const seededEmails = new Set((parsed.users || []).map((user) => user.email));
    const missingSeeds = seedUsers.filter((user) => !seededEmails.has(user.email));
    if (!missingSeeds.length) return parsed;
    const state = { users: [...(parsed.users || []), ...missingSeeds], sessions: parsed.sessions || [] };
    await writeState(state);
    return state;
  } catch {
    const state = { users: seedUsers, sessions: [] };
    await writeState(state);
    return state;
  }
}

async function writeState(state) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(statePath, JSON.stringify(state, null, 2));
}

async function mutateState(mutator) {
  mutationQueue = mutationQueue.catch(() => undefined).then(async () => {
    const state = await readState();
    const result = await mutator(state);
    await writeState(state);
    return result;
  });
  return mutationQueue;
}

function createSessionForUser(state, user) {
  const token = crypto.randomBytes(32).toString("hex");
  const session = {
    token,
    userId: user.id,
    createdAt: new Date().toISOString(),
  };
  state.sessions = [session, ...(state.sessions || []).filter((item) => item.userId !== user.id)].slice(0, 100);
  return { token, user: publicUser(user) };
}

export function getBearerToken(req) {
  const header = req.headers.authorization || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1] || "";
}

export async function loginUser({ email, password, role }) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedRole = String(role || "").trim();
  if (!normalizedEmail || !password) throw new Error("Email and password are required.");
  if (!["candidate", "employee", "recruiter"].includes(normalizedRole)) throw new Error("Choose a valid workspace.");

  return mutateState(async (state) => {
    const user = (state.users || []).find((item) => item.email === normalizedEmail && item.role === normalizedRole);
    if (!user || user.passwordHash !== hashPassword(password)) {
      throw new Error("Invalid email, password, or workspace.");
    }
    return createSessionForUser(state, user);
  });
}

export async function registerCandidate({ email, password, name }) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail || !password) throw new Error("Email and password are required.");
  if (String(password).length < 6) throw new Error("Password must be at least 6 characters.");

  return mutateState(async (state) => {
    let user = (state.users || []).find((item) => item.email === normalizedEmail && item.role === "candidate");
    if (user) {
      if (user.passwordHash !== hashPassword(password)) throw new Error("A candidate account already exists for this email.");
      return createSessionForUser(state, user);
    }
    user = {
      id: `usr-candidate-${crypto.randomUUID()}`,
      email: normalizedEmail,
      name: String(name || normalizedEmail.split("@")[0] || "Candidate"),
      role: "candidate",
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
    };
    state.users = [user, ...(state.users || [])];
    return createSessionForUser(state, user);
  });
}

export async function getSession(token) {
  if (!token) throw new Error("Missing auth token.");
  const state = await readState();
  const session = (state.sessions || []).find((item) => item.token === token);
  if (!session) throw new Error("Session not found.");
  const user = (state.users || []).find((item) => item.id === session.userId);
  if (!user) throw new Error("User not found.");
  return { token: session.token, user: publicUser(user) };
}

export async function logoutUser(token) {
  if (!token) return { ok: true };
  return mutateState(async (state) => {
    state.sessions = (state.sessions || []).filter((session) => session.token !== token);
    return { ok: true };
  });
}
