import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchContestSubmissions, } from "../../../features/contests/contestsThunks";
import { clearSubmissions } from "../../../features/contests/contestsSlice";
import {
  selectContestSubmissions,
  selectContestSubmissionsLoading,
  selectContestSubmissionsError,
} from "../../../features/contests/contestsSelectors";

const VERDICT_STYLES = {
  Accepted: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  "Wrong Answer": "bg-red-100 text-red-700 border border-red-200",
  "Time Limit Exceeded": "bg-amber-100 text-amber-700 border border-amber-200",
  "Runtime Error": "bg-purple-100 text-purple-700 border border-purple-200",
  "Compilation Error": "bg-slate-100 text-slate-600 border border-slate-200",
};

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function ContestSubmissionsPage() {
  const dispatch = useDispatch();
  const { contestId } = useParams();

  const submissions = useSelector(selectContestSubmissions);
  const isLoading = useSelector(selectContestSubmissionsLoading);
  const error = useSelector(selectContestSubmissionsError);

  useEffect(() => {
    dispatch(fetchContestSubmissions(contestId));
    return () => {
      dispatch(clearSubmissions());
    };
  }, [dispatch, contestId]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-400">
        Loading submissions...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!submissions.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-400">
        No submissions yet. Submit a solution to see it here.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="grid grid-cols-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
        <span>Problem</span>
        <span>Verdict</span>
        <span>Language</span>
        <span className="text-right">Time</span>
      </div>

      {/* Rows */}
      {submissions.map((sub, index) => (
        <div
          key={sub.id}
          className={`grid grid-cols-4 items-center px-5 py-3.5 text-sm transition hover:bg-slate-50 ${
            index !== submissions.length - 1 ? "border-b border-slate-100" : ""
          }`}
        >
          <span className="font-mono font-semibold text-slate-800">
            Problem {sub.problemCode}
          </span>

          <span>
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                VERDICT_STYLES[sub.verdict] || "bg-slate-100 text-slate-600"
              }`}
            >
              {sub.verdict}
            </span>
          </span>

          <span className="text-slate-600">{sub.language}</span>

          <span className="text-right text-slate-400">
            {timeAgo(sub.submittedAt)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default ContestSubmissionsPage;
