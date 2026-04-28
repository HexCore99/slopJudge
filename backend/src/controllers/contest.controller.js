import {
  getContestDetailsById,
  getContestsForUser,
  registerUserForUpcomingContest,
  verifyContestPasswordAccess,
  getContestSubmissions,
  getContestLeaderboard,
  getContestAnnouncements,
  getContestQueries,
  submitContestQuery,
  createContestAnnouncement,
  updateContestAnnouncement,
  deleteContestAnnouncement,
  replyToContestQuery,
  updateContestSchedule,
  deleteContestById,
} from "../services/contest.service.js";
import { errorResponse, successResponse } from "../utils/response.js";
import {
  validateAnnouncementPayload,
  validateContestId,
  validateContestPassword,
  validateContestSchedulePayload,
  validateNumericId,
  validateQueryAnswer,
} from "../validators/contest.validator.js";

export async function getContests(req, res) {
  try {
    const data = await getContestsForUser(req.user.id);

    return successResponse(res, 200, "Contests fetched successfully.", data);
  } catch (error) {
    console.error("Get contests error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to fetch contests.",
    );
  }
}

export async function getContestDetails(req, res) {
  try {
    const contestId = req.params.contestId;
    const validationError = validateContestId(contestId);

    if (validationError) {
      return errorResponse(res, 400, validationError);
    }

    const data = await getContestDetailsById(
      req.user.id,
      contestId,
      req.user.role,
    );

    return successResponse(
      res,
      200,
      "Contest details fetched successfully.",
      data,
    );
  } catch (error) {
    console.error("Get contest details error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to fetch contest details.",
    );
  }
}

export async function updateSchedule(req, res) {
  try {
    const { contestId } = req.params;
    const contestIdError = validateContestId(contestId);

    if (contestIdError) {
      return errorResponse(res, 400, contestIdError);
    }

    const scheduleError = validateContestSchedulePayload(req.body);

    if (scheduleError) {
      return errorResponse(res, 400, scheduleError);
    }

    const data = await updateContestSchedule(contestId, req.body);
    return successResponse(res, 200, "Contest schedule updated.", data);
  } catch (error) {
    console.error("Update contest schedule error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to update contest schedule.",
    );
  }
}

export async function deleteContest(req, res) {
  try {
    const { contestId } = req.params;
    const contestIdError = validateContestId(contestId);

    if (contestIdError) {
      return errorResponse(res, 400, contestIdError);
    }

    const data = await deleteContestById(contestId);
    return successResponse(res, 200, "Contest deleted.", data);
  } catch (error) {
    console.error("Delete contest error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to delete contest.",
    );
  }
}

export async function registerContest(req, res) {
  try {
    const contestId = req.params.contestId;
    const validationError = validateContestId(contestId);

    if (validationError) {
      return errorResponse(res, 400, validationError);
    }

    const data = await registerUserForUpcomingContest(req.user.id, contestId);

    return successResponse(res, 200, "Contest registration successful.", data);
  } catch (error) {
    console.error("Register contest error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to register for contest.",
    );
  }
}

export async function verifyContestPassword(req, res) {
  try {
    const contestId = req.params.contestId;
    const contestIdError = validateContestId(contestId);

    if (contestIdError) {
      return errorResponse(res, 400, contestIdError);
    }

    const passwordError = validateContestPassword(req.body.password);

    if (passwordError) {
      return errorResponse(res, 400, passwordError);
    }

    const data = await verifyContestPasswordAccess(
      req.user.id,
      contestId,
      req.body.password,
    );

    return successResponse(
      res,
      200,
      "Contest password verified successfully.",
      data,
    );
  } catch (error) {
    console.error("Verify contest password error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Password verification failed.",
    );
  }
}

export async function getSubmissions(req, res) {
  try {
    const { contestId } = req.params;
    const data = await getContestSubmissions(
      req.user.id,
      contestId,
      req.user.role,
    );
    return successResponse(res, 200, "Submissions fetched.", { items: data });
  } catch (error) {
    console.error("Get submissions error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to fetch submissions.",
    );
  }
}

