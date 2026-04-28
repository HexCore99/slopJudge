import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { clearSubmissions } from "../../../features/contests/contestsSlice";
import {
  selectContestSubmissions,
  selectContestSubmissionsError,
  selectContestSubmissionsLoading,
} from "../../../features/contests/contestsSelectors";
import { fetchContestSubmissions } from "../../../features/contests/contestsThunks";

const VERDICT_STYLES = {
  Accepted: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  "Wrong Answer": "bg-red-100 text-red-700 border border-red-200",
  "Time Limit Exceeded": "bg-amber-100 text-amber-700 border border-amber-200",
  "Runtime Error": "bg-purple-100 text-purple-700 border border-purple-200",
  "Compilation Error": "bg-slate-100 text-slate-600 border border-slate-200",
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AdminContestSubmissionsPage() {
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
        No submissions yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="grid grid-cols-5 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">
        <span>Participant</span>
        <span>Problem</span>
        <span>Verdict</span>
        <span>Language</span>
        <span className="text-right">Submitted</span>
      </div>

      {submissions.map((sub, index) => (
        <div
          key={sub.id}
          className={`grid grid-cols-5 items-center px-5 py-3.5 text-sm transition hover:bg-slate-50 ${
            index !== submissions.length - 1 ? "border-b border-slate-100" : ""
          }`}
        >
          <span className="font-semibold text-slate-800">{sub.username}</span>
          <span className="font-mono font-semibold text-slate-700">
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
            {formatDate(sub.submittedAt)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default AdminContestSubmissionsPage;
