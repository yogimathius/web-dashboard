import React, { useEffect, useState } from 'react'
import { 
  Book, 
  Star, 
  GitBranch, 
  Users, 
  Plus, 
  Search,
  Filter,
  Eye,
  Heart,
  Download,
  Share2,
  Sparkles,
  Zap,
  Crown,
  Circle
} from 'lucide-react'
import { useDashboardStore } from '../../stores/useDashboardStore'

interface Codex {
  id: string
  name: string
  description: string
  author: string
  symbols: Array<{
    name: string
    meaning: string
    power: number
  }>
  rituals: Array<{
    name: string
    description: string
    steps: string[]
  }>
  commandments: string[]
  reflections: Array<{
    author: string
    wisdom: string
    timestamp: string
  }>
  stats: {
    forks: number
    stars: number
    practitioners: number
    enlightenmentLevel: number
  }
  tags: string[]
  createdAt: string
  updatedAt: string
  isForked?: boolean
  parentCodex?: string
}

interface CodexFilters {
  category: string
  enlightenmentLevel: 'beginner' | 'intermediate' | 'advanced' | 'master' | 'all'
  sortBy: 'newest' | 'popular' | 'enlightened' | 'active'
}

export const CodexBrowser: React.FC = () => {
  const { codices, loadCodexes } = useDashboardStore()
  const [selectedCodex, setSelectedCodex] = useState<Codex | null>(null)
  const [filters, setFilters] = useState<CodexFilters>({
    category: 'all',
    enlightenmentLevel: 'all',
    sortBy: 'newest'
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)

  // Mock codices data
  const mockCodexes: Codex[] = [
    {
      id: '1',
      name: 'The Sacred Path of Clean Code',
      description: 'A wisdom protocol for writing code that transcends mere functionality, embracing clarity, compassion, and conscious design.',
      author: 'CodeMystic',
      symbols: [
        { name: '⚡', meaning: 'Instant Clarity', power: 85 },
        { name: '🌟', meaning: 'Elegant Simplicity', power: 92 },
        { name: '🔮', meaning: 'Future Vision', power: 78 }
      ],
      rituals: [
        {
          name: 'Morning Code Meditation',
          description: 'Begin each coding session with mindful intention',
          steps: [
            'Sit quietly and breathe deeply for 2 minutes',
            'Set an intention for the day\'s code',
            'Visualize the elegant solution before coding',
            'Open your IDE with gratitude'
          ]
        }
      ],
      commandments: [
        'Write code as if the next maintainer is a serial killer who knows where you live',
        'Every function should do one thing, and do it with love',
        'Comments are love letters to future developers',
        'Refactor with the patience of a gardener'
      ],
      reflections: [
        {
          author: 'DevSage',
          wisdom: 'True mastery comes not from writing complex code, but from making complexity appear simple.',
          timestamp: '2024-09-01T10:30:00Z'
        }
      ],
      stats: {
        forks: 234,
        stars: 1205,
        practitioners: 3421,
        enlightenmentLevel: 87
      },
      tags: ['clean-code', 'mindfulness', 'craftsmanship'],
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-09-10T15:30:00Z'
    },
    {
      id: '2',
      name: 'Debugging as Spiritual Practice',
      description: 'Transform the frustration of debugging into a journey of self-discovery and technical enlightenment.',
      author: 'BugWhisperer',
      symbols: [
        { name: '🔍', meaning: 'Deep Investigation', power: 91 },
        { name: '🌱', meaning: 'Growth Through Challenge', power: 88 },
        { name: '⚖️', meaning: 'Balance of Logic', power: 83 }
      ],
      rituals: [
        {
          name: 'The Sacred Rubber Duck Ceremony',
          description: 'Transform debugging into enlightened dialogue',
          steps: [
            'Place rubber duck in position of honor',
            'Explain the problem with complete honesty',
            'Listen to the duck\'s silent wisdom',
            'Thank the duck for its service'
          ]
        }
      ],
      commandments: [
        'Every bug is a teacher in disguise',
        'Patience in debugging leads to wisdom in design',
        'The universe conspires to help those who help themselves with good logging',
        'Embrace the unknown with curiosity, not fear'
      ],
      reflections: [
        {
          author: 'DebugDruid',
          wisdom: 'The most persistent bugs often reveal the most profound truths about our assumptions.',
          timestamp: '2024-08-20T14:45:00Z'
        }
      ],
      stats: {
        forks: 156,
        stars: 892,
        practitioners: 2134,
        enlightenmentLevel: 79
      },
      tags: ['debugging', 'patience', 'growth'],
      createdAt: '2024-02-08T12:00:00Z',
      updatedAt: '2024-09-05T09:15:00Z'
    },
    {
      id: '3',
      name: 'The Way of Distributed Harmony',
      description: 'Ancient wisdom for modern distributed systems, balancing resilience with elegance.',
      author: 'SystemsSage',
      symbols: [
        { name: '🕸️', meaning: 'Interconnected Web', power: 95 },
        { name: '⚡', meaning: 'Lightning Fast', power: 89 },
        { name: '🌊', meaning: 'Flow State', power: 92 }
      ],
      rituals: [
        {
          name: 'Service Blessing Ritual',
          description: 'Honor each microservice with intention',
          steps: [
            'List all services in your architecture',
            'Speak gratitude for each service\'s purpose',
            'Visualize healthy communication between services',
            'Set monitoring with loving attention'
          ]
        }
      ],
      commandments: [
        'Design for failure, hope for success',
        'Every service should be an island of stability',
        'Monitoring is meditation for systems',
        'Graceful degradation is the highest virtue'
      ],
      reflections: [
        {
          author: 'CloudShaman',
          wisdom: 'A distributed system is like a jazz ensemble - each service plays its part while listening to the whole.',
          timestamp: '2024-09-08T16:22:00Z'
        }
      ],
      stats: {
        forks: 89,
        stars: 567,
        practitioners: 1456,
        enlightenmentLevel: 94
      },
      tags: ['distributed-systems', 'resilience', 'harmony'],
      createdAt: '2024-03-12T14:30:00Z',
      updatedAt: '2024-09-08T16:22:00Z',
      isForked: true,
      parentCodex: 'original-distributed-codex'
    }
  ]

  useEffect(() => {
    // Load codices from store (mock data for now)
    loadCodexes()
  }, [loadCodexes])

  const getEnlightenmentColor = (level: number) => {
    if (level >= 90) return 'text-purple-600'
    if (level >= 80) return 'text-blue-600'
    if (level >= 70) return 'text-green-600'
    if (level >= 60) return 'text-yellow-600'
    return 'text-slate-600'
  }

  const getEnlightenmentBadge = (level: number) => {
    if (level >= 90) return { icon: Crown, label: 'Master' }
    if (level >= 80) return { icon: Sparkles, label: 'Advanced' }
    if (level >= 70) return { icon: Zap, label: 'Intermediate' }
    if (level >= 60) return { icon: Circle, label: 'Developing' }
    return { icon: Circle, label: 'Beginner' }
  }

  const CodexCard: React.FC<{ codex: Codex }> = ({ codex }) => {
    const badge = getEnlightenmentBadge(codex.stats.enlightenmentLevel)
    const BadgeIcon = badge.icon

    return (
      <div 
        className="card hover:shadow-xl transition-all duration-300 cursor-pointer group"
        onClick={() => setSelectedCodex(codex)}
      >
        {codex.isForked && (
          <div className="flex items-center gap-1 text-xs text-purple-600 mb-2">
            <GitBranch className="w-3 h-3" />
            <span>Forked from {codex.parentCodex}</span>
          </div>
        )}

        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg">
              <Book className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 group-hover:text-purple-600 transition-colors">
                {codex.name}
              </h3>
              <p className="text-sm text-slate-600">by {codex.author}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <BadgeIcon className={`w-4 h-4 ${getEnlightenmentColor(codex.stats.enlightenmentLevel)}`} />
            <span className={`text-xs font-medium ${getEnlightenmentColor(codex.stats.enlightenmentLevel)}`}>
              {badge.label}
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-4 line-clamp-3">{codex.description}</p>

        {/* Sacred Symbols Preview */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-slate-700">Sacred Symbols</span>
          </div>
          <div className="flex gap-2">
            {codex.symbols.slice(0, 3).map((symbol, index) => (
              <div 
                key={index}
                className="flex items-center gap-1 px-2 py-1 bg-purple-50 rounded text-sm"
                title={symbol.meaning}
              >
                <span className="text-lg">{symbol.name}</span>
                <span className="text-purple-600 text-xs">{symbol.power}</span>
              </div>
            ))}
            {codex.symbols.length > 3 && (
              <div className="px-2 py-1 bg-slate-100 rounded text-sm text-slate-500">
                +{codex.symbols.length - 3} more
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center text-sm border-t border-slate-200 pt-3">
          <div>
            <div className="flex items-center justify-center gap-1 text-yellow-600">
              <Star className="w-4 h-4" />
              <span className="font-semibold">{codex.stats.stars}</span>
            </div>
            <p className="text-slate-500 text-xs">Stars</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-blue-600">
              <GitBranch className="w-4 h-4" />
              <span className="font-semibold">{codex.stats.forks}</span>
            </div>
            <p className="text-slate-500 text-xs">Forks</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-green-600">
              <Users className="w-4 h-4" />
              <span className="font-semibold">{codex.stats.practitioners}</span>
            </div>
            <p className="text-slate-500 text-xs">Practitioners</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {codex.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag}
              className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sacred Codices</h1>
          <p className="text-slate-600 mt-1">Explore and create sacred development protocols</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          Create Codex
        </button>
      </div>

      {/* Featured Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Book className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">{mockCodexes.length}</p>
              <p className="text-sm text-slate-600">Total Codices</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">
                {mockCodexes.reduce((sum, c) => sum + c.stats.stars, 0)}
              </p>
              <p className="text-sm text-slate-600">Total Stars</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">
                {mockCodexes.reduce((sum, c) => sum + c.stats.practitioners, 0)}
              </p>
              <p className="text-sm text-slate-600">Practitioners</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Sparkles className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">
                {Math.round(mockCodexes.reduce((sum, c) => sum + c.stats.enlightenmentLevel, 0) / mockCodexes.length)}
              </p>
              <p className="text-sm text-slate-600">Avg Enlightenment</p>
            </div>
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
              placeholder="Search sacred wisdom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input w-64"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="input w-40"
            >
              <option value="all">All Categories</option>
              <option value="clean-code">Clean Code</option>
              <option value="debugging">Debugging</option>
              <option value="architecture">Architecture</option>
              <option value="testing">Testing</option>
              <option value="devops">DevOps</option>
            </select>
          </div>

          <select
            value={filters.enlightenmentLevel}
            onChange={(e) => setFilters({ ...filters, enlightenmentLevel: e.target.value as any })}
            className="input w-32"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="master">Master</option>
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
            className="input w-32"
          >
            <option value="newest">Newest</option>
            <option value="popular">Popular</option>
            <option value="enlightened">Enlightened</option>
            <option value="active">Most Active</option>
          </select>
        </div>
      </div>

      {/* Codices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCodexes.map((codex) => (
          <CodexCard key={codex.id} codex={codex} />
        ))}
      </div>

      {/* Codex Details Modal */}
      {selectedCodex && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl">
                  <Book className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{selectedCodex.name}</h2>
                  <p className="text-slate-600">by {selectedCodex.author}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-outline">
                  <Heart className="w-4 h-4" />
                  Star
                </button>
                <button className="btn btn-outline">
                  <GitBranch className="w-4 h-4" />
                  Fork
                </button>
                <button 
                  onClick={() => setSelectedCodex(null)}
                  className="btn btn-outline"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Sacred Description</h3>
                  <p className="text-slate-700 leading-relaxed">{selectedCodex.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Sacred Symbols</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedCodex.symbols.map((symbol, index) => (
                      <div key={index} className="p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{symbol.name}</span>
                          <div className="flex-1">
                            <p className="font-medium text-slate-900">{symbol.meaning}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-full bg-purple-200 rounded-full h-2">
                                <div 
                                  className="bg-purple-600 h-2 rounded-full"
                                  style={{ width: `${symbol.power}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-purple-600">{symbol.power}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Sacred Rituals</h3>
                  {selectedCodex.rituals.map((ritual, index) => (
                    <div key={index} className="p-4 bg-blue-50 rounded-lg mb-3">
                      <h4 className="font-semibold text-blue-900 mb-2">{ritual.name}</h4>
                      <p className="text-blue-800 mb-3">{ritual.description}</p>
                      <ol className="space-y-1">
                        {ritual.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="text-sm text-blue-700">
                            {stepIndex + 1}. {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Sacred Commandments</h3>
                  <div className="space-y-2">
                    {selectedCodex.commandments.map((commandment, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <Crown className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-green-800">{commandment}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Sacred Reflections</h3>
                  {selectedCodex.reflections.map((reflection, index) => (
                    <div key={index} className="p-4 bg-yellow-50 rounded-lg mb-3">
                      <p className="text-yellow-800 italic mb-2">"{reflection.wisdom}"</p>
                      <div className="flex justify-between text-sm text-yellow-600">
                        <span>— {reflection.author}</span>
                        <span>{new Date(reflection.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                <div className="card">
                  <h4 className="font-semibold text-slate-900 mb-3">Sacred Stats</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Stars:</span>
                      <span className="font-medium">{selectedCodex.stats.stars}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Forks:</span>
                      <span className="font-medium">{selectedCodex.stats.forks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Practitioners:</span>
                      <span className="font-medium">{selectedCodex.stats.practitioners}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Enlightenment:</span>
                      <span className={`font-medium ${getEnlightenmentColor(selectedCodex.stats.enlightenmentLevel)}`}>
                        {selectedCodex.stats.enlightenmentLevel}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h4 className="font-semibold text-slate-900 mb-3">Sacred Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCodex.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="px-2 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <h4 className="font-semibold text-slate-900 mb-3">Sacred Timeline</h4>
                  <div className="space-y-2 text-sm text-slate-600">
                    <div>
                      <span className="font-medium">Created:</span><br />
                      {new Date(selectedCodex.createdAt).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Updated:</span><br />
                      {new Date(selectedCodex.updatedAt).toLocaleDateString()}
                    </div>
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