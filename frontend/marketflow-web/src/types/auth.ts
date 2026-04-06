// Auth ile ilgili request/response tipleri

export type RegisterRequest = {
  fullName: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  id: number;
  fullName: string;
  email: string;
  role: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  id: number;
  fullName: string;
  email: string;
  role: string;
  token: string;
};
