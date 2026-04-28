import express from "express";
import {
  createProblem,
  deleteProblem,
  getMyProblem,
  getMyProblems,
  getProblemEditorial,
  saveProblemEditorial,
  updateProblem,
} from "../controllers/problem.controller.js";
import { requireAdmin, requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/mine", getMyProblems);
router.post("/", createProblem);
router.get("/:problemId/editorial", getProblemEditorial);
router.put("/:problemId/editorial", saveProblemEditorial);
router.get("/:problemId", getMyProblem);
router.patch("/:problemId", updateProblem);
router.delete("/:problemId", deleteProblem);

export default router;
