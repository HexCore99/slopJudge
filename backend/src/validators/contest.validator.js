export function validateContestId(contestId) {
  if (!contestId || typeof contestId !== "string" || !contestId.trim()) {
    return "Contest id is required.";
  }

  return null;
}

export function validateContestPassword(password) {
  if (typeof password !== "string" || !password.trim()) {
    return "Contest password is required.";
  }

  return null;
}

export function validateNumericId(value, label) {
  const numberValue = Number(value);

  if (!Number.isInteger(numberValue) || numberValue <= 0) {
    return `${label} must be a positive number.`;
  }

  return null;
}

export function validateQueryAnswer(answer) {
  if (typeof answer !== "string" || !answer.trim()) {
    return "Reply cannot be empty.";
  }

  return null;
}

export function validateAnnouncementPayload({ title, body } = {}) {
  if (typeof title !== "string" || !title.trim()) {
    return "Announcement title is required.";
  }

  if (typeof body !== "string" || !body.trim()) {
    return "Announcement body is required.";
  }

  return null;
}

export function validateContestSchedulePayload({ startTime, endTime } = {}) {
  if (typeof startTime !== "string" || !startTime.trim()) {
    return "Start time is required.";
  }

  if (typeof endTime !== "string" || !endTime.trim()) {
    return "End time is required.";
  }

  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  if (Number.isNaN(startDate.getTime())) {
    return "Start time is invalid.";
  }

  if (Number.isNaN(endDate.getTime())) {
    return "End time is invalid.";
  }

  if (endDate <= startDate) {
    return "End time must be after start time.";
  }

  return null;
}
