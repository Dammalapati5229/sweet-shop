import api from "./axios";

export const register = (data: {
  fullName: string;
  email: string;
  password: string;
}) => api.post("/auth/register", data);

export const login = (data: { email: string; password: string }) =>
  api.post("/auth/login", data);
