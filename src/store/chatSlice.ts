import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatState {
  chatId: string | number | null;
  messages: any[];
  status: 'idle' | 'loading' | 'completed' | 'failed';
  error: string | null;
  isInProgress: boolean;
  resetFlag: boolean;
}

const initialState: ChatState = {
  chatId: 1,
  messages: [],
  status: 'idle',
  error: null,
  isInProgress: false,
  resetFlag: false
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    startNewChat: (state) => {
      // Increment the chatId number instead of using timestamp
      state.chatId = typeof state.chatId === 'number' ? state.chatId + 1 : 1;
      state.messages = [];
      state.status = 'loading';
      state.isInProgress = true;
      state.error = null;
      state.resetFlag = !state.resetFlag; // Toggle flag to trigger reset
    },
    setChatId: (state, action: PayloadAction<string | number>) => {
      state.chatId = action.payload;
    },
    addMessage: (state, action: PayloadAction<any>) => {
      state.messages.push(action.payload);
    },
    chatLoading: (state) => {
      state.status = 'loading';
    },
    chatCompleted: (state) => {
      state.status = 'completed';
      state.isInProgress = false;
    },
    chatFailed: (state, action: PayloadAction<string>) => {
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
export const selectChatId = (state: { chat: ChatState }) => state.chat.chatId;
export const selectMessages = (state: { chat: ChatState }) => state.chat.messages;
export const selectChatStatus = (state: { chat: ChatState }) => state.chat.status;
export const selectChatError = (state: { chat: ChatState }) => state.chat.error;
export const selectIsInProgress = (state: { chat: ChatState }) => state.chat.isInProgress;
export const selectResetFlag = (state: { chat: ChatState }) => state.chat.resetFlag;

export default chatSlice.reducer;