'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  AlertTriangle,
  Clock,
  Bot,
  FileText,
  Settings,
  ChevronDown,
  Sun,
  Moon,
  Building2,
  Target,
  TrendingUp,
  Users,
  Zap,
  Workflow,
  Inbox,
  Shield,
  FileText as FileTextIcon,
  DollarSign,
  Activity,
  Menu,
  X,
  Check,
  Sparkles,
  Lightbulb,
  History,
  SlidersHorizontal,
  BarChart3,
  FlaskConical,
  CalendarDays,
  Radio,
  CircleDollarSign,
  GitBranch,
  ClipboardCheck,
  PenLine,
  Layers,
  ShieldCheck,
  Scale,
  ClipboardList,
  BookOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAI } from '@/components/ai-provider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface NavItem {
  label: string
  icon: React.ElementType
  href: string
  badge?: number
}

interface NavSection {
  title: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    title: 'PLANNING',
    items: [
      { label: 'Annual Planning (preview)', icon: CalendarDays, href: '/planning' },
    ],
  },
  {
    title: 'COMMAND',
    items: [
      { label: 'Director Command View', icon: LayoutDashboard, href: '/' },
      { label: 'Risk Horizon', icon: AlertTriangle, href: '/risk', badge: 5 },
      { label: 'Controls & Auto-Audit', icon: ShieldCheck, href: '/controls', badge: 17 },
      { label: 'Controls Library', icon: BookOpen, href: '/controls-library' },
      { label: 'Risk Audit', icon: ClipboardList, href: '/risk-audit', badge: 1 },
      { label: 'Compliance Audit', icon: Scale, href: '/compliance-audit', badge: 2 },
      { label: 'SLA Tracker', icon: Clock, href: '/sla', badge: 7 },
    ],
  },
  {
    title: 'OPERATIONS',
    items: [
      { label: 'Lead Operational View', icon: Workflow, href: '/lead', badge: 5 },
      { label: 'Funding & PO Cycle', icon: CircleDollarSign, href: '/funding', badge: 12 },
      { label: 'Approval Pipeline', icon: GitBranch, href: '/approval-pipeline' },
      { label: 'BDP Fact-Check', icon: ClipboardCheck, href: '/bdp-factcheck', badge: 3 },
      { label: 'Termsheet Authoring', icon: PenLine, href: '/termsheet' },
      { label: 'Key-Person Risk', icon: Shield, href: '/analyst', badge: 3 },
      { label: 'Throughput & Cycle', icon: Activity, href: '/throughput' },
      { label: 'Program Scorecard', icon: Target, href: '/program' },
      { label: 'Project Health', icon: Building2, href: '/projects' },
      { label: 'Milestone Gates', icon: Target, href: '/milestones', badge: 1 },
      { label: 'Task Inbox', icon: Inbox, href: '/inbox', badge: 4 },
      { label: 'Budget & EAC', icon: DollarSign, href: '/budget' },
      { label: 'Change Orders', icon: FileTextIcon, href: '/change-orders', badge: 3 },
      { label: 'Concurrent Hub Build', icon: Layers, href: '/concurrent-hub' },
    ],
  },
  {
    title: 'INTELLIGENCE',
    items: [
      { label: 'Variance Explainer', icon: AlertTriangle, href: '/variance' },
      { label: 'Orchestration View', icon: Workflow, href: '/orchestration' },
      { label: 'Agent Activity', icon: Bot, href: '/agents' },
      { label: 'Predictive Insights', icon: Zap, href: '/insights' },
    ],
  },
  {
    title: 'ADMIN',
    items: [
      { label: 'Party Intelligence', icon: Users, href: '/parties' },
      { label: 'Reports', icon: FileText, href: '/reports' },
      { label: 'Settings', icon: Settings, href: '/settings' },
    ],
  },
  {
    title: 'EXECUTIVE',
    items: [
      { label: 'Executive Deck', icon: FileText, href: '/deck' },
    ],
  },
]

