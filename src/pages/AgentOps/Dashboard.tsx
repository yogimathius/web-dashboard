import React, { useEffect } from 'react'
import { Bot, Activity, CheckCircle, AlertCircle, Clock, Zap } from 'lucide-react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { useDashboardStore } from '../../stores/useDashboardStore'
import type { Agent, Task } from '../../types'

// Mock performance data
const performanceData = [
  { time: '00:00', agents: 3, tasks: 12, success: 11 },
  { time: '04:00', agents: 3, tasks: 8, success: 8 },
  { time: '08:00', agents: 3, tasks: 15, success: 14 },
  { time: '12:00', agents: 3, tasks: 22, success: 20 },
  { time: '16:00', agents: 3, tasks: 18, success: 17 },
  { time: '20:00', agents: 3, tasks: 9, success: 9 },
]

const taskTypeData = [
  { name: 'Scaffold', count: 12, color: '#3b82f6' },
  { name: 'Code Gen', count: 18, color: '#10b981' },
  { name: 'Testing', count: 8, color: '#f59e0b' },
  { name: 'Deploy', count: 5, color: '#ef4444' },
]

export const Dashboard: React.FC = () => {
  const { agents, tasks, loadAgents, loadTasks, loadProjects } = useDashboardStore()

  useEffect(() => {
    loadAgents()
    loadTasks()
    loadProjects()
  }, [loadAgents, loadTasks, loadProjects])

  const activeAgents = agents.filter(agent => agent.status === 'active')
  const runningTasks = tasks.filter(task => task.status === 'running')
  const completedTasks = tasks.filter(task => task.status === 'completed')
  const averageSuccessRate = agents.reduce((acc, agent) => acc + agent.performance.successRate, 0) / agents.length

  const StatCard: React.FC<{
    title: string
    value: string | number
    change?: string
    icon: React.ReactNode
    color: string
  }> = ({ title, value, change, icon, color }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          {change && (
            <p className={`text-xs mt-1 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {change} from last hour
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">AgentOps Dashboard</h1>
        <p className="text-slate-600 mt-1">Monitor and manage your AI agents in real-time</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Agents"
          value={activeAgents.length}
          change="+1"
          icon={<Bot className="w-6 h-6 text-white" />}
          color="bg-primary-500"
        />
        <StatCard
          title="Running Tasks"
          value={runningTasks.length}
          change="+3"
          icon={<Activity className="w-6 h-6 text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Tasks Completed"
          value={completedTasks.length}
          change="+12"
          icon={<CheckCircle className="w-6 h-6 text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="Success Rate"
          value={`${Math.round(averageSuccessRate * 100)}%`}
          change="+2.1%"
          icon={<Zap className="w-6 h-6 text-white" />}
          color="bg-purple-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Over Time */}
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Performance Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="tasks" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Tasks"
              />
              <Line 
                type="monotone" 
                dataKey="success" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Successful"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Task Types Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Task Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Agent Status & Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Status */}
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Agent Status</h3>
          <div className="space-y-4">
            {agents.map((agent: Agent) => (
              <div key={agent.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    agent.status === 'active' ? 'bg-green-400' :
                    agent.status === 'idle' ? 'bg-yellow-400' :
                    agent.status === 'error' ? 'bg-red-400' : 'bg-slate-400'
                  }`} />
                  <div>
                    <p className="font-medium text-slate-900">{agent.name}</p>
                    <p className="text-sm text-slate-600 capitalize">{agent.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">
                    {agent.performance.tasksCompleted} tasks
                  </p>
                  <p className="text-sm text-slate-600">
                    {Math.round(agent.performance.successRate * 100)}% success
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Tasks</h3>
          <div className="space-y-4">
            {tasks.slice(0, 4).map((task: Task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {task.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : task.status === 'running' ? (
                      <Clock className="w-5 h-5 text-blue-500" />
                    ) : task.status === 'failed' ? (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{task.title}</p>
                    <p className="text-sm text-slate-600 capitalize">{task.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900 capitalize">{task.status}</p>
                  {task.status === 'running' && (
                    <p className="text-sm text-slate-600">{task.progress}%</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}