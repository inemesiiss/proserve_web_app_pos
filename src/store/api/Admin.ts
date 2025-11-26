import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["admin"],
  endpoints: (builder) => ({
    ///api/adminpos/get_all_client
    getClientsList: builder.query({
      query: () => {
        return {
          url: `/adminpos/get_all_client`,
          method: "GET",
        };
      },
      providesTags: ["admin"],
    }),
  }),
});

export const { useGetClientsListQuery } = adminApi;
