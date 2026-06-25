'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { KPICard } from '@/components/kpi-card'
import { PortfolioHeatmap } from '@/components/portfolio-heatmap'
import { SLAPanels } from '@/components/sla-panels'
import { KeyPersonRiskPanel, AwaitingApprovalPanel } from '@/components/bottom-panels'
import { KPIDrillDownModal } from '@/components/kpi-drill-down-modal'
import { VarianceContextCard, SupplierPerformanceModule } from '@/components/director-enhancements'

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
}

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const
    }
  }
}

// 13-week sparkline data (declining trend for CPI/SPI)
const cpiSparkline = [0.99, 0.98, 0.98, 0.97, 0.97, 0.96, 0.96, 0.96, 0.95, 0.95, 0.95, 0.94, 0.94]
const spiSparkline = [0.95, 0.94, 0.94, 0.93, 0.93, 0.92, 0.91, 0.91, 0.90, 0.90, 0.89, 0.89, 0.89]
const eacSparkline = [28, 30, 31, 33, 34, 35, 37, 38, 39, 40, 41, 42, 43]

export default function DirectorCommandView() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedKPI, setSelectedKPI] = useState('Portfolio CPI')

  const openKPIModal = (kpiLabel: string) => {
    setSelectedKPI(kpiLabel)
    setModalOpen(true)
  }

  return (
    <AppShell
      title="Director Command View"
      subtitle="Portfolio at a glance — Is the portfolio on track?"
    >
      <motion.div 
        className="space-y-8 w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ─── REGION 1: Top-line KPI Strip ─── */}
        <motion.section variants={sectionVariants}>
          <div className="flex items-center justify-between mb-5">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="w-1 h-8 rounded-full bg-gradient-to-b from-gold via-gold/70 to-gold/30" />
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-foreground">
                  Portfolio Health
                </h3>
                <p className="text-[10px] text-muted-foreground/60">
                  Source: kpi_earned_value from Cortex semantic layer
                </p>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <KPICard
              label="Portfolio CPI"
              value="0.94"
              delta="0.02 vs last week"
              trend="down"
              sparklineData={cpiSparkline}
              accentColor="amber"
              source="Cortex / kpi_earned_value"
              onClick={() => openKPIModal('Portfolio CPI')}
              index={0}
            />
            <KPICard
              label="Portfolio SPI"
              value="0.89"
              delta="0.02 vs last week"
              trend="down"
              sparklineData={spiSparkline}
              accentColor="amber"
              source="Cortex / kpi_earned_value"
              onClick={() => openKPIModal('Portfolio SPI')}
              index={1}
            />
            <KPICard
              label="EAC vs BAC"
              value="+$43M"
              delta="4.7% over budget"
              trend="up"
              sparklineData={eacSparkline}
              accentColor="red"
              source="Cortex / kpi_earned_value"
              onClick={() => openKPIModal('EAC vs BAC')}
              index={2}
            />
            <KPICard
              label="P1 Risks Open"
              value="9"
              delta="2 vs last week"
              trend="up"
              accentColor="red"
              source="Risk Register"
              onClick={() => openKPIModal('P1 Risks Open')}
              index={3}
            />
            <KPICard
              label="Predicted SLA Risks (72h)"
              value="5"
              delta="next 72 hours"
              trend="flat"
              accentColor="amber"
              source="Orchestration Engine ML"
              onClick={() => openKPIModal('Predicted SLA Risks (72h)')}
              index={4}
            />
          </div>
        </motion.section>

        {/* ─── REGION 2: Variance Context - Data vs Human ─── */}
        <motion.section variants={sectionVariants}>
          <VarianceContextCard />
        </motion.section>

        {/* ─── REGION 3: Portfolio Heatmap ─── */}
        <motion.section variants={sectionVariants}>
          <PortfolioHeatmap />
        </motion.section>

        {/* ─── REGION 4: Supplier Performance - Top of Mind ─── */}
        <motion.section variants={sectionVariants}>
          <SupplierPerformanceModule />
        </motion.section>

        {/* ─── REGION 5: Past SLA & Predicted SLA Risk Panel ─── */}
        <motion.section variants={sectionVariants}>
          <SLAPanels />
        </motion.section>

        {/* ─── REGION 6: Two-panel split row ─── */}
        <motion.section 
          variants={sectionVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <KeyPersonRiskPanel />
          <AwaitingApprovalPanel />
        </motion.section>
      </motion.div>

      {/* KPI Drill-Down Modal */}
      <KPIDrillDownModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        kpiLabel={selectedKPI}
      />
    </AppShell>
  )
}
