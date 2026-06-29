// ════════════════════════════════════════════════════════════════════════════
// PIP Audit Store — single source of truth for all audit schedules
// Extends AuditSchedule with full 5W+H metadata and lifecycle trail
// ════════════════════════════════════════════════════════════════════════════
import * as React from 'react'
import {
  CONTROLS_AUDIT_SCHEDULES,
  RISK_AUDIT_SCHEDULES,
  COMPLIANCE_AUDIT_SCHEDULES,
  PROJECTS,
  USERS,
  CONTROLS,
  RISK_ITEMS,
  COMPLIANCE_ITEMS,
  type AuditSchedule,
  type AuditType,
} from '@/lib/governance-data'

// ── Rich metadata added on top of base AuditSchedule ─────────────────────

export type LifecycleStage =
  | 'Draft'
  | 'Requested'
  | 'Approved'
  | 'Scheduled'
  | 'In Progress'
  | 'Completed'
  | 'Paused'
  | 'Cancelled'

export type TrailAction =
  | 'Created'
  | 'Requested by'
  | 'Approved by'
  | 'Scope updated'
  | 'Auditor assigned'
  | 'Status changed'
  | 'Schedule updated'
  | 'Comment added'

export interface TrailEntry {
  id: string
  action: TrailAction
  actor: string
  actorInitials: string
  actorRole: string
  ts: string          // ISO timestamp
  detail?: string
}

export interface Comment {
  id: string
  author: string
  authorInitials: string
  authorRole: string
  ts: string
  text: string
}

export interface RichAuditSchedule extends AuditSchedule {
  // WHO
  createdById: string
  createdByName: string
  createdByRole: string
  requestedById: string
  requestedByName: string
  requestedByRole: string
  approvedById: string
  approvedByName: string
  approvedByRole: string
  // WHY / WHAT
  purpose: string           // Why this audit was created
  sourceModule: string      // Where the requirement came from (e.g. "SOX Compliance", "Risk Register")
  regulatoryRef: string     // e.g. "SOX §302", "OSHA 29 CFR 1926.20"
  // WHEN
  createdAt: string         // ISO
  updatedAt: string         // ISO
  // WHERE / HOW
  scopeDescription: string  // Human-readable scope summary
  lifecycle: LifecycleStage
  // TRAIL & COMMENTS
  trail: TrailEntry[]
  comments: Comment[]
}

// ── localStorage key ────────────────────────────────────────────────────────
const LS_KEY = 'pip_audit_schedules_v2'

// ── Static seed enrichment ─────────────────────────────────────────────────
// Adds rich 5W+H metadata to the static seed data so it appears
// with full detail in the Hub just like user-created records.

