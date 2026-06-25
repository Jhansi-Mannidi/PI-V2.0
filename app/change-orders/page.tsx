'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { cn } from '@/lib/utils'
import {
  FileText,
  Clock,
  TrendingUp,
  Calendar,
  Search,
  Plus,
  ChevronRight,
  ChevronDown,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  X,
  ArrowUpRight,
  MessageSquare,
  History,
  User,
  Bot,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useActionModal } from '@/hooks/use-action-modal'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAI } from '@/components/ai-provider'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Animation ease curve
const ease = [0.25, 0.46, 0.45, 0.94] as const

const changeOrders = [
  {
    id: 'CO-0087', title: 'HVAC System Upgrade - Building C', project: 'Mesa', program: 'Southeast',
    amount: 2100000, type: 'Scope Change' as const, status: 'pending_director' as const,
    submittedBy: 'Mark Torres', submittedDate: '2026-04-28', daysInQueue: 5,
    currentApprover: 'Brian Smith', approvalLevel: 'Director',
    stages: [
      { name: 'Submitted', done: true, date: '2026-04-28', by: 'Mark Torres' },
      { name: 'PM Review', done: true, date: '2026-04-29', by: 'Hasit Chetal' },
      { name: 'Cost Validation', done: true, date: '2026-04-30', by: 'Finance Team' },
      { name: 'Director Approval', done: false, date: null, by: 'Brian Smith' },
    ],
    agent: 'A-200', agentNote: 'Budget impact: EAC increases to $143M (+$2.1M). Current EAC already $12M over BAC. Recommend value engineering review before approval.',
    impactDays: 12, budgetImpact: '+1.5%',
  },
  {
    id: 'CO-0088', title: 'Foundation Reinforcement - Sector 2', project: 'Pryor Creek', program: 'Central',
    amount: 890000, type: 'Design Change' as const, status: 'pending_pm' as const,
    submittedBy: 'David Kim', submittedDate: '2026-05-01', daysInQueue: 2,
    currentApprover: 'Hasit Chetal', approvalLevel: 'PM',
    stages: [
      { name: 'Submitted', done: true, date: '2026-05-01', by: 'David Kim' },
      { name: 'PM Review', done: false, date: null, by: 'Hasit Chetal' },
      { name: 'Cost Validation', done: false, date: null, by: 'Finance Team' },
    ],
    agent: 'A-200', agentNote: 'Seismic study findings support this change. Historical similar COs averaged $750K -- this CO is 18% above.',
    impactDays: 8, budgetImpact: '+0.6%',
  },
  {
    id: 'CO-0089', title: 'Emergency Generator Relocation', project: 'Henderson', program: 'West',
    amount: 1450000, type: 'Field Condition' as const, status: 'cost_validation' as const,
    submittedBy: 'Jennifer M.', submittedDate: '2026-04-30', daysInQueue: 3,
    currentApprover: 'Finance Team', approvalLevel: 'Finance',
    stages: [
      { name: 'Submitted', done: true, date: '2026-04-30', by: 'Jennifer M.' },
      { name: 'PM Review', done: true, date: '2026-05-01', by: 'Sarah Kim' },
      { name: 'Cost Validation', done: false, date: null, by: 'Finance Team' },
      { name: 'Director Approval', done: false, date: null, by: 'Brian Smith' },
    ],
    agent: null, agentNote: null, impactDays: 15, budgetImpact: '+1.1%',
  },
  {
    id: 'CO-0090', title: 'Cable Tray Rerouting - Level 3', project: 'Papillion', program: 'Central',
    amount: 340000, type: 'Design Change' as const, status: 'approved' as const,
    submittedBy: 'Robert Ng', submittedDate: '2026-04-22', daysInQueue: 0,
    currentApprover: null, approvalLevel: null,
    stages: [
      { name: 'Submitted', done: true, date: '2026-04-22', by: 'Robert Ng' },
      { name: 'PM Review', done: true, date: '2026-04-23', by: 'Hasit Chetal' },
      { name: 'Cost Validation', done: true, date: '2026-04-25', by: 'Finance Team' },
      { name: 'Approved', done: true, date: '2026-04-26', by: 'Hasit Chetal' },
    ],
    agent: 'A-200', agentNote: 'Fast-tracked due to critical path impact. Approved within 4 days (avg: 6.2 days).',
    impactDays: 5, budgetImpact: '+0.2%',
  },
  {
    id: 'CO-0091', title: 'Cooling Tower Specification Change', project: 'New Albany', program: 'Southeast',
    amount: 3200000, type: 'Scope Change' as const, status: 'rejected' as const,
    submittedBy: 'Sarah Lin', submittedDate: '2026-04-18', daysInQueue: 0,
    currentApprover: null, approvalLevel: null,
    stages: [
      { name: 'Submitted', done: true, date: '2026-04-18', by: 'Sarah Lin' },
      { name: 'PM Review', done: true, date: '2026-04-19', by: 'Brian Smith' },
      { name: 'Rejected', done: true, date: '2026-04-20', by: 'Brian Smith' },
    ],
    agent: 'A-200', agentNote: 'Rejected: existing specification meets performance requirements. Value engineering study found $1.8M savings with current design.',
    impactDays: 0, budgetImpact: '0%',
  },
]

