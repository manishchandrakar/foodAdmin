import { create } from "zustand";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) => {
    set({ user, isAuthenticated: true });
  },

  logout: async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    try {
      await fetch(`${baseUrl}/api/auth/logout`, { method: "POST", credentials: "include" });
    } catch {
      // best-effort — clear local state regardless
    }
    set({ user: null, isAuthenticated: false });
    window.location.href = "/login";
  },
}));

export default useAuthStore;
