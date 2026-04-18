import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Search, Video, Code, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import StudentTopTabs from "../../../components/layout/StudentTopTabs";
import AdminMoreMenu from "../../../components/common/AdminMoreMenu";

const ADMIN_TABS = [
  { key: "Dashboard", to: "/admin/dashboard" },
  { key: "Contests",  to: "/admin/contests"  },
  { key: "Problems",  to: "/admin/problems"  },
];

const MOCK_PROBLEMS = [
  { id: 1, title: "Two Sum Variants", hasEditorial: true },
  { id: 2, title: "Shortest Path in Grid", hasEditorial: false },
  { id: 3, title: "Longest Palindrome DP", hasEditorial: false },
  { id: 4, title: "Binary Search on Answer", hasEditorial: true },
  { id: 5, title: "Cycle Detection in Graph", hasEditorial: false },
];

export default function EditorialsPage() {
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Editorial Form State
  const [content, setContent] = useState("");
  const [solutionCode, setSolutionCode] = useState("");
  const [videoLink, setVideoLink] = useState("");

  const filteredProblems = MOCK_PROBLEMS.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectProblem = (problem) => {
    setSelectedProblem(problem);
    // In a real app, you would fetch existing editorial data here if problem.hasEditorial is true
    if (problem.hasEditorial) {
      setContent("### Intuition\nThe problem asks us to find...\n\n### Approach\nWe can use a hash map to store...");
      setSolutionCode("def solve():\n    pass");
      setVideoLink("https://youtube.com/watch?v=example");
    } else {
      setContent("");
      setSolutionCode("");
      setVideoLink("");
    }
  };

  const inputClasses = "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-[14px] outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10";
  const textareaClasses = "w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-[14px] outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 font-mono text-[13px]";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[length:24px_24px]" />
      
      <div className="relative z-[1]">
        <StudentTopTabs tabs={ADMIN_TABS} logoTo="/" navExtra={<AdminMoreMenu />} />

        <main className="mx-auto max-w-7xl px-6 py-8 pb-20">
          <Link to="/admin/dashboard" className="mb-6 inline-flex items-center gap-2 text-[13px] font-medium text-slate-500 transition hover:text-slate-800">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manage Editorials</h1>
            <p className="mt-1 text-[14px] text-slate-500">Write explanations, provide solution code, and link video walkthroughs.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            
            {/* ── Left Column: Problem List (1/3 space) ── */}
            <div className="lg:col-span-1 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 relative">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search problems..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`${inputClasses} pl-10`}
                  />
                </div>

                <div className="max-h-[600px] overflow-y-auto pr-1">
                  {filteredProblems.map((p) => {
                    const isSelected = selectedProblem?.id === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleSelectProblem(p)}
                        className={`w-full flex items-center justify-between rounded-xl border p-3.5 mb-2 text-left transition ${
                          isSelected 
                            ? "border-amber-400 bg-amber-50" 
                            : "border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <span className={`text-[13px] font-semibold ${isSelected ? "text-amber-900" : "text-slate-700"}`}>
                          {p.title}
                        </span>
                        {p.hasEditorial ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-slate-300" />
                        )}
                      </button>
                    );
                  })}
                  {filteredProblems.length === 0 && (
                    <div className="py-8 text-center text-[13px] text-slate-500">
                      No problems found.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Right Column: Editor (2/3 space) ── */}
            <div className="lg:col-span-2">
              {!selectedProblem ? (
                <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-2xl border border-slate-200 border-dashed bg-slate-50/50 p-8 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-200/50 text-slate-400">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h3 className="text-[16px] font-semibold text-slate-700">No Problem Selected</h3>
                  <p className="mt-1 max-w-sm text-[14px] text-slate-500">
                    Select a problem from the list on the left to write or edit its editorial explanation.
                  </p>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  
                  {/* Header / Actions */}
                  <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
                        Editing Editorial For
                      </div>
                      <h2 className="mt-0.5 text-[18px] font-bold text-slate-800">
                        {selectedProblem.title}
                      </h2>
                    </div>
                    <button className="rounded-xl bg-amber-600 px-6 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-amber-700">
                      {selectedProblem.hasEditorial ? "Update Editorial" : "Publish Editorial"}
                    </button>
                  </div>

                  {/* Explanation Markdown */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-2 text-[14px] font-semibold text-slate-800">
                      <FileText className="h-4 w-4 text-blue-500" />
                      Written Explanation (Markdown)
                    </div>
                    <textarea 
                      rows={12} 
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your step-by-step intuition and approach here..." 
                      className={textareaClasses} 
                    />
                  </div>

                  {/* Solution Code */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-2 text-[14px] font-semibold text-slate-800">
                      <Code className="h-4 w-4 text-emerald-500" />
                      Optimal Solution Code
                    </div>
                    <textarea 
                      rows={8} 
                      value={solutionCode}
                      onChange={(e) => setSolutionCode(e.target.value)}
                      placeholder="Paste the optimal source code here..." 
                      className={`${textareaClasses} bg-slate-900 text-slate-50 border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20 selection:bg-emerald-500/30`} 
                    />
                  </div>

                  {/* Video Link */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-2 text-[14px] font-semibold text-slate-800">
                      <Video className="h-4 w-4 text-red-500" />
                      Video Walkthrough Link
                    </div>
                    <input 
                      type="url" 
                      value={videoLink}
                      onChange={(e) => setVideoLink(e.target.value)}
                      placeholder="e.g. https://youtube.com/watch?v=..." 
                      className={inputClasses} 
                    />
                  </div>

                </form>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
