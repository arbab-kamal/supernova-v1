import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  chatHistory: [],
  conversationMessages: [],
  loading: false,
  conversationLoading: false,
  error: null,
};

export const fetchChatHistory = createAsyncThunk(
  'history/fetchChatHistory',
  async ({ chatId, projectName }, { rejectWithValue }) => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
      const response = await axios.get(`${baseURL}/chatHistory`, {
        params: { chatId, projectName },
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch chat history');
    }
  }
);

export const fetchConversationById = createAsyncThunk(
  'history/fetchConversationById',
  async ({ conversationId, projectName }, { rejectWithValue }) => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
      const response = await axios.get(`${baseURL}/conversation`, {
        params: { conversationId, projectName },
        withCredentials: true,
      });
      
      // Transform the conversation data into a format that matches your Message interface
      const messages = response.data.map(item => ({
        text: item.isUser ? item.question : item.reply,
        sender: item.isUser ? 'user' : 'ai'
      }));
      
      return messages;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch conversation');
    }
  }
);

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    clearHistory: (state) => {
      state.chatHistory = [];
    },
    clearConversation: (state) => {
      state.conversationMessages = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.chatHistory = action.payload;
        state.loading = false;
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchConversationById.pending, (state) => {
        state.conversationLoading = true;
        state.error = null;
      })
      .addCase(fetchConversationById.fulfilled, (state, action) => {
        state.conversationMessages = action.payload;
        state.conversationLoading = false;
      })
      .addCase(fetchConversationById.rejected, (state, action) => {
        state.conversationLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearHistory, clearConversation } = historySlice.actions;

// Selectors
export const selectChatHistory = (state) => state.history.chatHistory;
export const selectConversationMessages = (state) => state.history.conversationMessages;
export const selectHistoryLoading = (state) => state.history.loading;
export const selectConversationLoading = (state) => state.history.conversationLoading;
export const selectHistoryError = (state) => state.history.error;

export default historySlice.reducer;