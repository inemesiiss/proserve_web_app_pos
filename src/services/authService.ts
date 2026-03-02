import api from "./api";
import { viewUser } from "@/store/auth/authSlice";
import { store } from "@/store";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email?: string;
  username?: string;
  name?: string;
}

export interface LoginResponse {
  message: string;
}

export interface BranchReceiptFormat {
  id: number;
  branch: number | null;
  address: string | null;
  vat_reg_tin: string | null;
  vat_reg_date: string | null;
  min: string | null;
  t_discount: boolean;
  t_vat_sales: boolean;
  t_vat_twelve: boolean;
  t_vat_exempt: boolean;
  t_total: boolean;
  t_cash: boolean;
  t_change: boolean;
  t_total_items: boolean;
  t_invoice: boolean;
  t_cashier: boolean;
  t_order_no: boolean;
  t_date_time: boolean;
  line: boolean;
  l_name: boolean;
  l_address: boolean;
  l_tin: boolean;
  l_bus_style: boolean;
  qr: boolean;
  qr_image: string | null;
  created_at: string;
  b_name: string | null;
  c_name: string | null;
}

export interface UserResponse {
  success: boolean;
  id: number;
  client: number;
  role: number;
  branch: number;
  br_format: BranchReceiptFormat;
}

class AuthService {
  /**
   * Login user with email and password
   */

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>(
        "api/user/login/",
        credentials,
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Login failed. Please check your credentials.");
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      await api.post("/api/user/logout/");
      localStorage.clear();
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, we should clear local state
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<UserResponse>("/api/user/me/");
      console.log("Response: ", response);
      if (response) {
        localStorage.setItem("client", String(response.data.client));
        localStorage.setItem("role", String(response.data.role));
        localStorage.setItem("branch", String(response.data.branch));
        localStorage.setItem(
          "receipt_format",
          JSON.stringify(response.data.br_format),
        );

        store.dispatch(
          viewUser({
            role: String(response.data.role),
            client: String(response.data.client),
            branch: String(response.data.branch),
          }),
        );
      }
      return {
        id: response.data.id,
      };
    } catch (error) {
      throw new Error("Failed to fetch user data");
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<void> {
    try {
      await api.post("/api/user/refresh/");
    } catch (error) {
      throw new Error("Session expired. Please login again.");
    }
  }

  /**
   * Check if user is authenticated by verifying token
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new AuthService();
