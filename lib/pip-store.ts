// ═══════════════════════════════════════════════════════════════════════════
// PIP Central Store — localStorage-backed, cross-screen reactive data layer
// All user actions write here; every page reads from here via usePIPStore().
// ═══════════════════════════════════════════════════════════════════════════

import { RISK_ENTITIES, computeScore, type RiskEntity, type RiskState, type ResponseStrategy } from './risk-data'
import { CONTROLS as GOV_CONTROLS, USERS, type Control } from './governance-data'
import { allOrchestrations, type Orchestration } from './orchestration-data'

// ── Activity event — every user action writes one of these ──────────────────
export type ActionKind =
  | 'RISK_CREATED' | 'RISK_UPDATED' | 'RISK_STATE_CHANGED' | 'RISK_RESPONSE_SET'
  | 'CONTROL_UPDATED' | 'CONTROL_TESTED' | 'CONTROL_OWNER_CHANGED'
  | 'SLA_BREACH_RESOLVED' | 'SLA_ESCALATED' | 'SLA_REASSIGNED'
  | 'AUDIT_SCHEDULED' | 'AUDIT_COMPLETED' | 'AUDIT_FINDING_ADDED'
  | 'MITIGATION_OPENED' | 'ESCALATION_SENT'

export interface ActivityEvent {
  id: string
  kind: ActionKind
  at: number           // unix ms
  actorId: string      // USERS id
  actorName: string
  actorRole: string
  entityId: string     // RSK-xxx / CTRL-xxx / SLA-xxx / AUD-xxx
  entityTitle: string
  detail: string
  affectedParties: string[]   // names / roles impacted
  previousValue?: string
  newValue?: string
}

// ── SLA breach record ───────────────────────────────────────────────────────
export interface SLABreachRecord {
  id: string
  slaId: string
  slaName: string
  project: string
  instance: string
  elapsed: string
  elapsedMs: number
  ownerId: string
  ownerName: string
  uploadedById: string
  uploadedByName: string
  reviewedById: string | null
  reviewedByName: string | null
  status: 'open' | 'escalated' | 'resolved'
  resolvedAt?: number
  notes: string
  affectedParties: string[]
}

// ── Control test run record ─────────────────────────────────────────────────
export interface ControlTestRun {
  id: string
  controlId: string
  controlTitle: string
  runAt: number
  testedById: string
  testedByName: string
  reviewedById: string | null
  reviewedByName: string | null
  result: 'PASS' | 'PARTIAL' | 'FAIL' | 'NOT_TESTED'
  score: number
  notes: string
  affectedRiskIds: string[]
  affectedParties: string[]
}

// ── Risk snapshot (mutable copy of RiskEntity with metadata) ────────────────
export interface RiskSnapshot extends RiskEntity {
  createdById: string
  createdByName: string
  lastModifiedById: string
  lastModifiedByName: string
  lastModifiedAt: number
  reviewedById: string | null
  reviewedByName: string | null
  affectedParties: string[]
  financialLossTimeline: FinancialLossPoint[]
}

export interface FinancialLossPoint {
  month: string          // e.g. "Jul 2026"
  expectedLoss: number   // $M cumulative if not mitigated
  mitigatedLoss: number  // $M with current mitigation
  probability: number    // 0–100
  driver: string         // what's causing this
}

// ── Store shape ─────────────────────────────────────────────────────────────
export interface PIPStoreState {
  risks: Record<string, RiskSnapshot>
  controls: Record<string, Control>
  slaBreaches: SLABreachRecord[]
  controlTestRuns: ControlTestRun[]
  activityLog: ActivityEvent[]
  lastUpdated: number
}

