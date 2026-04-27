import express from "express";
import {
  getContestDetails,
  getContests,
  registerContest,
  verifyContestPassword,
  getSubmissions,
  getLeaderboard,
  getAnnouncements,
  getQueries,
  postQuery,
} from "../controllers/contest.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getContests);
router.get("/:contestId", getContestDetails);
router.post("/:contestId/register", registerContest);
router.post("/:contestId/verify-password", verifyContestPassword);
router.get("/:contestId/submissions", getSubmissions);
router.get("/:contestId/leaderboard", getLeaderboard);
router.get("/:contestId/announcements", getAnnouncements);
router.get("/:contestId/queries", getQueries);
router.post("/:contestId/queries", postQuery);

export default router;
