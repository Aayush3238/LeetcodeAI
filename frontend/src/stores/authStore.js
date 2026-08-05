import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      setAuth: (user, token, refreshToken) => set({ user, token, refreshToken: refreshToken || null, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, refreshToken: null, isAuthenticated: false }),
      updateUser: (user) => set((state) => ({ user: { ...state.user, ...user } })),
      setToken: (token) => set({ token }),
    }),
    { name: 'auth-storage' }
  )
)
