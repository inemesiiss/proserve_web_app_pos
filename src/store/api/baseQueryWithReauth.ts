import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { logout } from "../auth/authSlice";

const baseUrl = `${import.meta.env.VITE_API_DOMAIN}/api`;

const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include",
});

// Refresh token lock variables (outside the function to share across calls)
let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

export const baseQueryWithReauth: BaseQueryFn<any, unknown, unknown> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  // If the request failed with 401 Unauthorized
  if (result.error && result.error.status === 401) {
    // Don't try to refresh during login
    if (args.url === "/user/login/") {
      return result;
    }

    // Lock logic: only one refresh request allowed at a time
    if (!isRefreshing) {
      isRefreshing = true;

      refreshPromise = Promise.resolve(
        baseQuery(
          { url: "/user/refresh-token/", method: "POST" },
          api,
          extraOptions
        )
      ).finally(() => {
        isRefreshing = false;
      });
    }

    const refreshResult = await refreshPromise;

    if (refreshResult?.error) {
      api.dispatch(logout());
      return refreshResult;
    }

    // Optional: wait to ensure cookie/token is ready
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Retry the original request
    result = await baseQuery(args, api, extraOptions);
  }

  return result;
};
