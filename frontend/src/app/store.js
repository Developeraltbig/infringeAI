import storage from "redux-persist/lib/storage"; 
import {
  FLUSH,
  PAUSE,
  PURGE,
  PERSIST,
  REGISTER,
  REHYDRATE,
  persistStore,
  persistReducer,
} from "redux-persist";
// import { apiSlice } from "./features/api/apiSlice";
import authReducer from "../features/auth/authSlice";
import analysisReducer from '../features/slice/analysisSlice'
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { apiSlice } from "../features/api/apiSlice";

console.log("hgcjfchcjjhmng",window.localStorage)
// console.log(storage)
// console.log("STORAGE:", storage);
// console.log("getItem:", storage?.default?.getItem);

const fixedStorage = storage.default || storage;

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
  analysis: analysisReducer,
});

const persistConfig = {
  key: "user-root",
  storage: fixedStorage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,],
      },
    }).concat(apiSlice.middleware),
  devTools: !import.meta.env.PROD, // Enable devtools only in development
});

export const persistor = persistStore(store);
