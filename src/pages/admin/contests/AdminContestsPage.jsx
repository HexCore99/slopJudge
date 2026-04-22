import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Filter, Edit2, Trash2, Users, FileText } from "lucide-react";
import StudentTopTabs from "../../../components/layout/StudentTopTabs";
import AdminMoreMenu from "../../../components/common/AdminMoreMenu";
import { ADMIN_NAV_TABS } from "../../../features/admin/adminNavTabs";

const MOCK_CONTESTS = [
  { id: 1, title: "Weekly Algo Sprint #14",    status: "Running",  participants: 142, problems: 5, date: "Apr 17, 2026", authorId: 101 },
  { id: 2, title: "Graph Theory Beginner Cup", status: "Running",  participants: 89,  problems: 4, date: "Apr 17, 2026", authorId: 102 },
  { id: 3, title: "DP Mastery Challenge",      status: "Upcoming", participants: 0,   problems: 6, date: "Apr 19, 2026", authorId: 101 },
  { id: 4, title: "April Warmup Round",        status: "Ended",    participants: 210, problems: 5, date: "Apr 10, 2026", authorId: 103 },
];

const statusStyles = {
  Running:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  Upcoming: "bg-blue-50   text-blue-700   border-blue-200",
  Ended:    "bg-slate-100 text-slate-500  border-slate-200",
  Draft:    "bg-amber-50  text-amber-700  border-amber-200",
};

export default function AdminContestsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredContests = MOCK_CONTESTS.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "All" || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[length:24px_24px]" />
      
      <div className="relative z-[1]">
        <StudentTopTabs tabs={ADMIN_NAV_TABS} logoTo="/" navExtra={<AdminMoreMenu />} />

        <main className="mx-auto max-w-7xl px-6 py-8 pb-20">
          
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manage Contests</h1>
              <p className="mt-1 text-[14px] text-slate-500">
                Create, schedule, and moderate competitive programming contests.
              </p>
            </div>
            
            <Link 
              to="/admin/contests/create" 
              className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-amber-700"
            >
              <Plus className="h-4 w-4" />
              Create Contest
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            
            <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
              
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search contests..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2 text-[13px] outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-400" />
                  <span className="text-[13px] font-medium text-slate-600">Status:</span>
                </div>
                <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
                  {["All", "Running", "Upcoming", "Ended"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`rounded-md px-3 py-1.5 text-[12px] font-semibold transition ${
                        filterStatus === status 
                          ? "bg-white text-amber-700 shadow-sm" 
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Contest Title</th>
                    <th className="px-4 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Status</th>
                    <th className="px-4 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Participants</th>
                    <th className="px-4 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Problems</th>
                    <th className="px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContests.map((c) => {
                    return (
                      <tr key={c.id} className="border-b border-slate-50 transition hover:bg-slate-50/60 last:border-0">
                        <td className="px-6 py-4">
                          <Link 
                            to={`/admin/contests/${c.id}`}
                            className="text-[14px] font-semibold text-slate-800 hover:text-amber-700 transition-colors"
                          >
                            {c.title}
                          </Link>
                          <div className="mt-1 text-[12px] text-slate-400">{c.date}</div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-block rounded px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${statusStyles[c.status]}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-600">
                            <Users className="h-4 w-4 text-slate-400" /> {c.participants}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-600">
                            <FileText className="h-4 w-4 text-slate-400" /> {c.problems}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-[12px] font-medium transition border-slate-200 bg-white text-slate-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700`}>
                              <Edit2 className="h-3.5 w-3.5" /> Edit
                            </button>
                            <button className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-[12px] font-medium transition border-slate-200 bg-white text-slate-600 hover:border-red-300 hover:bg-red-50 hover:text-red-600`}>
                              <Trash2 className="h-3.5 w-3.5" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  
                  {filteredContests.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-[13px] text-slate-500">
                        No contests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
