// src/store/historySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  chatHistory: [],
  loading: false,
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

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    clearHistory: (state) => {
      state.chatHistory = [];
    },
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
      });
  },
});

export const { clearHistory } = historySlice.actions;

// Selectors
export const selectChatHistory = (state) => state.history.chatHistory;
export const selectHistoryLoading = (state) => state.history.loading;
export const selectHistoryError = (state) => state.history.error;

export default historySlice.reducer;