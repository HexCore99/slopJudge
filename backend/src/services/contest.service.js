import bcrypt from "bcrypt";
import { pool } from "../config/db.js";

const CONTEST_FILTERS = [
  { key: "all", label: "All" },
  { key: "live", label: "Live" },
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
];

function createServiceError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function formatDate(dateValue) {
  const date = new Date(dateValue);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatTime(dateValue) {
  const date = new Date(dateValue);
  return `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())} UTC`;
}

function formatDuration(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours && minutes) return `${hours}h ${minutes}m`;
  if (hours) return `${hours}h`;
  return `${minutes}m`;
}

async function getTagsMap(contestIds) {
  if (!contestIds.length) {
    return {};
  }

  const placeholders = contestIds.map(() => "?").join(",");

  const [rows] = await pool.execute(
    `SELECT contest_id, tag_name
     FROM contest_tags
     WHERE contest_id IN (${placeholders})
     ORDER BY id ASC`,
    contestIds,
  );

  return rows.reduce((acc, row) => {
    if (!acc[row.contest_id]) {
      acc[row.contest_id] = [];
    }

    acc[row.contest_id].push(row.tag_name);
    return acc;
  }, {});
}

async function hasContestAccess(userId, contestId) {
  const [rows] = await pool.execute(
    `SELECT 1
     FROM contest_access
     WHERE user_id = ? AND contest_id = ?
     LIMIT 1`,
    [userId, contestId],
  );

  return rows.length > 0;
}

export async function getContestsForUser(userId) {
  const [liveRows] = await pool.execute(
    `SELECT
       c.id,
       c.name,
       c.description,
       c.start_time,
       c.duration_minutes,
       c.problems_count,
       c.participants_count,
       c.requires_password
     FROM contests c
     WHERE c.status = 'live'
     ORDER BY c.start_time ASC`,
  );

  const [upcomingRows] = await pool.execute(
    `SELECT
       c.id,
       c.name,
       c.description,
       c.start_time,
       c.duration_minutes,
       c.problems_count,
       c.requires_password,
       EXISTS(
         SELECT 1
         FROM contest_registrations cr
         WHERE cr.contest_id = c.id AND cr.user_id = ?
       ) AS registered
     FROM contests c
     WHERE c.status = 'upcoming'
     ORDER BY registered DESC, c.start_time ASC`,
    [userId],
  );

  const [pastRows] = await pool.execute(
    `SELECT
       c.id,
       c.name,
       c.start_time,
       c.contest_type,
       c.problems_count,
       c.is_rated,
       c.participants_count,
       COALESCE(r.participated, 0) AS participated,
       r.rank_position,
       COALESCE(r.total_participants, c.participants_count) AS total_participants
     FROM contests c
     LEFT JOIN contest_results r
       ON r.contest_id = c.id AND r.user_id = ?
     WHERE c.status = 'past'
     ORDER BY c.start_time DESC`,
    [userId],
  );

  const allContestIds = [
    ...liveRows.map((row) => row.id),
    ...upcomingRows.map((row) => row.id),
    ...pastRows.map((row) => row.id),
  ];

  const tagsMap = await getTagsMap(allContestIds);

  return {
    filters: CONTEST_FILTERS,
    live: liveRows.map((row) => ({
      id: row.id,
      name: row.name,
      desc: row.description || "",
      date: formatDate(row.start_time),
      time: formatTime(row.start_time),
      duration: formatDuration(row.duration_minutes),
      problems: row.problems_count,
      participants: row.participants_count,
      requiresPassword: Boolean(row.requires_password),
      tags: tagsMap[row.id] || [],
    })),
    upcoming: upcomingRows.map((row) => ({
      id: row.id,
      name: row.name,
      desc: row.description || "",
      date: formatDate(row.start_time),
      time: formatTime(row.start_time),
      duration: formatDuration(row.duration_minutes),
      problems: row.problems_count,
      registered: Boolean(row.registered),
      tags: tagsMap[row.id] || [],
    })),
    past: pastRows.map((row) => ({
      id: row.id,
      name: row.name,
      date: formatDate(row.start_time),
      type: row.contest_type || "Contest",
      participated: Boolean(row.participated),
      rank: row.participated ? row.rank_position : null,
      total: row.total_participants || 0,
      questions: row.problems_count || 0,
      rated: Boolean(row.is_rated),
      tags: tagsMap[row.id] || [],
    })),
  };
}

export async function getContestDetailsById(userId, contestId) {
  const [contestRows] = await pool.execute(
    `SELECT
       id,
       name,
       status,
       duration_minutes,
       requires_password
     FROM contests
     WHERE id = ?
     LIMIT 1`,
    [contestId],
  );

  if (!contestRows.length) {
    throw createServiceError("Contest not found.", 404);
  }

  const contest = contestRows[0];

  if (
    contest.requires_password &&
    !(await hasContestAccess(userId, contestId))
  ) {
    throw createServiceError("Contest password required.", 403);
  }

  const [problemRows] = await pool.execute(
    `SELECT
       problem_code,
       title,
       difficulty,
       points
     FROM contest_problems
     WHERE contest_id = ?
     ORDER BY sort_order ASC, problem_code ASC`,
    [contestId],
  );

  return {
    id: contest.id,
    title: `QuickJudge ${contest.name}`,
    statusText: String(contest.status).toUpperCase(),
    duration: formatDuration(contest.duration_minutes),
    problems: problemRows.map((problem) => ({
      id: problem.problem_code,
      title: problem.title,
      difficulty: problem.difficulty,
      points: problem.points,
    })),
  };
}

