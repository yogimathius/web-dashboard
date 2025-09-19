import { create } from 'zustand'
import type { Agent, Task, Project, Codex } from '../types'

interface DashboardState {
  // AgentOps State
  agents: Agent[]
  tasks: Task[]
  projects: Project[]
  
  // Sacred Codex State  
  codices: Codex[]
  activeCodex: Codex | null
  
  // UI State
  currentView: 'agentops' | 'codex' | 'unified'
  sidebarCollapsed: boolean
  
  // Actions
  setCurrentView: (view: 'agentops' | 'codex' | 'unified') => void
  toggleSidebar: () => void
  setActiveCodex: (codex: Codex | null) => void
  
  // Mock data loaders (replace with real API calls)
  loadAgents: () => void
  loadTasks: () => void
  loadProjects: () => void
  loadCodexes: () => void
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  // Initial state
  agents: [],
  tasks: [],
  projects: [],
  codices: [],
  activeCodex: null,
  currentView: 'agentops',
  sidebarCollapsed: false,

  // Actions
  setCurrentView: (view) => set({ currentView: view }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setActiveCodex: (codex) => set({ activeCodex: codex }),

  // Mock data loaders
  loadAgents: () => {
    const mockAgents: Agent[] = [
      {
        id: '1',
        name: 'Architect Alpha',
        type: 'architect',
        status: 'active',
        performance: {
          tasksCompleted: 47,
          successRate: 0.94,
          averageExecutionTime: 12.3,
          uptime: 0.98,
        },
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2', 
        name: 'Engineer Beta',
        type: 'engineer',
        status: 'active',
        performance: {
          tasksCompleted: 89,
          successRate: 0.91,
          averageExecutionTime: 8.7,
          uptime: 0.97,
        },
        createdAt: '2024-01-20T14:30:00Z',
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Tester Gamma',
        type: 'tester',
        status: 'idle',
        performance: {
          tasksCompleted: 156,
          successRate: 0.96,
          averageExecutionTime: 5.2,
          uptime: 0.99,
        },
        createdAt: '2024-02-01T09:15:00Z',
        updatedAt: new Date().toISOString(),
      },
    ]
    set({ agents: mockAgents })
  },

  loadTasks: () => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Setup React TypeScript Project',
        description: 'Initialize a new React project with TypeScript configuration',
        type: 'scaffold',
        status: 'running',
        agentId: '1',
        projectId: 'proj1',
        progress: 75,
        logs: [
          { id: '1', timestamp: new Date().toISOString(), level: 'info', message: 'Creating project structure...' },
          { id: '2', timestamp: new Date().toISOString(), level: 'info', message: 'Installing dependencies...' },
        ],
        createdAt: '2024-09-12T10:00:00Z',
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Generate API Client',
        description: 'Create TypeScript client for REST API endpoints',
        type: 'code-generation',
        status: 'completed',
        agentId: '2',
        projectId: 'proj1',
        progress: 100,
        logs: [
          { id: '3', timestamp: new Date().toISOString(), level: 'info', message: 'Generated client interfaces' },
          { id: '4', timestamp: new Date().toISOString(), level: 'info', message: 'Added error handling' },
        ],
        createdAt: '2024-09-12T09:30:00Z',
        updatedAt: new Date().toISOString(),
        completedAt: '2024-09-12T10:45:00Z',
      },
    ]
    set({ tasks: mockTasks })
  },

  loadProjects: () => {
    const mockProjects: Project[] = [
      {
        id: 'proj1',
        name: 'AI Engines Dashboard',
        description: 'Web dashboard for AgentOps and Sacred Codex platforms',
        repository: 'https://github.com/example/ai-engines-dashboard',
        framework: 'React',
        status: 'active',
        tasksCount: 15,
        agents: get().agents.slice(0, 2),
        createdAt: '2024-09-10T08:00:00Z',
      },
      {
        id: 'proj2', 
        name: 'Protocol Implementation',
        description: 'Core sacred protocol implementation in TypeScript',
        framework: 'Node.js',
        status: 'active',
        tasksCount: 8,
        agents: get().agents.slice(1),
        createdAt: '2024-09-05T14:00:00Z',
      },
    ]
    set({ projects: mockProjects })
  },

  loadCodexes: () => {
    const mockCodexes: Codex[] = [
      {
        id: '1',
        title: 'The Developer\'s Path',
        description: 'A sacred codex for conscious software development practices',
        authorId: 'user1',
        status: 'active',
        symbols: [
          {
            id: 's1',
            name: 'Code as Sacred Practice',
            meaning: 'Every line of code is written with intention and mindfulness',
            category: 'practice',
            usageCount: 42,
            createdAt: '2024-09-01T00:00:00Z',
          },
        ],
        rituals: [
          {
            id: 'r1',
            name: 'Daily Code Meditation',
            description: 'Start each coding session with 5 minutes of mindful breathing',
            steps: [
              { id: 'rs1', order: 1, instruction: 'Sit comfortably at your workstation', required: true },
              { id: 'rs2', order: 2, instruction: 'Take 10 deep breaths', duration: 60, required: true },
            ],
            frequency: 'daily',
            participantsCount: 127,
            completionRate: 0.78,
            createdAt: '2024-09-01T00:00:00Z',
          },
        ],
        reflections: [],
        commandments: [],
        forks: 23,
        collaborators: ['user1', 'user2', 'user3'],
        createdAt: '2024-09-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
      },
    ]
    set({ codices: mockCodexes })
  },
}))