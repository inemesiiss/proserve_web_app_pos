import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

// Branch user response from API
// New simpler format: user is now just the user ID (number)
interface BranchUserResponse {
  id: number;
  fullname: string | null;
  password: number | null;
  status: number;
  branch: number;
  user: number; // user ID - used for verification API
}

// API response wrapper
interface BranchUsersApiResponse {
  success: boolean;
  data: BranchUserResponse[];
}

// Simplified user option for dropdown usage
export interface UserOption {
  id: number; // branch user id
  branchUserId: number; // same as id
  userId: number; // actual user id - used for verification API
  fullName: string;
}

// Verify passcode request params
interface VerifyPasscodeParams {
  branchId: number;
  userId: number; // This is the user id (from user field)
  passCode: string;
}

// Verify passcode API response
interface VerifyPasscodeApiResponse {
  success: boolean;
  data: {
    id: number;
    user: {
      id: number;
      first_name: string;
      last_name: string;
    } | null;
    fullname?: string | null;
    has_login: boolean;
  };
  message?: string;
}

// Verified user result
export interface VerifiedUser {
  branchUserId: number;
  userId: number;
  fullName: string;
  hasLogin: boolean;
}

// Transform API response to dropdown-friendly format
const transformBranchUsers = (data: BranchUserResponse[]): UserOption[] => {
  return data.map((branchUser) => {
    // Use fullname directly, fallback to User ID if not available
    const fullName = branchUser.fullname?.trim() || `User ${branchUser.user}`;

    return {
      id: branchUser.id, // branch user id
      branchUserId: branchUser.id,
      userId: branchUser.user, // actual user id for verification
      fullName,
    };
  });
};

/**
 * User API - Handles user related queries
 */
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["branchUsers"],
  endpoints: (builder) => ({
    /**
     * Query: Get branch users for dropdown
     * GET /api/transactions/cashier/get_branch_users?bid=1
     * Returns active users for a specific branch
     */
    getBranchUsers: builder.query<UserOption[], number>({
      query: (branchId) => ({
        url: `/transactions/cashier/get_branch_users?bid=${branchId}`,
        method: "GET",
      }),
      transformResponse: (response: BranchUsersApiResponse) => {
        return transformBranchUsers(response.data || []);
      },
      providesTags: ["branchUsers"],
    }),

    /**
     * Mutation: Verify user passcode
     * GET /api/transactions/cashier/get_user_details?branchId=1&userId=1&passCode=123456
     * Validates user PIN and returns user details
     */
    verifyPasscode: builder.mutation<VerifiedUser, VerifyPasscodeParams>({
      query: ({ branchId, userId, passCode }) => ({
        url: `/transactions/cashier/get_user_details?branchId=${branchId}&userId=${userId}&passCode=${passCode}`,
        method: "GET",
      }),
      transformResponse: (response: VerifyPasscodeApiResponse) => {
        const data = response.data;

        // Use fullname directly, fallback to User ID
        const fullName = data.fullname?.trim() || `User ${data.id}`;

        return {
          branchUserId: data.id,
          userId: data.id,
          fullName,
          hasLogin: data.has_login,
        };
      },
    }),
  }),
});

// Auto-generated hooks
export const { useGetBranchUsersQuery, useVerifyPasscodeMutation } = userApi;