const CONTROLS_ENRICHMENT: Record<string, Partial<RichAuditSchedule>> = {
  'AS-001': {
    purpose: 'Verify that PO approval authority limits are not exceeded and segregation of duties is maintained across financial transactions for Henderson and Pryor Creek projects.',
    sourceModule: 'Financial Controls Framework — COSO',
    regulatoryRef: 'COSO Principle 10 — Control Activities',
    createdById: 'USR-001', createdByName: 'Brian Smith', createdByRole: 'Portfolio Director',
    requestedById: 'USR-002', requestedByName: 'Anu Reddy', requestedByRole: 'Senior Director',
    approvedById: 'USR-001', approvedByName: 'Brian Smith', approvedByRole: 'Portfolio Director',
    scopeDescription: '4 financial controls across 2 projects — Henderson Substation & Pryor Creek. Validates PO limits, SoD, change order reviews.',
    lifecycle: 'Scheduled',
    createdAt: '2026-01-01T09:00:00Z', updatedAt: '2026-06-01T09:00:00Z',
  },
  'AS-002': {
    purpose: 'Quarterly SOX attestation across all 8 projects to confirm that SoD and data integrity controls meet the SOX §302 officer certification requirements.',
    sourceModule: 'SOX Compliance Program',
    regulatoryRef: 'SOX §302 — Corporate Responsibility for Financial Reports',
    createdById: 'USR-001', createdByName: 'Brian Smith', createdByRole: 'Portfolio Director',
    requestedById: 'USR-002', requestedByName: 'Anu Reddy', requestedByRole: 'Senior Director',
    approvedById: 'USR-001', approvedByName: 'Brian Smith', approvedByRole: 'Portfolio Director',
    scopeDescription: '2 SOX-critical controls (SoD, spend tracking) across all 8 portfolio projects on a quarterly cadence.',
    lifecycle: 'Scheduled',
    createdAt: '2026-01-01T08:00:00Z', updatedAt: '2026-04-30T08:00:00Z',
  },
  'AS-003': {
    purpose: 'Monthly validation of procurement controls — vendor invoice matching and change order cost review — to prevent procurement fraud and budget overruns at NA-West sites.',
    sourceModule: 'Procurement Controls — COSO',
    regulatoryRef: 'COSO Principle 12 — Deploy through Policies',
    createdById: 'USR-003', createdByName: 'Hasit Chetal', createdByRole: 'Portfolio Controls Lead',
    requestedById: 'USR-001', requestedByName: 'Brian Smith', requestedByRole: 'Portfolio Director',
    approvedById: 'USR-001', approvedByName: 'Brian Smith', approvedByRole: 'Portfolio Director',
    scopeDescription: '2 procurement controls across Mesa Power, Dallas Cooling, and Council Bluffs sites.',
    lifecycle: 'Scheduled',
    createdAt: '2026-01-01T10:00:00Z', updatedAt: '2026-06-10T10:00:00Z',
  },
  'AS-004': {
    purpose: 'Quarterly review of permit & compliance controls at active construction sites to prevent regulatory violations and ensure contractor safety compliance.',
    sourceModule: 'Construction Compliance — OSHA / Contractual',
    regulatoryRef: 'OSHA 29 CFR 1926.20 — General Safety & Health Provisions',
    createdById: 'USR-003', createdByName: 'Hasit Chetal', createdByRole: 'Portfolio Controls Lead',
    requestedById: 'USR-008', requestedByName: 'Lena Ortiz', requestedByRole: 'Contractor Compliance Reviewer',
    approvedById: 'USR-001', approvedByName: 'Brian Smith', approvedByRole: 'Portfolio Director',
    scopeDescription: '3 compliance controls (permits, COI, SWPPPs) across Henderson Substation & Mesa Power construction sites.',
    lifecycle: 'Scheduled',
    createdAt: '2026-01-01T09:00:00Z', updatedAt: '2026-04-01T09:00:00Z',
  },
  'AS-005': {
    purpose: 'Monthly IT/Cyber controls review to validate data centre security controls and ensure cyber risk posture meets ISO 27001 and NIST CSF requirements.',
    sourceModule: 'Cyber/IT Security Framework — ISO 27001 / NIST CSF',
    regulatoryRef: 'ISO 27001:2022 — A.8.15 Logging; NIST CSF ID.AM-3',
    createdById: 'USR-003', createdByName: 'Hasit Chetal', createdByRole: 'Portfolio Controls Lead',
    requestedById: 'USR-002', requestedByName: 'Anu Reddy', requestedByRole: 'Senior Director',
    approvedById: 'USR-001', approvedByName: 'Brian Smith', approvedByRole: 'Portfolio Director',
    scopeDescription: '2 IT/Cyber controls across Atlanta DC-3 and Ashburn Pod 6 data centres.',
    lifecycle: 'Scheduled',
    createdAt: '2026-01-01T14:00:00Z', updatedAt: '2026-06-01T14:00:00Z',
  },
  'AS-006': {
    purpose: 'Semi-annual environmental controls review to validate EPA stormwater (SWPPP) and water use controls at NA-West industrial sites.',
    sourceModule: 'Environmental Compliance — EPA',
    regulatoryRef: 'EPA NPDES — Construction General Permit (CGP)',
    createdById: 'USR-003', createdByName: 'Hasit Chetal', createdByRole: 'Portfolio Controls Lead',
    requestedById: 'USR-006', requestedByName: 'Sreya Mukherjee', requestedByRole: 'Risk Owner',
    approvedById: 'USR-001', approvedByName: 'Brian Smith', approvedByRole: 'Portfolio Director',
    scopeDescription: '2 environmental controls (SWPPP, water management) across Mesa Power and Dallas Cooling.',
    lifecycle: 'Scheduled',
    createdAt: '2026-01-01T09:00:00Z', updatedAt: '2026-01-01T09:00:00Z',
  },
}

