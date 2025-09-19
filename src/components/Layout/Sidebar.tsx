import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  Bot, 
  BookOpen, 
  LayoutDashboard, 
  Settings, 
  Users, 
  Activity,
  Sparkles,
  Heart,
  ChevronLeft,
  ChevronRight 
} from 'lucide-react'
import { useDashboardStore } from '../../stores/useDashboardStore'
import { useAuthStore } from '../../stores/useAuthStore'
import { clsx } from 'clsx'

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar, currentView, setCurrentView } = useDashboardStore()
  const { user } = useAuthStore()

  const agentOpsMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/agentops' },
    { icon: Bot, label: 'Agents', path: '/agentops/agents' },
    { icon: Activity, label: 'Tasks', path: '/agentops/tasks' },
    { icon: Users, label: 'Projects', path: '/agentops/projects' },
  ]

  const codexMenuItems = [
    { icon: BookOpen, label: 'Codices', path: '/codex' },
    { icon: Sparkles, label: 'Symbols', path: '/codex/symbols' },
    { icon: Heart, label: 'Rituals', path: '/codex/rituals' },
    { icon: Users, label: 'Community', path: '/codex/community' },
  ]

  return (
    <aside 
      className={clsx(
        'bg-white border-r border-slate-200 h-screen transition-all duration-300 flex flex-col',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        {!sidebarCollapsed && (
          <div>
            <h1 className="text-xl font-bold gradient-sacred bg-clip-text text-transparent">
              AI Engines
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {user?.tier || 'Individual'} Plan
            </p>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 hover:bg-slate-100 rounded transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5 text-slate-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          )}
        </button>
      </div>

      {/* Platform Selector */}
      {!sidebarCollapsed && (
        <div className="p-4 border-b border-slate-200">
          <div className="bg-slate-50 rounded-lg p-1 flex">
            <button
              onClick={() => setCurrentView('agentops')}
              className={clsx(
                'flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all',
                currentView === 'agentops' 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              AgentOps
            </button>
            <button
              onClick={() => setCurrentView('codex')}
              className={clsx(
                'flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all',
                currentView === 'codex'
                  ? 'bg-white text-sacred-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              Codex
            </button>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {currentView === 'agentops' && (
          <>
            {!sidebarCollapsed && (
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Agent Operations
              </h3>
            )}
            {agentOpsMenuItems.map(({ icon: Icon, label, path }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group',
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-primary-200'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )
                }
              >
                <Icon className="w-5 h-5" />
                {!sidebarCollapsed && (
                  <span className="font-medium">{label}</span>
                )}
              </NavLink>
            ))}
          </>
        )}

        {currentView === 'codex' && (
          <>
            {!sidebarCollapsed && (
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Sacred Protocol
              </h3>
            )}
            {codexMenuItems.map(({ icon: Icon, label, path }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group',
                    isActive
                      ? 'bg-sacred-50 text-sacred-700 border-sacred-200'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )
                }
              >
                <Icon className="w-5 h-5" />
                {!sidebarCollapsed && (
                  <span className="font-medium">{label}</span>
                )}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <Settings className="w-5 h-5" />
          {!sidebarCollapsed && (
            <span className="font-medium">Settings</span>
          )}
        </NavLink>
      </div>
    </aside>
  )
}