const personas = [
  { name: 'Brian Smith', role: 'Portfolio Director', initials: 'BS', color: 'gold' },
  { name: 'Anu Reddi', role: 'Senior Director — Portfolio Approver', initials: 'AR', color: 'gold' },
  { name: 'Hasit Chetal', role: 'Portfolio Controls Lead', initials: 'HC', color: 'gold' },
  { name: 'Brian Steinberg', role: 'Program Manager — Central', initials: 'BS', color: 'gold' },
  { name: 'Sophia Lamb', role: 'Finance Partner — FP&A', initials: 'SL', color: 'gold' },
  { name: 'Sreya Mukherjee', role: 'LineSight — Operational Staff', initials: 'SM', color: 'gold' },
]

// Role-based access map: which hrefs each persona can access.
// 'ALL' means full access to every nav item.
const personaAccess: Record<string, Set<string> | 'ALL'> = {
  // Portfolio Director — Full Access — All Screens
  'Brian Smith': 'ALL',

  // Senior Director — Final Approver — Full Access (read-and-approve focus)
  'Anu Reddi': 'ALL',

  // Portfolio Controls Lead — Operations Lead — Full Ops
  // Grayed: Annual Planning, Director Command View, Variance Explainer, Party Intelligence, Executive Deck
  'Hasit Chetal': new Set([
    '/risk', '/controls', '/controls-library', '/risk-audit', '/compliance-audit', '/sla',
    '/lead', '/funding', '/approval-pipeline', '/bdp-factcheck', '/termsheet',
    '/analyst', '/throughput', '/program', '/projects', '/milestones', '/inbox', '/budget', '/change-orders',
    '/concurrent-hub',
    '/orchestration', '/agents', '/insights',
    '/reports', '/settings',
    '/recommendations', '/recommendations/digest', '/recommendations/project', '/recommendations/contractor',
    '/recommendations/signals', '/recommendations/capital-deployment', '/recommendations/impact', '/recommendations/what-if', '/recommendations/history',
    '/recommendations/settings',
  ]),

  // Program Manager — Central — Programme-Scoped Access
  'Brian Steinberg': new Set([
    '/program', '/projects', '/milestones', '/inbox', '/change-orders',
    '/funding', '/approval-pipeline', '/bdp-factcheck', '/termsheet',
    '/orchestration', '/insights',
    '/parties',
    '/recommendations', '/recommendations/digest', '/recommendations/project',
    '/recommendations/impact', '/recommendations/what-if', '/recommendations/history',
  ]),

  // Finance Partner (FP&A) — Funding-Cycle Scope
  'Sophia Lamb': new Set([
    '/funding', '/approval-pipeline', '/bdp-factcheck', '/termsheet',
    '/budget', '/change-orders', '/sla',
    '/insights', '/reports',
    '/recommendations', '/recommendations/digest', '/recommendations/impact',
    '/recommendations/history',
  ]),

  // LineSight — Operational Staff — Task-Scoped Access
  'Sreya Mukherjee': new Set([
    '/inbox',
    '/funding', '/termsheet',
    '/orchestration',
    '/recommendations', '/recommendations/digest', '/recommendations/project',
    '/recommendations/history',
  ]),
}

// Per-persona suffix labels (e.g. "(assigned only)")
const personaItemSuffix: Record<string, Record<string, string>> = {
  'Sreya Mukherjee': {
    '/orchestration': '(assigned only)',
  },
}

function hasAccess(personaName: string, href: string): boolean {
  const access = personaAccess[personaName]
  if (access === 'ALL') return true
  if (!access) return true
  return access.has(href)
}

interface AppShellProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  activeHref?: string
}

const aiNavSection: NavSection = {
  title: 'RECOMMENDATIONS',
  items: [
    { label: 'Recommendation Hub', icon: Lightbulb, href: '/recommendations', badge: 12 },
    { label: 'Weekly Digest', icon: CalendarDays, href: '/recommendations/digest' },
    { label: 'Project Recs', icon: Building2, href: '/recommendations/project', badge: 8 },
    { label: 'Contractor Intel', icon: Users, href: '/recommendations/contractor' },
    { label: 'External Signals', icon: Radio, href: '/recommendations/signals' },
    { label: 'Capital Deployment', icon: CircleDollarSign, href: '/recommendations/capital-deployment' },
    { label: 'Impact Analysis', icon: BarChart3, href: '/recommendations/impact' },
    { label: 'What-If Scenarios', icon: FlaskConical, href: '/recommendations/what-if' },
    { label: 'Rec. History', icon: History, href: '/recommendations/history' },
    { label: 'Engine Settings', icon: SlidersHorizontal, href: '/recommendations/settings' },
  ],
}