export async function getLeaderboard(req, res) {
  try {
    const { contestId } = req.params;
    const data = await getContestLeaderboard(contestId, req.user.id);
    return successResponse(res, 200, "Leaderboard fetched.", { items: data });
  } catch (error) {
    console.error("Get leaderboard error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to fetch leaderboard.",
    );
  }
}

export async function getAnnouncements(req, res) {
  try {
    const { contestId } = req.params;
    const data = await getContestAnnouncements(contestId);
    return successResponse(res, 200, "Announcements fetched.", { items: data });
  } catch (error) {
    console.error("Get announcements error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to fetch announcements.",
    );
  }
}

export async function createAnnouncement(req, res) {
  try {
    const { contestId } = req.params;
    const contestIdError = validateContestId(contestId);

    if (contestIdError) {
      return errorResponse(res, 400, contestIdError);
    }

    const payloadError = validateAnnouncementPayload(req.body);

    if (payloadError) {
      return errorResponse(res, 400, payloadError);
    }

    const data = await createContestAnnouncement(contestId, req.body);
    return successResponse(res, 201, "Announcement created.", { item: data });
  } catch (error) {
    console.error("Create announcement error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to create announcement.",
    );
  }
}

export async function updateAnnouncement(req, res) {
  try {
    const { contestId, announcementId } = req.params;
    const contestIdError = validateContestId(contestId);

    if (contestIdError) {
      return errorResponse(res, 400, contestIdError);
    }

    const idError = validateNumericId(announcementId, "Announcement id");

    if (idError) {
      return errorResponse(res, 400, idError);
    }

    const payloadError = validateAnnouncementPayload(req.body);

    if (payloadError) {
      return errorResponse(res, 400, payloadError);
    }

    const data = await updateContestAnnouncement(
      contestId,
      announcementId,
      req.body,
    );
    return successResponse(res, 200, "Announcement updated.", { item: data });
  } catch (error) {
    console.error("Update announcement error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to update announcement.",
    );
  }
}

export async function deleteAnnouncement(req, res) {
  try {
    const { contestId, announcementId } = req.params;
    const contestIdError = validateContestId(contestId);

    if (contestIdError) {
      return errorResponse(res, 400, contestIdError);
    }

    const idError = validateNumericId(announcementId, "Announcement id");

    if (idError) {
      return errorResponse(res, 400, idError);
    }

    const data = await deleteContestAnnouncement(contestId, announcementId);
    return successResponse(res, 200, "Announcement deleted.", data);
  } catch (error) {
    console.error("Delete announcement error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to delete announcement.",
    );
  }
}

export async function getQueries(req, res) {
  try {
    const { contestId } = req.params;
    const data = await getContestQueries(contestId);
    return successResponse(res, 200, "Queries fetched.", { items: data });
  } catch (error) {
    console.error("Get queries error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to fetch queries.",
    );
  }
}

export async function postQuery(req, res) {
  try {
    const { contestId } = req.params;
    const { question } = req.body;
    const data = await submitContestQuery(req.user.id, contestId, question);
    return successResponse(res, 201, "Query submitted.", { item: data });
  } catch (error) {
    console.error("Post query error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to submit query.",
    );
  }
}

export async function replyQuery(req, res) {
  try {
    const { contestId, queryId } = req.params;
    const contestIdError = validateContestId(contestId);

    if (contestIdError) {
      return errorResponse(res, 400, contestIdError);
    }

    const idError = validateNumericId(queryId, "Query id");

    if (idError) {
      return errorResponse(res, 400, idError);
    }

    const answerError = validateQueryAnswer(req.body.answer);

    if (answerError) {
      return errorResponse(res, 400, answerError);
    }

    const data = await replyToContestQuery(contestId, queryId, req.body.answer);
    return successResponse(res, 200, "Query replied.", { item: data });
  } catch (error) {
    console.error("Reply query error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to reply to query.",
    );
  }
}
