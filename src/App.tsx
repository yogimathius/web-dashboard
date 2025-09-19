import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/useAuthStore'
import { Layout } from './components/Layout/Layout'
import { Login } from './pages/Auth/Login'
import { Dashboard } from './pages/AgentOps/Dashboard'
import { Agents } from './pages/AgentOps/Agents'
import { Tasks } from './pages/AgentOps/Tasks'
import { CodexBrowser } from './pages/Codex/CodexBrowser'

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <Layout>{children}</Layout>
}

// Placeholder components for remaining pages
const ProjectsPage: React.FC = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Projects</h1>
    <p className="text-slate-600 mt-2">Manage development projects and workspaces.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="card">
          <h3 className="font-semibold text-slate-900 mb-2">Project {i}</h3>
          <p className="text-slate-600 text-sm mb-4">A sample development project with AI agent automation.</p>
          <div className="flex justify-between items-center">
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
            <span className="text-xs text-slate-500">3 agents</span>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const SymbolsPage: React.FC = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Sacred Symbols</h1>
    <p className="text-slate-600 mt-2">Discover and contribute to the symbol library.</p>
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
      {['⚡', '🌟', '🔮', '🌊', '🌱', '⚖️', '🕸️', '🔍', '👁️', '🔥', '💎', '🎯'].map((symbol, i) => (
        <div key={i} className="card text-center hover:shadow-lg transition-shadow cursor-pointer">
          <div className="text-4xl mb-2">{symbol}</div>
          <p className="text-sm font-medium text-slate-900">Symbol {i + 1}</p>
          <p className="text-xs text-slate-600">Sacred meaning</p>
        </div>
      ))}
    </div>
  </div>
)

const RitualsPage: React.FC = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Development Rituals</h1>
    <p className="text-slate-600 mt-2">Practice conscious development rituals.</p>
    <div className="space-y-4 mt-6">
      {[
        'Morning Code Meditation',
        'Debugging Ceremony', 
        'Deployment Blessing',
        'Code Review Ritual',
        'Evening Reflection'
      ].map((ritual, i) => (
        <div key={i} className="card">
          <h3 className="font-semibold text-slate-900 mb-2">{ritual}</h3>
          <p className="text-slate-600 text-sm mb-3">A sacred practice for mindful development.</p>
          <div className="flex items-center justify-between">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">5 min</span>
            <button className="btn btn-sm btn-primary">Practice</button>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const CommunityPage: React.FC = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Sacred Community</h1>
    <p className="text-slate-600 mt-2">Connect with fellow conscious developers.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div className="card">
        <h3 className="font-semibold text-slate-900 mb-4">Recent Discussions</h3>
        <div className="space-y-3">
          {[
            'The Art of Clean Code Meditation',
            'Debugging as Spiritual Practice',
            'Building Resilient Systems with Love'
          ].map((topic, i) => (
            <div key={i} className="p-3 bg-slate-50 rounded-lg">
              <p className="text-sm font-medium text-slate-900">{topic}</p>
              <p className="text-xs text-slate-600 mt-1">12 replies • 2 hours ago</p>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <h3 className="font-semibold text-slate-900 mb-4">Community Stats</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-slate-600">Active Members:</span>
            <span className="font-semibold">2,847</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Sacred Codices:</span>
            <span className="font-semibold">156</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Wisdom Shared:</span>
            <span className="font-semibold">8,234</span>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const SettingsPage: React.FC = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Settings</h1>
    <p className="text-slate-600 mt-2">Configure your AI Engines experience.</p>
    <div className="max-w-2xl mt-6">
      <div className="card">
        <h3 className="font-semibold text-slate-900 mb-4">Profile Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
            <input type="text" className="input" placeholder="Your name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" className="input" placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Sacred Path</label>
            <select className="input">
              <option>Frontend Mystic</option>
              <option>Backend Shaman</option>
              <option>DevOps Sage</option>
              <option>Full-Stack Guru</option>
            </select>
          </div>
          <button className="btn btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
  </div>
)

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* AgentOps Routes */}
      <Route path="/agentops" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/agentops/agents" element={
        <ProtectedRoute>
          <Agents />
        </ProtectedRoute>
      } />
      <Route path="/agentops/tasks" element={
        <ProtectedRoute>
          <Tasks />
        </ProtectedRoute>
      } />
      <Route path="/agentops/projects" element={
        <ProtectedRoute>
          <ProjectsPage />
        </ProtectedRoute>
      } />

      {/* Sacred Codex Routes */}
      <Route path="/codex" element={
        <ProtectedRoute>
          <CodexBrowser />
        </ProtectedRoute>
      } />
      <Route path="/codex/symbols" element={
        <ProtectedRoute>
          <SymbolsPage />
        </ProtectedRoute>
      } />
      <Route path="/codex/rituals" element={
        <ProtectedRoute>
          <RitualsPage />
        </ProtectedRoute>
      } />
      <Route path="/codex/community" element={
        <ProtectedRoute>
          <CommunityPage />
        </ProtectedRoute>
      } />

      {/* Settings */}
      <Route path="/settings" element={
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      } />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/agentops" replace />} />
    </Routes>
  )
}

export default App