const RISK_ENRICHMENT: Record<string, Partial<RichAuditSchedule>> = {
  'AS-101': {
    purpose: 'Quarterly review of the full risk register to ensure all high and critical risks are monitored, mitigated, and have assigned owners with current evidence.',
    sourceModule: 'Risk Register — Enterprise Risk Management',
    regulatoryRef: 'COSO ERM — Principle 9: Identifies Risk',
    createdById: 'USR-001', createdByName: 'Brian Smith', createdByRole: 'Portfolio Director',
    requestedById: 'USR-002', requestedByName: 'Anu Reddy', requestedByRole: 'Senior Director',
    approvedById: 'USR-001', approvedByName: 'Brian Smith', approvedByRole: 'Portfolio Director',
    scopeDescription: '7 risk items tracked across 1 project — Quarterly cadence. Verifies risk scores, mitigation status, and owner accountability.',
    lifecycle: 'Scheduled',
    createdAt: '2026-01-01T09:00:00Z', updatedAt: '2026-07-01T09:00:00Z',
  },
  'AS-102': {
    purpose: 'Monthly critical risk flash review for Mesa projects — ensures immediate escalation of any risk that has breached its trigger threshold.',
    sourceModule: 'Risk Register — Critical Watch List',
    regulatoryRef: 'Internal Risk Policy — Section 4.2 (Critical Risk Escalation)',
    createdById: 'USR-003', createdByName: 'Hasit Chetal', createdByRole: 'Portfolio Controls Lead',
    requestedById: 'USR-001', requestedByName: 'Brian Smith', requestedByRole: 'Portfolio Director',
    approvedById: 'USR-001', approvedByName: 'Brian Smith', approvedByRole: 'Portfolio Director',
    scopeDescription: '3 critical-rated risk items at Mesa Power. Validates trigger conditions and escalation paths monthly.',
    lifecycle: 'Scheduled',
    createdAt: '2026-01-05T09:00:00Z', updatedAt: '2026-06-30T09:00:00Z',
  },
  'AS-103': {
    purpose: 'Quarterly review of supply chain and environmental risk controls to identify emerging operational and regulatory exposure across NA-West sites.',
    sourceModule: 'Supply Chain Risk — Operational & Environmental',
    regulatoryRef: 'EPA Stormwater General Permit; Contractual SLA obligations',
    createdById: 'USR-006', createdByName: 'Sreya Mukherjee', createdByRole: 'Risk Owner',
    requestedById: 'USR-001', requestedByName: 'Brian Smith', requestedByRole: 'Portfolio Director',
    approvedById: 'USR-001', approvedByName: 'Brian Smith', approvedByRole: 'Portfolio Director',
    scopeDescription: '3 supply chain and environmental risk items across 2 NA-West projects.',
    lifecycle: 'Scheduled',
    createdAt: '2026-01-10T09:00:00Z', updatedAt: '2026-07-01T09:00:00Z',
  },
  'AS-104': {
    purpose: 'Monthly IT & Safety risk review to verify cyber threat risk scores and OSHA safety risks remain within acceptable tolerance at data-centre and construction sites.',
    sourceModule: 'IT & Safety Risk Register',
    regulatoryRef: 'NIST CSF; OSHA 29 CFR 1910',
    createdById: 'USR-003', createdByName: 'Hasit Chetal', createdByRole: 'Portfolio Controls Lead',
    requestedById: 'USR-002', requestedByName: 'Anu Reddy', requestedByRole: 'Senior Director',
    approvedById: 'USR-001', approvedByName: 'Brian Smith', approvedByRole: 'Portfolio Director',
    scopeDescription: '2 IT/Safety risk items. Validates current scores, owners, and mitigation plans monthly.',
    lifecycle: 'Scheduled',
    createdAt: '2026-01-10T09:00:00Z', updatedAt: '2026-07-01T09:00:00Z',
  },
  'AS-105': {
    purpose: 'Weekly critical risk watchlist — real-time monitoring of the top 5 portfolio risks to ensure no risk deteriorates without immediate escalation.',
    sourceModule: 'Executive Risk Watchlist — Portfolio Intelligence Platform',
    regulatoryRef: 'Internal — Board-level risk reporting obligation',
    createdById: 'USR-001', createdByName: 'Brian Smith', createdByRole: 'Portfolio Director',
    requestedById: 'USR-001', requestedByName: 'Brian Smith', requestedByRole: 'Portfolio Director',
    approvedById: 'USR-001', approvedByName: 'Brian Smith', approvedByRole: 'Portfolio Director',
    scopeDescription: '5 top-priority portfolio risks across 8 projects. Weekly verification of score, owner activity, and escalation status.',
    lifecycle: 'Scheduled',
    createdAt: '2026-01-01T07:00:00Z', updatedAt: '2026-06-27T07:00:00Z',
  },
}

