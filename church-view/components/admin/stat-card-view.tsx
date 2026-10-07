import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type StatCardData = {
  title: string;
  value: string;
  change: string;
  direction: "up" | "down" | "steady";
  comparisonLabel: string;
  icon: LucideIcon;
  tone: "indigo";
};

const tones = {
  indigo: { icon: "bg-indigo-50 text-indigo-700", positive: "text-emerald-700" },
} as const;

export function StatCardView({ stat }: { stat: StatCardData }) {
  const Icon = stat.icon;
  const TrendIcon = stat.direction === "up" ? ArrowUpRight : stat.direction === "down" ? ArrowDownRight : ArrowRight;
  const trendColor = stat.direction === "up" ? tones[stat.tone].positive : stat.direction === "down" ? "text-amber-700" : "text-slate-500";

  return <article className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-500">{stat.title}</p>
        <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{stat.value}</p>
      </div>
      <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${tones[stat.tone].icon}`}>
        <Icon aria-hidden="true" className="size-5" />
      </span>
    </div>
    <div className="mt-4 flex items-center gap-1.5 text-xs">
      <TrendIcon aria-hidden="true" className={`size-4 ${trendColor}`} />
      <span className={`font-semibold ${trendColor}`}>{stat.change}</span>
      <span className="text-slate-500">{stat.comparisonLabel}</span>
    </div>
  </article>;
}
