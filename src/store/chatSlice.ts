// src/store/chatSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface ChatState {
  chatId: number;
  resetFlag: boolean;
}

const initialState: ChatState = {
  chatId: 1,
  resetFlag: false
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    startNewChat: (state) => {
      state.chatId = state.chatId + 1;
      state.resetFlag = !state.resetFlag; // Toggle flag to trigger reset
    }
  }
});

export const { startNewChat } = chatSlice.actions;
export const selectChatId = (state: { chat: ChatState }) => state.chat.chatId;
export const selectResetFlag = (state: { chat: ChatState }) => state.chat.resetFlag;

export default chatSlice.reducer;