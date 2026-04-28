import {
  createProblemForAuthor,
  deleteProblemForAuthor,
  getEditorialForAuthor,
  getProblemForAuthor,
  getProblemsForAuthor,
  saveEditorialForAuthor,
  updateProblemForAuthor,
} from "../services/problem.service.js";
import { errorResponse, successResponse } from "../utils/response.js";
import {
  validateProblemId,
  validateProblemPayload,
  validateEditorialPayload,
} from "../validators/problem.validator.js";

export async function getMyProblems(req, res) {
  try {
    const data = await getProblemsForAuthor(req.user.id);
    return successResponse(res, 200, "Problems fetched.", { items: data });
  } catch (error) {
    console.error("Get problems error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to fetch problems.",
    );
  }
}

export async function getMyProblem(req, res) {
  try {
    const { problemId } = req.params;
    const idError = validateProblemId(problemId);

    if (idError) {
      return errorResponse(res, 400, idError);
    }

    const data = await getProblemForAuthor(req.user.id, problemId);
    return successResponse(res, 200, "Problem fetched.", { item: data });
  } catch (error) {
    console.error("Get problem error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to fetch problem.",
    );
  }
}

export async function createProblem(req, res) {
  try {
    const payloadError = validateProblemPayload(req.body);

    if (payloadError) {
      return errorResponse(res, 400, payloadError);
    }

    const data = await createProblemForAuthor(req.user.id, req.body);
    return successResponse(res, 201, "Problem created.", { item: data });
  } catch (error) {
    console.error("Create problem error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to create problem.",
    );
  }
}

export async function updateProblem(req, res) {
  try {
    const { problemId } = req.params;
    const idError = validateProblemId(problemId);

    if (idError) {
      return errorResponse(res, 400, idError);
    }

    const payloadError = validateProblemPayload(req.body);

    if (payloadError) {
      return errorResponse(res, 400, payloadError);
    }

    const data = await updateProblemForAuthor(req.user.id, problemId, req.body);
    return successResponse(res, 200, "Problem updated.", { item: data });
  } catch (error) {
    console.error("Update problem error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to update problem.",
    );
  }
}

export async function deleteProblem(req, res) {
  try {
    const { problemId } = req.params;
    const idError = validateProblemId(problemId);

    if (idError) {
      return errorResponse(res, 400, idError);
    }

    const data = await deleteProblemForAuthor(req.user.id, problemId);
    return successResponse(res, 200, "Problem deleted.", data);
  } catch (error) {
    console.error("Delete problem error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to delete problem.",
    );
  }
}

export async function getProblemEditorial(req, res) {
  try {
    const { problemId } = req.params;
    const idError = validateProblemId(problemId);

    if (idError) {
      return errorResponse(res, 400, idError);
    }

    const data = await getEditorialForAuthor(req.user.id, problemId);
    return successResponse(res, 200, "Editorial fetched.", { item: data });
  } catch (error) {
    console.error("Get editorial error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to fetch editorial.",
    );
  }
}

export async function saveProblemEditorial(req, res) {
  try {
    const { problemId } = req.params;
    const idError = validateProblemId(problemId);

    if (idError) {
      return errorResponse(res, 400, idError);
    }

    const payloadError = validateEditorialPayload(req.body);

    if (payloadError) {
      return errorResponse(res, 400, payloadError);
    }

    const data = await saveEditorialForAuthor(req.user.id, problemId, req.body);
    return successResponse(res, 200, "Editorial saved.", { item: data });
  } catch (error) {
    console.error("Save editorial error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to save editorial.",
    );
  }
}
