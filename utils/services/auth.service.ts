import api from "@/utils/api";
import type {
  TokenResponse,
  UserResponse,
  UpdateUserRequest,
} from "@/types/models";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nombre: string;
  cedula: string;
  telefono: string;
}

const authService = {
  async login(data: LoginRequest): Promise<TokenResponse> {
    const res = await api.post<TokenResponse>("/api/v1/auth/login", data);
    return res.data;
  },

  async register(data: RegisterRequest): Promise<UserResponse> {
    const res = await api.post<UserResponse>("/api/v1/auth/register", data);
    return res.data;
  },

  async refresh(refresh_token: string): Promise<TokenResponse> {
    const res = await api.post<TokenResponse>("/api/v1/auth/refresh", {
      refresh_token,
    });
    return res.data;
  },

  async getMe(): Promise<UserResponse> {
    const res = await api.get<UserResponse>("/api/v1/auth/me");
    return res.data;
  },

  async updateMe(data: UpdateUserRequest): Promise<UserResponse> {
    const res = await api.put<UserResponse>("/api/v1/auth/me", data);
    return res.data;
  },

  async logout(): Promise<void> {
    await api.post("/api/v1/auth/logout");
  },
};

export default authService;
