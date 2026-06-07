import http from "node:http";
import { getBearerToken, getSession, loginUser, logoutUser, registerCandidate } from "./authStore.mjs";
import { runConnector } from "./connectors.mjs";
import { createAccount, createContact, createManualResearchRun, generateMessage, getOutreachState, getSourcingRuns, importSourcingCsv, logOutreach, updateTask } from "./outreachStore.mjs";

const port = Number(process.env.PORT || 3001);

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  res.end(JSON.stringify(payload));
}

async function requireRole(req, allowedRoles) {
  const session = await getSession(getBearerToken(req));
  if (!allowedRoles.includes(session.user.role)) throw new Error("You do not have access to this workspace.");
  return session;
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return sendJson(res, 200, {});
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

  try {
    if (req.method === "GET" && url.pathname === "/api/health") {
      return sendJson(res, 200, { ok: true, service: "clario-api" });
    }

    if (req.method === "POST" && url.pathname === "/api/auth/login") {
      const session = await loginUser(await readJson(req));
      return sendJson(res, 200, { session });
    }

    if (req.method === "POST" && url.pathname === "/api/auth/register") {
      const session = await registerCandidate(await readJson(req));
      return sendJson(res, 201, { session });
    }

    if (req.method === "GET" && url.pathname === "/api/auth/session") {
      const session = await getSession(getBearerToken(req));
      return sendJson(res, 200, { session });
    }

    if (req.met