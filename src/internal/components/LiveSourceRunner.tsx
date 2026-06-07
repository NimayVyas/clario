import { useState } from "react";
import { Play, ServerCrash } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { InternalJobRole } from "../data/intelligenceSeed";

interface LiveSourceRunnerProps {
  onJobsFetched: (jobs: InternalJobRole[]) => void;
}

const examples = {
  greenhouse: "stripe",
  lever: "netflix",
  ashby: "ashby",
};

export function LiveSourceRunner({ onJobsFetched }: LiveSourceRunnerProps) {
  const [provider, setProvider] = useState<"greenhouse" | "lever" | "ashby">("greenhouse");
  const [identifier, setIdentifier] = useState(examples.greenhouse);
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState("");
  const [previewCount, setPreviewCount] = useState(0);

  const runSource = async () => {
    setIsRunning(true);
    setMessage("");
    setPreviewCount(0);
    try {
      const response = await fetch("/api/sources/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, identifier }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Source run failed");
      onJobsFetched(data.jobs);
      setPreviewCount(data.rolesFound);
      setMessage(`Fetched ${data.rolesFound} public jobs from ${provider}:${identifier}. They are now visible in Role Discovery.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Source run failed. Make sure npm run api is running.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-slate-950 p-2 text-white"><Play className="h-4 w-4" /></div>
        <div>
          <h3 className="font-semibold text-slate-950">Run live public ATS connector</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">Fetch real public postings through Greenhouse, Lever, or Ashby job-board endpoints. Start the API proxy with <code className="rounded bg-slate-100 px-1">npm run api</code>.</p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-[150px_1fr]">
        <select
          className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm"
          value={provider}
          onChange={(event) => {
            const next = event.target.value as "greenhouse" | "lever" | "ashby";
            setProvider(next);
            setIdentifier(examples[next]);
          }}
        >
          <option value="greenhouse">Greenhouse</option>
          <option value="lever">Lever</option>
          <option value="ashby">Ashby</option>
        </select>
        <input
          className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          placeholder="Board token or company slug"
        />
      </div>
      <Button className="mt-4 w-full bg-violet-700 text-white hover:bg-violet-600" onClick={runSource} disabled={isRunning}>
        <Play className="h-4 w-4" />
        {isRunning ? "Fetching public jobs..." : "Run connector"}
      </Button>
      {message && (
        <div className={previewCount ? "mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900" : "mt-4 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"}>
          {!previewCount && <ServerCrash className="h-4 w-4 shrink-0" />}
          {message}
        </div>
      )}
    </Card>
  );
}
