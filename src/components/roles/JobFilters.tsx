import { ContractType, RemoteType, RoleFilters } from "../../types/job";

interface JobFiltersProps {
  filters: RoleFilters;
  options: {
    states: string[];
    sources: string[];
    techStacks: string[];
  };
  onChange: (filters: RoleFilters) => void;
}

const remoteOptions: Array<RemoteType | "All"> = ["All", "Remote", "Hybrid", "Onsite"];
const contractOptions: Array<ContractType | "All"> = ["All", "W2", "C2C", "1099", "Contract-to-Hire"];

export function JobFilters({ filters, options, onChange }: JobFiltersProps) {
  const update = (key: keyof RoleFilters, value: string | number | undefined) => onChange({ ...filters, [key]: value });

  return (
    <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:grid-cols-2 xl:grid-cols-5">
      <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={filters.remoteType ?? "All"} onChange={(e) => update("remoteType", e.target.value)}>
        {remoteOptions.map((option) => <option key={option}>{option}</option>)}
      </select>
      <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={filters.contractType ?? "All"} onChange={(e) => update("contractType", e.target.value)}>
        {contractOptions.map((option) => <option key={option}>{option}</option>)}
      </select>
      <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={filters.state ?? "All"} onChange={(e) => update("state", e.target.value)}>
        <option>All</option>
        {options.states.map((option) => <option key={option}>{option}</option>)}
      </select>
      <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={filters.techStack ?? "All"} onChange={(e) => update("techStack", e.target.value)}>
        <option>All</option>
        {options.techStacks.map((option) => <option key={option}>{option}</option>)}
      </select>
      <input
        type="number"
        className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm"
        placeholder="Minimum rate"
        value={filters.minRate ?? ""}
        onChange={(e) => update("minRate", e.target.value ? Number(e.target.value) : undefined)}
      />
    </div>
  );
}
