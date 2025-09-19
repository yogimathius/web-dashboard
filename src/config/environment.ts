// Environment configuration with type safety
interface Environment {
  NODE_ENV: 'development' | 'production' | 'test'
  API_BASE_URL: string
  WS_BASE_URL: string
  APP_VERSION: string
  BUILD_TIME: string
}

// Get environment variables with defaults
const getEnvironment = (): Environment => {
  return {
    NODE_ENV: (import.meta.env.MODE as Environment['NODE_ENV']) || 'development',
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
    WS_BASE_URL: import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:3001',
    APP_VERSION: (globalThis as any).__APP_VERSION__ || '0.1.0',
    BUILD_TIME: (globalThis as any).__BUILD_TIME__ || new Date().toISOString(),
  }
}

export const env = getEnvironment()

// Helper functions
export const isDevelopment = () => env.NODE_ENV === 'development'
export const isProduction = () => env.NODE_ENV === 'production'
export const isTest = () => env.NODE_ENV === 'test'

// API configuration
export const apiConfig = {
  baseURL: env.API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
}

// WebSocket configuration
export const wsConfig = {
  url: env.WS_BASE_URL,
  reconnectAttempts: 5,
  reconnectInterval: 3000,
}