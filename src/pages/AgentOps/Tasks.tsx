import React, { useEffect, useState } from 'react'
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  Pause, 
  RotateCcw, 
  Filter,
  Search,
  Plus,
  Calendar,
  User,
  Settings
} from 'lucide-react'
import { useDashboardStore } from '../../stores/useDashboardStore'
import type { Task, TaskStatus, TaskType } from '../../types'

interface TaskFilters {
  status: TaskStatus | 'all'
  type: TaskType | 'all'
  assignedAgent: string | 'all'
  dateRange: 'today' | 'week' | 'month' | 'all'
}

interface CreateTaskForm {
  title: string
  type: TaskType
  description: string
  assignedAgent: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  estimatedDuration: number
  configuration: Record<string, any>
}

export const Tasks: React.FC = () => {
  const { tasks, agents, loadTasks, loadAgents, createTask, updateTask, deleteTask } = useDashboardStore()
  const [filters, setFilters] = useState<TaskFilters>({
    status: 'all',
    type: 'all',
    assignedAgent: 'all',
    dateRange: 'all'
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createForm, setCreateForm] = useState<CreateTaskForm>({
    title: '',
    type: 'scaffold',
    description: '',
    assignedAgent: '',
    priority: 'medium',
    estimatedDuration: 300,
    configuration: {}
  })

  useEffect(() => {
    loadTasks()
    loadAgents()
  }, [loadTasks, loadAgents])

  // Filter and search tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filters.status === 'all' || task.status === filters.status
    const matchesType = filters.type === 'all' || task.type === filters.type
    const matchesAgent = filters.assignedAgent === 'all' || task.assignedAgent === filters.assignedAgent
    
    return matchesSearch && matchesStatus && matchesType && matchesAgent
  })

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const newTask = await createTask({
      ...createForm,
      status: 'pending' as TaskStatus,
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      logs: []
    })

    if (newTask) {
      setShowCreateForm(false)
      setCreateForm({
        title: '',
        type: 'scaffold',
        description: '',
        assignedAgent: '',
        priority: 'medium',
        estimatedDuration: 300,
        configuration: {}
      })
    }
  }

  const handleTaskAction = async (task: Task, action: 'start' | 'pause' | 'retry' | 'cancel') => {
    let newStatus: TaskStatus = task.status
    
    switch (action) {
      case 'start':
        newStatus = 'running'
        break
      case 'pause':
        newStatus = 'paused'
        break
      case 'retry':
        newStatus = 'pending'
        break
      case 'cancel':
        newStatus = 'cancelled'
        break
    }
    
    await updateTask(task.id, { ...task, status: newStatus })
  }

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'running': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'paused': return 'bg-purple-100 text-purple-800'
      case 'cancelled': return 'bg-slate-100 text-slate-800'
      default: return 'bg-slate-100 text-slate-800'
    }
  }

  const getStatusIcon = (status: TaskStatus) => {
    const iconClass = "w-4 h-4"
    switch (status) {
      case 'completed': return <CheckCircle className={`${iconClass} text-green-500`} />
      case 'running': return <Play className={`${iconClass} text-blue-500`} />
      case 'pending': return <Clock className={`${iconClass} text-yellow-500`} />
      case 'failed': return <AlertCircle className={`${iconClass} text-red-500`} />
      case 'paused': return <Pause className={`${iconClass} text-purple-500`} />
      case 'cancelled': return <AlertCircle className={`${iconClass} text-slate-500`} />
      default: return <Clock className={`${iconClass} text-slate-500`} />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-slate-500'
    }
  }

  const TaskCard: React.FC<{ task: Task }> = ({ task }) => (
    <div 
      className="card hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => setSelectedTask(task)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {getStatusIcon(task.status)}
            <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{task.title}</h3>
            <p className="text-sm text-slate-600 capitalize">{task.type}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
          {task.status}
        </span>
      </div>

      <p className="text-sm text-slate-600 mb-3 line-clamp-2">{task.description}</p>

      <div className="flex items-center justify-between text-sm text-slate-500 mb-3">
        <div className="flex items-center gap-1">
          <User className="w-4 h-4" />
          <span>{task.assignedAgent || 'Unassigned'}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{new Date(task.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {task.status === 'running' && (
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{task.progress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-3 border-t border-slate-200">
        {task.status === 'pending' && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleTaskAction(task, 'start')
            }}
            className="btn btn-sm btn-primary"
          >
            <Play className="w-4 h-4" />
            Start
          </button>
        )}
        {task.status === 'running' && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleTaskAction(task, 'pause')
            }}
            className="btn btn-sm btn-secondary"
          >
            <Pause className="w-4 h-4" />
            Pause
          </button>
        )}
        {task.status === 'failed' && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleTaskAction(task, 'retry')
            }}
            className="btn btn-sm btn-outline"
          >
            <RotateCcw className="w-4 h-4" />
            Retry
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation()
            // Handle edit
          }}
          className="btn btn-sm btn-outline"
        >
          <Settings className="w-4 h-4" />
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
          <h1 className="text-2xl font-bold text-slate-900">Task Management</h1>
          <p className="text-slate-600 mt-1">Monitor and control agent task execution</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          Create Task
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="card">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{tasks.filter(t => t.status === 'running').length}</div>
            <div className="text-sm text-slate-600">Running</div>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{tasks.filter(t => t.status === 'pending').length}</div>
            <div className="text-sm text-slate-600">Pending</div>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{tasks.filter(t => t.status === 'completed').length}</div>
            <div className="text-sm text-slate-600">Completed</div>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{tasks.filter(t => t.status === 'failed').length}</div>
            <div className="text-sm text-slate-600">Failed</div>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-600">{tasks.length}</div>
            <div className="text-sm text-slate-600">Total</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input w-64"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value as TaskStatus | 'all' })}
              className="input w-32"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="running">Running</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="paused">Paused</option>
            </select>
          </div>

          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value as TaskType | 'all' })}
            className="input w-32"
          >
            <option value="all">All Types</option>
            <option value="scaffold">Scaffold</option>
            <option value="code_generation">Code Gen</option>
            <option value="testing">Testing</option>
            <option value="deployment">Deploy</option>
          </select>

          <select
            value={filters.assignedAgent}
            onChange={(e) => setFilters({ ...filters, assignedAgent: e.target.value })}
            className="input w-32"
          >
            <option value="all">All Agents</option>
            {agents.map(agent => (
              <option key={agent.id} value={agent.id}>{agent.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {/* Create Task Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Create New Task</h2>
            
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  className="input"
                  placeholder="Task title"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select
                    value={createForm.type}
                    onChange={(e) => setCreateForm({ ...createForm, type: e.target.value as TaskType })}
                    className="input"
                    required
                  >
                    <option value="scaffold">Scaffold</option>
                    <option value="code_generation">Code Generation</option>
                    <option value="testing">Testing</option>
                    <option value="deployment">Deployment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                  <select
                    value={createForm.priority}
                    onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value as 'low' | 'medium' | 'high' | 'critical' })}
                    className="input"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assigned Agent</label>
                <select
                  value={createForm.assignedAgent}
                  onChange={(e) => setCreateForm({ ...createForm, assignedAgent: e.target.value })}
                  className="input"
                >
                  <option value="">Select Agent</option>
                  {agents.filter(a => a.status === 'active').map(agent => (
                    <option key={agent.id} value={agent.id}>{agent.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="input"
                  placeholder="Task description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Duration (seconds)</label>
                <input
                  type="number"
                  value={createForm.estimatedDuration}
                  onChange={(e) => setCreateForm({ ...createForm, estimatedDuration: parseInt(e.target.value) })}
                  className="input"
                  min="30"
                  max="3600"
                />
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
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {getStatusIcon(selectedTask.status)}
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedTask.title}</h2>
                  <p className="text-slate-600 capitalize">{selectedTask.type}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="btn btn-outline"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Task Details</h3>
                  <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Status:</span>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(selectedTask.status)}`}>
                        {selectedTask.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Priority:</span>
                      <span className="font-medium capitalize">{selectedTask.priority}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Assigned Agent:</span>
                      <span className="font-medium">{selectedTask.assignedAgent || 'Unassigned'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Created:</span>
                      <span className="font-medium">{new Date(selectedTask.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Updated:</span>
                      <span className="font-medium">{new Date(selectedTask.updatedAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
                  <p className="text-slate-600 bg-slate-50 rounded-lg p-3">
                    {selectedTask.description}
                  </p>
                </div>

                {selectedTask.status === 'running' && (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Progress</h3>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Completion</span>
                        <span>{selectedTask.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div 
                          className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${selectedTask.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Task Actions</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.status === 'pending' && (
                      <button
                        onClick={() => handleTaskAction(selectedTask, 'start')}
                        className="btn btn-primary"
                      >
                        <Play className="w-4 h-4" />
                        Start
                      </button>
                    )}
                    {selectedTask.status === 'running' && (
                      <button
                        onClick={() => handleTaskAction(selectedTask, 'pause')}
                        className="btn btn-secondary"
                      >
                        <Pause className="w-4 h-4" />
                        Pause
                      </button>
                    )}
                    {selectedTask.status === 'failed' && (
                      <button
                        onClick={() => handleTaskAction(selectedTask, 'retry')}
                        className="btn btn-outline"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Retry
                      </button>
                    )}
                    <button
                      onClick={() => handleTaskAction(selectedTask, 'cancel')}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Execution Logs</h3>
                  <div className="bg-slate-900 text-green-400 rounded-lg p-3 font-mono text-sm max-h-64 overflow-y-auto">
                    {selectedTask.logs?.length ? (
                      selectedTask.logs.map((log, index) => (
                        <div key={index} className="mb-1">
                          <span className="text-slate-400">[{new Date(log.timestamp).toLocaleTimeString()}]</span>{' '}
                          <span className={log.level === 'error' ? 'text-red-400' : 'text-green-400'}>
                            {log.message}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-500">No logs available</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}