import { useState, useCallback, useEffect, useRef } from "react";
import StudentTopTabs from "../../../components/layout/StudentTopTabs";
import ProfileHero from "./components/ProfileHero";

import ProfileTabs from "./components/ProfileTabs";
import OverviewPanel from "./components/OverviewPanel";
import SubmissionsPanel from "./components/SubmissionsPanel";
import ActivityPanel from "./components/ActivityPanel";
import ContestsPanel from "./components/ContestsPanel";
import EditProfileModal from "./components/EditProfileModal";
import SubmissionSlidePanel from "./components/SubmissionSlidePanel";
import ToastContainer from "./components/Toast";
import {
  profileUser as initialUser,
  submissions,
  contests,
  achievements,
  activities,
  difficulties,
} from "./data/profileMockData";

let toastIdCounter = 0;

export default function ProfilePage() {
  const [user, setUser] = useState(initialUser);
  const [activeTab, setActiveTab] = useState("overview");
  const [editOpen, setEditOpen] = useState(false);
  const [slideSubmission, setSlideSubmission] = useState(null);
  const [slideOpen, setSlideOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Reveal animation
  const revealRefs = useRef([]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("opacity-100", "translate-y-0");
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );
    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addRevealRef = useCallback((el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  }, []);

  // Toast helpers
  const toast = useCallback((msg, type = "info") => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, msg, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Edit profile
  function handleSave(data) {
    setUser((prev) => ({ ...prev, ...data }));
    setEditOpen(false);
    toast("Profile updated successfully", "success");
  }

  // Submission panel
  function openSubmission(idx) {
    if (idx >= 0 && idx < submissions.length) {
      setSlideSubmission(submissions[idx]);
      setSlideOpen(true);
    }
  }

  function closeSubmission() {
    setSlideOpen(false);
  }

  // Keyboard escape
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") {
        setEditOpen(false);
        setSlideOpen(false);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-[Space_Grotesk,sans-serif] text-slate-800">
      {/* Background layers */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:24px_24px]" />
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute -top-[15%] -left-[10%] h-[55%] w-[55%]"
          style={{
            background:
              "radial-gradient(ellipse, rgba(194,133,10,0.04) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -right-[8%] -bottom-[20%] h-[50%] w-[50%]"
          style={{
            background:
              "radial-gradient(ellipse, rgba(37,99,235,0.025) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Toast container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Edit modal */}
      <EditProfileModal
        isOpen={editOpen}
        user={user}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
      />

      {/* Submission slide panel */}
      <SubmissionSlidePanel
        submission={slideSubmission}
        isOpen={slideOpen}
        onClose={closeSubmission}
        onToast={toast}
      />

      {/* Main content */}
      <div className="relative z-[1]">
        <StudentTopTabs
          tabs={[
            { key: "Problems", to: "/student/problems" },
            { key: "Contests", to: "/student/contests" },
            { key: "Leaderboard", to: "/student/leaderboard" },
            { key: "Profile", to: "/student/profile" },
          ]}
          logoTo="/"
        />

        <main className="mx-auto max-w-7xl px-6 py-8">
          {/* Tabs */}
          <div
            ref={addRevealRef}
            className="translate-y-6 opacity-0 transition-all duration-600"
            style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
          >
            <ProfileTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              contestCount={contests.length}
            />
          </div>

          {/* Profile hero */}
          <div
            ref={addRevealRef}
            className="translate-y-6 opacity-0 transition-all duration-600"
            style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
          >
            <ProfileHero
              user={user}
              difficulties={difficulties}
              achievements={achievements}
              onEditClick={() => setEditOpen(true)}
              onShareClick={() => toast("Profile link copied", "success")}
            />
          </div>



          {/* Tab panels */}
          <div
            ref={addRevealRef}
            className="translate-y-6 opacity-0 transition-all duration-600"
            style={{
              transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
              transitionDelay: "200ms",
            }}
          >
            {activeTab === "overview" && <OverviewPanel />}

            {activeTab === "submissions" && (
              <SubmissionsPanel
                submissions={submissions}
                allSubmissions={submissions}
                onOpenSubmission={openSubmission}
                onToast={toast}
              />
            )}

            {activeTab === "activity" && (
              <ActivityPanel
                activities={activities}
                submissions={submissions}
                onOpenSubmission={openSubmission}
              />
            )}

            {activeTab === "contests" && (
              <ContestsPanel contests={contests} onToast={toast} />
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 border-t border-black/7 py-6">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 text-xs text-slate-500 md:flex-row">
            <span>QuickJudge V2.0 — Built for competitive learners</span>
            <div className="flex gap-4">
              <a
                href="#"
                className="transition-colors hover:text-slate-800"
              >
                Documentation
              </a>
              <a
                href="#"
                className="transition-colors hover:text-slate-800"
              >
                API
              </a>
              <a
                href="#"
                className="transition-colors hover:text-slate-800"
              >
                Support
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