// ── Seed initial data from static sources ───────────────────────────────────
function buildInitialRiskSnapshot(e: RiskEntity): RiskSnapshot {
  // Build a deterministic 6-month financial loss timeline
  const months = ['Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026', 'Nov 2026', 'Dec 2026']
  const score = computeScore(e.drivers)
  const timeline: FinancialLossPoint[] = months.map((month, i) => {
    const growth = 1 + i * 0.08 * (score / 100)
    const mitFactor = e.response === 'Mitigate' ? 0.35 : e.response === 'Transfer' ? 0.5 : e.response === 'Avoid' ? 0.1 : 0.9
    return {
      month,
      expectedLoss: parseFloat((e.impactCost * growth).toFixed(2)),
      mitigatedLoss: parseFloat((e.impactCost * growth * mitFactor).toFixed(2)),
      probability: Math.min(100, e.probability * 20 - 5 + i * 2),
      driver: i === 0 ? e.category : i < 3 ? 'Schedule drift' : 'Compounding exposure',
    }
  })

  return {
    ...e,
    createdById: 'USR-006',
    createdByName: 'Sreya Mukherjee',
    lastModifiedById: 'USR-001',
    lastModifiedByName: 'Brian Smith',
    lastModifiedAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    reviewedById: 'USR-002',
    reviewedByName: 'Anu Reddy',
    affectedParties: [e.ownerRole, e.program, e.project],
    financialLossTimeline: timeline,
  }
}

function buildInitialState(): PIPStoreState {
  const risks: Record<string, RiskSnapshot> = {}
  for (const e of RISK_ENTITIES) {
    risks[e.id] = buildInitialRiskSnapshot(e)
  }

  const controls: Record<string, Control> = {}
  for (const c of GOV_CONTROLS) {
    controls[c.id] = { ...c }
  }

  // Seed some SLA breach records
  const slaBreaches: SLABreachRecord[] = [
    {
      id: 'BRE-001', slaId: 'SLA-001', slaName: 'RFI Response Time', project: 'Pryor Creek',
      instance: 'RFI-1188', elapsed: '4d 06h 12m', elapsedMs: 375720000,
      ownerId: 'USR-008', ownerName: 'Lena Ortiz',
      uploadedById: 'USR-004', uploadedByName: 'Sophia Lam',
      reviewedById: 'USR-003', reviewedByName: 'Hasit Chetal',
      status: 'open', notes: 'Auto-nudge sent 2h ago. Structural review pending.',
      affectedParties: ['Lena Ortiz', 'Hasit Chetal', 'NA-East Program Team'],
    },
    {
      id: 'BRE-002', slaId: 'SLA-001', slaName: 'RFI Response Time', project: 'Pryor Creek',
      instance: 'RFI-1192', elapsed: '3d 18h 44m', elapsedMs: 333840000,
      ownerId: 'USR-005', ownerName: 'Alice Cox',
      uploadedById: 'USR-004', uploadedByName: 'Sophia Lam',
      reviewedById: null, reviewedByName: null,
      status: 'escalated', notes: 'Escalation recommended by Agent A-200.',
      affectedParties: ['Alice Cox', 'NA-West Team'],
    },
    {
      id: 'BRE-003', slaId: 'SLA-004', slaName: 'Contractor Onboarding', project: 'Henderson',
      instance: 'ONB-0044', elapsed: '12d 08h 30m', elapsedMs: 1069800000,
      ownerId: 'USR-008', ownerName: 'Lena Ortiz',
      uploadedById: 'USR-007', uploadedByName: 'Daniel Cho',
      reviewedById: 'USR-002', reviewedByName: 'Anu Reddy',
      status: 'open', notes: 'Legal review flagged as bottleneck. Awaiting sign-off.',
      affectedParties: ['Lena Ortiz', 'Anu Reddy', 'Legal Team'],
    },
  ]

  // Seed control test runs
  const controlTestRuns: ControlTestRun[] = [
    {
      id: 'CTR-001', controlId: 'CTR-001', controlTitle: 'Budget Approval Authority Gate',
      runAt: Date.now() - 1000 * 60 * 30,
      testedById: 'USR-004', testedByName: 'Sophia Lam',
      reviewedById: 'USR-003', reviewedByName: 'Hasit Chetal',
      result: 'PASS', score: 97, notes: 'All thresholds within policy bounds.',
      affectedRiskIds: [], affectedParties: ['Sophia Lam', 'ODC Controls'],
    },
    {
      id: 'CTR-002', controlId: 'CTR-003', controlTitle: 'Permit Compliance Gate',
      runAt: Date.now() - 1000 * 60 * 60 * 38,
      testedById: 'USR-009', testedByName: 'Priya Nair',
      reviewedById: null, reviewedByName: null,
      result: 'FAIL', score: 38, notes: 'EMEA permit evidence missing for 3 of 5 projects.',
      affectedRiskIds: ['RSK-1837'], affectedParties: ['Priya Nair', 'FeP Compliance', 'EMEA Legal'],
    },
  ]

  // Seed activity log
  const activityLog: ActivityEvent[] = [
    {
      id: 'ACT-001', kind: 'RISK_STATE_CHANGED', at: Date.now() - 1000 * 60 * 60 * 3,
      actorId: 'USR-001', actorName: 'Brian Smith', actorRole: 'Portfolio Director',
      entityId: 'RSK-1837', entityTitle: 'STB AHJ sustainability requirement unresolved',
      detail: 'State changed from Mitigating to Escalated — needs leadership.',
      affectedParties: ['ELS Legal', 'EMEA Program Team', 'Anu Reddy'],
      previousValue: 'Mitigating', newValue: 'Escalated',
    },
    {
      id: 'ACT-002', kind: 'CONTROL_TESTED', at: Date.now() - 1000 * 60 * 30,
      actorId: 'USR-004', actorName: 'Sophia Lam', actorRole: 'Control Owner',
      entityId: 'CTRL-001', entityTitle: 'Budget Approval Authority Gate',
      detail: 'Auto-audit run completed. Result: PASS (score 97).',
      affectedParties: ['ODC Controls', 'NA-West Program'],
    },
    {
      id: 'ACT-003', kind: 'SLA_ESCALATED', at: Date.now() - 1000 * 60 * 60 * 2,
      actorId: 'USR-003', actorName: 'Hasit Chetal', actorRole: 'Portfolio Controls Lead',
      entityId: 'BRE-002', entityTitle: 'RFI-1192 SLA Breach',
      detail: 'Escalated to Senior Director. Agent A-200 recommended action.',
      affectedParties: ['Alice Cox', 'NA-West Team', 'Anu Reddy'],
    },
    {
      id: 'ACT-004', kind: 'RISK_RESPONSE_SET', at: Date.now() - 1000 * 60 * 60 * 24,
      actorId: 'USR-006', actorName: 'Sreya Mukherjee', actorRole: 'Risk Owner',
      entityId: 'RSK-1042', entityTitle: 'GC tender pricing above guardrail (VLB)',
      detail: 'Response strategy set to Mitigate. Mitigation task opened.',
      affectedParties: ['ODC Cost Controls', 'NA-West Team'],
      previousValue: undefined, newValue: 'Mitigate',
    },
  ]

  return {
    risks,
    controls,
    slaBreaches,
    controlTestRuns,
    activityLog,
    lastUpdated: Date.now(),
  }
}

