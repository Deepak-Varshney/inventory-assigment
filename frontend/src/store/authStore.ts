import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  setSession: (user: User, token: string) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  hydrated: false,

  setSession: (user, token) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("inventory_token", token);
      window.localStorage.setItem("inventory_user", JSON.stringify(user));
    }

    set({
      user,
      token,
      isAuthenticated: true,
      hydrated: true,
    });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("inventory_token");
      window.localStorage.removeItem("inventory_user");
    }

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      hydrated: true,
    });
  },

  hydrate: () => {
    if (typeof window === "undefined") {
      return;
    }

    const token = window.localStorage.getItem("inventory_token");
    const user = window.localStorage.getItem("inventory_user");

    if (token && user) {
      set({
        token,
        user: JSON.parse(user) as User,
        isAuthenticated: true,
        hydrated: true,
      });
      return;
    }

    set({ hydrated: true });
  },
}));