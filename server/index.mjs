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

    if (req.method === "POST" && url.pathname === "/api/auth/logout") {
      const result = await logoutUser(getBearerToken(req));
      return sendJson(res, 200, result);
    }

    if (url.pathname.startsWith("/api/outreach") || url.pathname.startsWith("/api/sourcing") || url.pathname.startsWith("/api/sources") || url.pathname.startsWith("/api/connectors")) {
      await requireRole(req, ["employee"]);
    }

    if (req.method === "GET" && url.pathname === "/api/sourcing/runs") {
      return sendJson(res, 200, { runs: await getSourcingRuns() });
    }

    if (req.method === "POST" && url.pathname === "/api/sourcing/import-csv") {
      const result = await importSourcingCsv(await readJson(req));
      return sendJson(res, 201, result);
    }

    if (req.method === "POST" && url.pathname === "/api/sourcing/research-queue") {
      const result = await createManualResearchRun(await readJson(req));
      return sendJson(res, 201, result);
    }

    if (req.method === "GET" && url.pathname === "/api/sourcing/providers") {
      return sendJson(res, 200, {
        providers: [
          { id: "csv", name: "CSV Import", status: "enabled", note: "Use real company/contact lists from Apollo, Clay, LinkedIn research, Google Sheets, or manual exports." },
          { id: "manual-research", name: "Manual Research Queue", status: "enabled", note: "Creates research tasks without inventing contacts." },
          { id: "apollo", name: "Apollo", status: "not_configured", requiredEnv: "APOLLO_API_KEY" },
          { id: "hunter", name: "Hunter", status: "not_configured", requiredEnv: "HUNTER_API_KEY" },
          { id: "people-data-labs", name: "People Data Labs", status: "not_configured", requiredEnv: "PDL_API_KEY" },
        ],
      });
    }

    if (req.method === "GET" && url.pathname === "/api/outreach") {
      const state = await getOutreachState();
      return sendJson(res, 200, state);
    }

    if (req.method === "GET" && url.pathname === "/api/outreach/accounts") {
      const state = await getOutreachState();
      const query = (url.searchParams.get("q") || "").toLowerCase();
      const type = url.searchParams.get("type") || "All";
      const stage = url.searchParams.get("stage") || "All";
      const accounts = state.accounts.filter((account) => {
        const matchesQuery = !query || [account.name, account.accountType, account.headquarters, account.owner, ...account.technicalSpecialties].some((value) => String(value).toLowerCase().includes(query));
        const matchesType = type === "All" || account.accountType === type;
        const matchesStage = stage === "All" || account.stage === stage;
        return matchesQuery && matchesType && matchesStage;
      });
      return sendJson(res, 200, { accounts });
    }

    if (req.method === "POST" && url.pathname === "/api/outreach/accounts") {
      const account = await createAccount(await readJson(req));
      return sendJson(res, 201, { account });
    }

    if (req.method === "GET" && url.pathname === "/api/outreach/contacts") {
      const state = await getOutreachState();
      return sendJson(res, 200, { contacts: state.contacts });
    }

    if (req.method === "POST" && url.pathname === "/api/outreach/contacts") {
      const contact = await createContact(await readJson(req));
      return sendJson(res, 201, { contact });
    }

    if (req.method === "GET" && url.pathname === "/api/outreach/tasks") {
      const state = await getOutreachState();
      return sendJson(res, 200, { tasks: state.tasks });
    }

    const taskMatch = url.pathname.match(/^\/api\/outreach\/tasks\/([^/]+)$/);
    if (req.method === "PATCH" && taskMatch) {
      const task = await updateTask(taskMatch[1], await readJson(req));
      return sendJson(res, 200, { task });
    }

    if (req.method === "GET" && url.pathname === "/api/outreach/activity") {
      const state = await getOutreachState();
      return sendJson(res, 200, { outreachEvents: state.outreachEvents });
    }

    if (req.method === "POST" && url.pathname === "/api/outreach/messages/generate") {
      const message = await generateMessage(await readJson(req));
      return sendJson(res, 200, message);
    }

    if (req.method === "POST" && url.pathname === "/api/outreach/send") {
      const result = await logOutreach(await readJson(req));
      return sendJson(res, 200, result);
    }

    if (req.method === "POST" && url.pathname === "/api/sources/run") {
      const { provider, identifier } = await readJson(req);
      const jobs = await runConnector({ provider, identifier });
      return sendJson(res, 200, {
        provider,
        identifier,
        rolesFound: jobs.length,
        rolesCreated: jobs.length,
        rolesUpdated: 0,
        jobs,
        compliance: "Fetched through public ATS job-board endpoints only. Do not submit candidates without consent.",
      });
    }

    const connectorMatch = url.pathname.match(/^\/api\/connectors\/([^/]+)\/([^/]+)\/jobs$/);
    if (req.method === "GET" && connectorMatch) {
      const [, provider, identifier] = connectorMatch;
      const jobs = await runConnector({ provider, identifier });
      return sendJson(res, 200, { jobs });
    }

    return sendJson(res, 404, { error: "Not found" });
  } catch (error) {
    return sendJson(res, 400, { error: error instanceof Error ? error.message : "Unknown connector error" });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Clario API listening on http://127.0.0.1:${port}`);
});