// ── Storage key ──────────────────────────────────────────────────────────────
const STORAGE_KEY = 'pip_store_v3'

export function loadStore(): PIPStoreState {
  if (typeof window === 'undefined') return buildInitialState()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as PIPStoreState
      // Merge any new seed risks that aren't in stored state
      const initial = buildInitialState()
      for (const id of Object.keys(initial.risks)) {
        if (!parsed.risks[id]) parsed.risks[id] = initial.risks[id]
      }
      return parsed
    }
  } catch { /* ignore */ }
  return buildInitialState()
}

export function saveStore(state: PIPStoreState): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, lastUpdated: Date.now() }))
  } catch { /* ignore quota */ }
}

// ── Action helpers (pure functions — call saveStore after) ───────────────────

export function addActivity(
  state: PIPStoreState,
  event: Omit<ActivityEvent, 'id' | 'at'>,
): PIPStoreState {
  const id = `ACT-${Date.now()}`
  return {
    ...state,
    activityLog: [{ ...event, id, at: Date.now() }, ...state.activityLog].slice(0, 500),
    lastUpdated: Date.now(),
  }
}

export function updateRiskState(
  state: PIPStoreState,
  riskId: string,
  newState: RiskState,
  actorId: string,
  note: string,
): PIPStoreState {
  const risk = state.risks[riskId]
  if (!risk) return state
  const actor = USERS.find((u) => u.id === actorId) ?? USERS[0]
  const prevState = risk.state

  const updatedRisk: RiskSnapshot = {
    ...risk,
    state: newState,
    lastModifiedById: actorId,
    lastModifiedByName: actor.name,
    lastModifiedAt: Date.now(),
    events: [
      {
        type: newState === 'Escalated' ? 'ESCALATED' : newState === 'Materialised' ? 'MATERIALISED' : newState === 'Resolved' ? 'RESOLVED' : 'SIGNAL',
        at: 'just now',
        actor: actor.name,
        detail: note,
      },
      ...risk.events,
    ],
  }

  let next = { ...state, risks: { ...state.risks, [riskId]: updatedRisk } }
  next = addActivity(next, {
    kind: 'RISK_STATE_CHANGED',
    actorId, actorName: actor.name, actorRole: actor.role,
    entityId: riskId, entityTitle: risk.title,
    detail: note,
    affectedParties: risk.affectedParties,
    previousValue: prevState,
    newValue: newState,
  })
  return next
}

