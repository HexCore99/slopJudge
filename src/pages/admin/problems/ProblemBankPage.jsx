import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import StudentTopTabs from "../../../components/layout/StudentTopTabs";
import AdminMoreMenu from "../../../components/common/AdminMoreMenu";
import { ADMIN_NAV_TABS } from "../../../features/admin/adminNavTabs";
import {
  DIFFICULTY_BADGE_CLASSES,
  PROBLEM_BANK_ITEMS,
} from "../../../features/problems/problemBankMockData";

export default function ProblemBankPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("All");

  const userStr = localStorage.getItem("qj_user");
  const currentUser = userStr ? JSON.parse(userStr) : { id: 101, role: "student" };

  const filteredProblems = PROBLEM_BANK_ITEMS.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDiff = filterDifficulty === "All" || p.difficulty === filterDifficulty;
    return matchesSearch && matchesDiff;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[length:24px_24px]" />
      
      <div className="relative z-[1]">
        <StudentTopTabs tabs={ADMIN_NAV_TABS} logoTo="/" navExtra={<AdminMoreMenu />} />

        <main className="mx-auto max-w-7xl px-6 py-8 pb-20">
          
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Problem Bank</h1>
              <p className="mt-1 text-[14px] text-slate-500">
                Manage and moderate competitive programming challenges.
              </p>
            </div>
            
            <Link 
              to="/admin/problems/create" 
              className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-amber-700"
            >
              <Plus className="h-4 w-4" />
              Create Problem
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            
            {/* Filters Bar */}
            <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
              
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search by title or tags..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2 text-[13px] outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-400" />
                  <span className="text-[13px] font-medium text-slate-600">Difficulty:</span>
                </div>
                <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
                  {["All", "Easy", "Medium", "Hard"].map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setFilterDifficulty(diff)}
                      className={`rounded-md px-3 py-1.5 text-[12px] font-semibold transition ${
                        filterDifficulty === diff 
                          ? "bg-white text-amber-700 shadow-sm" 
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Problem List */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Problem Title</th>
                    <th className="px-4 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Difficulty</th>
                    <th className="px-4 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Tags</th>
                    <th className="px-4 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Editorial</th>
                    <th className="px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProblems.map((p) => {
                    const isAuthor =
                      currentUser.role === "admin" && p.authorId === currentUser.id;
                    const canEdit = isAuthor;

                    return (
                      <tr key={p.id} className="border-b border-slate-50 transition hover:bg-slate-50/60 last:border-0">
                        <td className="px-6 py-4">
                          <Link 
                            to={`/admin/problems/${p.id}`}
                            className="text-[14px] font-semibold text-slate-800 hover:text-amber-700 transition-colors"
                          >
                            {p.title}
                          </Link>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-block rounded px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${DIFFICULTY_BADGE_CLASSES[p.difficulty]}`}>
                            {p.difficulty}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {p.tags.map((tag) => (
                              <span key={tag} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {p.hasEditorial ? (
                            <span className="flex items-center gap-1.5 text-[12px] font-medium text-emerald-600">
                              <CheckCircle2 className="h-4 w-4" /> Available
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-[12px] font-medium text-slate-400">
                              <AlertCircle className="h-4 w-4" /> Missing
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              disabled={!canEdit}
                              className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-[12px] font-medium transition ${
                                canEdit 
                                  ? "border-slate-200 bg-white text-slate-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700" 
                                  : "border-slate-100 bg-slate-50 text-slate-400 opacity-60 cursor-not-allowed"
                              }`}
                              title={!canEdit ? "You do not have permission to edit this problem" : "Edit problem"}
                            >
                              <Edit2 className="h-3.5 w-3.5" /> Edit
                            </button>
                            <button 
                              disabled={!canEdit}
                              className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-[12px] font-medium transition ${
                                canEdit 
                                  ? "border-slate-200 bg-white text-slate-600 hover:border-red-300 hover:bg-red-50 hover:text-red-600" 
                                  : "border-slate-100 bg-slate-50 text-slate-400 opacity-60 cursor-not-allowed"
                              }`}
                              title={!canEdit ? "You do not have permission to delete this problem" : "Delete problem"}
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  
                  {filteredProblems.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-[13px] text-slate-500">
                        No problems found matching your filters.
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
