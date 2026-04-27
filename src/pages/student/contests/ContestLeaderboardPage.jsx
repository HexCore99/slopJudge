import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchContestLeaderboard } from "../../../features/contests/contestsThunks";
import { clearLeaderboard } from "../../../features/contests/contestsSlice";
import {
  selectContestLeaderboard,
  selectContestLeaderboardLoading,
  selectContestLeaderboardError,
} from "../../../features/contests/contestsSelectors";

const RANK_MEDAL = { 1: "🥇", 2: "🥈", 3: "🥉" };

function ContestLeaderboardPage() {
  const dispatch = useDispatch();
  const { contestId } = useParams();

  const leaderboard = useSelector(selectContestLeaderboard);
  const isLoading = useSelector(selectContestLeaderboardLoading);
  const error = useSelector(selectContestLeaderboardError);

  useEffect(() => {
    dispatch(fetchContestLeaderboard(contestId));
    return () => {
      dispatch(clearLeaderboard());
    };
  }, [dispatch, contestId]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-400">
        Loading leaderboard...
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

  if (!leaderboard.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-400">
        No participants yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="grid grid-cols-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
        <span>Rank</span>
        <span>Participant</span>
        <span className="text-center">Solved</span>
        <span className="text-right">Penalty (min)</span>
      </div>

      {/* Rows */}
      {leaderboard.map((entry, index) => (
        <div
          key={entry.userId}
          className={`grid grid-cols-4 items-center px-5 py-3.5 text-sm transition ${
            entry.isMe
              ? "bg-amber-50 font-semibold"
              : "hover:bg-slate-50"
          } ${index !== leaderboard.length - 1 ? "border-b border-slate-100" : ""}`}
        >
          {/* Rank */}
          <span className="font-mono font-bold text-slate-700">
            {RANK_MEDAL[entry.rank] || `#${entry.rank}`}
          </span>

          {/* Username */}
          <span
            className={`flex items-center gap-2 ${
              entry.isMe ? "text-amber-700" : "text-slate-800"
            }`}
          >
            {entry.username}
            {entry.isMe && (
              <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                You
              </span>
            )}
          </span>

          {/* Solved */}
          <span className="text-center font-semibold text-slate-700">
            {entry.solved}
          </span>

          {/* Penalty */}
          <span className="text-right text-slate-500">{entry.penalty}</span>
        </div>
      ))}
    </div>
  );
}

export default ContestLeaderboardPage;