export async function registerUserForUpcomingContest(userId, contestId) {
  const [contestRows] = await pool.execute(
    `SELECT id, status
     FROM contests
     WHERE id = ?
     LIMIT 1`,
    [contestId],
  );

  if (!contestRows.length) {
    throw createServiceError("Contest not found.", 404);
  }

  const contest = contestRows[0];

  if (contest.status !== "upcoming") {
    throw createServiceError("Only upcoming contests can be registered.", 400);
  }

  await pool.execute(
    `INSERT INTO contest_registrations (user_id, contest_id)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE contest_id = contest_id`,
    [userId, contestId],
  );

  return {
    contestId,
  };
}

export async function verifyContestPasswordAccess(userId, contestId, password) {
  const [contestRows] = await pool.execute(
    `SELECT id, requires_password, password_hash
     FROM contests
     WHERE id = ?
     LIMIT 1`,
    [contestId],
  );

  if (!contestRows.length) {
    throw createServiceError("Contest not found.", 404);
  }

  const contest = contestRows[0];

  if (!contest.requires_password) {
    return {
      contestId,
    };
  }

  const isMatched = await bcrypt.compare(password, contest.password_hash || "");

  if (!isMatched) {
    throw createServiceError("Incorrect contest password.", 401);
  }

  await pool.execute(
    `INSERT INTO contest_access (user_id, contest_id)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE granted_at = CURRENT_TIMESTAMP`,
    [userId, contestId],
  );

  return {
    contestId,
  };
}

export async function getContestSubmissions(userId, contestId) {
  const [rows] = await pool.execute(
    `SELECT
       s.id,
       s.problem_code,
       s.language,
       s.verdict,
       s.submitted_at
     FROM contest_submissions s
     WHERE s.user_id = ? AND s.contest_id = ?
     ORDER BY s.submitted_at DESC`,
    [userId, contestId],
  );

  return rows.map((r) => ({
    id: r.id,
    problemCode: r.problem_code,
    language: r.language,
    verdict: r.verdict,
    submittedAt: r.submitted_at,
  }));
}

export async function getContestLeaderboard(contestId, currentUserId) {
  const [rows] = await pool.execute(
    `SELECT
       user_id,
       username,
       solved,
       total_penalty
     FROM contest_leaderboard
     WHERE contest_id = ?
     ORDER BY solved DESC, total_penalty ASC`,
    [contestId],
  );

  return rows.map((r, index) => ({
    rank: index + 1,
    userId: r.user_id,
    username: r.username,
    solved: r.solved,
    penalty: r.total_penalty,
    isMe: r.user_id === currentUserId,
  }));
}

export async function getContestAnnouncements(contestId) {
  const [rows] = await pool.execute(
    `SELECT id, title, body, posted_at
     FROM contest_announcements
     WHERE contest_id = ?
     ORDER BY posted_at DESC`,
    [contestId],
  );

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    body: r.body,
    postedAt: r.posted_at,
  }));
}

export async function getContestQueries(contestId) {
  const [rows] = await pool.execute(
    `SELECT id, user_id, username, question, answer, status, created_at, answered_at
     FROM contest_queries
     WHERE contest_id = ?
     ORDER BY created_at DESC`,
    [contestId],
  );

  return rows.map((r) => ({
    id: r.id,
    userId: r.user_id,
    username: r.username,
    question: r.question,
    answer: r.answer,
    status: r.status,
    createdAt: r.created_at,
    answeredAt: r.answered_at,
  }));
}

export async function submitContestQuery(userId, contestId, question) {
  if (!question || !question.trim()) {
    throw createServiceError("Question cannot be empty.", 400);
  }

  const [contestRows] = await pool.execute(
    `SELECT id FROM contests WHERE id = ? LIMIT 1`,
    [contestId],
  );

  if (!contestRows.length) {
    throw createServiceError("Contest not found.", 404);
  }

  const [userRows] = await pool.execute(
    `SELECT name FROM users WHERE id = ? LIMIT 1`,
    [userId],
  );

  const username = userRows.length ? userRows[0].name : "Unknown";

  const [result] = await pool.execute(
    `INSERT INTO contest_queries (contest_id, user_id, username, question)
     VALUES (?, ?, ?, ?)`,
    [contestId, userId, username, question.trim()],
  );

  return {
    id: result.insertId,
    contestId,
    userId,
    username,
    question: question.trim(),
    answer: null,
    status: "pending",
    createdAt: new Date(),
    answeredAt: null,
  };
}
