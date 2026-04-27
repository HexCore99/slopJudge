import { createSlice } from "@reduxjs/toolkit";
import {
  mockDiscussions,
  getNextDiscussionId,
  getNextReplyId,
} from "../../pages/student/discussions/data/discussionMockData";

const initialState = {
  list: mockDiscussions.map((d) => ({
    id: d.id,
    title: d.title,
    authorName: d.authorName,
    replyCount: d.replies.length,
    createdAt: d.createdAt,
  })),
  discussions: mockDiscussions,
  selectedId: null,
  mode: "idle", // 'idle' | 'viewing' | 'creating' | 'editing'
  editingDiscussionId: null,
  editingReplyId: null,
};

const discussionsSlice = createSlice({
  name: "discussions",
  initialState,
  reducers: {
    selectDiscussion(state, action) {
      state.selectedId = action.payload;
      state.mode = "viewing";
      state.editingDiscussionId = null;
      state.editingReplyId = null;
    },

    startCreating(state) {
      state.mode = "creating";
      state.selectedId = null;
      state.editingDiscussionId = null;
      state.editingReplyId = null;
    },

    cancelCreating(state) {
      state.mode = state.selectedId ? "viewing" : "idle";
    },

    createDiscussion(state, action) {
      const { title, body, authorId, authorName } = action.payload;
      const id = getNextDiscussionId();
      const now = new Date().toISOString();

      const newDiscussion = {
        id,
        title,
        body,
        authorId,
        authorName,
        createdAt: now,
        replies: [],
      };

      state.discussions.unshift(newDiscussion);
      state.list.unshift({
        id,
        title,
        authorName,
        replyCount: 0,
        createdAt: now,
      });

      state.selectedId = id;
      state.mode = "viewing";
    },

    addReply(state, action) {
      const { discussionId, body, userId, authorName, parentReplyId = null } =
        action.payload;
      const discussion = state.discussions.find((d) => d.id === discussionId);
      if (!discussion) return;

      const reply = {
        id: getNextReplyId(),
        parentReplyId,
        userId,
        authorName,
        body,
        createdAt: new Date().toISOString(),
      };

      discussion.replies.push(reply);

      const listItem = state.list.find((d) => d.id === discussionId);
      if (listItem) {
        listItem.replyCount = discussion.replies.length;
      }
    },

    // Edit discussion
    startEditingDiscussion(state, action) {
      state.editingDiscussionId = action.payload;
      state.editingReplyId = null;
    },

    cancelEditingDiscussion(state) {
      state.editingDiscussionId = null;
    },

    saveEditDiscussion(state, action) {
      const { id, title, body } = action.payload;
      const discussion = state.discussions.find((d) => d.id === id);
      if (!discussion) return;

      discussion.title = title;
      discussion.body = body;

      const listItem = state.list.find((d) => d.id === id);
      if (listItem) {
        listItem.title = title;
      }

      state.editingDiscussionId = null;
    },

    deleteDiscussion(state, action) {
      const id = action.payload;
      state.discussions = state.discussions.filter((d) => d.id !== id);
      state.list = state.list.filter((d) => d.id !== id);

      if (state.selectedId === id) {
        state.selectedId = null;
        state.mode = "idle";
      }

      state.editingDiscussionId = null;
    },

    // Edit reply
    startEditingReply(state, action) {
      state.editingReplyId = action.payload;
      state.editingDiscussionId = null;
    },

    cancelEditingReply(state) {
      state.editingReplyId = null;
    },

    saveEditReply(state, action) {
      const { discussionId, replyId, body } = action.payload;
      const discussion = state.discussions.find((d) => d.id === discussionId);
      if (!discussion) return;

      const reply = discussion.replies.find((r) => r.id === replyId);
      if (reply) {
        reply.body = body;
      }

      state.editingReplyId = null;
    },

    deleteReply(state, action) {
      const { discussionId, replyId } = action.payload;
      const discussion = state.discussions.find((d) => d.id === discussionId);
      if (!discussion) return;

      // Collect all descendant IDs recursively
      function collectDescendants(parentId) {
        const children = discussion.replies.filter(
          (r) => r.parentReplyId === parentId,
        );
        let ids = [parentId];
        for (const child of children) {
          ids = ids.concat(collectDescendants(child.id));
        }
        return ids;
      }

      const idsToRemove = new Set(collectDescendants(replyId));
      discussion.replies = discussion.replies.filter(
        (r) => !idsToRemove.has(r.id),
      );

      const listItem = state.list.find((d) => d.id === discussionId);
      if (listItem) {
        listItem.replyCount = discussion.replies.length;
      }

      state.editingReplyId = null;
    },
  },
});

export const {
  selectDiscussion,
  startCreating,
  cancelCreating,
  createDiscussion,
  addReply,
  startEditingDiscussion,
  cancelEditingDiscussion,
  saveEditDiscussion,
  deleteDiscussion,
  startEditingReply,
  cancelEditingReply,
  saveEditReply,
  deleteReply,
} = discussionsSlice.actions;

export default discussionsSlice.reducer;