const statusConfig = {
  pending_director: { label: 'Pending Director', color: 'text-red', bg: 'bg-red-bg', icon: Clock },
  pending_pm: { label: 'Pending PM', color: 'text-amber', bg: 'bg-amber-bg', icon: Clock },
  cost_validation: { label: 'Cost Validation', color: 'text-amber', bg: 'bg-amber-bg', icon: DollarSign },
  approved: { label: 'Approved', color: 'text-green', bg: 'bg-green-bg', icon: CheckCircle2 },
  rejected: { label: 'Rejected', color: 'text-red', bg: 'bg-red-bg', icon: XCircle },
}

type TabFilter = 'all' | 'pending' | 'approved' | 'rejected'

// Projects available for selection
const projectOptions = [
  { value: 'mesa', label: 'Mesa', program: 'Southeast' },
  { value: 'pryor-creek', label: 'Pryor Creek', program: 'Central' },
  { value: 'henderson', label: 'Henderson', program: 'West' },
  { value: 'papillion', label: 'Papillion', program: 'Central' },
  { value: 'new-albany', label: 'New Albany', program: 'Southeast' },
  { value: 'council-bluffs', label: 'Council Bluffs', program: 'Central' },
]

const coTypes = [
  { value: 'scope_change', label: 'Scope Change' },
  { value: 'design_change', label: 'Design Change' },
  { value: 'field_condition', label: 'Field Condition' },
  { value: 'owner_request', label: 'Owner Request' },
  { value: 'regulatory', label: 'Regulatory Compliance' },
]

/* ── Decision Capture Data ── */
const approveReasons = [
  'Scope clarification',
  'Site condition discovered',
  'Owner-directed change',
  'Schedule recovery',
  'Code or compliance',
  'Estimating gap',
  'Other',
]

const rejectReasons = [
  'Insufficient justification',
  'Estimate too high',
  'Schedule impact unacceptable',
  'Available in baseline scope',
  'Defer to gate review',
  'Other',
]

const contributingFactors = [
  'Weather',
  'Contractor performance',
  'Engineering rework',
  'Long-lead procurement',
  'Permit delay',
  'Internal review delay',
  'Force majeure',
]

const partyCatalog = [
  { id: 'acme', name: 'Acme Electrical' },
  { id: 'pacific', name: 'Pacific Systems' },
  { id: 'linesight', name: 'LineSight Consulting' },
  { id: 'jones', name: 'Jones Steel' },
  { id: 'midwest', name: 'Midwest Mechanical' },
  { id: 'summit', name: 'Summit Civil' },
]

interface RecentDecision {
  id: string
  coId: string
  coTitle: string
  action: 'approved' | 'rejected'
  primaryReason: string
  narrative: string
  decisionMaker: string
  timestamp: string
  contributingFactors: string[]
  parties: string[]
}

const recentDecisions: RecentDecision[] = [
  {
    id: 'DEC-001',
    coId: 'CO-0090',
    coTitle: 'Cable Tray Rerouting - Level 3',
    action: 'approved',
    primaryReason: 'Schedule recovery',
    narrative: 'Critical path impact required expedited approval. Design change validated by structural engineering. Fast-tracking to prevent cascade delays.',
    decisionMaker: 'Hasit Chetal',
    timestamp: '2026-04-26 14:22',
    contributingFactors: ['Engineering rework'],
    parties: ['acme'],
  },
  {
    id: 'DEC-002',
    coId: 'CO-0091',
    coTitle: 'Cooling Tower Specification Change',
    action: 'rejected',
    primaryReason: 'Available in baseline scope',
    narrative: 'Value engineering study found $1.8M savings with current design. Existing specification meets all performance requirements.',
    decisionMaker: 'Brian Smith',
    timestamp: '2026-04-20 10:15',
    contributingFactors: [],
    parties: ['midwest'],
  },
  {
    id: 'DEC-003',
    coId: 'CO-0085',
    coTitle: 'Fire Suppression Upgrade - Zone A',
    action: 'approved',
    primaryReason: 'Code or compliance',
    narrative: 'Required to meet updated fire code. Non-compliance would delay occupancy permit.',
    decisionMaker: 'Sarah Kim',
    timestamp: '2026-04-18 09:45',
    contributingFactors: ['Permit delay'],
    parties: [],
  },
  {
    id: 'DEC-004',
    coId: 'CO-0082',
    coTitle: 'Foundation Depth Extension',
    action: 'approved',
    primaryReason: 'Site condition discovered',
    narrative: 'Geotechnical survey revealed unstable soil at planned depth. Extension necessary for structural integrity.',
    decisionMaker: 'Brian Smith',
    timestamp: '2026-04-15 16:30',
    contributingFactors: ['Weather', 'Engineering rework'],
    parties: ['summit', 'jones'],
  },
  {
    id: 'DEC-005',
    coId: 'CO-0079',
    coTitle: 'Electrical Panel Relocation',
    action: 'rejected',
    primaryReason: 'Estimate too high',
    narrative: 'Vendor quote 40% above historical benchmark. Requested re-quote from alternative suppliers.',
    decisionMaker: 'Hasit Chetal',
    timestamp: '2026-04-12 11:00',
    contributingFactors: ['Long-lead procurement'],
    parties: ['acme'],
  },
]