export function AppShell({ children, title = 'Director Command View', subtitle, activeHref = '/' }: AppShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { aiEnabled, setAiEnabled } = useAI()
  const { theme, setTheme } = useTheme()
  const [currentPersona, setCurrentPersonaState] = React.useState(personas[0])

  // Resolve the first accessible nav item for a given persona (scans main nav, then AI nav)
  const getFirstAccessibleHref = React.useCallback((personaName: string): string | null => {
    for (const section of navSections) {
      for (const item of section.items) {
        if (hasAccess(personaName, item.href)) return item.href
      }
    }
    for (const item of aiNavSection.items) {
      if (hasAccess(personaName, item.href)) return item.href
    }
    return null
  }, [])

  // Hydrate persona from sessionStorage so the selection persists across in-app navigation
  // within the same tab session, but resets to the default (Brian Smith — Portfolio Director)
  // on a fresh page load or new tab.
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = window.sessionStorage.getItem('v0:currentPersona')
      if (stored) {
        const match = personas.find((p) => p.name === stored)
        if (match) setCurrentPersonaState(match)
      }
    } catch {
      // ignore storage errors
    }
  }, [])

  const setCurrentPersona = React.useCallback((persona: typeof personas[number]) => {
    setCurrentPersonaState(persona)
    try {
      window.sessionStorage.setItem('v0:currentPersona', persona.name)
    } catch {
      // ignore storage errors
    }
    // Always route the user to the first accessible section for the newly selected persona,
    // so they don't land on a screen their role doesn't have access to.
    const firstHref = getFirstAccessibleHref(persona.name)
    if (firstHref && firstHref !== pathname) {
      setIsNavigating(true)
      router.push(firstHref)
    }
  }, [getFirstAccessibleHref, pathname, router])

  const [mounted, setMounted] = React.useState(false)
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [selectedRegion, setSelectedRegion] = React.useState('all')
  const [isNavigating, setIsNavigating] = React.useState(false)
  const prevPathname = React.useRef(pathname)

  React.useEffect(() => { setMounted(true) }, [])

  // Detect navigation completion and clear navigating state
  React.useEffect(() => {
    if (prevPathname.current !== pathname) {
      setIsNavigating(false)
      prevPathname.current = pathname
    }
  }, [pathname])

  // Close sidebar on route nav (link click) + trigger loading state
  const handleNavClick = (href: string) => {
    setSidebarOpen(false)
    if (href !== pathname) {
      setIsNavigating(true)
    }
  }

  /* ── Sidebar Content (shared between desktop sidebar and mobile drawer) ── */
  const SidebarContent = (
    <>
      {/* Brand */}
      <div className="p-5 pb-4 border-b border-sidebar-border">
        <p className="text-[8.5px] font-bold tracking-[3px] text-gold uppercase mb-1.5">Google ODC</p>
        <h1 className="text-[14px] font-semibold text-sidebar-foreground leading-snug tracking-[-0.02em]">Portfolio Intelligence</h1>
        <h1 className="text-[14px] font-semibold text-sidebar-foreground leading-snug tracking-[-0.02em]">Platform</h1>
      </div>
      
      {/* Mobile Brand header gradient for stunning effect in dark mode */}

      {/* Persona Switcher */}
      <div className="px-3 py-2.5 border-b border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-gold/8 to-transparent hover:from-gold/12 hover:bg-sidebar-accent/70 transition-all duration-200">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold/25 to-gold/10 border border-gold/35 shadow-[0_6px_18px_rgba(212,160,76,0.14)] flex items-center justify-center">
                <span className="text-[9px] font-bold text-gold">{currentPersona.initials}</span>
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-[11.5px] font-semibold text-sidebar-foreground truncate tracking-[-0.01em]">{currentPersona.name}</p>
                <p className="text-[9.5px] text-sidebar-foreground/55 truncate">{currentPersona.role}</p>
              </div>
              <ChevronDown className="w-3 h-3 text-sidebar-foreground/50 shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[230px]">
            {personas.map((persona) => (
              <DropdownMenuItem key={persona.name} onClick={() => setCurrentPersona(persona)} className="flex items-center gap-3 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-gold">{persona.initials}</span>
                </div>
                <div>
                  <p className="text-[12.5px] font-medium">{persona.name}</p>
                  <p className="text-[10.5px] text-muted-foreground">{persona.role}</p>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        {navSections.map((section) => {
          const visibleItems = section.items.filter((item) => hasAccess(currentPersona.name, item.href))
          if (visibleItems.length === 0) return null
          return (
          <div key={section.title} className="mb-4">
            <p className="px-3 mb-2 text-[10.5px] font-bold tracking-[2px] text-gold/80 uppercase">{section.title}</p>
            <div className="space-y-0.5">
              {visibleItems.map((item) => {
                // Use pathname for active state detection with startsWith for nested routes
                // Special case: '/' should only match exactly, not as prefix
                const isActive = item.href === '/' 
                  ? pathname === '/'
                  : pathname === item.href || pathname.startsWith(item.href + '/')
                const suffix = personaItemSuffix[currentPersona.name]?.[item.href]

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    prefetch={true}
                    onClick={() => handleNavClick(item.href)}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-[12px] transition-all duration-150',
                      isActive
                        ? 'bg-gradient-to-r from-gold/18 to-gold/6 text-gold font-semibold border-l-[3px] border-gold -ml-[3px] pl-[calc(0.75rem+3px)] shadow-[inset_0_0_0_1px_rgba(212,160,76,0.12)]'
                        : 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground/90 active:scale-[0.97]'
                    )}
                  >
                    <item.icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="flex-1 truncate">
                      {item.label}
                      {suffix && (
                        <span className="ml-1 text-[10px] text-sidebar-foreground/40 italic">{suffix}</span>
                      )}
                    </span>
                    {item.badge !== undefined && (
                      <span className="min-w-[17px] h-[17px] px-1 flex items-center justify-center rounded-full bg-gold text-navy text-[8.5px] font-bold shadow-sm">{item.badge}</span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
          )
        })}

        {/* AI Recommendations section - only visible when AI is enabled and persona has access */}
        <AnimatePresence>
          {aiEnabled && aiNavSection.items.some((item) => hasAccess(currentPersona.name, item.href)) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="mb-5 overflow-hidden"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-teal/5 via-transparent to-transparent rounded-lg pointer-events-none" />
                <p className="px-3 mb-2 text-[10.5px] font-bold tracking-[2px] text-teal uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {aiNavSection.title}
                </p>
                <div className="space-y-0.5">
                  {aiNavSection.items
                    .filter((item) => hasAccess(currentPersona.name, item.href))
                    .map((item) => {
                    // Use pathname for active state detection with startsWith for nested routes
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        prefetch={true}
                        onClick={() => handleNavClick(item.href)}
                        className={cn(
                          'flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-[12px] transition-all duration-150',
                          isActive
                            ? 'bg-teal/10 text-teal font-semibold border-l-[3px] border-teal -ml-[3px] pl-[calc(0.75rem+3px)]'
                            : 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground/90 active:scale-[0.97]'
                        )}
                      >
                        <item.icon className="w-4 h-4 shrink-0" />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge !== undefined && (
                          <span className="min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-teal text-white text-[9px] font-bold">{item.badge}</span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <p className="text-[10px] text-sidebar-foreground/50 text-center tracking-wider">VoltusWave · May 2026</p>
      </div>
    </>
  )

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[264px] bg-sidebar flex-col border-r border-sidebar-border shrink-0">
        {SidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setSidebarOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            {/* Drawer */}
            <motion.aside 
              className="relative w-[280px] max-w-[85vw] h-full bg-sidebar flex flex-col shadow-2xl"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* Close button */}
              <motion.button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-foreground hover:bg-gold/20 transition-colors z-10"
                aria-label="Close menu"
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
              {SidebarContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Navigation Progress Bar */}
        <AnimatePresence>
          {isNavigating && (
            <motion.div
              className="h-0.5 bg-gold/20 fixed top-0 left-0 right-0 z-[60]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-gold via-gold to-gold/60 shadow-[0_0_10px_rgba(212,160,76,0.6)]"
                initial={{ width: '0%' }}
                animate={{ width: ['0%', '30%', '60%', '85%'] }}
                transition={{ duration: 2, times: [0, 0.3, 0.6, 1], ease: 'easeOut' }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Topbar */}
        <header className="h-12 sm:h-14 border-b border-line bg-card flex items-center justify-between px-4 sm:px-6 shrink-0 gap-3">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            {/* Hamburger (mobile only) */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors shrink-0"
              aria-label="Open menu"
            >
              <Menu className="w-4.5 h-4.5 text-foreground" />
            </button>

            <div className="min-w-0 flex-1">
              <h2 className="text-sm sm:text-base font-semibold text-foreground leading-snug truncate">
                {title}
              </h2>
              {subtitle && (
                <p className="text-[10px] sm:text-[11px] text-muted-foreground/70 truncate hidden sm:block mt-0.5">{subtitle}</p>
              )}
            </div>

            {/* Data Freshness - Live indicator */}
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green" />
              </span>
              <span className="text-muted-foreground font-medium">Live</span>
            </div>
            <div className="sm:hidden relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green" />
            </div>

            {/* Region Filter - hidden on small screens */}
            <div className="hidden md:block">
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="h-8 w-[140px] text-xs border-border">
                  <SelectValue placeholder="Filter by region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="southeast">Southeast</SelectItem>
                  <SelectItem value="central">Central</SelectItem>
                  <SelectItem value="west">West</SelectItem>
                  <SelectItem value="northeast">Northeast</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">

            {/* AI Toggle */}
            <motion.div whileTap={{ scale: 0.98 }}>
              <button
                onClick={() => setAiEnabled(!aiEnabled)}
                className={cn(
                  'flex items-center gap-2 h-8 px-3 rounded-md transition-all duration-300 border',
                  aiEnabled
                    ? 'bg-teal/10 border-teal/30 shadow-[0_0_12px_-3px_rgba(43,138,138,0.4)]'
                    : 'bg-background border-border hover:bg-accent hover:text-accent-foreground'
                )}
                aria-label="Toggle AI Recommendations"
              >
                <Sparkles className={cn(
                  'w-3.5 h-3.5 transition-colors',
                  aiEnabled ? 'text-teal' : 'text-muted-foreground'
                )} />
                <span className={cn(
                  'text-xs font-medium transition-colors',
                  aiEnabled ? 'text-teal' : 'text-muted-foreground'
                )}>
                  {aiEnabled ? 'AI On' : 'AI'}
                </span>
                {/* Toggle Switch */}
                <div className={cn(
                  'relative w-8 h-4 rounded-full transition-colors duration-300',
                  aiEnabled ? 'bg-teal' : 'bg-muted-foreground/30'
                )}>
                  <motion.div
                    className="absolute top-0.5 w-3 h-3 rounded-full bg-card shadow-sm dark:bg-foreground"
                    animate={{ left: aiEnabled ? '18px' : '2px' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </div>
              </button>
            </motion.div>

            {/* Theme Toggle */}
            {mounted && (
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="h-8 w-8" aria-label="Toggle theme">
                  <AnimatePresence mode="wait">
                    {theme === 'dark' ? (
                      <motion.div
                        key="sun"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Sun className="h-4 w-4" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="moon"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Moon className="h-4 w-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            )}

            </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto px-2 py-3 sm:px-3 sm:py-4 lg:px-4 lg:py-5 bg-background">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
