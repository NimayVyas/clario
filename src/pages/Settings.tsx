import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

const fields = [
  ["Target roles", "Data Engineer, AI Engineer, React Developer"],
  ["Target tech stacks", "Python, AWS, Spark, React, Snowflake"],
  ["Minimum hourly rate", "75"],
  ["Preferred locations", "Remote US, New York, Washington DC, Austin"],
  ["Contract type preference", "W2, Contract-to-Hire"],
  ["Remote preference", "Remote or Hybrid"],
  ["Sources enabled", "Partner feed, career pages, CSV upload"],
  ["Alert frequency", "Daily digest"],
];

export function Settings() {
  return (
    <div className="space-y-5">
      <section>
        <h1 className="text-2xl font-semibold text-slate-950">Profile</h1>
        <p className="mt-2 text-sm text-slate-600">Tell Clario which contract roles, rates, locations, and work models you want our staffing team to prioritize.</p>
      </section>
      <Card className="max-w-4xl p-5">
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map(([label, value]) => (
            <label key={label} className="space-y-2">
              <span className="text-sm font-medium text-slate-700">{label}</span>
              <input className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-slate-400" defaultValue={value} />
            </label>
          ))}
        </div>
        <div className="mt-6 flex justify-end"><Button>Save preferences</Button></div>
      </Card>
    </div>
  );
}