const COMPLIANCE_ENRICHMENT: Record<string, Partial<RichAuditSchedule>> = {
  'AS-201': {
    purpose: 'Quarterly review of all contractual insurance certificates to ensure COIs are current, cover thresholds are met, and no contractor is operating without valid coverage.',
    sourceModule: 'Contractor Compliance — Insurance Management',
    regulatoryRef: 'Master Service Agreement §8 — Insurance Requirements',
    createdById: 'USR-008', createdByName: 'Lena Ortiz', createdByRole: 'Contractor Compliance Reviewer',
    requestedById: 'USR-001', requestedByName: 'Brian Smith', requestedByRole: 'Portfolio Director',
    approvedById: 'USR-001', approvedByName: 'Brian Smith', approvedByRole: 'Portfolio Director',
    scopeDescription: '3 COI compliance items (General Liability, Workers Compensation, Commercial Auto) across all active construction projects.',
    lifecycle: 'Scheduled',
    createdAt: '2026-01-01T09:00:00Z', updatedAt: '2026-07-01T09:00:00Z',
  },
  'AS-202': {
    purpose: 'Bi-annual review of active construction permits and local regulatory approvals to prevent work stoppages and regulatory violations.',
    sourceModule: 'Construction Permit Register — AHJ Compliance',
    regulatoryRef: 'Local AHJ Permit Requirements; OSHA 29 CFR 1926',
    createdById: 'USR-008', createdByName: 'Lena Ortiz', createdByRole: 'Contractor Compliance Reviewer',
    requestedById: 'USR-003', requestedByName: 'Hasit Chetal', requestedByRole: 'Portfolio Controls Lead',
    approvedById: 'USR-001', approvedByName: 'Brian Smith', approvedByRole: 'Portfolio Director',
    scopeDescription: '2 permit compliance items across Mesa Power and Henderson Substation active construction sites.',
    lifecycle: 'Scheduled',
    createdAt: '2026-01-05T09:00:00Z', updatedAt: '2026-07-01T09:00:00Z',
  },
  'AS-203': {
    purpose: 'Monthly OSHA 300 log review to ensure safety incidents are recorded, classified, and reported within required timeframes.',
    sourceModule: 'Safety Compliance — OSHA Recordkeeping',
    regulatoryRef: 'OSHA 29 CFR 1904 — Recording and Reporting Occupational Injuries and Illnesses',
    createdById: 'USR-003', createdByName: 'Hasit Chetal', createdByRole: 'Portfolio Controls Lead',
    requestedById: 'USR-008', requestedByName: 'Lena Ortiz', requestedByRole: 'Contractor Compliance Reviewer',
    approvedById: 'USR-001', approvedByName: 'Brian Smith', approvedByRole: 'Portfolio Director',
    scopeDescription: '1 OSHA 300 log compliance item. Monthly verification that all recordable incidents are logged within 7 days.',
    lifecycle: 'Scheduled',
    createdAt: '2026-01-10T09:00:00Z', updatedAt: '2026-07-01T09:00:00Z',
  },
  'AS-204': {
    purpose: 'Monthly SOX internal controls evidence package review to validate that all supporting documentation is complete for officer certification.',
    sourceModule: 'SOX Compliance — Controls Evidence Management',
    regulatoryRef: 'SOX §302 and §404 — Management Assessment of Internal Controls',
    createdById: 'USR-001', createdByName: 'Brian Smith', createdByRole: 'Portfolio Director',
    requestedById: 'USR-002', requestedByName: 'Anu Reddy', requestedByRole: 'Senior Director',
    approvedById: 'USR-001', approvedByName: 'Brian Smith', approvedByRole: 'Portfolio Director',
    scopeDescription: '1 SOX evidence package. Validates completeness and sign-off chain of all quarterly attestation documents.',
    lifecycle: 'Scheduled',
    createdAt: '2026-01-01T09:00:00Z', updatedAt: '2026-07-01T09:00:00Z',
  },
  'AS-205': {
    purpose: 'Annual review of the Utility Interconnect Agreement at Henderson Substation to ensure all regulatory and contractual milestones are tracked and met.',
    sourceModule: 'Contractual Compliance — Utility Agreements',
    regulatoryRef: 'FERC Order 2003 — Interconnection Procedures',
    createdById: 'USR-003', createdByName: 'Hasit Chetal', createdByRole: 'Portfolio Controls Lead',
    requestedById: 'USR-001', requestedByName: 'Brian Smith', requestedByRole: 'Portfolio Director',
    approvedById: 'USR-001', approvedByName: 'Brian Smith', approvedByRole: 'Portfolio Director',
    scopeDescription: '1 Utility Interconnect Agreement milestone tracker for Henderson Substation.',
    lifecycle: 'Scheduled',
    createdAt: '2026-01-01T09:00:00Z', updatedAt: '2026-01-01T09:00:00Z',
  },
}

