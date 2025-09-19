// Core domain types for AI Engines Platform

export interface Agent {
  id: string
  name: string
  type: 'architect' | 'engineer' | 'tester' | 'custom'
  status: 'active' | 'idle' | 'error' | 'offline'
  performance: AgentPerformance
  createdAt: string
  updatedAt: string
}

export interface AgentPerformance {
  tasksCompleted: number
  successRate: number
  averageExecutionTime: number
  uptime: number
}

export interface Task {
  id: string
  title: string
  description: string
  type: 'scaffold' | 'code-generation' | 'testing' | 'deployment' | 'custom'
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  agentId: string
  projectId: string
  progress: number
  logs: TaskLog[]
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export interface TaskLog {
  id: string
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  data?: Record<string, unknown>
}

export interface Project {
  id: string
  name: string
  description: string
  repository?: string
  framework: string
  status: 'active' | 'archived' | 'maintenance'
  tasksCount: number
  agents: Agent[]
  createdAt: string
}

// Sacred Codex Types
export interface Codex {
  id: string
  title: string
  description: string
  authorId: string
  status: 'draft' | 'active' | 'sacred' | 'archived'
  symbols: CodexSymbol[]
  rituals: Ritual[]
  reflections: Reflection[]
  commandments: Commandment[]
  forks: number
  collaborators: string[]
  createdAt: string
  updatedAt: string
}

export interface CodexSymbol {
  id: string
  name: string
  meaning: string
  visualRepresentation?: string
  category: 'awakening' | 'wisdom' | 'practice' | 'community'
  usageCount: number
  createdAt: string
}

export interface Ritual {
  id: string
  name: string
  description: string
  steps: RitualStep[]
  frequency: 'daily' | 'weekly' | 'monthly' | 'as-needed'
  participantsCount: number
  completionRate: number
  createdAt: string
}

export interface RitualStep {
  id: string
  order: number
  instruction: string
  duration?: number
  required: boolean
}

export interface Reflection {
  id: string
  title: string
  content: string
  authorId: string
  tags: string[]
  resonanceScore: number
  responses: ReflectionResponse[]
  createdAt: string
}

export interface ReflectionResponse {
  id: string
  authorId: string
  content: string
  resonance: 'low' | 'medium' | 'high' | 'profound'
  createdAt: string
}

export interface Commandment {
  id: string
  text: string
  category: 'technical' | 'ethical' | 'spiritual' | 'community'
  votes: CommandmentVote[]
  status: 'proposed' | 'debated' | 'accepted' | 'rejected'
  createdAt: string
}

export interface CommandmentVote {
  userId: string
  vote: 'agree' | 'disagree' | 'abstain'
  reasoning?: string
  createdAt: string
}

// User and Auth Types
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  tier: 'individual' | 'team' | 'enterprise' | 'seeker' | 'practitioner' | 'sacred-circle' | 'collective'
  permissions: string[]
  preferences: UserPreferences
  createdAt: string
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'sacred'
  notifications: NotificationSettings
  dashboard: DashboardSettings
}

export interface NotificationSettings {
  taskUpdates: boolean
  agentAlerts: boolean
  communityActivity: boolean
  sacredMilestones: boolean
}

export interface DashboardSettings {
  defaultView: 'agentops' | 'codex' | 'unified'
  widgetLayout: string[]
  refreshInterval: number
}