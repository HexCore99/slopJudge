import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BarChart3, RefreshCw } from "lucide-react";
import StudentTopTabs from "../../../components/layout/StudentTopTabs";
import GlobalLeaderboardTable from "../../../features/leaderboard/components/GlobalLeaderboardTable";
import {
  selectGlobalLeaderboard,
  selectGlobalLeaderboardError,
  selectGlobalLeaderboardLoading,
} from "../../../features/leaderboard/leaderboardSelectors";
import { fetchGlobalLeaderboard } from "../../../features/leaderboard/leaderboardThunks";

function buildMockLeaderboard() {
  const names = [
    "cipher_x",
    "neovim_god",
    "segfault7",
    "nullptr_t",
    "bytewitch",
    "rekursiv",
    "hashbrown",
    "queuepain",
    "loophole9",
    "stackover",
    "ac_machine",
    "binSearch",
    "greedy_pig",
    "dp_wizard",
    "bitmaskPR",
    "heapify_me",
    "xorshift99",
    "carry_bit",
    "prefixsum",
    "suffix_arr",
  ];

  const baseRatings = [
    2510, 2380, 2245, 2110, 1980, 1870, 1750, 1650, 1580, 1490, 1420, 1360,
    1290, 1240, 1185, 1140, 1090, 1050, 1010, 980,
  ];

  return names.map((username, index) => ({
    rank: index + 1,
    userId: `u${index + 1}`,
    username,
    rating: baseRatings[index],
    totalSolved: Math.max(0, Math.round(baseRatings[index] / 10 - 48 - index)),
  }));
}

const MOCK_LEADERBOARD = buildMockLeaderboard();

function GlobalLeaderboardPage() {
  const dispatch = useDispatch();
  const entries = useSelector(selectGlobalLeaderboard);
  const isLoading = useSelector(selectGlobalLeaderboardLoading);
  const error = useSelector(selectGlobalLeaderboardError);

  useEffect(() => {
    dispatch(fetchGlobalLeaderboard());
  }, [dispatch]);

  const displayEntries = entries?.length > 0 ? entries : MOCK_LEADERBOARD;

  function handleRefresh() {
    dispatch(fetchGlobalLeaderboard());
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#faf9f7]">
      <StudentTopTabs />

      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-amber-600" />
            <h1 className="text-lg font-bold text-slate-800">
              Global Leaderboard
            </h1>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-700">
            Showing demo leaderboard because the API is unavailable: {error}
          </div>
        )}

        {isLoading && !displayEntries.length ? (
          <div className="space-y-2">
            {[...Array(10)].map((_, index) => (
              <div
                key={index}
                className="h-12 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        ) : (
          <GlobalLeaderboardTable entries={displayEntries} />
        )}
      </div>
    </div>
  );
}

export default GlobalLeaderboardPage;
