import { useState } from "react";
import {
  Trophy,
  FileText,
  Zap,
  CalendarDays,
  ChevronRight,
} from "lucide-react";
import StudentTopTabs from "../../../components/layout/StudentTopTabs";
import AdminMoreMenu from "../../../components/common/AdminMoreMenu";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ADMIN = {
  name: "Siyam Hassan",
  role: "Admin",
};

const STATS = [
  { label: "Total Contests",  value: 12, delta: "+2 this month", Icon: Trophy,       accent: "amber"   },
  { label: "Total Problems",  value: 48, delta: "+5 this month", Icon: FileText,     accent: "blue"    },
  { label: "Active Contests", value: 3,  delta: "Running now",   Icon: Zap,          accent: "emerald" },
  { label: "Upcoming",        value: 2,  delta: "Next 7 days",   Icon: CalendarDays, accent: "violet"  },
];

const CONTESTS = [
  { id: 1, title: "Weekly Algo Sprint #14",    status: "Running",  participants: 142, problems: 5, time: "2h 34m left",   date: "Apr 17, 2026" },
  { id: 2, title: "Graph Theory Beginner Cup", status: "Running",  participants: 89,  problems: 4, time: "5h 12m left",   date: "Apr 17, 2026" },
  { id: 3, title: "DP Mastery Challenge",      status: "Upcoming", participants: 0,   problems: 6, time: "Starts in 2d",  date: "Apr 19, 2026" },
  { id: 4, title: "April Warmup Round",        status: "Ended",    participants: 210, problems: 5, time: "Ended",         date: "Apr 10, 2026" },
  { id: 5, title: "String Manipulation Blitz", status: "Draft",    participants: 0,   problems: 3, time: "Not scheduled", date: "—"            },
];

const PROBLEMS = [
  { id: 1, title: "Two Sum Variants",         difficulty: "Easy",   tag: "Array",         used: 3 },
  { id: 2, title: "Shortest Path in Grid",    difficulty: "Medium", tag: "Graph",         used: 2 },
  { id: 3, title: "Longest Palindrome DP",    difficulty: "Hard",   tag: "DP",            used: 1 },
  { id: 4, title: "Binary Search on Answer",  difficulty: "Medium", tag: "Binary Search", used: 4 },
  { id: 5, title: "Cycle Detection in Graph", difficulty: "Medium", tag: "Graph",         used: 2 },
];



// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusStyles = {
  Running:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  Upcoming: "bg-blue-50   text-blue-700   border-blue-200",
  Ended:    "bg-slate-100 text-slate-500  border-slate-200",
  Draft:    "bg-amber-50  text-amber-700  border-amber-200",
};

const diffStyles = {
  Easy:   "bg-emerald-50 text-emerald-700",
  Medium: "bg-amber-50   text-amber-700",
  Hard:   "bg-red-50     text-red-600",
};

const accentMap = {
  amber: {
    card:  "border-amber-200/80  bg-amber-50/40",
    icon:  "bg-amber-100  text-amber-600",
    val:   "text-amber-700",
    delta: "text-amber-700 bg-amber-50",
  },
  blue: {
    card:  "border-blue-200/80   bg-blue-50/40",
    icon:  "bg-blue-100   text-blue-600",
    val:   "text-blue-700",
    delta: "text-blue-700  bg-blue-50",
  },
  emerald: {
    card:  "border-emerald-200/80 bg-emerald-50/40",
    icon:  "bg-emerald-100 text-emerald-600",
    val:   "text-emerald-700",
    delta: "text-emerald-700 bg-emerald-50",
  },
  violet: {
    card:  "border-violet-200/80 bg-violet-50/40",
    icon:  "bg-violet-100 text-violet-600",
    val:   "text-violet-700",
    delta: "text-violet-700 bg-violet-50",
  },
};

