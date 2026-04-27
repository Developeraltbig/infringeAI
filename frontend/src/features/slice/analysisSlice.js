import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarOpen: false,
  currentView: "project", // 'new' or 'project'
  mode: "interactive",
  bulkPatents: ["US1234567B2", "US1234567B2"],
  history: [
    { id: 1, title: "US20260025167A1", type: "Interactive", date: "Mar 24" },
    { id: 2, title: "US20260025167A1", type: "Bulk", date: "Mar 25" },
    { id: 3, title: "US20260025167A1", type: "Bulk", date: "Apr 24" },
    { id: 4, title: "US20260025167A1", type: "Quick", date: "Mar 24" },
  ],
  projects: [
    {
      id: "US6421675B1",
      status: "Processing",
      mode: "Bulk",
      created: "Sep 25, 2025",
    },
    {
      id: "US6421675B1",
      status: "Complete",
      mode: "Quick",
      created: "Sep 25, 2025",
    },
    {
      id: "US6421675B1",
      status: "Rejected",
      mode: "Bulk",
      created: "Sep 25, 2025",
    },
    {
      id: "US6421675B1",
      status: "Processing",
      mode: "Bulk",
      created: "Sep 25, 2025",
    },
    {
      id: "US6421675B1",
      status: "Complete",
      mode: "Quick",
      created: "Sep 25, 2025",
    },
  ],
};

const analysisSlice = createSlice({
  name: "analysis",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setCurrentView: (state, action) => {
      state.currentView = action.payload;
      state.isSidebarOpen = false; // Close sidebar on mobile when navigating
    },
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    addBulkPatent: (state, action) => {
      if (action.payload && !state.bulkPatents.includes(action.payload)) {
        state.bulkPatents.push(action.payload);
      }
    },
    removeBulkPatent: (state, action) => {
      state.bulkPatents = state.bulkPatents.filter(
        (_, index) => index !== action.payload,
      );
    },
  },
});

export const {
  toggleSidebar,
  setCurrentView,
  setMode,
  addBulkPatent,
  removeBulkPatent,
} = analysisSlice.actions;
export default analysisSlice.reducer;
