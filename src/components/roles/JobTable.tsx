import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import { JobRole } from "../../types/job";
import { formatRateRange } from "../../lib/utils";
import { Button } from "../ui/Button";
import { DuplicateRiskBadge } from "./DuplicateRiskBadge";
import { RemoteTypeBadge } from "./RemoteTypeBadge";
import { SourceBadge } from "./SourceBadge";
import { TransparencyBadge } from "./TransparencyBadge";

interface JobTableProps {
  jobs: JobRole[];
  onSelect: (job: JobRole) => void;
}

function SortHeader({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      {label}
      <ArrowUpDown className="h-3 w-3 text-slate-400" />
    </span>
  );
}

export function JobTable({ jobs, onSelect }: JobTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "postedDate", desc: true }]);
  const columns = useMemo<ColumnDef<JobRole>[]>(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => <button onClick={column.getToggleSortingHandler()}><SortHeader label="Job title" /></button>,
        cell: ({ row }) => (
          <div>
            <div className="font-medium text-slate-950">{row.original.title}</div>
            <div className="mt-1 flex flex-wrap gap-1">{row.original.techStack.slice(0, 3).map((skill) => <span key={skill} className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600">{skill}</span>)}</div>
          </div>
        ),
      },
      { accessorKey: "company", header: ({ column }) => <button onClick={column.getToggleSortingHandler()}><SortHeader label="Client" /></button> },
      { accessorKey: "vendor", header: "Vendor" },
      { accessorKey: "location", header: ({ column }) => <button onClick={column.getToggleSortingHandler()}><SortHeader label="Location" /></button> },
      { accessorKey: "remoteType", header: "Remote", cell: ({ row }) => <RemoteTypeBadge type={row.original.remoteType} /> },
      { accessorKey: "contractType", header: "Type" },
      { accessorKey: "contractLength", header: "Length" },
      {
        id: "rate",
        accessorFn: (row) => row.hourlyRateMax,
        header: ({ column }) => <button onClick={column.getToggleSortingHandler()}><SortHeader label="Rate" /></button>,
        cell: ({ row }) => <span className="font-medium text-slate-900">{formatRateRange(row.original.hourlyRateMin, row.original.hourlyRateMax)}</span>,
      },
      { accessorKey: "postedDate", header: ({ column }) => <button onClick={column.getToggleSortingHandler()}><SortHeader label="Posted" /></button> },
      { accessorKey: "source", header: "Source", cell: ({ row }) => <SourceBadge source={row.original.source} /> },
      {
        accessorKey: "transparencyScore",
        header: ({ column }) => <button onClick={column.getToggleSortingHandler()}><SortHeader label="Clarity" /></button>,
        cell: ({ row }) => <div className="space-y-1"><div className="font-semibold">{row.original.transparencyScore}</div><TransparencyBadge score={row.original.transparencyScore} /></div>,
      },
      {
        accessorKey: "aiFitScore",
        header: ({ column }) => <button onClick={column.getToggleSortingHandler()}><SortHeader label="AI fit" /></button>,
        cell: ({ row }) => <span className="font-semibold text-slate-950">{row.original.aiFitScore}</span>,
      },
      { accessorKey: "duplicateRiskScore", header: "Duplicate", cell: ({ row }) => <DuplicateRiskBadge score={row.original.duplicateRiskScore} /> },
      { accessorKey: "status", header: "Status" },
    ],
    [],
  );

  const table = useReactTable({ data: jobs, columns, state: { sorting }, onSortingChange: setSorting, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel() });

  if (!jobs.length) {
    return <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-500">No roles match the current filters.</div>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-[1500px] w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => <th key={header.id} className="px-4 py-3 font-semibold">{flexRender(header.column.columnDef.header, header.getContext())}</th>)}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="cursor-pointer transition hover:bg-slate-50" onClick={() => onSelect(row.original)}>
                {row.getVisibleCells().map((cell) => <td key={cell.id} className="px-4 py-3 align-top text-slate-700">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
        <span>{jobs.length} visible roles</span>
        <Button variant="ghost" size="sm">Rows are clickable</Button>
      </div>
    </div>
  );
}
