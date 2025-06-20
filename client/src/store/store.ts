import { create } from 'zustand';

type AuthState = {
  token: string | null;
  role: 'user' | 'admin' | null;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  setAuth: (
    token: string,
    role: 'user' | 'admin',
    firstName: string | null,
    lastName: string | null,
    username: string
  ) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: null,
  firstName: null,
  lastName: null,
  username: null,
  setAuth: (token, role, firstName, lastName, username) =>
    set({ token, role, firstName, lastName, username }),
  clearAuth: () =>
    set({ token: null, role: null, firstName: null, lastName: null, username: null }),
}));
