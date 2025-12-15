import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["admin"],
  endpoints: (builder) => ({
    ///api/adminpos/region_list
    getRegion: builder.query({
      query: () => {
        return {
          url: `/adminpos/region_list`,
          method: "GET",
        };
      },
    }),
    ///api/adminpos/<region_id>/province_list
    getProvince: builder.query({
      query: (id) => {
        return {
          url: `/adminpos/${id}/province_list`,
          method: "GET",
        };
      },
    }),
    ///api/adminpos/<province_id>/city_list
    getCity: builder.query({
      query: (id) => {
        return {
          url: `/adminpos/${id}/city_list`,
          method: "GET",
        };
      },
    }),
    ///api/adminpos/<city_id>/barangay_list
    getBarangay: builder.query({
      query: (id) => {
        return {
          url: `/adminpos/${id}/barangay_list`,
          method: "GET",
        };
      },
    }),
    ///api/adminpos/get_client
    getClients: builder.query({
      query: () => {
        return {
          url: `/adminpos/get_client`,
          method: "GET",
        };
      },
      providesTags: ["admin"],
    }),
    ///api/adminpos/get_all_client
    getClientsList: builder.query({
      query: ({ search, id, type, page, pageSize }) => {
        return {
          url: `/adminpos/get_all_client?search=${search}&id=${id}&type=${type}&page=${page}&pageSize=${pageSize}`,
          method: "GET",
        };
      },
      providesTags: ["admin"],
    }),
    ///api/adminpos/get_subscription
    getSubscription: builder.query({
      query: () => {
        return {
          url: `/adminpos/get_subscription`,
          method: "GET",
        };
      },
      providesTags: ["admin"],
    }),
    ///api/adminpos/add_client
    addAccount: builder.mutation({
      query: (formBody) => {
        return {
          url: `/adminpos/add_client/`,
          method: "POST",
          body: formBody,
        };
      },
      invalidatesTags: ["admin"],
    }),
    ///api/adminpos/up_client
    upAccount: builder.mutation({
      query: (formBody) => {
        return {
          url: `/adminpos/up_client/`,
          method: "PUT",
          body: formBody,
        };
      },
      invalidatesTags: ["admin"],
    }),
    ///api/adminpos/add_branch
    addBranch: builder.mutation({
      query: (formBody) => {
        return {
          url: `/adminpos/add_branch/`,
          method: "POST",
          body: formBody,
        };
      },
      invalidatesTags: ["admin"],
    }),
    ///api/adminpos/get_branch
    getBranchList: builder.query({
      query: ({ search, id, type, page, pageSize }) => {
        return {
          url: `/adminpos/get_branch?search=${search}&id=${id}&type=${type}&page=${page}&pageSize=${pageSize}`,
          method: "GET",
        };
      },
      providesTags: ["admin"],
    }),
    ///api/adminpos/up_branch
    upBranch: builder.mutation({
      query: (formBody) => {
        return {
          url: `/adminpos/up_branch/`,
          method: "PUT",
          body: formBody,
        };
      },
      invalidatesTags: ["admin"],
    }),
    ///api/adminpos/get_all_branch
    getAllBranch: builder.query({
      query: ({ cid }) => {
        return {
          url: `/adminpos/get_all_branch?cid=${cid}`,
          method: "GET",
        };
      },
      providesTags: ["admin"],
    }),
    ///api/adminpos/add_terminal
    addTerminal: builder.mutation({
      query: (formBody) => {
        return {
          url: `/adminpos/add_terminal/`,
          method: "POST",
          body: formBody,
        };
      },
      invalidatesTags: ["admin"],
    }),
    ///api/adminpos/get_terminal
    getTerminal: builder.query({
      query: ({ search, id, bid, page, pageSize }) => {
        return {
          url: `/adminpos/get_terminal?search=${search}&id=${id}&page=${page}&pageSize=${pageSize}&bid=${bid}`,
          method: "GET",
        };
      },
      providesTags: ["admin"],
    }),
    ///api/adminpos/up_terminal
    upTerminal: builder.mutation({
      query: (formBody) => {
        return {
          url: `/adminpos/up_terminal/`,
          method: "PUT",
          body: formBody,
        };
      },
      invalidatesTags: ["admin"],
    }),
    ///api/adminpos/add_user
    addUser: builder.mutation({
      query: (formBody) => {
        return {
          url: `/adminpos/add_user/`,
          method: "POST",
          body: formBody,
        };
      },
      invalidatesTags: ["admin"],
    }),
    ///api/adminpos/get_profile
    getProfile: builder.query({
      query: () => {
        return {
          url: `/adminpos/get_profile`,
          method: "GET",
        };
      },
      providesTags: ["admin"],
    }),
    ///api/adminpos/get_users
    getUsers: builder.query({
      query: ({ search, id, bid, page, pageSize }) => {
        return {
          url: `/adminpos/get_users?search=${search}&id=${id}&page=${page}&pageSize=${pageSize}&bid=${bid}`,
          method: "GET",
        };
      },
      providesTags: ["admin"],
    }),
    ///api/adminpos/up_user
    upUser: builder.mutation({
      query: (formBody) => {
        return {
          url: `/adminpos/up_user/`,
          method: "PUT",
          body: formBody,
        };
      },
      invalidatesTags: ["admin"],
    }),
    ///api/adminpos/get_categories
    getCategories: builder.query({
      query: ({ search, id, page, pageSize }) => {
        return {
          url: `/adminpos/get_categories?search=${search}&id=${id}&page=${page}&pageSize=${pageSize}`,
          method: "GET",
        };
      },
      providesTags: ["admin"],
    }),
    ///api/adminpos/add_category
    addCategory: builder.mutation({
      query: (formBody) => {
        return {
          url: `/adminpos/add_category/`,
          method: "POST",
          body: formBody,
        };
      },
      invalidatesTags: ["admin"],
    }),
    ///api/adminpos/up_category
    upCategory: builder.mutation({
      query: (formBody) => {
        return {
          url: `/adminpos/up_category/`,
          method: "PUT",
          body: formBody,
        };
      },
      invalidatesTags: ["admin"],
    }),
    ///api/adminpos/get_all_categ
    getAllCategories: builder.query({
      query: ({ id }) => {
        return {
          url: `/adminpos/get_all_categ?id=${id}`,
          method: "GET",
        };
      },
      providesTags: ["admin"],
    }),
    //add_client_product
    addClientProduct: builder.mutation({
      query: (formBody) => {
        return {
          url: `/adminpos/add_client_product/`,
          method: "POST",
          body: formBody,
        };
      },
      invalidatesTags: ["admin"],
    }),
    ///api/adminpos/get_products
    getProducts: builder.query({
      query: ({ id }) => {
        return {
          url: `/adminpos/get_products?id=${id}`,
          method: "GET",
        };
      },
      providesTags: ["admin"],
    }),
    ///api/adminpos/up_client_product
    upClientProduct: builder.mutation({
      query: (formBody) => {
        return {
          url: `/adminpos/up_client_product/`,
          method: "PUT",
          body: formBody,
        };
      },
      invalidatesTags: ["admin"],
    }),
    //get_all_products
    getAllProducts: builder.query({
      query: ({ id }) => {
        return {
          url: `/adminpos/get_all_products?id=${id}`,
          method: "GET",
        };
      },
      providesTags: ["admin"],
    }),
    ///api/adminpos/add_branch_user
    addBranchUser: builder.mutation({
      query: (formBody) => {
        return {
          url: `/adminpos/add_branch_user/`,
          method: "POST",
          body: formBody,
        };
      },
      invalidatesTags: ["admin"],
    }),
    ///api/adminpos/up_branch_user
    upBranchUser: builder.mutation({
      query: (formBody) => {
        return {
          url: `/adminpos/up_branch_user/`,
          method: "PUT",
          body: formBody,
        };
      },
      invalidatesTags: ["admin"],
    }),
    ///api/adminpos/get_branch_users
    getBranchUsers: builder.query({
      query: ({ search, id, bid, page, pageSize }) => {
        return {
          url: `/adminpos/get_branch_users?search=${search}&id=${id}&page=${page}&pageSize=${pageSize}&bid=${bid}`,
          method: "GET",
        };
      },
      providesTags: ["admin"],
    }),
  }),
});

export const {
  useGetBarangayQuery,
  useGetCityQuery,
  useGetProvinceQuery,
  useGetRegionQuery,
  useGetClientsQuery,
  useGetClientsListQuery,
  useGetSubscriptionQuery,
  useAddAccountMutation,
  useUpAccountMutation,
  useAddBranchMutation,
  useGetBranchListQuery,
  useUpBranchMutation,
  useGetAllBranchQuery,
  useAddTerminalMutation,
  useGetTerminalQuery,
  useUpTerminalMutation,
  useAddUserMutation,
  useGetProfileQuery,
  useGetUsersQuery,
  useUpUserMutation,
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpCategoryMutation,
  useGetAllCategoriesQuery,
  useAddClientProductMutation,
  useGetProductsQuery,
  useUpClientProductMutation,
  useGetAllProductsQuery,
  useAddBranchUserMutation,
  useUpBranchUserMutation,
  useGetBranchUsersQuery,
} = adminApi;
