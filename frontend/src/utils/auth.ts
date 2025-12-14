import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  fullName?: string;
  email?: string;
  role?: string;
};

export function isLoggedIn(): boolean {
  return !!localStorage.getItem("token");
}

export function getUserRole(): string {
  const token = localStorage.getItem("token");
  if (!token) return "";

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.role || "";
  } catch {
    return "";
  }
}

export function getUserName(): string {
  const token = localStorage.getItem("token");
  if (!token) return "";

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.fullName || decoded.email || "User";
  } catch {
    return "User";
  }
}

export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/";
}
