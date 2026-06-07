export function ScoreRing({ score, label }: { score: number; label: string }) {
  const color = score >= 80 ? "#059669" : score >= 60 ? "#d97706" : "#e11d48";
  return (
    <div className="flex items-center gap-2">
      <div
        className="grid h-10 w-10 place-items-center rounded-full text-xs font-semibold"
        style={{ background: `conic-gradient(${color} ${score}%, #e2e8f0 0)` }}
      >
        <div className="grid h-8 w-8 place-items-center rounded-full bg-white">{score}</div>
      </div>
      <span className="text-xs font-medium text-slate-500">{label}</span>
    </div>
  );
}
