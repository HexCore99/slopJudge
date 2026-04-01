import { Bell, BarChart3, FileText, HelpCircle, Send } from "lucide-react";

const iconMap = {
  Problems: FileText,
  Submissions: Send,
  Leaderboard: BarChart3,
  Announcements: Bell,
  Queries: HelpCircle,
};

function ContestTabs({ tabs = [], activeTab, onChange }) {
  return (
    <div className="mb-6 flex flex-wrap gap-4 rounded-xl bg-slate-200/60 p-2 text-sm">
      {tabs.map((tab) => {
        const Icon = iconMap[tab] || FileText;
        const isActive = tab === activeTab;
        const isAccessible = tab === "Problems";

        return (
          <button
            type="button"
            key={tab}
            disabled={!isAccessible}
            onClick={() => {
              if (isAccessible) onChange(tab);
            }}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 transition ${
              isActive
                ? "bg-white font-semibold text-slate-900 shadow-sm"
                : isAccessible
                  ? "text-slate-500 hover:bg-white/70 hover:text-slate-900"
                  : "cursor-not-allowed bg-slate-100 text-slate-400 opacity-70"
            }`}
          >
            <Icon size={16} />
            {tab}
          </button>
        );
      })}
    </div>
  );
}

export default ContestTabs;
