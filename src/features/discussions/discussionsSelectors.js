export const selectDiscussionList = (state) => state.discussions.list;

export const selectDiscussions = (state) => state.discussions.discussions;

export const selectSelectedId = (state) => state.discussions.selectedId;

export const selectMode = (state) => state.discussions.mode;

export const selectActiveDiscussion = (state) => {
  const { selectedId, discussions } = state.discussions;
  if (!selectedId) return null;
  return discussions.find((d) => d.id === selectedId) || null;
};

export const selectEditingDiscussionId = (state) =>
  state.discussions.editingDiscussionId;

export const selectEditingReplyId = (state) =>
  state.discussions.editingReplyId;
