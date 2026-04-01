import {
  contestFilters,
  liveContests,
  pastContests,
  upcomingContests,
} from "./contestsMockData";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const clone = (value) => JSON.parse(JSON.stringify(value));

const liveContestMap = Object.fromEntries(
  liveContests.map((contest) => [contest.id, contest]),
);

const contestDetailsMap = {
  "WC-43L": {
    id: "WC-43L",
    title: `QuickJudge ${liveContestMap["WC-43L"].name}`,
    statusText: "LIVE",
    duration: liveContestMap["WC-43L"].duration,
    tabs: [
      "Problems",
      "Submissions",
      "Leaderboard",
      "Announcements",
      "Queries",
    ],
    problems: [
      {
        id: "A",
        title: "Minimum Path in DAG",
        difficulty: "easy",
        points: 100,
      },
      {
        id: "B",
        title: "Greedy Interval Merge",
        difficulty: "medium",
        points: 200,
      },
      { id: "C", title: "Tree Teleport", difficulty: "medium", points: 200 },
      {
        id: "D",
        title: "Shortest Route Rebuild",
        difficulty: "hard",
        points: 300,
      },
    ],
    submissions: [
      {
        id: "SUB-1201",
        problem: "A",
        language: "GNU C++17",
        verdict: "Accepted",
        time: "00:12:14",
      },
      {
        id: "SUB-1202",
        problem: "C",
        language: "GNU C++17",
        verdict: "Wrong Answer",
        time: "00:39:51",
      },
    ],
    leaderboard: [
      { rank: 1, name: "Aritra", solved: 4, penalty: 318 },
      { rank: 2, name: "Muntaha", solved: 4, penalty: 351 },
      { rank: 3, name: "HexCore", solved: 3, penalty: 287 },
    ],
    announcements: [
      {
        id: 1,
        title: "Contest Started",
        body: "Welcome everyone. Read statements carefully before submitting.",
        createdAt: "Mar 15, 2025 • 14:00 UTC",
      },
      {
        id: 2,
        title: "Clarification for Problem C",
        body: "Graph is 1-indexed. Sample explanation has been updated.",
        createdAt: "Mar 15, 2025 • 14:22 UTC",
      },
    ],
    queries: [
      {
        id: 1,
        user: "Student_21",
        problem: "B",
        question: "Can values be negative in hidden tests?",
        status: "Answered",
      },
      {
        id: 2,
        user: "Student_07",
        problem: "D",
        question: "Are multiple edges possible?",
        status: "Pending",
      },
    ],
  },

  "BLZ-09L": {
    id: "BLZ-09L",
    title: `QuickJudge ${liveContestMap["BLZ-09L"].name}`,
    statusText: "LIVE",
    duration: liveContestMap["BLZ-09L"].duration,
    tabs: [
      "Problems",
      "Submissions",
      "Leaderboard",
      "Announcements",
      "Queries",
    ],
    problems: [
      { id: "A", title: "Digit Collapse", difficulty: "easy", points: 100 },
      { id: "B", title: "Fast Matrix Walk", difficulty: "medium", points: 200 },
      { id: "C", title: "Prime Window", difficulty: "hard", points: 300 },
    ],
    submissions: [
      {
        id: "SUB-2201",
        problem: "A",
        language: "Python 3",
        verdict: "Accepted",
        time: "00:05:32",
      },
      {
        id: "SUB-2202",
        problem: "B",
        language: "GNU C++17",
        verdict: "Runtime Error",
        time: "00:26:10",
      },
    ],
    leaderboard: [
      { rank: 1, name: "Sajid", solved: 3, penalty: 141 },
      { rank: 2, name: "Rafid", solved: 2, penalty: 89 },
      { rank: 3, name: "Nafis", solved: 2, penalty: 104 },
    ],
    announcements: [
      {
        id: 1,
        title: "Password Protected Round",
        body: "Only registered students with the password may enter the contest.",
        createdAt: "Mar 15, 2025 • 17:45 UTC",
      },
    ],
    queries: [
      {
        id: 1,
        user: "Student_18",
        problem: "B",
        question: "What is the maximum grid size?",
        status: "Answered",
      },
    ],
  },

  "ALG-12L": {
    id: "ALG-12L",
    title: `QuickJudge ${liveContestMap["ALG-12L"].name}`,
    statusText: "LIVE",
    duration: liveContestMap["ALG-12L"].duration,
    tabs: [
      "Problems",
      "Submissions",
      "Leaderboard",
      "Announcements",
      "Queries",
    ],
    problems: [
      { id: "A", title: "Prefix Peak", difficulty: "easy", points: 100 },
      {
        id: "B",
        title: "Binary Search Bounds",
        difficulty: "medium",
        points: 200,
      },
      { id: "C", title: "Ad-hoc Conveyor", difficulty: "medium", points: 200 },
      { id: "D", title: "Range Balance", difficulty: "hard", points: 300 },
      { id: "E", title: "Compressed Jumps", difficulty: "hard", points: 300 },
    ],
    submissions: [
      {
        id: "SUB-3201",
        problem: "A",
        language: "GNU C++17",
        verdict: "Accepted",
        time: "00:08:04",
      },
    ],
    leaderboard: [
      { rank: 1, name: "Tariq", solved: 5, penalty: 406 },
      { rank: 2, name: "Nova", solved: 4, penalty: 300 },
      { rank: 3, name: "Ishraq", solved: 4, penalty: 341 },
    ],
    announcements: [
      {
        id: 1,
        title: "Read Problem E Carefully",
        body: "The intended solution is not plain brute force.",
        createdAt: "Mar 16, 2025 • 16:14 UTC",
      },
    ],
    queries: [
      {
        id: 1,
        user: "Student_05",
        problem: "E",
        question: "Can input size exceed 2e5?",
        status: "Pending",
      },
    ],
  },
};

export async function getContestsApi() {
  await wait(400);

  return {
    filters: clone(contestFilters),
    live: clone(liveContests),
    upcoming: clone(upcomingContests),
    past: clone(pastContests),
  };
}

export async function registerUpcomingContestApi(contestId) {
  await wait(250);

  const contest = upcomingContests.find((item) => item.id === contestId);

  if (!contest) {
    throw new Error("Upcoming contest not found.");
  }

  return {
    success: true,
    contestId,
  };
}

export async function verifyContestPasswordApi({ contestId, password }) {
  await wait(300);

  const contest = liveContests.find((item) => item.id === contestId);

  if (!contest) {
    throw new Error("Contest not found.");
  }

  if (!contest.requiresPassword) {
    return {
      success: true,
      contestId,
    };
  }

  if (password.trim() !== contest.password) {
    throw new Error("Incorrect contest password.");
  }

  return {
    success: true,
    contestId,
  };
}

export async function getContestDetailsApi(contestId) {
  await wait(300);

  const details = contestDetailsMap[contestId];

  if (!details) {
    throw new Error("Contest not found.");
  }

  return clone(details);
}
