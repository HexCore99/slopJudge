import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2, Plus, Code, Target, Cpu, Clock, Tag, Star, Eye, EyeOff } from "lucide-react";
import StudentTopTabs from "../../../components/layout/StudentTopTabs";
import AdminMoreMenu from "../../../components/common/AdminMoreMenu";
import { ADMIN_NAV_TABS } from "../../../features/admin/adminNavTabs";

const ADMIN_CREATE_TABS = ADMIN_NAV_TABS.map((tab) => ({ ...tab, end: true }));

const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const COMMON_TAGS = [
  "Array", "String", "Hash Table", "Math", "Dynamic Programming", 
  "Sorting", "Greedy", "DFS", "BFS", "Tree", "Binary Search", "Graph"
];

export default function CreateProblemPage() {
  const [difficulty, setDifficulty] = useState("Medium");
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTags, setCustomTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  
  // Updated test case state to include 'isHidden' flag
  const [testCases, setTestCases] = useState([{ input: "", output: "", isHidden: false }]);

  const allTags = [...COMMON_TAGS, ...customTags];

  const handleToggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddNewTag = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      const tag = newTag.trim();
      if (tag && !allTags.includes(tag)) {
        setCustomTags([...customTags, tag]);
        setSelectedTags([...selectedTags, tag]); // Auto-select the newly added tag
      } else if (tag && allTags.includes(tag) && !selectedTags.includes(tag)) {
        setSelectedTags([...selectedTags, tag]); // Auto-select if it already exists but wasn't selected
      }
      setNewTag("");
    }
  };

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: "", output: "", isHidden: false }]);
  };

  const handleRemoveTestCase = (index) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const handleTestCaseChange = (index, field, value) => {
    const newTestCases = [...testCases];
    newTestCases[index][field] = value;
    setTestCases(newTestCases);
  };

  const inputClasses = "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-[14px] outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10";
  const textareaClasses = "w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-[14px] outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 font-mono text-[13px]";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[length:24px_24px]" />
      
      <div className="relative z-[1]">
        <StudentTopTabs
          tabs={ADMIN_CREATE_TABS}
          logoTo="/"
          navExtra={<AdminMoreMenu excludeAction="problem" />}
        />

        <main className="mx-auto max-w-7xl px-6 py-8 pb-20">
          <Link to="/admin/dashboard" className="mb-6 inline-flex items-center gap-2 text-[13px] font-medium text-slate-500 transition hover:text-slate-800">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create New Problem</h1>
              <p className="mt-1 text-[14px] text-slate-500">Define problem statement, limits, tags, scoring, and test cases.</p>
            </div>
            <div className="flex gap-3">
              <Link to="/admin/dashboard" className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
                Cancel
              </Link>
              <button className="rounded-xl bg-amber-600 px-6 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-amber-700">
                Save Problem
              </button>
            </div>
          </div>

          <form className="grid grid-cols-1 gap-6 lg:grid-cols-3" onSubmit={(e) => e.preventDefault()}>
            
            {/* ── Left Column: Statement & Test Cases (Takes up 2/3 space) ── */}
            <div className="space-y-6 lg:col-span-2">
              
              {/* Problem Details */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-2 text-[15px] font-semibold text-slate-800">
                  <Code className="h-4 w-4 text-amber-500" />
                  Problem Content
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="mb-1.5 block text-[13px] font-medium text-slate-700">Problem Title</label>
                    <input type="text" placeholder="e.g. Find Longest Palindromic Substring" className={inputClasses} />
                  </div>
                  
                  <div>
                    <label className="mb-1.5 block text-[13px] font-medium text-slate-700">Problem Statement (Markdown Supported)</label>
                    <textarea rows={8} placeholder="Describe the problem clearly..." className={textareaClasses} />
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-[13px] font-medium text-slate-700">Input Format</label>
                      <textarea rows={3} placeholder="Explain how input is structured..." className={textareaClasses} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[13px] font-medium text-slate-700">Output Format</label>
                      <textarea rows={3} placeholder="Explain what needs to be printed..." className={textareaClasses} />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[13px] font-medium text-slate-700">Constraints</label>
                    <textarea rows={3} placeholder="e.g. 1 <= N <= 10^5" className={textareaClasses} />
                  </div>
                </div>
              </div>

              {/* Test Cases */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[15px] font-semibold text-slate-800">
                    <Target className="h-4 w-4 text-emerald-500" />
                    Test Cases
                  </div>
                  <button 
                    type="button" 
                    onClick={handleAddTestCase}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-[12px] font-semibold text-slate-700 transition hover:bg-slate-200"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Case
                  </button>
                </div>

                <div className="space-y-4">
                  {testCases.map((tc, idx) => (
                    <div key={idx} className={`relative rounded-xl border p-4 pt-5 transition-colors ${tc.isHidden ? "border-amber-200 bg-amber-50/40" : "border-slate-100 bg-slate-50/50"}`}>
                      
                      <div className="absolute right-3 top-3 flex items-center gap-3">
                        {/* Hide/Show Toggle */}
                        <button
                          type="button"
                          onClick={() => handleTestCaseChange(idx, 'isHidden', !tc.isHidden)}
                          className={`flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider transition ${
                            tc.isHidden ? "text-amber-600" : "text-slate-400 hover:text-slate-600"
                          }`}
                          title="Toggle hidden test case (used for evaluation, but hidden from users)"
                        >
                          {tc.isHidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          {tc.isHidden ? "Hidden" : "Visible"}
                        </button>
                        
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Case {idx + 1}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                        <div>
                          <label className="mb-1.5 block text-[12px] font-medium text-slate-500">Input</label>
                          <textarea 
                            rows={3} 
                            value={tc.input}
                            onChange={(e) => handleTestCaseChange(idx, 'input', e.target.value)}
                            className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 font-mono text-[13px] outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10" 
                            placeholder="Input data"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-[12px] font-medium text-slate-500">Expected Output</label>
                          <textarea 
                            rows={3} 
                            value={tc.output}
                            onChange={(e) => handleTestCaseChange(idx, 'output', e.target.value)}
                            className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 font-mono text-[13px] outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10" 
                            placeholder="Expected output"
                          />
                        </div>
                      </div>
                      
                      {testCases.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => handleRemoveTestCase(idx)}
                          className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-red-500 hover:text-red-600 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right Column: Configuration (Takes up 1/3 space) ── */}
            <div className="space-y-6 lg:col-span-1">
              
              {/* Scoring & Difficulty */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-[14px] font-semibold text-slate-800">Scoring & Difficulty</h2>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-slate-700">
                      <Star className="h-3.5 w-3.5 text-amber-500" />
                      Points
                    </label>
                    <input type="number" defaultValue={100} className={`${inputClasses}`} placeholder="e.g. 100" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[13px] font-medium text-slate-700">Difficulty Level</label>
                    <div className="grid grid-cols-3 gap-2">
                      {DIFFICULTIES.map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDifficulty(d)}
                          className={`rounded-xl border py-2.5 text-[13px] font-medium transition ${
                            difficulty === d 
                              ? d === "Easy" ? "border-emerald-500 bg-emerald-50 text-emerald-700" 
                                : d === "Medium" ? "border-amber-500 bg-amber-50 text-amber-700"
                                : "border-red-500 bg-red-50 text-red-700"
                              : "border-slate-200 text-slate-500 hover:bg-slate-50"
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-1.5 text-[14px] font-semibold text-slate-800">
                  <Tag className="h-4 w-4 text-blue-500" />
                  Topic Tags
                </div>
                
                {/* Add new tag input */}
                <div className="mb-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Create a new tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleAddNewTag}
                    className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-[13px] outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                  />
                  <button 
                    type="button" 
                    onClick={handleAddNewTag}
                    className="rounded-xl bg-slate-100 px-3 py-2 text-[13px] font-medium text-slate-700 transition hover:bg-slate-200"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition ${
                          isSelected
                            ? "border-blue-300 bg-blue-50 text-blue-700"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Execution Limits */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-[14px] font-semibold text-slate-800">Execution Limits</h2>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-slate-700">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      Time Limit
                    </label>
                    <div className="relative">
                      <input type="number" defaultValue={1.0} step="0.1" className={`${inputClasses} pr-10`} />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-slate-400">sec</span>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-slate-700">
                      <Cpu className="h-3.5 w-3.5 text-slate-400" />
                      Memory Limit
                    </label>
                    <div className="relative">
                      <input type="number" defaultValue={256} className={`${inputClasses} pr-12`} />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-slate-400">MB</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </form>
        </main>
      </div>
    </div>
  );
}