// ── Enrichment helper ───────────────────────────────────────────────────────
function buildTrail(base: Partial<RichAuditSchedule>, id: string): TrailEntry[] {
  const entries: TrailEntry[] = []
  if (base.createdById && base.createdByName && base.createdAt) {
    entries.push({
      id: `${id}-T1`,
      action: 'Created',
      actor: base.createdByName,
      actorInitials: USERS.find(u => u.id === base.createdById)?.initials ?? base.createdByName.slice(0, 2).toUpperCase(),
      actorRole: base.createdByRole ?? '',
      ts: base.createdAt,
      detail: 'Schedule created and saved to audit register.',
    })
  }
  if (base.requestedById && base.requestedByName) {
    entries.push({
      id: `${id}-T2`,
      action: 'Requested by',
      actor: base.requestedByName,
      actorInitials: USERS.find(u => u.id === base.requestedById)?.initials ?? base.requestedByName.slice(0, 2).toUpperCase(),
      actorRole: base.requestedByRole ?? '',
      ts: base.createdAt ?? new Date().toISOString(),
      detail: 'Audit requirement raised and schedule requested.',
    })
  }
  if (base.approvedById && base.approvedByName) {
    entries.push({
      id: `${id}-T3`,
      action: 'Approved by',
      actor: base.approvedByName,
      actorInitials: USERS.find(u => u.id === base.approvedById)?.initials ?? base.approvedByName.slice(0, 2).toUpperCase(),
      actorRole: base.approvedByRole ?? '',
      ts: base.createdAt ?? new Date().toISOString(),
      detail: 'Schedule approved and set to Active status.',
    })
  }
  return entries
}

function enrich(
  base: AuditSchedule,
  extra: Partial<RichAuditSchedule>,
): RichAuditSchedule {
  return {
    ...base,
    createdById: extra.createdById ?? 'USR-001',
    createdByName: extra.createdByName ?? 'Brian Smith',
    createdByRole: extra.createdByRole ?? 'Portfolio Director',
    requestedById: extra.requestedById ?? 'USR-001',
    requestedByName: extra.requestedByName ?? 'Brian Smith',
    requestedByRole: extra.requestedByRole ?? 'Portfolio Director',
    approvedById: extra.approvedById ?? 'USR-001',
    approvedByName: extra.approvedByName ?? 'Brian Smith',
    approvedByRole: extra.approvedByRole ?? 'Portfolio Director',
    purpose: extra.purpose ?? '',
    sourceModule: extra.sourceModule ?? '',
    regulatoryRef: extra.regulatoryRef ?? '',
    createdAt: extra.createdAt ?? '2026-01-01T09:00:00Z',
    updatedAt: extra.updatedAt ?? extra.createdAt ?? '2026-01-01T09:00:00Z',
    scopeDescription: extra.scopeDescription ?? '',
    lifecycle: extra.lifecycle ?? 'Scheduled',
    trail: buildTrail(extra, base.id),
    comments: [],
  }
}

// ── Enriched static seed datasets ──────────────────────────────────────────
export const RICH_CONTROLS_SCHEDULES: RichAuditSchedule[] =
  CONTROLS_AUDIT_SCHEDULES.map(s => enrich(s, CONTROLS_ENRICHMENT[s.id] ?? {}))

