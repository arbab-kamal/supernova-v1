// store/chatSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chatId: null,
  messages: [],
  status: 'idle', // idle, loading, completed, failed
  error: null,
  isInProgress: false
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    startNewChat: (state) => {
      state.chatId = Date.now().toString();
      state.messages = [];
      state.status = 'loading';
      state.isInProgress = true;
      state.error = null;
    },
    setChatId: (state, action) => {
      state.chatId = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    chatLoading: (state) => {
      state.status = 'loading';
    },
    chatCompleted: (state) => {
      state.status = 'completed';
      state.isInProgress = false;
    },
    chatFailed: (state, action) => {
      state.status = 'failed';
      state.isInProgress = false;
      state.error = action.payload;
    },
    resetChat: (state) => {
      state.messages = [];
      state.status = 'idle';
      state.error = null;
      state.isInProgress = false;
    },
    clearChatError: (state) => {
      state.error = null;
    }
  }
});

export const { 
  startNewChat, 
  setChatId, 
  addMessage, 
  chatLoading, 
  chatCompleted, 
  chatFailed, 
  resetChat,
  clearChatError 
} = chatSlice.actions;

// Selectors
export const selectChatId = (state) => state.chat.chatId;
export const selectMessages = (state) => state.chat.messages;
export const selectChatStatus = (state) => state.chat.status;
export const selectChatError = (state) => state.chat.error;
export const selectIsInProgress = (state) => state.chat.isInProgress;

export default chatSlice.reducer;