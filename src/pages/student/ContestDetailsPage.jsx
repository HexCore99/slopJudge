import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import StudentTopTabs from "../../components/layout/StudentTopTabs";
import ContestDetailsHeader from "../../components/contest/contestDetails/ContestDetailsHeader";
import ContestTabs from "../../components/contest/contestDetails/ContestTabs";
import ContestProblemsTable from "../../components/contest/problems/ContestProblemsTable";
import Loading from "../../components/common/Loading";
import Error from "../../components/common/Error";
import { clearContestDetails } from "../../features/contests/contestSlice";
import {
  selectContestDetails,
  selectContestDetailsError,
  selectContestDetailsLoading,
} from "../../features/contests/contestsSelectors";
import { fetchContestDetails } from "../../features/contests/contestsThunks";

function ContestDetailsPage() {
  const dispatch = useDispatch();
  const { contestId } = useParams();

  const contestDetails = useSelector(selectContestDetails);
  const isLoading = useSelector(selectContestDetailsLoading);
  const error = useSelector(selectContestDetailsError);

  const [activeTab, setActiveTab] = useState("Problems");

  useEffect(() => {
    dispatch(fetchContestDetails(contestId));

    return () => {
      dispatch(clearContestDetails());
    };
  }, [dispatch, contestId]);

  useEffect(() => {
    setActiveTab("Problems");
  }, [contestId]);

  const tabContent = useMemo(() => {
    if (!contestDetails) return null;

    return <ContestProblemsTable problems={contestDetails.problems || []} />;
  }, [contestDetails]);

  if (isLoading) {
    return <Loading description="Loading contest details..." />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <StudentTopTabs activeTab="Contests" logoTo="/" />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-4">
          <Link
            to="/student/contests"
            className="text-sm font-medium text-amber-700 hover:text-amber-800"
          >
            ← Back to contests
          </Link>
        </div>

        {contestDetails ? (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <ContestDetailsHeader
              title={contestDetails.title}
              statusText={contestDetails.statusText}
              duration={contestDetails.duration}
            />

            <div className="p-6">
              <ContestTabs
                tabs={contestDetails.tabs || []}
                activeTab={activeTab}
                onChange={setActiveTab}
              />

              {tabContent}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default ContestDetailsPage;