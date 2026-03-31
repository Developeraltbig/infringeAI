import { configureStore } from '@reduxjs/toolkit'
import analysisReducer from '../features/slice/analysisSlice'

// Configure the Redux store
export const store = configureStore({
  reducer: {
    analysis: analysisReducer, // our main slice
  },

  // Middleware: includes thunk by default
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // optional: avoid errors with non-serializable values
    }),

  // Enable Redux DevTools in development only
  devTools: import.meta.env.PROD,
})