import { useSelector, useDispatch } from "react-redux";
import { MessageSquare } from "lucide-react";
import StudentTopTabs from "../../../components/layout/StudentTopTabs";
import DiscussionList from "./components/DiscussionList";
import DiscussionDetail from "./components/DiscussionDetail";
import CreateDiscussionForm from "./components/CreateDiscussionForm";
import EmptyState from "./components/EmptyState";
import { selectMode } from "../../../features/discussions/discussionsSelectors";
import { startCreating } from "../../../features/discussions/discussionsSlice";

export default function DiscussionPage() {
  const dispatch = useDispatch();
  const mode = useSelector(selectMode);

  function renderRightPanel() {
    switch (mode) {
      case "creating":
        return <CreateDiscussionForm />;
      case "viewing":
        return <DiscussionDetail />;
      default:
        return <EmptyState onCreateClick={() => dispatch(startCreating())} />;
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <StudentTopTabs
        tabs={[
          { key: "Problems", to: "/student/problems" },
          { key: "Contests", to: "/student/contests" },
          { key: "Leaderboard", to: "/student/leaderboard" },
          { key: "Discuss", to: "/student/discuss" },
        ]}
        logoTo="/"
      />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-8">
        {/* Hero */}
        <section className="mb-6">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-200/90 bg-amber-50/70 text-amber-700 shadow-sm">
              <MessageSquare className="h-4.5 w-4.5" />
            </div>
            <div>
              <h1 className="text-[48px] leading-none font-bold tracking-[-0.04em] text-slate-800 md:text-[56px]">
                Discussions
              </h1>
              <p className="mt-1.5 text-[14px] font-medium tracking-[0.01em] text-slate-500 md:text-[15px]">
                Join or start a conversation with the community
              </p>
            </div>
          </div>
        </section>

        {/* Split Panel */}
        <div className="flex flex-1 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          {/* Left — Discussion List */}
          <div className="w-[340px] shrink-0 border-r border-slate-200/80 bg-slate-50/60">
            <DiscussionList />
          </div>

          {/* Right — Detail / Create / Empty */}
          <div className="flex min-w-0 flex-1 flex-col">{renderRightPanel()}</div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-black/7 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 text-xs text-slate-500 md:flex-row">
          <span>QuickJudge V2.0 — Built for competitive learners</span>
          <div className="flex gap-4">
            <a href="#" className="transition-colors hover:text-slate-800">
              Documentation
            </a>
            <a href="#" className="transition-colors hover:text-slate-800">
              API
            </a>
            <a href="#" className="transition-colors hover:text-slate-800">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
