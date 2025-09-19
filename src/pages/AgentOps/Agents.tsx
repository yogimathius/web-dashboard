import React, { useEffect, useState } from 'react'
import { Bot, Plus, Settings, Play, Pause, Trash2, Edit3, Activity, Zap } from 'lucide-react'
import { useDashboardStore } from '../../stores/useDashboardStore'
import type { Agent, AgentType, AgentStatus } from '../../types'

interface CreateAgentForm {
  name: string
  type: AgentType
  description: string
  configuration: {
    maxConcurrentTasks: number
    timeout: number
    retryAttempts: number
  }
}

export const Agents: React.FC = () => {
  const { agents, loadAgents, createAgent, updateAgent, deleteAgent } = useDashboardStore()
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createForm, setCreateForm] = useState<CreateAgentForm>({
    name: '',
    type: 'architect',
    description: '',
    configuration: {
      maxConcurrentTasks: 3,
      timeout: 300,
      retryAttempts: 3
    }
  })

  useEffect(() => {
    loadAgents()
  }, [loadAgents])

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const newAgent = await createAgent({
      ...createForm,
      status: 'idle' as AgentStatus,
      performance: {
        tasksCompleted: 0,
        successRate: 0,
        averageExecutionTime: 0,
        lastActive: new Date().toISOString()
      }
    })

    if (newAgent) {
      setShowCreateForm(false)
      setCreateForm({
        name: '',
        type: 'architect',
        description: '',
        configuration: {
          maxConcurrentTasks: 3,
          timeout: 300,
          retryAttempts: 3
        }
      })
    }
  }

  const handleStatusToggle = async (agent: Agent) => {
    const newStatus: AgentStatus = agent.status === 'active' ? 'idle' : 'active'
    await updateAgent(agent.id, { ...agent, status: newStatus })
  }

  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'idle': return 'bg-yellow-100 text-yellow-800'
      case 'error': return 'bg-red-100 text-red-800'
      case 'maintenance': return 'bg-blue-100 text-blue-800'
      default: return 'bg-slate-100 text-slate-800'
    }
  }

  const getTypeIcon = (type: AgentType) => {
    const iconClass = "w-5 h-5"
    switch (type) {
      case 'architect': return <Settings className={iconClass} />
      case 'engineer': return <Bot className={iconClass} />
      case 'tester': return <Activity className={iconClass} />
      default: return <Bot className={iconClass} />
    }
  }

  const AgentCard: React.FC<{ agent: Agent }> = ({ agent }) => (
    <div className="card hover:shadow-lg transition-shadow cursor-pointer"
         onClick={() => setSelectedAgent(agent)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            {getTypeIcon(agent.type)}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{agent.name}</h3>
            <p className="text-sm text-slate-600 capitalize">{agent.type}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
          {agent.status}
        </span>
      </div>

      <p className="text-sm text-slate-600 mb-4 line-clamp-2">{agent.description}</p>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="text-center">
          <p className="font-semibold text-slate-900">{agent.performance.tasksCompleted}</p>
          <p className="text-slate-500">Tasks</p>
        </div>
        <div className="text-center">
          <p className="font-semibold text-slate-900">{Math.round(agent.performance.successRate * 100)}%</p>
          <p className="text-slate-500">Success</p>
        </div>
        <div className="text-center">
          <p className="font-semibold text-slate-900">{agent.performance.averageExecutionTime}s</p>
          <p className="text-slate-500">Avg Time</p>
        </div>
      </div>

      <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleStatusToggle(agent)
          }}
          className={`btn btn-sm ${agent.status === 'active' ? 'btn-secondary' : 'btn-primary'}`}
        >
          {agent.status === 'active' ? (
            <>
              <Pause className="w-4 h-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Start
            </>
          )}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            // Handle edit
          }}
          className="btn btn-sm btn-outline"
        >
          <Edit3 className="w-4 h-4" />
          Edit
        </button>
      </div>
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Agent Management</h1>
          <p className="text-slate-600 mt-1">Configure and monitor your AI agents</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          Create Agent
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Bot className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">
                {agents.filter(a => a.status === 'active').length}
              </p>
              <p className="text-sm text-slate-600">Active Agents</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">
                {agents.reduce((sum, a) => sum + a.performance.tasksCompleted, 0)}
              </p>
              <p className="text-sm text-slate-600">Total Tasks</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">
                {Math.round(agents.reduce((sum, a) => sum + a.performance.successRate, 0) / agents.length * 100)}%
              </p>
              <p className="text-sm text-slate-600">Avg Success</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Settings className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">{agents.length}</p>
              <p className="text-sm text-slate-600">Total Agents</p>
            </div>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      {/* Create Agent Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Create New Agent</h2>
            
            <form onSubmit={handleCreateAgent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="input"
                  placeholder="Agent name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select
                  value={createForm.type}
                  onChange={(e) => setCreateForm({ ...createForm, type: e.target.value as AgentType })}
                  className="input"
                  required
                >
                  <option value="architect">Architect</option>
                  <option value="engineer">Engineer</option>
                  <option value="tester">Tester</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="input"
                  placeholder="Agent description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Max Tasks</label>
                  <input
                    type="number"
                    value={createForm.configuration.maxConcurrentTasks}
                    onChange={(e) => setCreateForm({
                      ...createForm,
                      configuration: {
                        ...createForm.configuration,
                        maxConcurrentTasks: parseInt(e.target.value)
                      }
                    })}
                    className="input"
                    min="1"
                    max="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Timeout (s)</label>
                  <input
                    type="number"
                    value={createForm.configuration.timeout}
                    onChange={(e) => setCreateForm({
                      ...createForm,
                      configuration: {
                        ...createForm.configuration,
                        timeout: parseInt(e.target.value)
                      }
                    })}
                    className="input"
                    min="30"
                    max="3600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Agent Details Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary-100 rounded-lg">
                  {getTypeIcon(selectedAgent.type)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedAgent.name}</h2>
                  <p className="text-slate-600 capitalize">{selectedAgent.type}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAgent(null)}
                className="btn btn-outline"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Status</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedAgent.status)}`}>
                    {selectedAgent.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
                  <p className="text-slate-600">{selectedAgent.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Configuration</h3>
                  <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Max Concurrent Tasks:</span>
                      <span className="font-medium">{selectedAgent.configuration.maxConcurrentTasks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Timeout:</span>
                      <span className="font-medium">{selectedAgent.configuration.timeout}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Retry Attempts:</span>
                      <span className="font-medium">{selectedAgent.configuration.retryAttempts}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Performance Metrics</h3>
                  <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Tasks Completed:</span>
                      <span className="font-medium">{selectedAgent.performance.tasksCompleted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Success Rate:</span>
                      <span className="font-medium">{Math.round(selectedAgent.performance.successRate * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Avg Execution Time:</span>
                      <span className="font-medium">{selectedAgent.performance.averageExecutionTime}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Last Active:</span>
                      <span className="font-medium">
                        {new Date(selectedAgent.performance.lastActive).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusToggle(selectedAgent)}
                    className={`btn ${selectedAgent.status === 'active' ? 'btn-secondary' : 'btn-primary'} flex-1`}
                  >
                    {selectedAgent.status === 'active' ? (
                      <>
                        <Pause className="w-4 h-4" />
                        Pause Agent
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Start Agent
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => deleteAgent(selectedAgent.id)}
                    className="btn btn-secondary"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}