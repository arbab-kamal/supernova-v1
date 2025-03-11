// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './projectSlice';
import chatReducer from './chatSlice';  // Import the new chat reducer

export const store = configureStore({
  reducer: {
    project: projectReducer,
    chat: chatReducer,    // Add the chat reducer here
  },
});