export function updateRiskResponse(
  state: PIPStoreState,
  riskId: string,
  response: ResponseStrategy,
  actorId: string,
): PIPStoreState {
  const risk = state.risks[riskId]
  if (!risk) return state
  const actor = USERS.find((u) => u.id === actorId) ?? USERS[0]

  const updatedRisk: RiskSnapshot = {
    ...risk,
    response,
    lastModifiedById: actorId,
    lastModifiedByName: actor.name,
    lastModifiedAt: Date.now(),
  }

  let next = { ...state, risks: { ...state.risks, [riskId]: updatedRisk } }
  next = addActivity(next, {
    kind: 'RISK_RESPONSE_SET',
    actorId, actorName: actor.name, actorRole: actor.role,
    entityId: riskId, entityTitle: risk.title,
    detail: `Response strategy set to ${response}.`,
    affectedParties: risk.affectedParties,
    newValue: response,
  })
  return next
}

export function resolveSLABreach(
  state: PIPStoreState,
  breachId: string,
  actorId: string,
  note: string,
): PIPStoreState {
  const breach = state.slaBreaches.find((b) => b.id === breachId)
  if (!breach) return state
  const actor = USERS.find((u) => u.id === actorId) ?? USERS[0]

  const updated = state.slaBreaches.map((b) =>
    b.id === breachId ? { ...b, status: 'resolved' as const, resolvedAt: Date.now(), notes: note } : b
  )

  let next = { ...state, slaBreaches: updated }
  next = addActivity(next, {
    kind: 'SLA_BREACH_RESOLVED',
    actorId, actorName: actor.name, actorRole: actor.role,
    entityId: breachId, entityTitle: `${breach.slaName} — ${breach.instance}`,
    detail: note,
    affectedParties: breach.affectedParties,
  })
  return next
}

export function recordControlTest(
  state: PIPStoreState,
  run: Omit<ControlTestRun, 'id' | 'runAt'>,
  actorId: string,
): PIPStoreState {
  const actor = USERS.find((u) => u.id === actorId) ?? USERS[0]
  const newRun: ControlTestRun = { ...run, id: `CTR-${Date.now()}`, runAt: Date.now() }

  // Update the control's last result
  const ctrl = state.controls[run.controlId]
  type ControlEff = 'Effective' | 'Partially Effective' | 'Ineffective' | 'Not Tested'
  const newEff: ControlEff = run.result === 'PASS' ? 'Effective' : run.result === 'PARTIAL' ? 'Partially Effective' : 'Ineffective'
  const updatedControls = ctrl
    ? { ...state.controls, [run.controlId]: { ...ctrl, effectiveness: newEff, lastTested: new Date().toISOString().split('T')[0] } as typeof ctrl }
    : state.controls

  let next = { ...state, controlTestRuns: [newRun, ...state.controlTestRuns], controls: updatedControls }
  next = addActivity(next, {
    kind: 'CONTROL_TESTED',
    actorId, actorName: actor.name, actorRole: actor.role,
    entityId: run.controlId, entityTitle: run.controlTitle,
    detail: `Test run: ${run.result}. Score: ${run.score}. ${run.notes}`,
    affectedParties: run.affectedParties,
    newValue: run.result,
  })
  return next
}
