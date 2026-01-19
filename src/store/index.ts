import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import { adminApi } from "./api/Admin";
import { authApi } from "./api/authApi";
import { transactionApi } from "./api/Transaction";
import { reportsApi } from "./api/Reports";
import { userApi } from "./api/User";
import { discountsApi } from "./api/Discounts";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [discountsApi.reducerPath]: discountsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(adminApi.middleware)
      .concat(transactionApi.middleware)
      .concat(reportsApi.middleware)
      .concat(userApi.middleware)
      .concat(discountsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
