'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { AppShell } from '@/components/app-shell'
import {
  Search,
  Bot,
  WifiOff,
  CheckCircle2,
  ChevronRight,
  AlertCircle,
  FileText,
  Receipt,
  HelpCircle,
  CalendarDays,
  Inbox,
  TrendingUp,
  LayoutList,
  X,
  Clock,
  Building2,
  User,
  MessageSquare,
  Paperclip,
  Send,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  History,
} from 'lucide-react'
import {
  allTasks,
  getUrgentTasks,
  getOnTrackTasks,
  type InboxTask,
  type TaskType,
} from '@/lib/inbox-data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { FadeUp, AnimNum } from '@/components/animated-primitives'

// ── Type icon config ──

const typeConfig: Record<
  TaskType,
  { icon: React.ElementType; bg: string; label: string; iconColor: string }
> = {
  doc: {
    icon: FileText,
    bg: 'bg-navy/5 dark:bg-navy-soft/30',
    iconColor: 'text-navy dark:text-slate-300',
    label: 'Document',
  },
  invoice: {
    icon: Receipt,
    bg: 'bg-navy/5 dark:bg-navy-soft/30',
    iconColor: 'text-navy dark:text-slate-300',
    label: 'Invoice',
  },
  rfi: {
    icon: HelpCircle,
    bg: 'bg-navy/5 dark:bg-navy-soft/30',
    iconColor: 'text-navy dark:text-slate-300',
    label: 'RFI',
  },
  schedule: {
    icon: CalendarDays,
    bg: 'bg-navy/5 dark:bg-navy-soft/30',
    iconColor: 'text-navy dark:text-slate-300',
    label: 'Schedule',
  },
}

// ── Tab types ──

type TabKey = 'today' | 'week' | 'all'

