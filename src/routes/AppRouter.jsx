import { Navigate, createBrowserRouter } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import AdminDashboard from "../pages/admin/dashboard/AdminDashboard";
import AdminContestsPage from "../pages/admin/contests/AdminContestsPage";
import CreateContestPage from "../pages/admin/contests/CreateContestPage";
import ProblemBankPage from "../pages/admin/problems/ProblemBankPage";
import CreateProblemPage from "../pages/admin/problems/CreateProblemPage";
import EditorialsPage from "../pages/admin/editorials/EditorialsPage";
import PublicLayout from "../components/layout/PublicLayout";
import LandingPage from "../pages/public/LandingPage";
import LoginPage from "../pages/public/LoginPage";
import SignupPage from "../pages/public/SignupPage";
import StudentLayout from "../components/layout/StudentLayout";
import ContestAnnouncementsPage from "../pages/student/contests/ContestAnnouncementsPage";
import ContestLayoutPage from "../pages/student/contests/ContestLayoutPage";
import ContestLeaderboardPage from "../pages/student/contests/ContestLeaderboardPage";
import ContestPage from "../pages/student/contests/ContestPage";
import ContestProblemsPage from "../pages/student/contests/ContestProblemsPage";
import ContestQueriesPage from "../pages/student/contests/ContestQueriesPage";
import ContestSubmissionsPage from "../pages/student/contests/ContestSubmissionsPage";
import PastContestsPage from "../pages/student/contests/PastContestsPage";
import StudentProblemBankPage from "../pages/student/problems/StudentProblemBankPage";
import ProfilePage from "../pages/student/profile/ProfilePage";

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [{ path: "/", element: <LandingPage /> }],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  {
    path: "/student",
    element: <StudentLayout />,
    children: [
      { path: "profile", element: <ProfilePage /> },
      { path: "contests", element: <ContestPage /> },
      { path: "contests/past", element: <PastContestsPage /> },
      { path: "problems", element: <StudentProblemBankPage /> },
      {
        path: "contests/:contestId",
        element: <ContestLayoutPage />,
        children: [
          { index: true, element: <Navigate to="problems" replace /> },
          { path: "problems", element: <ContestProblemsPage /> },
          { path: "submissions", element: <ContestSubmissionsPage /> },
          { path: "leaderboard", element: <ContestLeaderboardPage /> },
          { path: "announcements", element: <ContestAnnouncementsPage /> },
          { path: "queries", element: <ContestQueriesPage /> },
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "contests", element: <AdminContestsPage /> },
      { path: "contests/create", element: <CreateContestPage /> },
      { path: "problems", element: <ProblemBankPage /> },
      { path: "problems/create", element: <CreateProblemPage /> },
      { path: "editorials", element: <EditorialsPage /> },
    ],
  },
]);

export default router;
