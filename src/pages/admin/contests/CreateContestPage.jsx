import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Globe,
  Lock,
  Search,
  Shield,
  Trophy,
  X,
} from "lucide-react";
import AdminMoreMenu from "../../../components/common/AdminMoreMenu";
import StudentTopTabs from "../../../components/layout/StudentTopTabs";
import { ADMIN_NAV_TABS } from "../../../features/admin/adminNavTabs";
import {
  selectContestsError,
  selectContestsLoading,
  selectLiveContests,
  selectPastContests,
  selectUpcomingContests,
} from "../../../features/contests/contestsSelectors";
import {
  fetchContests,
  updateContestScheduleThunk,
} from "../../../features/contests/contestsThunks";

const ADMIN_CREATE_TABS = ADMIN_NAV_TABS.map((tab) => ({ ...tab, end: true }));

const MOCK_PROBLEMS = [
  { id: 1, title: "Two Sum Variants", difficulty: "Easy", tag: "Array" },
  { id: 2, title: "Shortest Path in Grid", difficulty: "Medium", tag: "Graph" },
  { id: 3, title: "Longest Palindrome DP", difficulty: "Hard", tag: "DP" },
  {
    id: 4,
    title: "Binary Search on Answer",
    difficulty: "Medium",
    tag: "Binary Search",
  },
  {
    id: 5,
    title: "Cycle Detection in Graph",
    difficulty: "Medium",
    tag: "Graph",
  },
];

const EMPTY_FORM = {
  title: "",
  description: "",
  startTime: "",
  endTime: "",
  password: "",
};

function pad(value) {
  return String(value).padStart(2, "0");
}

function toDateTimeInputValue(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatDurationPreview(startTime, endTime) {
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return "";
  }

  const totalMinutes = Math.round(
    (endDate.getTime() - startDate.getTime()) / (60 * 1000),
  );

  if (totalMinutes <= 0) return "End time must be after start time";

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours && minutes) return `${hours}h ${minutes}m`;
  if (hours) return `${hours}h`;
  return `${minutes}m`;
}

function buildContestOptions(live, upcoming, past) {
  return [...live, ...upcoming, ...past].map((contest) => ({
    id: contest.id,
    title: contest.name,
    description: contest.desc || "",
    startTime: contest.startTime,
    endTime: contest.endTime,
    requiresPassword: Boolean(contest.requiresPassword),
    isRated: Boolean(contest.rated ?? contest.isRated),
  }));
}

