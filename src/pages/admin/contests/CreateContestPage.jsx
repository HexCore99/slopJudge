import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Search, Lock, Globe, X } from "lucide-react";
import StudentTopTabs from "../../../components/layout/StudentTopTabs";
import AdminMoreMenu from "../../../components/common/AdminMoreMenu";

const ADMIN_TABS = [
  { key: "Dashboard", to: "/admin/dashboard" },
  { key: "Contests",  to: "/admin/contests"  },
  { key: "Problems",  to: "/admin/problems"  },
];

const MOCK_PROBLEMS = [
  { id: 1, title: "Two Sum Variants", difficulty: "Easy", tag: "Array" },
  { id: 2, title: "Shortest Path in Grid", difficulty: "Medium", tag: "Graph" },
  { id: 3, title: "Longest Palindrome DP", difficulty: "Hard", tag: "DP" },
  { id: 4, title: "Binary Search on Answer", difficulty: "Medium", tag: "Binary Search" },
  { id: 5, title: "Cycle Detection in Graph", difficulty: "Medium", tag: "Graph" },
];

export default function CreateContestPage() {
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleToggleProblem = (problem) => {
    if (selectedProblems.find((p) => p.id === problem.id)) {
      setSelectedProblems(selectedProblems.filter((p) => p.id !== problem.id));
    } else {
      setSelectedProblems([...selectedProblems, problem]);
    }
  };

  const filteredProblems = MOCK_PROBLEMS.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const inputClasses = "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-[14px] outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[length:24px_24px]" />
      
      <div className="relative z-[1]">
        <StudentTopTabs tabs={ADMIN_TABS} logoTo="/" navExtra={<AdminMoreMenu />} />

        <main className="mx-auto max-w-4xl px-6 py-8 pb-20">
          <Link to="/admin/dashboard" className="mb-6 inline-flex items-center gap-2 text-[13px] font-medium text-slate-500 transition hover:text-slate-800">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create New Contest</h1>
            <p className="mt-1 text-[14px] text-slate-500">Configure contest details, select problems, and set access controls.</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            
            {/* General Info */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-[15px] font-semibold text-slate-800">General Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-slate-700">Contest Title</label>
                  <input type="text" placeholder="e.g. Weekly Algo Sprint #15" className={inputClasses} />
                </div>
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-slate-700">Description</label>
                  <textarea rows={4} placeholder="Describe the contest rules..." className={`resize-none ${inputClasses}`} />
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-[15px] font-semibold text-slate-800">Schedule</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-slate-700">Start Time</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input type="datetime-local" className={`${inputClasses} pl-10`} />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-slate-700">End Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input type="datetime-local" className={`${inputClasses} pl-10`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Access Control */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-[15px] font-semibold text-slate-800">Access Control</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setIsPrivate(false)}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition ${!isPrivate ? "border-amber-400 bg-amber-50 text-amber-700" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}
                >
                  <Globe className="h-6 w-6" />
                  <span className="text-[13px] font-semibold">Public Contest</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPrivate(true)}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition ${isPrivate ? "border-amber-400 bg-amber-50 text-amber-700" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}
                >
                  <Lock className="h-6 w-6" />
                  <span className="text-[13px] font-semibold">Private Contest</span>
                </button>
              </div>

              {isPrivate && (
                <div className="mt-4 animate-[fadeSlideDown_0.2s_ease]">
                  <label className="mb-1.5 block text-[13px] font-medium text-slate-700">Contest Password</label>
                  <input type="password" placeholder="Enter a secure password..." className={inputClasses} />
                </div>
              )}
            </div>

            {/* Problem Selection */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-[15px] font-semibold text-slate-800">Select Problems</h2>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
                  {selectedProblems.length} Selected
                </span>
              </div>

              <div className="mb-4 relative">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search problems by name or tag..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`${inputClasses} pl-10`}
                />
              </div>

              <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-100">
                {filteredProblems.map((p) => {
                  const isSelected = selectedProblems.some((sp) => sp.id === p.id);
                  return (
                    <div 
                      key={p.id}
                      onClick={() => handleToggleProblem(p)}
                      className={`flex cursor-pointer items-center justify-between border-b border-slate-100 p-3 last:border-0 transition hover:bg-slate-50 ${isSelected ? "bg-amber-50/30" : ""}`}
                    >
                      <div>
                        <div className="text-[13.5px] font-semibold text-slate-800">{p.title}</div>
                        <div className="mt-0.5 flex gap-2 text-[11px] font-medium">
                          <span className={`${p.difficulty === 'Easy' ? 'text-emerald-600' : p.difficulty === 'Medium' ? 'text-amber-600' : 'text-red-600'}`}>{p.difficulty}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500">{p.tag}</span>
                        </div>
                      </div>
                      <div className={`flex h-5 w-5 items-center justify-center rounded border ${isSelected ? "border-amber-500 bg-amber-500 text-white" : "border-slate-300 bg-white"}`}>
                        {isSelected && <X className="h-3.5 w-3.5 rotate-45" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Link to="/admin/dashboard" className="rounded-xl border border-slate-200 px-6 py-2.5 text-[14px] font-medium text-slate-600 transition hover:bg-slate-50">
                Cancel
              </Link>
              <button type="submit" className="rounded-xl bg-amber-600 px-6 py-2.5 text-[14px] font-semibold text-white transition hover:bg-amber-700 shadow-sm">
                Create Contest
              </button>
            </div>

          </form>
        </main>
      </div>
    </div>
  );
}
