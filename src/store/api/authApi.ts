// store/api/authApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

// const baseUrl = `${import.meta.env.VITE_API_BASE}/api`;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation<
      { success: boolean; rid: number; cid: number; uid: number },
      { email: string; password: string }
    >({
      query: ({ email, password }) => ({
        url: "/user/login/",
        method: "POST",
        body: { email, password },
      }),
    }),

    getUser: builder.query<{ id: number }, {}>({
      query: () => "/user/me",
      transformResponse: (response: { success: boolean; data: number }) => ({
        id: response.data,
      }),
    }),

    getUsersWithRole: builder.query<{ role: string }, { userId: number }>({
      query: ({ userId }) => ({
        url: `/users/${userId}/view_user_account/`,
        method: "GET",
      }),
      transformResponse: (response: {
        success: boolean;
        data: Array<{ role: { id: number; name: string } }>;
      }) => {
        return { role: response.data[0]?.role?.name || "" };
      },
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/user/logout/",
        method: "POST",
      }),
    }),

    refreshToken: builder.mutation<{ access: string }, void>({
      query: () => ({
        url: "/user/refresh-token/",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetUserQuery,
  useLazyGetUserQuery,
  useGetUsersWithRoleQuery,
  useLazyGetUsersWithRoleQuery,
  useLogoutMutation,
  useRefreshTokenMutation,
} = authApi;
