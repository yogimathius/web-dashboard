import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Mock authentication - replace with real API call
        if (email && password) {
          const mockUser: User = {
            id: '1',
            email,
            name: email.split('@')[0],
            tier: 'individual',
            permissions: ['read', 'write'],
            preferences: {
              theme: 'light',
              notifications: {
                taskUpdates: true,
                agentAlerts: true,
                communityActivity: true,
                sacredMilestones: true,
              },
              dashboard: {
                defaultView: 'agentops',
                widgetLayout: ['tasks', 'agents', 'projects'],
                refreshInterval: 30000,
              },
            },
            createdAt: new Date().toISOString(),
          }
          
          set({ user: mockUser, isAuthenticated: true })
        } else {
          throw new Error('Invalid credentials')
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      updateUser: (updates) => {
        const { user } = get()
        if (user) {
          set({ user: { ...user, ...updates } })
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)