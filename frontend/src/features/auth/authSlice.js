import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  credits: 0,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      if (user !== undefined) {
        state.user = user;
        state.isAuthenticated = true;
        // Sync credits whenever user object is updated
        if (typeof user?.credits === "number") {
          state.credits = user.credits;
        }
      }
      if (accessToken !== undefined) {
        state.token = accessToken;
      }
    },
    // Called after a successful project creation to keep sidebar in sync
    decrementCredits: (state, action) => {
      const amount = action.payload ?? 1;
      state.credits = Math.max(0, state.credits - amount);
      if (state.user) {
        state.user = { ...state.user, credits: state.credits };
      }
    },
    // Sync credits from a server response (e.g. after project creation)
    setCredits: (state, action) => {
      state.credits = action.payload;
      if (state.user) {
        state.user = { ...state.user, credits: action.payload };
      }
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.credits = 0;
    },
  },
});

export const { setCredentials, decrementCredits, setCredits, logOut } =
  authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectCredits = (state) => state.auth.credits;
