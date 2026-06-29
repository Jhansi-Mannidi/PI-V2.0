'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import {
  LayoutGrid,
  Activity,
  Table2,
  KanbanSquare,
  ClipboardCheck,
  TrendingDown,
  Plus,
} from 'lucide-react'
import { ExposureBanner } from '@/components/risk/exposure-banner'
import { RiskHeatmap } from '@/components/risk/risk-heatmap'
import { DiscoveryFeed } from '@/components/risk/discovery-feed'
import { RiskRegister } from '@/components/risk/risk-register'
import { IssueBoard } from '@/components/risk/issue-board'
import { AuditConsole } from '@/components/risk/audit-console'
import { ImpactExplorer } from '@/components/risk/impact-explorer'
import { RiskHorizonContent } from '@/components/risk/risk-horizon-content'
import { RiskCaptureForm } from '@/components/risk/risk-capture-form'
import { useAI } from '@/components/ai-provider'

const ease = [0.25, 0.46, 0.45, 0.94] as const

type TabId = 'overview' | 'horizon' | 'register' | 'issues' | 'audits' | 'impact'

const TABS: { id: TabId; label: string; icon: typeof LayoutGrid }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'horizon', label: 'Risk Horizon', icon: Activity },
  { id: 'register', label: 'Risk Register', icon: Table2 },
  { id: 'issues', label: 'Issue Board', icon: KanbanSquare },
  { id: 'audits', label: 'Audit Console', icon: ClipboardCheck },
  { id: 'impact', label: 'Impact Explorer', icon: TrendingDown },
]

export default function RiskManagementPage() {
  const { aiEnabled } = useAI()
  const [tab, setTab] = useState<TabId>('overview')
  const [showCaptureDrawer, setShowCaptureDrawer] = useState(false)
  const [registerProgram, setRegisterProgram] = useState<string | null>(null)
  const [registerCategory, setRegisterCategory] = useState<string | null>(null)

  const goRegister = (program?: string, category?: string) => {
    setRegisterProgram(program ?? null)
    setRegisterCategory(category ?? null)
    setTab('register')
  }

  return (
    <AppShell
      title="Risk Management"
      subtitle="Discover, score, and govern risks, issues & audits across the portfolio"
      activeHref="/risk"
    >
      <div className="w-full space-y-5">
        {/* Tab bar + capture action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-1 overflow-x-auto rounded-lg border border-line bg-muted/40 p-1 no-scrollbar">
            {TABS.map((t) => {
              const Icon = t.icon
              const on = t.id === tab
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors ${
                    on ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              )
            })}
          </div>
          <Button 
            onClick={() => setShowCaptureDrawer(true)}
            size="sm" 
            className="gap-1.5 shrink-0 self-start bg-gold text-navy font-semibold"
          >
            <Plus className="h-3.5 w-3.5" />
            Capture Risk
          </Button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease }}
          >
            {tab === 'overview' && (
              <div className="space-y-5">
                <ExposureBanner />
                <RiskHeatmap onCellSelect={goRegister} />
                {aiEnabled && <DiscoveryFeed />}
              </div>
            )}
            {tab === 'horizon' && <RiskHorizonContent />}
            {tab === 'register' && (
              <RiskRegister
                initialProgram={registerProgram}
                initialCategory={registerCategory}
              />
            )}
            {tab === 'issues' && <IssueBoard />}
            {tab === 'audits' && <AuditConsole />}
            {tab === 'impact' && <ImpactExplorer />}
          </motion.div>
        </AnimatePresence>
      </div>

      <RiskCaptureForm open={showCaptureDrawer} onClose={() => setShowCaptureDrawer(false)} />
    </AppShell>
  )
}
