import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarOpen: false,
  currentView: "project",
  mode: "quick",
  bulkPatents: [], // Array of patent ID chips
  tempCredits: 100, // Initial credit balance
};

const analysisSlice = createSlice({
  name: "analysis",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    // 🟢 1. Adding individual patents via search bar
    addBulkPatent: (state, action) => {
      const id = action.payload.trim().toUpperCase();
      if (id && !state.bulkPatents.includes(id)) {
        state.bulkPatents.push(id);
      }
    },
    // 🟢 2. NEW: Setting multiple patents at once (For File Upload)
    setBulkPatents: (state, action) => {
      // Logic: Merge new IDs with existing ones and remove duplicates
      const incomingIds = action.payload.map((id) => id.trim().toUpperCase());
      const uniqueList = [...new Set([...state.bulkPatents, ...incomingIds])];
      state.bulkPatents = uniqueList;
    },
    // 🟢 3. Removing a single chip
    removeBulkPatent: (state, action) => {
      state.bulkPatents = state.bulkPatents.filter(
        (_, index) => index !== action.payload,
      );
    },
    // 🟢 4. Wiping all chips
    clearBulkPatents: (state) => {
      state.bulkPatents = [];
    },
    // 🟢 5. Temporary credit logic
    deductCredits: (state, action) => {
      state.tempCredits = Math.max(0, state.tempCredits - action.payload);
    },
  },
});

// 🚀 CRITICAL: Export all actions so SearchArea.jsx can find them
export const {
  toggleSidebar,
  setMode,
  addBulkPatent,
  setBulkPatents, // 👈 Added this export
  removeBulkPatent,
  clearBulkPatents,
  deductCredits,
} = analysisSlice.actions;

export default analysisSlice.reducer;
