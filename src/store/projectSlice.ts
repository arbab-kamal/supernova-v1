// src/store/projectSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedProject: null,
  projects: [],
};

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload;
    },
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
    clearSelectedProject: (state) => {
      state.selectedProject = null;
    },
  },
});

export const { setSelectedProject, setProjects, clearSelectedProject } = projectSlice.actions;

// Selectors
export const selectCurrentProject = (state) => state.project.selectedProject;
export const selectAllProjects = (state) => state.project.projects;

export default projectSlice.reducer;