type NewCOFormData = {
  title: string
  project: string
  type: string
  amount: string
  description: string
  scheduleImpact: string
  justification: string
}

const initialFormData: NewCOFormData = {
  title: '',
  project: '',
  type: '',
  amount: '',
  description: '',
  scheduleImpact: '',
  justification: '',
}

export default function ChangeOrderWorkbenchPage() {
  const { aiEnabled } = useAI()
  const { toast } = useToast()
  const [tab, setTab] = React.useState<TabFilter>('all')
  const [expandedCO, setExpandedCO] = React.useState<string | null>(null)
  const [showNewCODialog, setShowNewCODialog] = React.useState(false)
  const [formStep, setFormStep] = React.useState(1)
  const [formData, setFormData] = React.useState<NewCOFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitSuccess, setSubmitSuccess] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  
  // Decision capture state
  const [decisionModal, setDecisionModal] = React.useState<{
    open: boolean
    action: 'approve' | 'reject'
    coId: string
    coTitle: string
  } | null>(null)
  const [decisionReason, setDecisionReason] = React.useState('')
  const [decisionNarrative, setDecisionNarrative] = React.useState('')
  const [selectedFactors, setSelectedFactors] = React.useState<string[]>([])
  const [selectedParties, setSelectedParties] = React.useState<string[]>([])
  const [isCapturing, setIsCapturing] = React.useState(false)

  const handleFormChange = (field: keyof NewCOFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNextStep = () => {
    if (formStep < 3) setFormStep(formStep + 1)
  }

  const handlePrevStep = () => {
    if (formStep > 1) setFormStep(formStep - 1)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSubmitSuccess(true)
    // Reset after showing success
    setTimeout(() => {
      setShowNewCODialog(false)
      setFormStep(1)
      setFormData(initialFormData)
      setSubmitSuccess(false)
    }, 2000)
  }

  const resetDialog = () => {
    setShowNewCODialog(false)
    setFormStep(1)
    setFormData(initialFormData)
    setSubmitSuccess(false)
  }

  const isStep1Valid = formData.title && formData.project && formData.type
  const isStep2Valid = formData.amount && formData.scheduleImpact
  const isStep3Valid = formData.justification

  const action = useActionModal()

  // Decision capture handlers
  const openDecisionModal = (action: 'approve' | 'reject', coId: string, coTitle: string) => {
    setDecisionModal({ open: true, action, coId, coTitle })
    setDecisionReason('')
    setDecisionNarrative('')
    setSelectedFactors([])
    setSelectedParties([])
  }

  const closeDecisionModal = () => {
    setDecisionModal(null)
    setDecisionReason('')
    setDecisionNarrative('')
    setSelectedFactors([])
    setSelectedParties([])
  }

  const toggleFactor = (factor: string) => {
    setSelectedFactors(prev => 
      prev.includes(factor) 
        ? prev.filter(f => f !== factor)
        : [...prev, factor]
    )
  }

  const toggleParty = (partyId: string) => {
    setSelectedParties(prev =>
      prev.includes(partyId)
        ? prev.filter(p => p !== partyId)
        : [...prev, partyId]
    )
  }

  const isDecisionValid = decisionReason !== '' && decisionNarrative.length >= 30

  const handleCaptureDecision = async () => {
    if (!decisionModal || !isDecisionValid) return
    
    setIsCapturing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsCapturing(false)
    
    toast({
      title: 'Decision captured',
      description: 'This entry feeds the context graph and will inform future change-order recommendations.',
    })
    
    closeDecisionModal()
  }

  const pending = changeOrders.filter((co) => ['pending_director', 'pending_pm', 'cost_validation'].includes(co.status))
  
  // Apply search filter
  const searchFiltered = searchQuery.trim() === '' 
    ? changeOrders 
    : changeOrders.filter((co) => {
        const query = searchQuery.toLowerCase()
        return (
          co.id.toLowerCase().includes(query) ||
          co.title.toLowerCase().includes(query) ||
          co.project.toLowerCase().includes(query) ||
          co.program.toLowerCase().includes(query) ||
          co.type.toLowerCase().includes(query)
        )
      })
  
  // Apply tab filter on top of search
  const filtered = tab === 'all' ? searchFiltered :
    tab === 'pending' ? searchFiltered.filter((co) => ['pending_director', 'pending_pm', 'cost_validation'].includes(co.status)) :
    tab === 'approved' ? searchFiltered.filter((co) => co.status === 'approved') :
    searchFiltered.filter((co) => co.status === 'rejected')

  const totalPendingValue = pending.reduce((s, co) => s + co.amount, 0)
  const formatAmount = (n: number) => n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : `$${(n / 1000).toFixed(0)}K`

  const tabs: { key: TabFilter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: searchFiltered.length },
    { key: 'pending', label: 'Pending', count: searchFiltered.filter((co) => ['pending_director', 'pending_pm', 'cost_validation'].includes(co.status)).length },
    { key: 'approved', label: 'Approved', count: searchFiltered.filter((co) => co.status === 'approved').length },
    { key: 'rejected', label: 'Rejected', count: searchFiltered.filter((co) => co.status === 'rejected').length },
  ]

  return (
    <AppShell title="Change Order Workbench" subtitle="Track, review, and approve change orders" activeHref="/change-orders">
      <div className="space-y-4 sm:space-y-6 w-full">

        {/* ── Summary Strip ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-card rounded-xl border border-line p-4">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-gold" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total COs</span>
            </div>
            <p className="text-2xl font-sans font-bold text-foreground">{changeOrders.length}</p>
            <p className="text-[11px] text-muted-foreground">This quarter</p>
          </div>
          <div className="bg-card rounded-xl border border-line p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-gold" />
              <span className="text-[10px] font-bold text-gold uppercase tracking-wider">Pending</span>
            </div>
            <p className="text-2xl font-sans font-bold text-gold">{pending.length}</p>
            <p className="text-[11px] text-muted-foreground">{formatAmount(totalPendingValue)} pending value</p>
          </div>
          <div className="bg-card rounded-xl border border-line p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-red" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Budget Impact</span>
            </div>
            <p className="text-2xl font-sans font-bold text-foreground">+{formatAmount(totalPendingValue)}</p>
            <p className="text-[11px] text-muted-foreground">If all pending approved</p>
          </div>
          <div className="bg-card rounded-xl border border-line p-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Avg Cycle Time</span>
            </div>
            <p className="text-2xl font-sans font-bold text-foreground">5.2d</p>
            <p className="text-[11px] text-muted-foreground">Target: 5.0d</p>
          </div>
        </div>

        {/* ── Change Order Table ── */}
        <div className="bg-card rounded-xl border border-line overflow-hidden">
          <div className="px-6 py-5 border-b border-line">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sans text-base font-semibold text-foreground">Change Orders</h3>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search COs..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 w-[200px] pl-9 pr-4 text-sm border border-line rounded-lg bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all" 
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <Button size="sm" className="h-9 text-xs gap-1.5 border border-gold/40 hover:border-gold" style={{ backgroundColor: '#FAF6EB', color: '#0B1F3A' }} onClick={() => setShowNewCODialog(true)}>
                  <Plus className="w-3.5 h-3.5" />New CO
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              {tabs.map((t) => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={cn('px-4 py-2 rounded-lg text-xs font-semibold transition-all',
                    tab === t.key ? 'bg-gold text-navy shadow-sm' : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground')}>
                  {t.label}<span className="ml-2 px-1.5 py-0.5 rounded-md bg-black/10 dark:bg-white/10 text-[10px]">{t.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Table Header */}
          <div className="hidden sm:grid sm:grid-cols-6 gap-0 bg-muted/30 dark:bg-navy-mid/30 border-b border-line text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
            <div className="px-6 py-3">Change Order</div>
            <div className="px-4 py-3">Type</div>
            <div className="px-4 py-3">Amount</div>
            <div className="px-4 py-3">Status</div>
            <div className="px-4 py-3">Days in Queue</div>
            <div className="px-4 py-3">Agent</div>
          </div>

          <div className="divide-y divide-line">
            {filtered.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm font-medium text-muted-foreground mb-1">No change orders found</p>
                <p className="text-xs text-muted-foreground/70">
                  {searchQuery ? `No results for "${searchQuery}"` : 'No change orders match the current filter'}
                </p>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="mt-3 text-xs text-gold hover:text-gold/80 font-medium"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div>
              {filtered.map((co, index) => {
              const sCfg = statusConfig[co.status]
              const SIcon = sCfg.icon
              return (
                <motion.div
                  key={co.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04, ease }}
                >
                  <button onClick={() => setExpandedCO(expandedCO === co.id ? null : co.id)}
                    className={cn('w-full grid grid-cols-1 sm:grid-cols-6 gap-0 items-center text-left hover:bg-secondary/30 transition-colors group', expandedCO === co.id && 'bg-secondary/20')}>
                    
                    {/* CO ID & Title */}
                    <div className="px-6 py-4 flex items-center gap-3">
                      <div className="flex items-center gap-2 shrink-0">
                        {expandedCO === co.id ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-mono font-bold text-gold mb-0.5">{co.id}</p>
                        <p className="text-sm font-semibold text-foreground truncate group-hover:text-gold transition-colors">{co.title}</p>
                        <p className="text-[11px] text-muted-foreground">{co.project} -- {co.program}</p>
                      </div>
                    </div>

                    {/* Type */}
                    <div className="px-4 py-4">
                      <Badge variant="outline" className="text-[10px] border-line text-muted-foreground">{co.type}</Badge>
                    </div>

                    {/* Amount */}
                    <div className="px-4 py-4">
                      <span className="text-sm font-mono font-bold text-foreground">{formatAmount(co.amount)}</span>
                    </div>

                    {/* Status */}
                    <div className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <SIcon className={cn('w-4 h-4', sCfg.color)} />
                        <Badge variant="outline" className={cn('text-[10px] font-semibold', sCfg.color, sCfg.bg.replace('bg-', 'border-').replace('-bg', '/20'))}>{sCfg.label}</Badge>
                      </div>
                    </div>

                    {/* Days in Queue */}
                    <div className="px-4 py-4">
                      {co.daysInQueue > 0 ? (
                        <span className={cn('text-sm font-mono font-semibold', co.daysInQueue >= 5 ? 'text-red' : 'text-muted-foreground')}>{co.daysInQueue}d</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </div>

                    {/* Agent */}
                    <div className="px-4 py-4">
                      {aiEnabled && co.agent ? (
                        <Badge variant="outline" className="text-[10px] font-mono border-teal/20 text-teal">
                          <Bot className="w-3 h-3 mr-1" />{co.agent}
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </div>
                  </button>

                  {expandedCO === co.id && (
                    <div className="px-3 sm:px-5 pb-4 ml-4 sm:ml-9 space-y-3">
                      {/* Approval Timeline */}
                      <div className="p-4 rounded-lg bg-secondary/20 border border-line">
                        <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase">Approval Pipeline</p>
                        <div className="flex items-center gap-0">
                          {co.stages.map((stage, i) => (
                            <React.Fragment key={stage.name}>
                              <div className="flex flex-col items-center text-center">
                                <div className={cn(
                                  'w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold mb-1',
                                  stage.done ? 'bg-green/20 text-green border border-green/30' : 'bg-secondary text-muted-foreground border border-line'
                                )}>
                                  {stage.done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                                </div>
                                <span className="text-[10px] font-semibold text-foreground whitespace-nowrap">{stage.name}</span>
                                <span className="text-[9px] text-muted-foreground">{stage.date || 'Pending'}</span>
                                <span className="text-[9px] text-muted-foreground">{stage.by}</span>
                              </div>
                              {i < co.stages.length - 1 && (
                                <div className={cn('flex-1 h-0.5 mx-1 rounded', stage.done ? 'bg-green/40' : 'bg-line')} />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-secondary/20 border border-line">
                          <p className="text-xs font-semibold text-muted-foreground mb-1">Impact Assessment</p>
                          <div className="flex gap-4">
                            <div><span className="text-[10px] text-muted-foreground">Schedule</span><p className="text-sm font-mono font-semibold text-foreground">+{co.impactDays}d</p></div>
                            <div><span className="text-[10px] text-muted-foreground">Budget</span><p className="text-sm font-mono font-semibold text-foreground">{co.budgetImpact}</p></div>
                            <div><span className="text-[10px] text-muted-foreground">Submitted</span><p className="text-sm font-mono text-foreground">{co.submittedDate}</p></div>
                          </div>
                        </div>
                        {aiEnabled && co.agentNote && (
                          <div className="p-3 rounded-lg bg-teal/5 border border-teal/10">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Bot className="w-3.5 h-3.5 text-teal" />
                              <span className="text-xs font-semibold text-teal">Agent Analysis</span>
                            </div>
                            <p className="text-sm text-foreground/80 font-mono">{co.agentNote}</p>
                          </div>
                        )}
                      </div>

                      {co.status !== 'approved' && co.status !== 'rejected' && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="h-7 text-xs gap-1 bg-green hover:bg-green/90 text-white"
                            onClick={(e) => {
                              e.stopPropagation()
                              openDecisionModal('approve', co.id, co.title)
                            }}
                          >
                            <CheckCircle2 className="w-3 h-3" />Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-7 text-xs gap-1 border-red/30 text-red"
                            onClick={(e) => {
                              e.stopPropagation()
                              openDecisionModal('reject', co.id, co.title)
                            }}
                          >
                            <XCircle className="w-3 h-3" />Reject
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs gap-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              action.open({
                                tone: 'destructive',
                                icon: ArrowUpRight,
                                title: `Escalate ${co.id}`,
                                description: 'Escalates this change order to portfolio leadership for executive review.',
                                context: [
                                  { label: 'Change Order', value: co.id },
                                  { label: 'Title', value: co.title },
                                  { label: 'Project', value: co.project },
                                  { label: 'Amount', value: `$${(co.amount / 1000).toFixed(0)}K` },
                                ],
                                fields: [
                                  {
                                    type: 'select',
                                    name: 'target',
                                    label: 'Escalate To',
                                    required: true,
                                    options: [
                                      { value: 'pd', label: 'Brian Smith — Portfolio Director' },
                                      { value: 'cfo', label: 'Finance Lead — CFO Review' },
                                      { value: 'exec', label: 'Executive Steering Committee' },
                                    ],
                                  },
                                  {
                                    type: 'textarea',
                                    name: 'reason',
                                    label: 'Reason for Escalation',
                                    placeholder: 'Why does this CO need executive review?',
                                    required: true,
                                  },
                                ],
                                confirmLabel: 'Escalate',
                                successToast: `${co.id} escalated`,
                                successDescription: 'Portfolio leadership has been notified.',
                              })
                            }}
                          >
                            <ArrowUpRight className="w-3 h-3" />Escalate
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )
            })}
            </div>
            )}
          </div>
        </div>

        {/* ── Recent Decisions and Reasons Panel ── */}
        <div className="bg-card rounded-xl border border-line overflow-hidden">
          <div className="px-6 py-4 border-b border-line flex items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            <h3 className="font-sans text-base font-semibold text-foreground">Recent Decisions & Reasons</h3>
            <span className="text-xs text-muted-foreground ml-auto">Last 5 decisions across portfolio</span>
          </div>

          <div className="divide-y divide-line">
            {recentDecisions.map((decision) => (
              <div key={decision.id} className="px-6 py-4 hover:bg-secondary/20 transition-colors group">
                <div className="flex items-start gap-4">
                  {/* Decision Icon */}
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                    decision.action === 'approved' ? 'bg-green/10' : 'bg-red/10'
                  )}>
                    {decision.action === 'approved' 
                      ? <CheckCircle2 className="w-4 h-4 text-green" />
                      : <XCircle className="w-4 h-4 text-red" />
                    }
                  </div>

                  {/* Decision Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-gold">{decision.coId}</span>
                      <span className={cn(
                        'text-[10px] font-bold uppercase px-1.5 py-0.5 rounded',
                        decision.action === 'approved' ? 'bg-green/10 text-green' : 'bg-red/10 text-red'
                      )}>
                        {decision.action}
                      </span>
                      <span className="text-[10px] text-muted-foreground ml-auto">{decision.timestamp}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1 truncate">{decision.coTitle}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-[10px] border-primary/20 text-primary bg-primary/5">
                        {decision.primaryReason}
                      </Badge>
                      {decision.contributingFactors.length > 0 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{decision.contributingFactors.length} factor{decision.contributingFactors.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {decision.narrative.length > 80 
                        ? `${decision.narrative.slice(0, 80)}...` 
                        : decision.narrative
                      }
                    </p>
                  </div>

                  {/* Decision Maker */}
                  <div className="shrink-0 text-right">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <User className="w-3 h-3" />
                      {decision.decisionMaker}
                    </div>
                    <button className="text-[10px] text-primary hover:underline mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      View full trace
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decision Capture Modal */}
      <Dialog open={decisionModal?.open ?? false} onOpenChange={(open) => !open && closeDecisionModal()}>
        <DialogContent className="sm:max-w-[560px] bg-card border-line">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-gold" />
              Capture Decision Context
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {decisionModal?.action === 'approve' ? 'Approving' : 'Rejecting'} {decisionModal?.coId} — {decisionModal?.coTitle}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Primary Reason - Required */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Primary Reason <span className="text-red">*</span>
              </Label>
              <Select value={decisionReason} onValueChange={setDecisionReason}>
                <SelectTrigger className="bg-secondary/50 border-line">
                  <SelectValue placeholder="Select primary reason..." />
                </SelectTrigger>
                <SelectContent>
                  {(decisionModal?.action === 'approve' ? approveReasons : rejectReasons).map((reason) => (
                    <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Decision Narrative - Required */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Decision Narrative <span className="text-red">*</span>
                <span className="text-xs text-muted-foreground ml-2">(min 30 characters)</span>
              </Label>
              <textarea
                placeholder="Why this decision, in your own words. This becomes part of the audit trail and feeds the decision-trace graph."
                value={decisionNarrative}
                onChange={(e) => setDecisionNarrative(e.target.value)}
                rows={3}
                className={cn(
                  'w-full px-3 py-2 text-sm rounded-lg bg-secondary/50 border focus:ring-2 focus:outline-none resize-none transition-colors',
                  decisionNarrative.length > 0 && decisionNarrative.length < 30
                    ? 'border-amber focus:border-amber focus:ring-amber/20'
                    : 'border-line focus:border-gold focus:ring-gold/20'
                )}
              />
              <div className="flex items-center justify-between">
                <span className={cn(
                  'text-[10px]',
                  decisionNarrative.length >= 30 ? 'text-green' : 'text-muted-foreground'
                )}>
                  {decisionNarrative.length}/30 characters minimum
                </span>
              </div>
            </div>

            {/* Contributing Factors - Optional */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Contributing Factors <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <div className="flex flex-wrap gap-2">
                {contributingFactors.map((factor) => (
                  <button
                    key={factor}
                    onClick={() => toggleFactor(factor)}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-xs font-medium transition-all border',
                      selectedFactors.includes(factor)
                        ? 'bg-primary/10 border-primary/30 text-primary'
                        : 'bg-secondary/50 border-line text-muted-foreground hover:border-line hover:text-foreground'
                    )}
                  >
                    {factor}
                  </button>
                ))}
              </div>
            </div>

            {/* Parties Involved - Optional */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Parties Involved <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {partyCatalog.map((party) => (
                  <label
                    key={party.id}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all',
                      selectedParties.includes(party.id)
                        ? 'bg-gold/5 border-gold/30'
                        : 'bg-secondary/30 border-line hover:border-line'
                    )}
                  >
                    <Checkbox
                      checked={selectedParties.includes(party.id)}
                      onCheckedChange={() => toggleParty(party.id)}
                      className="data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                    />
                    <span className="text-xs font-medium text-foreground">{party.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-between pt-4 border-t border-line">
            <Button variant="outline" size="sm" onClick={closeDecisionModal} className="text-xs">
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleCaptureDecision}
              disabled={!isDecisionValid || isCapturing}
              className={cn(
                'text-xs gap-1.5 border',
                decisionModal?.action === 'approve'
                  ? 'border-gold/40 hover:border-gold'
                  : 'bg-red hover:bg-red/90 text-white border-red'
              )}
              style={decisionModal?.action === 'approve' ? { backgroundColor: '#FAF6EB', color: '#0B1F3A' } : undefined}
            >
              {isCapturing ? (
                <>
                  <div className="w-3 h-3 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                  Capturing...
                </>
              ) : decisionModal?.action === 'approve' ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  Approve & Capture
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3" />
                  Reject & Capture
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New CO Dialog */}
      <Dialog open={showNewCODialog} onOpenChange={(open) => !open && resetDialog()}>
        <DialogContent className="sm:max-w-[600px] bg-card border-line">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground">
              {submitSuccess ? 'Change Order Submitted' : 'Create New Change Order'}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {submitSuccess 
                ? 'Your change order has been submitted for review.'
                : `Step ${formStep} of 3 — ${formStep === 1 ? 'Basic Information' : formStep === 2 ? 'Cost & Impact' : 'Justification & Submit'}`
              }
            </DialogDescription>
          </DialogHeader>

          {submitSuccess ? (
            <div className="py-8 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green/20 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground mb-1">CO-0092 Created</p>
                <p className="text-sm text-muted-foreground">Your change order has been submitted and is pending PM review.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Step Indicator */}
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3].map((step) => (
                  <React.Fragment key={step}>
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                      formStep === step 
                        ? 'bg-gold text-navy' 
                        : formStep > step 
                        ? 'bg-green/20 text-green border border-green/30'
                        : 'bg-secondary text-muted-foreground border border-line'
                    )}>
                      {formStep > step ? <CheckCircle2 className="w-4 h-4" /> : step}
                    </div>
                    {step < 3 && (
                      <div className={cn('flex-1 h-0.5 rounded', formStep > step ? 'bg-green/40' : 'bg-line')} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Step 1: Basic Information */}
              {formStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium text-foreground">Change Order Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., HVAC System Upgrade - Building C"
                      value={formData.title}
                      onChange={(e) => handleFormChange('title', e.target.value)}
                      className="bg-secondary/50 border-line focus:border-gold focus:ring-gold/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Project</Label>
                      <Select value={formData.project} onValueChange={(v) => handleFormChange('project', v)}>
                        <SelectTrigger className="bg-secondary/50 border-line">
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projectOptions.map((p) => (
                            <SelectItem key={p.value} value={p.value}>
                              {p.label} <span className="text-muted-foreground ml-1">({p.program})</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Type</Label>
                      <Select value={formData.type} onValueChange={(v) => handleFormChange('type', v)}>
                        <SelectTrigger className="bg-secondary/50 border-line">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {coTypes.map((t) => (
                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium text-foreground">Description (Optional)</Label>
                    <textarea
                      id="description"
                      placeholder="Briefly describe the change order..."
                      value={formData.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-secondary/50 border border-line focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Cost & Impact */}
              {formStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-sm font-medium text-foreground">Estimated Amount ($)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0"
                          value={formData.amount}
                          onChange={(e) => handleFormChange('amount', e.target.value)}
                          className="pl-9 bg-secondary/50 border-line focus:border-gold focus:ring-gold/20"
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground">Enter amount in dollars</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="schedule" className="text-sm font-medium text-foreground">Schedule Impact (Days)</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="schedule"
                          type="number"
                          placeholder="0"
                          value={formData.scheduleImpact}
                          onChange={(e) => handleFormChange('scheduleImpact', e.target.value)}
                          className="pl-9 bg-secondary/50 border-line focus:border-gold focus:ring-gold/20"
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground">Estimated schedule extension</p>
                    </div>
                  </div>

                  {/* Impact Preview */}
                  {formData.amount && (
                    <div className="p-4 rounded-lg bg-secondary/30 border border-line">
                      <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase">Impact Preview</p>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-[10px] text-muted-foreground">Cost Impact</p>
                          <p className="text-lg font-mono font-bold text-foreground">
                            {Number(formData.amount) >= 1000000 
                              ? `$${(Number(formData.amount) / 1000000).toFixed(1)}M` 
                              : `$${(Number(formData.amount) / 1000).toFixed(0)}K`}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground">Schedule</p>
                          <p className="text-lg font-mono font-bold text-foreground">+{formData.scheduleImpact || 0}d</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground">Approval Path</p>
                          <p className="text-sm font-semibold text-foreground">
                            {Number(formData.amount) >= 1000000 ? 'Director' : Number(formData.amount) >= 500000 ? 'PM + Finance' : 'PM Only'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Justification & Submit */}
              {formStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="justification" className="text-sm font-medium text-foreground">Business Justification</Label>
                    <textarea
                      id="justification"
                      placeholder="Explain why this change order is necessary and its benefits..."
                      value={formData.justification}
                      onChange={(e) => handleFormChange('justification', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-secondary/50 border border-line focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none resize-none"
                    />
                  </div>

                  {/* Summary */}
                  <div className="p-4 rounded-lg bg-gold/5 border border-gold/20">
                    <p className="text-xs font-semibold text-gold mb-3 uppercase">Change Order Summary</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Title:</span>
                        <span className="font-medium text-foreground">{formData.title || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Project:</span>
                        <span className="font-medium text-foreground">
                          {projectOptions.find(p => p.value === formData.project)?.label || '—'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium text-foreground">
                          {coTypes.find(t => t.value === formData.type)?.label || '—'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="font-mono font-bold text-gold">
                          {formData.amount 
                            ? Number(formData.amount) >= 1000000 
                              ? `$${(Number(formData.amount) / 1000000).toFixed(1)}M` 
                              : `$${(Number(formData.amount) / 1000).toFixed(0)}K`
                            : '—'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Schedule Impact:</span>
                        <span className="font-medium text-foreground">+{formData.scheduleImpact || 0} days</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4 border-t border-line">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={formStep === 1 ? resetDialog : handlePrevStep}
                  className="text-xs"
                >
                  {formStep === 1 ? 'Cancel' : 'Back'}
                </Button>
                <Button
                  size="sm"
                  onClick={formStep === 3 ? handleSubmit : handleNextStep}
                  disabled={
                    (formStep === 1 && !isStep1Valid) ||
                    (formStep === 2 && !isStep2Valid) ||
                    (formStep === 3 && !isStep3Valid) ||
                    isSubmitting
                  }
                  className="text-xs gap-1.5 border border-gold/40 hover:border-gold"
                  style={{ backgroundColor: '#FAF6EB', color: '#0B1F3A' }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3 h-3 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : formStep === 3 ? (
                    <>Submit CO</>
                  ) : (
                    <>Continue</>
                  )}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      {action.element}
    </AppShell>
  )
}