const ADMIN_TABS = [
  { key: "Dashboard", to: "/admin/dashboard" },
  { key: "Contests",  to: "/admin/contests"  },
  { key: "Problems",  to: "/admin/problems"  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ stat }) {
  const a = accentMap[stat.accent];
  return (
    <div className={`rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:shadow-md ${a.card}`}>
      <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${a.icon}`}>
        <stat.Icon className="h-4 w-4" />
      </div>
      <div className={`text-3xl font-bold tracking-tight ${a.val}`}>{stat.value}</div>
      <div className="mt-0.5 text-[13px] font-medium text-slate-500">{stat.label}</div>
      <div className={`mt-3 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${a.delta}`}>
        {stat.delta}
      </div>
    </div>
  );
}

function ContestRow({ contest }) {
  return (
    <tr className="border-b border-slate-100 transition hover:bg-slate-50/60 last:border-0">
      <td className="px-4 py-3.5">
        <div className="text-[13.5px] font-semibold text-slate-800">{contest.title}</div>
        <div className="mt-0.5 text-[11px] text-slate-400">{contest.date}</div>
      </td>
      <td className="px-3 py-3.5">
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusStyles[contest.status]}`}>
          {contest.status}
        </span>
      </td>
      <td className="px-3 py-3.5 text-center text-[13px] text-slate-600">{contest.problems}</td>
      <td className="px-3 py-3.5 text-center text-[13px] text-slate-600">{contest.participants}</td>
      <td className="px-3 py-3.5 text-[12px] text-slate-400">{contest.time}</td>
      <td className="px-4 py-3.5 text-right">
        <button className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-600 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700">
          Manage <ChevronRight className="h-3 w-3" />
        </button>
      </td>
    </tr>
  );
}

function ProblemRow({ problem }) {
  return (
    <tr className="border-b border-slate-100 transition hover:bg-slate-50/60 last:border-0">
      <td className="px-4 py-3.5">
        <div className="text-[13.5px] font-semibold text-slate-800">{problem.title}</div>
      </td>
      <td className="px-3 py-3.5">
        <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${diffStyles[problem.difficulty]}`}>
          {problem.difficulty}
        </span>
      </td>
      <td className="px-3 py-3.5">
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">
          {problem.tag}
        </span>
      </td>
      <td className="px-3 py-3.5 text-center text-[12px] text-slate-400">
        Used in {problem.used} contest{problem.used !== 1 ? "s" : ""}
      </td>
      <td className="px-4 py-3.5 text-right">
        <button className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-600 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700">
          Edit <ChevronRight className="h-3 w-3" />
        </button>
      </td>
    </tr>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("contests");
  const [contestFilter, setContestFilter] = useState("All");

  const filteredContests =
    contestFilter === "All"
      ? CONTESTS
      : CONTESTS.filter((c) => c.status === contestFilter);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Subtle dot-grid background */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[length:24px_24px]" />

      <div className="relative z-[1]">
        <StudentTopTabs tabs={ADMIN_TABS} logoTo="/" navExtra={<AdminMoreMenu />} />

        <main className="mx-auto max-w-7xl px-6 py-8">

          {/* ── Header ─────────────────────────────────────────────── */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-600">
                Admin Dashboard
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                Welcome back, {ADMIN.name.split(" ")[0]} 👋
              </h1>
              <p className="mt-1 text-[13px] text-slate-400">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

          </div>

          {/* ── Stat Cards ─────────────────────────────────────────── */}
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {STATS.map((s) => (
              <StatCard key={s.label} stat={s} />
            ))}
          </div>

          {/* ── Contests / Problems Table ──────────────────────── */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Tab bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
              <div className="flex gap-1.5">
                {["contests", "problems"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-lg px-3.5 py-1.5 text-[12px] font-semibold capitalize transition ${
                      activeTab === tab
                        ? "border border-amber-200 bg-amber-50 text-amber-700"
                        : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                    }`}
                  >
                    {tab === "contests" ? "🏆 Contests" : "📝 Problems"}
                  </button>
                ))}
              </div>

              {activeTab === "contests" && (
                <div className="flex flex-wrap gap-1">
                  {["All", "Running", "Upcoming", "Ended", "Draft"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setContestFilter(f)}
                      className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition ${
                        contestFilter === f
                          ? "bg-slate-100 text-slate-700"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {activeTab === "contests" ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {["Contest", "Status", "Problems", "Participants", "Time", ""].map(
                        (h, i) => (
                          <th
                            key={i}
                            className={`px-${i === 0 || i === 5 ? "4" : "3"} py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 ${
                              i === 2 || i === 3 ? "text-center" : "text-left"
                            }`}
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContests.map((c) => (
                      <ContestRow key={c.id} contest={c} />
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {["Problem", "Difficulty", "Tag", "Usage", ""].map((h, i) => (
                        <th
                          key={i}
                          className={`px-${i === 0 || i === 4 ? "4" : "3"} py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 ${
                            i === 3 ? "text-center" : "text-left"
                          }`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PROBLEMS.map((p) => (
                      <ProblemRow key={p.id} problem={p} />
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 border-t border-black/[0.07] py-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 text-xs text-slate-400">
            <span>QuickJudge V2.0 — Admin Panel</span>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-600">
              {ADMIN.role}
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
