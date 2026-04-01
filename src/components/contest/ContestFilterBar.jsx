import { CalendarDays, Clock3, History, Layers3 } from "lucide-react";

const iconMap = {
  all: Layers3,
  live: Clock3,
  upcoming: CalendarDays,
  past: History,
};

function ContestFilterBar({
  filters,
  activeFilter,
  setActiveFilter,
  setPastFilter,
}) {
  return (
    <div className="mb-8 flex flex-wrap items-center gap-3">
      {filters.map(({ key, label }) => {
        const Icon = iconMap[key];

        return (
          <button
            key={key}
            onClick={() => {
              setActiveFilter(key);
              if (key !== "past") setPastFilter("all");
            }}
            className={`inline-flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-medium transition ${
              activeFilter === key
                ? "border-amber-200 bg-amber-50 text-amber-700 shadow-sm"
                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            {key === "live" ? (
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </div>
            ) : (
              <Icon className="h-4 w-4" />
            )}

            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default ContestFilterBar;
