import api from "./api";

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

export interface UserResponse {
  success: boolean;
  id: number;
  client: number;
  role: number;
  branch: number;
}

class AuthService {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>(
        "api/user/login/",
        credentials
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