export default function CreateContestPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { contestId } = useParams();
  const isEditMode = Boolean(contestId);

  const live = useSelector(selectLiveContests);
  const upcoming = useSelector(selectUpcomingContests);
  const past = useSelector(selectPastContests);
  const isLoading = useSelector(selectContestsLoading);
  const loadError = useSelector(selectContestsError);

  const [isPrivate, setIsPrivate] = useState(false);
  const [isRated, setIsRated] = useState(false);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formDraft, setFormDraft] = useState({
    key: null,
    values: {},
  });
  const [actionError, setActionError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchContests());
    }
  }, [dispatch, isEditMode]);

  const contests = useMemo(
    () => buildContestOptions(live, upcoming, past),
    [live, upcoming, past],
  );

  const editingContest = contests.find((contest) => contest.id === contestId);
  const formKey = contestId || "create";
  const baseFormData =
    isEditMode && editingContest
      ? {
          title: editingContest.title,
          description: editingContest.description,
          startTime: toDateTimeInputValue(editingContest.startTime),
          endTime: toDateTimeInputValue(editingContest.endTime),
          password: "",
        }
      : EMPTY_FORM;
  const draftValues = formDraft.key === formKey ? formDraft.values : {};
  const formData = { ...baseFormData, ...draftValues };
  const displayedIsRated = isEditMode
    ? Boolean(editingContest?.isRated)
    : isRated;
  const displayedIsPrivate = isEditMode
    ? Boolean(editingContest?.requiresPassword) && !displayedIsRated
    : isPrivate && !displayedIsRated;

  function handleToggleProblem(problem) {
    if (isEditMode) return;

    if (selectedProblems.find((p) => p.id === problem.id)) {
      setSelectedProblems(selectedProblems.filter((p) => p.id !== problem.id));
    } else {
      setSelectedProblems([...selectedProblems, problem]);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormDraft((prev) => ({
      key: formKey,
      values: {
        ...(prev.key === formKey ? prev.values : {}),
        [name]: value,
      },
    }));
  }

  function handleRatingChange(nextIsRated) {
    if (isEditMode) return;

    setIsRated(nextIsRated);

    if (nextIsRated) {
      setIsPrivate(false);
      setFormDraft((prev) => ({
        key: formKey,
        values: {
          ...(prev.key === formKey ? prev.values : {}),
          password: "",
        },
      }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!isEditMode) return;

    setIsSaving(true);
    setActionError(null);

    const result = await dispatch(
      updateContestScheduleThunk({
        contestId,
        startTime: formData.startTime,
        endTime: formData.endTime,
      }),
    );

    setIsSaving(false);

    if (updateContestScheduleThunk.fulfilled.match(result)) {
      navigate("/admin/contests");
      return;
    }

    setActionError(result.payload || "Failed to update contest time.");
  }

  const filteredProblems = MOCK_PROBLEMS.filter(
    (problem) =>
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.tag.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const durationPreview = formatDurationPreview(
    formData.startTime,
    formData.endTime,
  );
  const canSaveSchedule =
    formData.startTime &&
    formData.endTime &&
    new Date(formData.endTime) > new Date(formData.startTime);

  const inputClasses =
    "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-[14px] outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10";
  const lockedClasses = isEditMode ? "bg-slate-50 text-slate-500" : "";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[length:24px_24px]" />

      <div className="relative z-[1]">
        <StudentTopTabs
          tabs={ADMIN_CREATE_TABS}
          logoTo="/"
          navExtra={<AdminMoreMenu excludeAction="contest" />}
        />

        <main className="mx-auto max-w-7xl px-6 py-8 pb-20">
          <Link
            to="/admin/contests"
            className="mb-6 inline-flex items-center gap-2 text-[13px] font-medium text-slate-500 transition hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Contests
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {isEditMode ? "Edit Contest" : "Create New Contest"}
            </h1>
            <p className="mt-1 text-[14px] text-slate-500">
              {isEditMode
                ? "Update the contest schedule."
                : "Configure contest details, select problems, and set access controls."}
            </p>
          </div>

          {isEditMode && isLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-400">
              Loading contest...
            </div>
          ) : isEditMode && loadError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center text-sm text-red-600">
              {loadError}
            </div>
          ) : isEditMode && !editingContest ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-400">
              Contest not found.
            </div>
          ) : (
            <form
              className="grid grid-cols-1 gap-6 lg:grid-cols-3"
              onSubmit={handleSubmit}
            >
              <div className="space-y-6 lg:col-span-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-5 text-[15px] font-semibold text-slate-800">
                    General Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                        Contest Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        readOnly={isEditMode}
                        placeholder="e.g. Weekly Algo Sprint #15"
                        className={`${inputClasses} ${lockedClasses}`}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                        Description
                      </label>
                      <textarea
                        rows={6}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        readOnly={isEditMode}
                        placeholder="Describe the contest rules..."
                        className={`resize-none ${inputClasses} ${lockedClasses}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-[15px] font-semibold text-slate-800">
                      Select Problems
                    </h2>
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
                      {selectedProblems.length} Selected
                    </span>
                  </div>

                  <div className="relative mb-4">
                    <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search problems by name or tag..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      disabled={isEditMode}
                      className={`${inputClasses} pl-10 ${lockedClasses}`}
                    />
                  </div>

                  <div className="max-h-80 overflow-y-auto rounded-xl border border-slate-100">
                    {filteredProblems.map((problem) => {
                      const isSelected = selectedProblems.some(
                        (selected) => selected.id === problem.id,
                      );
                      return (
                        <div
                          key={problem.id}
                          onClick={() => handleToggleProblem(problem)}
                          className={`flex items-center justify-between border-b border-slate-100 p-3.5 transition last:border-0 hover:bg-slate-50 ${
                            isSelected ? "bg-amber-50/30" : ""
                          } ${isEditMode ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                        >
                          <div>
                            <div className="text-[13.5px] font-semibold text-slate-800">
                              {problem.title}
                            </div>
                            <div className="mt-1 flex gap-2 text-[11px] font-medium">
                              <span
                                className={
                                  problem.difficulty === "Easy"
                                    ? "text-emerald-600"
                                    : problem.difficulty === "Medium"
                                      ? "text-amber-600"
                                      : "text-red-600"
                                }
                              >
                                {problem.difficulty}
                              </span>
                              <span className="text-slate-400">•</span>
                              <span className="text-slate-500">
                                {problem.tag}
                              </span>
                            </div>
                          </div>
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded border transition ${
                              isSelected
                                ? "border-amber-500 bg-amber-500 text-white"
                                : "border-slate-300 bg-white"
                            }`}
                          >
                            {isSelected && (
                              <X className="h-3.5 w-3.5 rotate-45" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-6 lg:col-span-1">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-5 text-[15px] font-semibold text-slate-800">
                    Schedule
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                        Start Time
                      </label>
                      <div className="relative">
                        <Calendar className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="datetime-local"
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleChange}
                          className={`${inputClasses} pl-10`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                        End Time
                      </label>
                      <div className="relative">
                        <Clock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="datetime-local"
                          name="endTime"
                          value={formData.endTime}
                          onChange={handleChange}
                          className={`${inputClasses} pl-10`}
                        />
                      </div>
                    </div>
                    {durationPreview && (
                      <p
                        className={`rounded-xl px-4 py-2 text-sm ${
                          canSaveSchedule
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        Duration: {durationPreview}
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-5 text-[15px] font-semibold text-slate-800">
                    Contest Rating
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      disabled={isEditMode}
                      onClick={() => handleRatingChange(true)}
                      className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        displayedIsRated
                          ? "border-amber-400 bg-amber-50 text-amber-700"
                          : "border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <Trophy className="h-5 w-5" />
                      <span className="text-[12px] font-semibold">Rated</span>
                    </button>
                    <button
                      type="button"
                      disabled={isEditMode}
                      onClick={() => handleRatingChange(false)}
                      className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        !displayedIsRated
                          ? "border-amber-400 bg-amber-50 text-amber-700"
                          : "border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <Shield className="h-5 w-5" />
                      <span className="text-[12px] font-semibold">
                        Unrated
                      </span>
                    </button>
                  </div>

                  {displayedIsRated && (
                    <p className="mt-4 rounded-xl bg-amber-50 px-4 py-2 text-sm text-amber-700">
                      Rated contests are public only, so private access is
                      disabled.
                    </p>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-5 text-[15px] font-semibold text-slate-800">
                    Access Control
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      disabled={isEditMode}
                      onClick={() => setIsPrivate(false)}
                      className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        !displayedIsPrivate
                          ? "border-amber-400 bg-amber-50 text-amber-700"
                          : "border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <Globe className="h-5 w-5" />
                      <span className="text-[12px] font-semibold">Public</span>
                    </button>
                    <button
                      type="button"
                      disabled={isEditMode || displayedIsRated}
                      onClick={() => setIsPrivate(true)}
                      className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        displayedIsPrivate
                          ? "border-amber-400 bg-amber-50 text-amber-700"
                          : "border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <Lock className="h-5 w-5" />
                      <span className="text-[12px] font-semibold">Private</span>
                    </button>
                  </div>

                  {displayedIsPrivate && (
                    <div className="mt-4 animate-[fadeSlideDown_0.2s_ease]">
                      <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                        Contest Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isEditMode}
                        placeholder="Enter password..."
                        className={`${inputClasses} ${lockedClasses}`}
                      />
                    </div>
                  )}
                </div>

                {actionError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {actionError}
                  </div>
                )}

                <div className="flex flex-col gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isEditMode && (isSaving || !canSaveSchedule)}
                    className="w-full rounded-xl bg-amber-600 px-6 py-3 text-[14px] font-semibold text-white shadow-sm transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isEditMode
                      ? isSaving
                        ? "Saving..."
                        : "Save Time"
                      : "Create Contest"}
                  </button>
                  <Link
                    to="/admin/contests"
                    className="w-full rounded-xl border border-slate-200 px-6 py-3 text-center text-[14px] font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
