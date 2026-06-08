"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserRole } from "@/types";

const DEMO_USERS: Record<string, { password: string; user: User }> = {
  "admin@srm.com": {
    password: "admin123",
    user: { id: "u1", name: "Alex Morgan", email: "admin@srm.com", role: "Admin", department: "IT", lastLogin: new Date().toISOString() },
  },
  "procurement@srm.com": {
    password: "proc123",
    user: { id: "u2", name: "Sarah Johnson", email: "procurement@srm.com", role: "Procurement Manager", department: "Procurement", lastLogin: new Date().toISOString() },
  },
  "finance@srm.com": {
    password: "fin123",
    user: { id: "u3", name: "Mark Davis", email: "finance@srm.com", role: "Finance User", department: "Finance", lastLogin: new Date().toISOString() },
  },
  "executive@srm.com": {
    password: "exec123",
    user: { id: "u4", name: "Lisa Brown", email: "executive@srm.com", role: "Executive", department: "Management", lastLogin: new Date().toISOString() },
  },
  "supplier@srm.com": {
    password: "sup123",
    user: { id: "u5", name: "Hans Weber", email: "supplier@srm.com", role: "Supplier", department: "External", lastLogin: new Date().toISOString() },
  },
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loginError: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loginError: null,
      login: (email, password) => {
        const record = DEMO_USERS[email.toLowerCase()];
        if (record && record.password === password) {
          set({ user: { ...record.user, lastLogin: new Date().toISOString() }, isAuthenticated: true, loginError: null });
          return true;
        }
        set({ loginError: "Invalid email or password. Try admin@srm.com / admin123" });
        return false;
      },
      logout: () => set({ user: null, isAuthenticated: false, loginError: null }),
      clearError: () => set({ loginError: null }),
    }),
    { name: "srm-auth" }
  )
);