export default function TaskInboxPage() {
  const [activeTab, setActiveTab] = React.useState<TabKey>('today')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isOffline, setIsOffline] = React.useState(false)
  const [selectedTask, setSelectedTask] = React.useState<InboxTask | null>(null)

  React.useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    if (!navigator.onLine) setIsOffline(true)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Filter tasks by tab
  const tabTasks = React.useMemo(() => {
    if (activeTab === 'today') {
      const urgent = getUrgentTasks(allTasks)
      const onTrack = getOnTrackTasks(allTasks).slice(0, 1)
      return [...urgent, ...onTrack]
    }
    if (activeTab === 'week') {
      return allTasks.slice(0, 8)
    }
    return allTasks
  }, [activeTab])

  // Search filter
  const filteredTasks = React.useMemo(() => {
    if (!searchQuery.trim()) return tabTasks
    const q = searchQuery.toLowerCase()
    return tabTasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.project.toLowerCase().includes(q) ||
        typeConfig[t.type].label.toLowerCase().includes(q)
    )
  }, [tabTasks, searchQuery])

  const urgentTasks = getUrgentTasks(filteredTasks)
  const onTrackTasks = getOnTrackTasks(filteredTasks)

  const tabCounts: Record<TabKey, number> = {
    today: 4,
    week: 8,
    all: allTasks.length,
  }

  return (
    <AppShell title="Task Inbox" subtitle="SLA-driven prioritized task queue" activeHref="/inbox">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {/* Urgent Tasks Card */}
          <div className="bg-card rounded-xl border border-line p-4 sm:p-5 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">Urgent Tasks</p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1.5">{urgentTasks.length}</p>
              </div>
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-red-bg dark:bg-red/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                <AlertCircle className="w-5 sm:w-6 h-5 sm:h-6 text-red" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-line">
              <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red animate-pulse" />
                Requires immediate attention
              </p>
            </div>
          </div>

          {/* On Track Card */}
          <div className="bg-card rounded-xl border border-line p-4 sm:p-5 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">On Track</p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1.5">{onTrackTasks.length}</p>
              </div>
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-green-bg dark:bg-green/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                <TrendingUp className="w-5 sm:w-6 h-5 sm:h-6 text-green" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-line">
              <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green" />
                Within SLA timeframe
              </p>
            </div>
          </div>

          {/* Total Tasks Card */}
          <div className="bg-card rounded-xl border border-line p-4 sm:p-5 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Tasks</p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1.5">{filteredTasks.length}</p>
              </div>
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-navy/5 dark:bg-navy-soft/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <LayoutList className="w-5 sm:w-6 h-5 sm:h-6 text-navy dark:text-slate-300" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-line">
              <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-navy/50 dark:bg-slate-400" />
                Active in queue
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-card rounded-xl border border-line overflow-hidden shadow-sm">
          {/* Header with Tabs and Search */}
          <div className="border-b border-line bg-secondary/30">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4">
              {/* Tabs */}
              <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg w-fit">
                {(['today', 'week', 'all'] as TabKey[]).map((tab) => {
                  const isActive = activeTab === tab
                  const labels: Record<TabKey, string> = {
                    today: 'Today',
                    week: 'This Week',
                    all: 'All',
                  }
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        'px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200',
                        isActive
                          ? 'bg-gold text-navy shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                      )}
                    >
                      {labels[tab]}
                      <span className={cn(
                        'ml-1.5 sm:ml-2 text-[10px] sm:text-xs font-mono',
                        isActive ? 'text-navy/70' : 'text-muted-foreground'
                      )}>
                        {tabCounts[tab]}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-56 md:w-64 h-9 pl-9 pr-4 rounded-lg bg-background border border-line text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all"
                />
              </div>
            </div>

            {/* Offline Banner */}
            {isOffline && (
              <div className="mx-4 sm:mx-6 mb-3 px-4 py-3 bg-amber-bg border border-amber/30 rounded-lg flex items-center gap-3">
                <WifiOff className="w-4 h-4 text-amber" />
                <p className="text-xs sm:text-sm text-amber dark:text-amber">
                  {"You're offline. Actions will sync when connection returns."}
                </p>
              </div>
            )}
          </div>

          {/* Column Header */}
          <div className="hidden sm:grid grid-cols-[1fr_100px_100px_90px] items-center px-6 py-3 border-b border-line bg-muted/20">
            <div className="flex items-center gap-3 pl-12">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Task</span>
            </div>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Type</span>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status</span>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-right pr-6">SLA</span>
          </div>

          {/* Task List */}
          <div>
            {filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-6">
                <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-green-bg dark:bg-green/10 flex items-center justify-center mb-4">
                  <Inbox className="w-7 sm:w-8 h-7 sm:h-8 text-green" />
                </div>
                <p className="text-base sm:text-lg font-semibold text-foreground mb-1">All caught up!</p>
                <p className="text-xs sm:text-sm text-muted-foreground text-center">No tasks require your attention right now.</p>
              </div>
            ) : (
              <>
                {/* URGENT section */}
                {urgentTasks.length > 0 && (
                  <div>
                    <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-red-bg/50 dark:bg-red/5 border-b border-red/20">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red animate-pulse" />
                        <span className="text-[10px] sm:text-[11px] font-bold text-red uppercase tracking-wider">
                          Urgent
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-red/70">
                          Requires immediate attention
                        </span>
                      </div>
                    </div>
                    <div className="divide-y divide-line/50">
                      {urgentTasks.map((task) => (
                        <TaskRow key={task.id} task={task} onSelect={() => setSelectedTask(task)} />
                      ))}
                    </div>
                  </div>
                )}

                {/* ON TRACK section */}
                {onTrackTasks.length > 0 && (
                  <div>
                    <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-green-bg/50 dark:bg-green/5 border-y border-green/20">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green" />
                        <span className="text-[10px] sm:text-[11px] font-bold text-green uppercase tracking-wider">
                          On Track
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-green/70">
                          Within SLA timeframe
                        </span>
                      </div>
                    </div>
                    <div className="divide-y divide-line/50">
                      {onTrackTasks.map((task) => (
                        <TaskRow key={task.id} task={task} onSelect={() => setSelectedTask(task)} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Task Detail Panel */}
      <TaskDetailPanel task={selectedTask} onClose={() => setSelectedTask(null)} />
    </AppShell>
  )
}

// ── Task Detail Panel Component ──

function TaskDetailPanel({ task, onClose }: { task: InboxTask | null; onClose: () => void }) {
  const [comment, setComment] = React.useState('')

  if (!task) return null

  const cfg = typeConfig[task.type]
  const TypeIcon = cfg.icon

  const slaColor =
    task.state === 'breach'
      ? 'text-red'
      : task.state === 'warn'
        ? 'text-amber'
        : 'text-green'

  const statusBadge =
    task.state === 'breach'
      ? { label: 'Past SLA', bg: 'bg-red-bg text-red border-red/30', dotColor: 'bg-red' }
      : task.state === 'warn'
        ? { label: 'At Risk', bg: 'bg-amber-bg text-amber border-amber/30', dotColor: 'bg-amber' }
        : { label: 'On Track', bg: 'bg-green-bg text-green border-green/30', dotColor: 'bg-green' }

  // Mock activity data
  const activities = [
    { id: 1, type: 'created', user: 'System', time: '2 days ago', description: 'Task created and assigned' },
    { id: 2, type: 'comment', user: 'Sarah Chen', time: '1 day ago', description: 'Reviewed initial documentation' },
    { id: 3, type: 'update', user: 'AI Agent', time: '6 hours ago', description: 'Pre-processed and flagged for review' },
  ]

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 dark:bg-black/60 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] md:w-[540px] bg-background z-50 shadow-2xl border-l border-line overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="bg-navy dark:bg-navy-soft px-4 sm:px-6 py-4 border-b-2 border-gold shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', 'bg-white/10')}>
                <TypeIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white truncate max-w-[250px] sm:max-w-[350px]">
                  {task.title}
                </h2>
                <p className="text-xs text-white/60">{cfg.label}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Status & SLA Section */}
          <div className="px-4 sm:px-6 py-4 border-b border-line bg-muted/20">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn('text-xs font-semibold border px-3 py-1', statusBadge.bg)}>
                  <span className={cn('w-1.5 h-1.5 rounded-full mr-2', statusBadge.dotColor)} />
                  {statusBadge.label}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className={cn('w-4 h-4', slaColor)} />
                <span className="text-muted-foreground">SLA:</span>
                <span className={cn('font-mono font-bold', slaColor)}>{task.slaDisplay}</span>
              </div>
            </div>
          </div>

          {/* Task Details */}
          <div className="px-4 sm:px-6 py-4 space-y-4 border-b border-line">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-line">
                <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Project</p>
                  <p className="text-sm font-medium text-foreground truncate">{task.project}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-line">
                <User className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Assigned To</p>
                  <p className="text-sm font-medium text-foreground">You</p>
                </div>
              </div>
            </div>

            {task.agentProcessed && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-teal-soft dark:bg-teal/10 border border-teal/20">
                <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-teal dark:text-teal">AI Pre-processed</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {task.agentName} has reviewed this task and prepared recommendations.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Activity Timeline */}
          <div className="px-4 sm:px-6 py-4 border-b border-line">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <History className="w-3.5 h-3.5" />
              Activity
            </h3>
            
            <div className="space-y-3">
              {activities.map((activity, idx) => (
                <div key={activity.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center shrink-0',
                      activity.type === 'comment' ? 'bg-navy/10 dark:bg-navy-soft/50' :
                      activity.type === 'update' ? 'bg-teal/10' : 'bg-muted'
                    )}>
                      {activity.type === 'comment' ? (
                        <MessageSquare className="w-3 h-3 text-navy dark:text-slate-300" />
                      ) : activity.type === 'update' ? (
                        <Bot className="w-3 h-3 text-teal" />
                      ) : (
                        <CheckCircle className="w-3 h-3 text-muted-foreground" />
                      )}
                    </div>
                    {idx < activities.length - 1 && (
                      <div className="w-px h-full bg-line min-h-[24px]" />
                    )}
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{activity.user}</span>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attachments */}
          <div className="px-4 sm:px-6 py-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <Paperclip className="w-3.5 h-3.5" />
              Attachments
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-line hover:bg-muted/30 transition-colors cursor-pointer group">
                <div className="w-9 h-9 rounded-lg bg-navy/5 dark:bg-navy-soft/30 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-navy dark:text-slate-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">document_review.pdf</p>
                  <p className="text-xs text-muted-foreground">245 KB</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="border-t border-line bg-card px-4 sm:px-6 py-4 shrink-0 space-y-3">
          {/* Quick Comment */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 h-9 px-3 rounded-lg bg-muted/30 border border-line text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all"
            />
            <Button
              size="sm"
              variant="outline"
              className="h-9 w-9 p-0"
              disabled={!comment.trim()}
              onClick={() => {
                if (!comment.trim()) return
                toast.success('Comment posted', { description: 'Visible to all task collaborators' })
                setComment('')
              }}
              aria-label="Post comment"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button 
              className="flex-1 h-10 bg-green hover:bg-green/90 text-white font-semibold gap-2"
              onClick={() => {
                onClose()
              }}
            >
              <CheckCircle className="w-4 h-4" />
              Approve
            </Button>
            <Button 
              variant="outline"
              className="flex-1 h-10 border-red/30 text-red hover:bg-red-bg hover:text-red font-semibold gap-2"
              onClick={() => {
                onClose()
              }}
            >
              <XCircle className="w-4 h-4" />
              Reject
            </Button>
            <Button 
              variant="outline"
              className="h-10 px-4 border-amber/30 text-amber hover:bg-amber-bg hover:text-amber font-semibold gap-2"
              onClick={() => {
                onClose()
              }}
            >
              <ArrowUpRight className="w-4 h-4" />
              Escalate
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

// ── TaskRow Component - Professional table-like row with fixed column widths ──

function TaskRow({ task, onSelect }: { task: InboxTask; onSelect: () => void }) {
  const cfg = typeConfig[task.type]
  const TypeIcon = cfg.icon

  const slaColor =
    task.state === 'breach'
      ? 'text-red'
      : task.state === 'warn'
        ? 'text-amber'
        : 'text-green'

  const statusBadge =
    task.state === 'breach'
      ? { label: 'Past SLA', bg: 'bg-red-bg text-red border-red/30' }
      : task.state === 'warn'
        ? { label: 'At Risk', bg: 'bg-amber-bg text-amber border-amber/30' }
        : { label: 'On Track', bg: 'bg-green-bg text-green border-green/30' }

  return (
    <button
      className="w-full grid grid-cols-1 sm:grid-cols-[1fr_100px_100px_90px] items-center px-4 sm:px-6 py-3 sm:py-4 text-left hover:bg-gold-pale/50 dark:hover:bg-navy-soft/20 transition-colors group"
      onClick={onSelect}
    >
      {/* Task Info with Icon */}
      <div className="flex items-center gap-3 min-w-0">
        <div className={cn('w-9 sm:w-10 h-9 sm:h-10 rounded-lg flex items-center justify-center relative shrink-0', cfg.bg)}>
          <TypeIcon className={cn('w-4 sm:w-5 h-4 sm:h-5', cfg.iconColor)} />
          {task.agentProcessed && (
            <span
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-teal flex items-center justify-center ring-2 ring-card"
              title={`Pre-processed by ${task.agentName}`}
            >
              <Bot className="w-2.5 h-2.5 text-white" />
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-semibold text-foreground truncate group-hover:text-gold transition-colors">
            {task.title}
          </p>
          <p className="text-[10px] sm:text-xs text-muted-foreground truncate mt-0.5">
            {task.project}
          </p>
        </div>
      </div>

      {/* Mobile: Type, Status, SLA in a row */}
      <div className="flex sm:hidden items-center gap-2 mt-2 pl-12">
        <Badge variant="outline" className="text-[9px] font-medium border-line text-muted-foreground px-2 py-0.5">
          {cfg.label}
        </Badge>
        <Badge variant="outline" className={cn('text-[9px] font-medium border px-2 py-0.5', statusBadge.bg)}>
          {statusBadge.label}
        </Badge>
        <span className={cn('text-[10px] font-mono font-bold ml-auto', slaColor)}>
          {task.slaDisplay}
        </span>
        <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
      </div>

      {/* Desktop: Type Badge */}
      <div className="hidden sm:flex justify-start">
        <Badge variant="outline" className="text-[10px] font-medium border-line text-muted-foreground px-2.5 py-0.5">
          {cfg.label}
        </Badge>
      </div>

      {/* Desktop: Status Badge */}
      <div className="hidden sm:flex justify-start">
        <Badge variant="outline" className={cn('text-[10px] font-semibold border px-2.5 py-0.5', statusBadge.bg)}>
          {statusBadge.label}
        </Badge>
      </div>

      {/* Desktop: SLA Time */}
      <div className="hidden sm:flex items-center justify-end gap-2 pr-2">
        <div className="text-right">
          <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">SLA</p>
          <p className={cn('text-xs font-mono font-bold', slaColor)}>
            {task.slaDisplay}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
      </div>
    </button>
  )
}
