import { useEffect, useMemo, useState } from "react";
import { History } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import StudentTopTabs from "../../components/layout/StudentTopTabs";
import ContestPageHeader from "../../components/contest/ContestPageHeader";
import PastContestTable from "../../components/contest/PastContestTable";
import {
  selectContestsError,
  selectContestsHasFetched,
  selectContestsLoading,
  selectPastContests,
} from "../../features/contests/contestsSelectors";
import { fetchContests } from "../../features/contests/contestsThunks";

function PastContestsPage() {
  const dispatch = useDispatch();

  const pastContests = useSelector(selectPastContests);
  const isLoading = useSelector(selectContestsLoading);
  const hasFetched = useSelector(selectContestsHasFetched);
  const error = useSelector(selectContestsError);

  const [pastFilter, setPastFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!hasFetched) {
      dispatch(fetchContests());
    }
  }, [dispatch, hasFetched]);

  const query = search.trim().toLowerCase();

  const searchMatch = ({ name = "", desc = "", type = "", tags = [] }) => {
    if (!query) return true;

    const haystack = [name, desc, type, ...tags].join(" ").toLowerCase();
    return haystack.includes(query);
  };

  const filteredPast = useMemo(() => {
    return pastContests.filter((contest) => {
      const matchesRated =
        pastFilter === "all" ||
        (pastFilter === "rated" && contest.rated) ||
        (pastFilter === "unrated" && !contest.rated);

      return matchesRated && searchMatch(contest);
    });
  }, [pastContests, pastFilter, query]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <StudentTopTabs logoTo="/" />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <ContestPageHeader
          title="Past Contests"
          subtitle="Browse all previous contests"
          search={search}
          setSearch={setSearch}
          searchPlaceholder="Search past contests by name, type, or tag..."
          icon={History}
        />

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading && !hasFetched ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center text-sm text-slate-500 shadow-sm">
            Loading past contests...
          </div>
        ) : (
          <PastContestTable
            contests={filteredPast}
            pastFilter={pastFilter}
            setPastFilter={setPastFilter}
          />
        )}
      </main>
    </div>
  );
}

export default PastContestsPage;
