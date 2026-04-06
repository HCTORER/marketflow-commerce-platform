import { api } from "../../api/api";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../../types/auth";

// Register isteği
export async function registerUser(data: RegisterRequest) {
  const response = await api.post<RegisterResponse>("/auth/register", data);
  return response.data;
}

// Login isteği
export async function loginUser(data: LoginRequest) {
  const response = await api.post<LoginResponse>("/auth/login", data);
  return response.data;
}
