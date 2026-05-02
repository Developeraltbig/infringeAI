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
    // setCredentials: (state, action) => {
    //   const { user, accessToken } = action.payload;
    //   if (user) {
    //     state.user = user;
    //     state.isAuthenticated = true;
    //     // Sync top-level credits with the user object
    //     if (typeof user.credits === "number") {
    //       state.credits = user.credits;
    //     }
    //   }
    //   if (accessToken) {
    //     state.token = accessToken;
    //   }
    // },
    // frontend/src/features/auth/authSlice.js

    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;

      // 🟢 IMPORTANT: NEVER set token to null here if it already exists
      if (accessToken) {
        state.token = accessToken;
      }

      // 🟢 Merge user data instead of replacing it, to keep credits stable
      if (user) {
        state.user = { ...state.user, ...user };
        if (typeof user.credits === "number") {
          state.credits = user.credits;
        }
        state.isAuthenticated = true;
      }
    },
    // Used to update credits directly from API responses
    setCredits: (state, action) => {
      state.credits = action.payload;
      if (state.user) {
        state.user.credits = action.payload;
      }
    },
    // Alias used in SearchArea.jsx
    updateUserCredits: (state, action) => {
      state.credits = action.payload;
      if (state.user) {
        state.user.credits = action.payload;
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

export const { setCredentials, setCredits, logOut, updateUserCredits } =
  authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

// Fixes the "Uncaught SyntaxError" in SearchArea
export const selectUserCredits = (state) => state.auth.credits;
export const selectCredits = (state) => state.auth.credits;