export const RICH_RISK_SCHEDULES: RichAuditSchedule[] =
  RISK_AUDIT_SCHEDULES.map(s => enrich(s, RISK_ENRICHMENT[s.id] ?? {}))

export const RICH_COMPLIANCE_SCHEDULES: RichAuditSchedule[] =
  COMPLIANCE_AUDIT_SCHEDULES.map(s => enrich(s, COMPLIANCE_ENRICHMENT[s.id] ?? {}))

export const ALL_STATIC_SCHEDULES: RichAuditSchedule[] = [
  ...RICH_CONTROLS_SCHEDULES,
  ...RICH_RISK_SCHEDULES,
  ...RICH_COMPLIANCE_SCHEDULES,
]

// ── localStorage CRUD ───────────────────────────────────────────────────────
export function loadUserSchedules(): RichAuditSchedule[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]') as RichAuditSchedule[]
  } catch {
    return []
  }
}

export function saveNewSchedule(s: RichAuditSchedule): void {
  const existing = loadUserSchedules()
  localStorage.setItem(LS_KEY, JSON.stringify([...existing, s]))
}

export function updateSchedule(id: string, patch: Partial<RichAuditSchedule>): void {
  const existing = loadUserSchedules()
  const updated = existing.map(s => s.id === id ? { ...s, ...patch, updatedAt: new Date().toISOString() } : s)
  localStorage.setItem(LS_KEY, JSON.stringify(updated))
}

export function deleteSchedule(id: string): void {
  const existing = loadUserSchedules()
  localStorage.setItem(LS_KEY, JSON.stringify(existing.filter(s => s.id !== id)))
}

export function addComment(id: string, comment: Comment): void {
  const existing = loadUserSchedules()
  const updated = existing.map(s =>
    s.id === id
      ? { ...s, comments: [...(s.comments ?? []), comment], updatedAt: new Date().toISOString() }
      : s,
  )
  localStorage.setItem(LS_KEY, JSON.stringify(updated))
}

export function addTrailEntry(id: string, entry: TrailEntry): void {
  const existing = loadUserSchedules()
  const updated = existing.map(s =>
    s.id === id
      ? { ...s, trail: [...(s.trail ?? []), entry], updatedAt: new Date().toISOString() }
      : s,
  )
  localStorage.setItem(LS_KEY, JSON.stringify(updated))
}

// ── React hook ──────────────────────────────────────────────────────────────
// Merges static enriched seeds with localStorage user records.
// Re-reads on storage events so the Hub updates in real time
// when a form in another tab saves a new schedule.

export function useAuditStore() {
  const [userSchedules, setUserSchedules] = React.useState<RichAuditSchedule[]>([])

  const reload = React.useCallback(() => {
    setUserSchedules(loadUserSchedules())
  }, [])

  React.useEffect(() => {
    reload()
    const handler = (e: StorageEvent) => {
      if (e.key === LS_KEY) reload()
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [reload])

  const allSchedules = React.useMemo(
    () => [...ALL_STATIC_SCHEDULES, ...userSchedules],
    [userSchedules],
  )

  return { allSchedules, userSchedules, reload }
}

// ── ID generator ────────────────────────────────────────────────────────────
export function generateScheduleId(type: AuditType): string {
  const existing = loadUserSchedules()
  const typePrefix = type === 'controls' ? '' : type === 'risk' ? '1' : '2'
  const base = type === 'controls' ? 7 : type === 'risk' ? 106 : 206
  const userOfType = existing.filter(s => s.type === type).length
  const num = base + userOfType
  return `AS-${String(num).padStart(3, '0')}`
}

// ── Scope item label helpers ────────────────────────────────────────────────
export function getScopeItemLabels(type: AuditType, ids: string[]): string[] {
  if (type === 'controls') {
    return ids.map(id => CONTROLS.find(c => c.id === id)?.name ?? id)
  }
  if (type === 'risk') {
    return ids.map(id => RISK_ITEMS.find(r => r.id === id)?.title ?? id)
  }
  return ids.map(id => COMPLIANCE_ITEMS.find(c => c.id === id)?.requirement ?? id)
}

export function getProjectNames(projectIds: string[]): string[] {
  return projectIds.map(id => PROJECTS.find(p => p.id === id)?.name ?? id)
}
