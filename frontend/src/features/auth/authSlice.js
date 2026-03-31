import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null, // This will be our access token
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      if (user !== undefined) {
        state.user = user;
      }
      if (accessToken !== undefined) {
        state.token = accessToken;
      }
    },
    logOut: (state, action) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

// Selectors for easy access in components
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
