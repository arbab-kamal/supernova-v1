// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './projectSlice';
import chatReducer from './chatSlice';
import historyReducer from './historySlice';

export const store = configureStore({
  reducer: {
    project: projectReducer,
    chat: chatReducer,
    history: historyReducer,
  },
});

export default store;