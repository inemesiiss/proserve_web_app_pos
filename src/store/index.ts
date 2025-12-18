import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import { adminApi } from "./api/Admin";
import { authApi } from "./api/authApi";
import { transactionApi } from "./api/Transaction";
import { reportsApi } from "./api/Reports";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(adminApi.middleware)
      .concat(transactionApi.middleware)
      .concat(reportsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
