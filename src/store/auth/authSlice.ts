// store/auth/authSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  role: string | null;
  loading: boolean;
  error: string | null;
  client: string | null;
  branch: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  role: null,
  loading: false,
  error: null,
  client: null,
  branch: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ role: string }>) => {
      state.isAuthenticated = true;
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.role = null;
      state.client = null;
      state.branch = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    viewUser: (
      state,
      action: PayloadAction<{ role: string; client: string; branch: string }>,
    ) => {
      state.role = action.payload.role;
      state.client = action.payload.client;
      state.branch = action.payload.branch;
    },
  },
});

export const { loginSuccess, logout, setLoading, setError, viewUser } =
  authSlice.actions;
export default authSlice.reducer;
