// ─────────────────────────────────────────────────────────────
// Risk Management Module — central data layer
// Pi-PRD-RISK-001. Event-sourced entities, 0–100 scoring (§5.2),
// risk state machine (§5.3), four-archetype discovery (§4.1),
// portfolio/program heatmaps (§8.2), issues, audits, impact.
// ─────────────────────────────────────────────────────────────

export type Tier = 'Project' | 'Program' | 'Portfolio'
export type EntityKind = 'RISK' | 'ISSUE' | 'AUDIT'
export type RiskCategory =
  | 'Cost' | 'Schedule' | 'Scope' | 'Safety' | 'Supply-chain' | 'Legal' | 'Technical' | 'Resource' | 'External'
export type Archetype = 'Threshold' | 'Trend' | 'Correlation' | 'Absence'
export type Generator = 'Rules' | 'Agent A-305' | 'Manual'
export type ResponseStrategy = 'Mitigate' | 'Transfer' | 'Avoid' | 'Accept'

// §5.3 Risk state machine
export type RiskState =
  | 'Identified' | 'Assessed' | 'Mitigating' | 'Escalated' | 'Materialised' | 'Resolved' | 'Accepted'

export const RISK_STATES: { id: RiskState; meaning: string; trigger: string }[] = [
  { id: 'Identified', meaning: 'Raised, not yet scored', trigger: 'Manual submit or AI candidate surfaced' },
  { id: 'Assessed', meaning: 'Probability, impact & score set', trigger: 'Scoring complete (manual or auto)' },
  { id: 'Mitigating', meaning: 'Active response in flight', trigger: 'A response strategy with actions is chosen' },
  { id: 'Escalated', meaning: 'Raised a tier; needs leadership', trigger: 'Score ≥ 90, or owner escalates manually' },
  { id: 'Materialised', meaning: 'Became an issue', trigger: 'Owner marks materialised; kind → ISSUE' },
  { id: 'Resolved', meaning: 'Closed; impact avoided or absorbed', trigger: 'Corrective action complete + verified' },
  { id: 'Accepted', meaning: 'Consciously tolerated, monitored', trigger: 'Accept response chosen with rationale' },
]

// ── Score banding (§5.2) ──
export type ScoreBand = 'Low' | 'Elevated' | 'High' | 'Critical'
export function bandForScore(score: number): ScoreBand {
  if (score >= 90) return 'Critical'
  if (score >= 70) return 'High'
  if (score >= 40) return 'Elevated'
  return 'Low'
}
export const BAND_META: Record<ScoreBand, { label: string; text: string; bg: string; ring: string; cell: string }> = {
  Low: { label: 'Low', text: 'text-green', bg: 'bg-green-bg', ring: 'border-green/30', cell: 'bg-green/15 text-green' },
  Elevated: { label: 'Elevated', text: 'text-amber', bg: 'bg-amber-bg', ring: 'border-amber/30', cell: 'bg-amber/20 text-amber' },
  High: { label: 'High', text: 'text-red', bg: 'bg-red-bg', ring: 'border-red/30', cell: 'bg-red/20 text-red' },
  Critical: { label: 'Critical', text: 'text-red', bg: 'bg-red-bg', ring: 'border-red/50', cell: 'bg-red/35 text-red' },
}

// ── Score drivers (§5.2 weighted blend) ──
export interface ScoreDrivers {
  severity: number   // 0–100, from P×I matrix band
  financial: number  // 0–100, $ impact log-scaled
  velocity: number   // 0–100, how fast worsening
  proximity: number  // 0–100, nearness of target date
}
export const DRIVER_WEIGHTS = { severity: 0.45, financial: 0.30, velocity: 0.15, proximity: 0.10 } as const

export function computeScore(d: ScoreDrivers): number {
  const raw =
    d.severity * DRIVER_WEIGHTS.severity +
    d.financial * DRIVER_WEIGHTS.financial +
    d.velocity * DRIVER_WEIGHTS.velocity +
    d.proximity * DRIVER_WEIGHTS.proximity
  return Math.round(Math.max(0, Math.min(100, raw)))
}

// §5.1 5×5 probability × impact matrix → qualitative band
export const PI_MATRIX: ScoreBand[][] = [
  // impact:  1Insig    2Minor      3Moderate   4Major      5Severe
  ['Low', 'Low', 'Low', 'Elevated', 'Elevated'],          // 1 Rare
  ['Low', 'Low', 'Elevated', 'Elevated', 'High'],         // 2 Unlikely
  ['Low', 'Elevated', 'Elevated', 'High', 'High'],        // 3 Possible
  ['Low', 'Elevated', 'High', 'High', 'Critical'],        // 4 Likely
  ['Elevated', 'High', 'High', 'Critical', 'Critical'],   // 5 Almost certain
]

// ── Event log (§2 store events, derive conclusions) ──
export interface RiskEvent {
  type: 'RAISED' | 'SCORED' | 'MITIGATING' | 'ESCALATED' | 'MATERIALISED' | 'RESOLVED' | 'ACCEPTED' | 'SIGNAL'
  at: string            // relative label e.g. "4d ago"
  actor: string         // Service Role or agent
  detail: string
}

export interface RiskEntity {
  id: string
  kind: EntityKind
  tier: Tier
  title: string
  category: RiskCategory
  project: string       // campus code chip
  program: string       // NA-West / NA-East / EMEA / APAC
  description: string
  probability: 1 | 2 | 3 | 4 | 5
  impact: 1 | 2 | 3 | 4 | 5
  impactCost: number    // $M
  impactDays: number
  ownerRole: string     // Service Role, never an individual
  supportRequested: string
  mitigation: string
  targetDate: string
  parties: string[]
  state: RiskState
  archetype?: Archetype
  generator: Generator
  confidence?: number   // for discovered risks
  signals?: string[]    // corroborating signals
  reasoning?: string    // hash-chained reasoning trace
  drivers: ScoreDrivers
  events: RiskEvent[]
  response?: ResponseStrategy
  linkedAudit?: string
}

// helper to build an entity with derived score available via computeScore(drivers)
function e(entity: RiskEntity): RiskEntity { return entity }

export const RISK_ENTITIES: RiskEntity[] = [
  e({
    id: 'RSK-1042', kind: 'RISK', tier: 'Program', title: 'GC tender pricing above guardrail (VLB)',
    category: 'Cost', project: 'VLB', program: 'NA-West',
    description: 'General-contractor tender for VLB substation fitout is pricing 12% above the approved cost guardrail. Three of four bids exceed BAC envelope.',
    probability: 4, impact: 4, impactCost: 2.1, impactDays: 0,
    ownerRole: 'ODC Cost Controls', supportRequested: 'Procurement re-scope authority',
    mitigation: 'Re-level bids; value-engineer fitout scope; request budget variance review.',
    targetDate: '2026-07-15', parties: ['Mesa Power', 'LineSight'],
    state: 'Mitigating', generator: 'Rules', archetype: 'Threshold',
    drivers: { severity: 82, financial: 88, velocity: 70, proximity: 64 },
    events: [
      { type: 'RAISED', at: '9d ago', actor: 'A-211 Cashflow Detector', detail: 'CPI 0.86 < 0.90 guardrail on VLB fitout package' },
      { type: 'SCORED', at: '9d ago', actor: 'Scoring engine', detail: 'P4 × I4 → High band; financial weight elevated ($2.1M)' },
      { type: 'MITIGATING', at: '6d ago', actor: 'ODC Cost Controls', detail: 'Bid re-levelling task opened' },
      { type: 'SIGNAL', at: '2d ago', actor: 'kpi_earned_value', detail: 'EAC drift +$0.3M week-over-week' },
    ],
    response: 'Mitigate',
  }),
  e({
    id: 'RSK-1037', kind: 'RISK', tier: 'Program', title: 'STB AHJ sustainability requirement unresolved',
    category: 'Legal', project: 'STB', program: 'EMEA',
    description: 'Authority-having-jurisdiction sustainability clause for STB has no compliant design response on file; permit issuance at risk.',
    probability: 4, impact: 5, impactCost: 1.4, impactDays: 9,
    ownerRole: 'ELS Legal', supportRequested: 'AHJ liaison + sustainability consultant',
    mitigation: 'Engage AHJ; commission compliance gap assessment; prepare alternative design.',
    targetDate: '2026-07-02', parties: ['Acme Electrical'],
    state: 'Escalated', generator: 'Agent A-305', archetype: 'Absence', confidence: 91,
    signals: ['Permit milestone in 24d', 'No AHJ orchestration started', 'Sustainability clause flagged in 2 prior EMEA permits'],
    reasoning: 'A-305 detected an absence-archetype gap: STB permit gate is 24 days out, yet no AHJ-sustainability orchestration exists. Cross-referenced 2 prior EMEA permits where the same clause caused 9-day average slip. ≥3 corroborating signals; routed to escalation by $-impact threshold.',
    drivers: { severity: 90, financial: 78, velocity: 60, proximity: 86 },
    events: [
      { type: 'RAISED', at: '5d ago', actor: 'A-305 Discovery', detail: 'Absence: permit gate near, no AHJ orchestration' },
      { type: 'SCORED', at: '5d ago', actor: 'Scoring engine', detail: 'P4 × I5 → Critical-adjacent; proximity weight high' },
      { type: 'ESCALATED', at: '3d ago', actor: 'ELS Legal', detail: 'Raised to Program tier — needs leadership' },
    ],
    response: 'Mitigate', linkedAudit: 'AUD-204',
  }),
  e({
    id: 'RSK-1051', kind: 'RISK', tier: 'Program', title: 'Thailand LLE supply exposure (Mid-East conflict)',
    category: 'Supply-chain', project: 'SNG', program: 'APAC',
    description: 'Europe-sourced long-lead electrical on the SNG critical-path fitout intersects with Mid-East conflict shipping disruption.',
    probability: 4, impact: 4, impactCost: 0.7, impactDays: 6,
    ownerRole: 'FeP Procurement', supportRequested: 'Alternate sourcing approval',
    mitigation: 'Identify alternate APAC supplier; expedite in-transit units; buffer critical path.',
    targetDate: 'Ongoing', parties: ['Pacific Rim Logistics'],
    state: 'Assessed', generator: 'Agent A-305', archetype: 'Correlation', confidence: 84,
    signals: ['Mid-East conflict escalation', 'Europe-sourced LLE on SNG', 'Critical-path fitout dependency'],
    reasoning: 'A-305 correlation across 3 independent signals: geopolitical conflict index, LLE sourcing origin (EU), and critical-path dependency. Matches the Thailand register entry teams track manually — surfaced before a human wrote it.',
    drivers: { severity: 72, financial: 58, velocity: 78, proximity: 50 },
    events: [
      { type: 'RAISED', at: '7d ago', actor: 'A-305 Discovery', detail: 'Correlation: conflict + EU LLE + critical path' },
      { type: 'SCORED', at: '7d ago', actor: 'Scoring engine', detail: 'P4 × I4 → High; velocity weight rising' },
    ],
  }),
  e({
    id: 'RSK-1029', kind: 'RISK', tier: 'Program', title: 'Pryor Creek schedule slip — 3 weeks sustained',
    category: 'Schedule', project: 'PRY', program: 'NA-West',
    description: 'SPI down three weeks running on Pryor Creek; structural review backlog driving sustained schedule deterioration.',
    probability: 4, impact: 3, impactCost: 0.6, impactDays: 7,
    ownerRole: 'ODC Schedule', supportRequested: 'Dedicated structural reviewer',
    mitigation: 'Add reviewer capacity for 2 sprints; re-sequence non-critical work.',
    targetDate: '2026-06-30', parties: ['LineSight'],
    state: 'Mitigating', generator: 'Rules', archetype: 'Trend', confidence: 79,
    signals: ['SPI 0.88 → 0.84 → 0.81 (3 wk)', 'RFI aging p82', 'Reviewer load above p75'],
    reasoning: 'Rules + windowed state: 3 consecutive periods of SPI decline crossed the trend threshold. Schedule-slip risk auto-raised with the worsening trajectory captured in the event log.',
    drivers: { severity: 64, financial: 52, velocity: 80, proximity: 66 },
    events: [
      { type: 'RAISED', at: '14d ago', actor: 'A-202 Bottleneck Detector', detail: 'Trend: SPI down 3 weeks running' },
      { type: 'SCORED', at: '14d ago', actor: 'Scoring engine', detail: 'P4 × I3 → Elevated/High boundary' },
      { type: 'MITIGATING', at: '8d ago', actor: 'ODC Schedule', detail: 'Reviewer capacity request opened' },
    ],
    response: 'Mitigate',
  }),
  e({
    id: 'RSK-1018', kind: 'ISSUE', tier: 'Project', title: 'Henderson CPI breach — cost overrun materialised',
    category: 'Cost', project: 'HDL', program: 'NA-East',
    description: 'Cost-overrun risk on Henderson Substation has materialised; CPI fell below 0.90 and the variance is now actual, not predicted.',
    probability: 5, impact: 4, impactCost: 0.9, impactDays: 2,
    ownerRole: 'ODC Cost Controls', supportRequested: 'Change-order governance review',
    mitigation: 'Corrective-action plan inherited from risk mitigations; CO review in flight.',
    targetDate: '2026-06-20', parties: ['Mesa Power'],
    state: 'Materialised', generator: 'Rules', archetype: 'Threshold',
    drivers: { severity: 78, financial: 70, velocity: 55, proximity: 72 },
    events: [
      { type: 'RAISED', at: '21d ago', actor: 'A-211 Cashflow Detector', detail: 'Threshold: CPI < 0.90 on Henderson' },
      { type: 'SCORED', at: '21d ago', actor: 'Scoring engine', detail: 'P4 × I4 → High band' },
      { type: 'MITIGATING', at: '15d ago', actor: 'ODC Cost Controls', detail: 'Mitigation actions opened' },
      { type: 'MATERIALISED', at: '4d ago', actor: 'ODC Cost Controls', detail: 'Marked materialised — kind → ISSUE; pre-history retained' },
    ],
    response: 'Mitigate',
  }),
  e({
    id: 'RSK-1009', kind: 'RISK', tier: 'Project', title: 'Single-filler permit role — no backup (HDL)',
    category: 'Resource', project: 'HDL', program: 'NA-East',
    description: 'Permit-coordination Service Role on Henderson has a single filler with no assigned backup; key-person resilience gap.',
    probability: 3, impact: 4, impactCost: 0.2, impactDays: 3,
    ownerRole: 'ODC Resourcing', supportRequested: 'Backup filler assignment',
    mitigation: 'Assign and cross-train backup filler; document handover runbook.',
    targetDate: '2026-07-10', parties: [],
    state: 'Identified', generator: 'Agent A-305', archetype: 'Absence', confidence: 88,
    signals: ['Single filler on role', 'No backup assigned', 'Permit gate in 30d'],
    reasoning: 'A-203 Key-Person Risk Detector flagged an absence-archetype gap: a single-filler Service Role with no backup on a permit-critical path. Feeds the key-person resilience standard.',
    drivers: { severity: 60, financial: 35, velocity: 40, proximity: 70 },
    events: [
      { type: 'RAISED', at: '3d ago', actor: 'A-203 Key-Person Detector', detail: 'Absence: single filler, no backup' },
    ],
  }),
  e({
    id: 'RSK-1063', kind: 'RISK', tier: 'Project', title: 'Acme Electrical reliability drift',
    category: 'Supply-chain', project: 'NAE-2', program: 'NA-East',
    description: 'Party Feature Catalogue shows Acme Electrical reliability shifted four weeks ago; SLA-miss-rate climbing on NA-East packages.',
    probability: 3, impact: 3, impactCost: 0.4, impactDays: 2,
    ownerRole: 'FeP Procurement', supportRequested: 'Supplier performance review',
    mitigation: 'Open supplier audit; stage alternate; tighten SLA monitoring.',
    targetDate: '2026-07-05', parties: ['Acme Electrical'],
    state: 'Assessed', generator: 'Agent A-305', archetype: 'Trend', confidence: 76,
    signals: ['Reliability p50 0.94 → 0.89', 'SLA-miss-rate +8pts', 'Behavioural drift 4wk'],
    reasoning: 'A-305 trend on Party Feature Catalogue: reliability ratio decay plus SLA-miss-rate jump over a 4-week window.',
    drivers: { severity: 48, financial: 42, velocity: 62, proximity: 48 },
    events: [
      { type: 'RAISED', at: '6d ago', actor: 'A-305 Discovery', detail: 'Trend: Acme reliability drift' },
      { type: 'SCORED', at: '6d ago', actor: 'Scoring engine', detail: 'P3 × I3 → Elevated band' },
    ],
  }),
  e({
    id: 'RSK-1071', kind: 'RISK', tier: 'Project', title: 'New Albany permit jurisdiction backlog',
    category: 'Legal', project: 'NWA', program: 'NA-East',
    description: 'Franklin County review averaging 12d vs 8d SLA; New Albany permit at day 6 with prior slips in this jurisdiction.',
    probability: 3, impact: 2, impactCost: 0.4, impactDays: 1,
    ownerRole: 'ELS Legal', supportRequested: 'Expedited review option',
    mitigation: 'Request fast-track ($8K fee); monitor jurisdiction queue.',
    targetDate: '2026-06-28', parties: [],
    state: 'Accepted', generator: 'Rules', archetype: 'Trend', confidence: 62,
    signals: ['Jurisdiction avg 12d > 8d SLA', '2 prior slips'],
    reasoning: 'Rules trend on jurisdiction review times; accepted with monitoring threshold that re-opens if review exceeds 14 days.',
    drivers: { severity: 36, financial: 38, velocity: 44, proximity: 52 },
    events: [
      { type: 'RAISED', at: '10d ago', actor: 'Rules Engine', detail: 'Trend: jurisdiction backlog' },
      { type: 'ACCEPTED', at: '4d ago', actor: 'ELS Legal', detail: 'Accepted with monitoring threshold (re-open > 14d)' },
    ],
    response: 'Accept',
  }),
]

// ── R-01 Portfolio heatmap (§8.2 illustrative values) ──
export const HEATMAP_CATEGORIES: RiskCategory[] = ['Cost', 'Schedule', 'Supply-chain', 'Legal', 'Safety']
export interface HeatmapRow {
  program: string
  scores: Record<string, number>
  exposure: number // $M
}
export const PORTFOLIO_HEATMAP: HeatmapRow[] = [
  { program: 'NA-West', scores: { Cost: 82, Schedule: 74, 'Supply-chain': 31, Legal: 22, Safety: 45 }, exposure: 2.1 },
  { program: 'NA-East', scores: { Cost: 48, Schedule: 55, 'Supply-chain': 28, Legal: 61, Safety: 19 }, exposure: 0.9 },
  { program: 'EMEA', scores: { Cost: 71, Schedule: 40, 'Supply-chain': 68, Legal: 77, Safety: 24 }, exposure: 1.4 },
  { program: 'APAC', scores: { Cost: 35, Schedule: 42, 'Supply-chain': 79, Legal: 30, Safety: 18 }, exposure: 0.7 },
]

// R-02 program drill — projects × categories within a program
export interface ProgramDrill { program: string; projects: { project: string; scores: Record<string, number>; exposure: number }[] }
export const PROGRAM_DRILLS: ProgramDrill[] = [
  {
    program: 'NA-West',
    projects: [
      { project: 'VLB', scores: { Cost: 88, Schedule: 52, 'Supply-chain': 28, Legal: 20, Safety: 40 }, exposure: 2.1 },
      { project: 'PRY', scores: { Cost: 44, Schedule: 81, 'Supply-chain': 22, Legal: 18, Safety: 30 }, exposure: 0.6 },
      { project: 'MSA', scores: { Cost: 38, Schedule: 49, 'Supply-chain': 34, Legal: 26, Safety: 51 }, exposure: 0.4 },
    ],
  },
  {
    program: 'EMEA',
    projects: [
      { project: 'STB', scores: { Cost: 62, Schedule: 38, 'Supply-chain': 55, Legal: 90, Safety: 22 }, exposure: 1.4 },
      { project: 'DUB', scores: { Cost: 71, Schedule: 44, 'Supply-chain': 60, Legal: 41, Safety: 26 }, exposure: 0.5 },
    ],
  },
  {
    program: 'APAC',
    projects: [
      { project: 'SNG', scores: { Cost: 33, Schedule: 42, 'Supply-chain': 84, Legal: 28, Safety: 18 }, exposure: 0.7 },
    ],
  },
  {
    program: 'NA-East',
    projects: [
      { project: 'HDL', scores: { Cost: 70, Schedule: 48, 'Supply-chain': 30, Legal: 55, Safety: 19 }, exposure: 0.9 },
      { project: 'NWA', scores: { Cost: 40, Schedule: 50, 'Supply-chain': 26, Legal: 66, Safety: 20 }, exposure: 0.3 },
    ],
  },
]

// ── R-04 Issue board states (corrective-action kanban) ──
export const ISSUE_COLUMNS: { id: RiskState; label: string }[] = [
  { id: 'Materialised', label: 'Materialised' },
  { id: 'Mitigating', label: 'Corrective Action' },
  { id: 'Escalated', label: 'Escalated' },
  { id: 'Resolved', label: 'Resolved' },
]

export interface IssueCard {
  id: string; title: string; project: string; program: string
  state: RiskState; ownerRole: string; impactCost: number; impactDays: number
  age: string; correctiveAction: string; fromRisk?: string
}
export const ISSUES: IssueCard[] = [
  { id: 'ISS-1018', title: 'Henderson CPI breach — cost overrun', project: 'HDL', program: 'NA-East', state: 'Materialised', ownerRole: 'ODC Cost Controls', impactCost: 0.9, impactDays: 2, age: '4d', correctiveAction: 'CO governance review + variance plan', fromRisk: 'RSK-1018' },
  { id: 'ISS-1004', title: 'Data-stitching SLA breach — monthly report', project: 'MSA', program: 'NA-West', state: 'Mitigating', ownerRole: 'FeP Data Ops', impactCost: 0.4, impactDays: 2, age: '9d', correctiveAction: 'Reassign to backup filler; re-run pipeline' },
  { id: 'ISS-0998', title: 'RFI backlog blocking structural sign-off', project: 'PRY', program: 'NA-West', state: 'Mitigating', ownerRole: 'ODC Schedule', impactCost: 0.6, impactDays: 3, age: '12d', correctiveAction: 'Dedicated reviewer for 48h' },
  { id: 'ISS-0987', title: 'STB permit hold — AHJ clause', project: 'STB', program: 'EMEA', state: 'Escalated', ownerRole: 'ELS Legal', impactCost: 1.4, impactDays: 9, age: '6d', correctiveAction: 'AHJ liaison engaged; design alt in review', fromRisk: 'RSK-1037' },
  { id: 'ISS-0965', title: 'Insurance verification delay — onboarding', project: 'HDL', program: 'NA-East', state: 'Resolved', ownerRole: 'ELS Legal', impactCost: 0.2, impactDays: 1, age: '18d', correctiveAction: 'Backup filler assigned; cert received' },
  { id: 'ISS-0959', title: 'Cashflow confidence drop — tiering', project: 'VLB', program: 'NA-West', state: 'Resolved', ownerRole: 'ODC Cost Controls', impactCost: 0.3, impactDays: 0, age: '22d', correctiveAction: 'Re-tiered with committed forecast' },
]

// ── R-05 Audit console (§7) ──
export type AuditType = 'Readiness gate' | 'Compliance' | 'Financial control' | 'Data-quality' | 'Process / SLA' | 'Supplier'
export type AuditStatus = 'Scheduled' | 'In progress' | 'Findings raised' | 'Remediating' | 'Closed'
export interface AuditFinding { id: string; severity: ScoreBand; description: string; remediation: string; linkedRisk?: string }
export interface AuditInstance {
  id: string; type: AuditType; scope: string; project: string; program: string
  auditorRole: string; status: AuditStatus; cadence: string
  controlPoints: { total: number; pass: number; partial: number; fail: number }
  findings: AuditFinding[]
}
export const AUDITS: AuditInstance[] = [
  {
    id: 'AUD-204', type: 'Compliance', scope: 'STB permit & AHJ readiness', project: 'STB', program: 'EMEA',
    auditorRole: 'ELS Compliance', status: 'Findings raised', cadence: 'Event-driven',
    controlPoints: { total: 12, pass: 9, partial: 1, fail: 2 },
    findings: [
      { id: 'F-204-1', severity: 'Critical', description: 'AHJ sustainability clause has no compliant design response on file.', remediation: 'Commission gap assessment; engage AHJ liaison.', linkedRisk: 'RSK-1037' },
      { id: 'F-204-2', severity: 'Elevated', description: 'Permit renewal orchestration not started; gate in 24 days.', remediation: 'Open permit orchestration with milestone timer.', linkedRisk: 'RSK-1037' },
    ],
  },
  {
    id: 'AUD-198', type: 'Financial control', scope: 'PO/SLA three-way-match integrity', project: 'VLB', program: 'NA-West',
    auditorRole: 'ODC Controls', status: 'Remediating', cadence: 'Monthly',
    controlPoints: { total: 18, pass: 15, partial: 2, fail: 1 },
    findings: [
      { id: 'F-198-1', severity: 'High', description: 'Change-order governance bypassed on 1 of 312 transactions.', remediation: 'Re-route through CO approval; tighten ECA rule.', linkedRisk: 'RSK-1042' },
    ],
  },
  {
    id: 'AUD-191', type: 'Data-quality', scope: 'Cross-system ID resolution & manual-stitching', project: 'SNG', program: 'APAC',
    auditorRole: 'FeP Data Ops', status: 'In progress', cadence: 'Continuous',
    controlPoints: { total: 10, pass: 7, partial: 2, fail: 1 },
    findings: [
      { id: 'F-191-1', severity: 'High', description: 'Elevated manual-stitch rate on APAC sources (p82); provenance unverified.', remediation: 'Automate stitch; re-certify provenance.', linkedRisk: 'RSK-1051' },
    ],
  },
  {
    id: 'AUD-186', type: 'Readiness gate', scope: 'FeP validation — HDL milestone gate', project: 'HDL', program: 'NA-East',
    auditorRole: 'ODC PMO', status: 'Scheduled', cadence: 'Per gate',
    controlPoints: { total: 14, pass: 0, partial: 0, fail: 0 },
    findings: [],
  },
  {
    id: 'AUD-179', type: 'Supplier', scope: 'Acme Electrical performance vs SLA', project: 'NAE-2', program: 'NA-East',
    auditorRole: 'FeP Procurement', status: 'Findings raised', cadence: 'Quarterly',
    controlPoints: { total: 8, pass: 5, partial: 2, fail: 1 },
    findings: [
      { id: 'F-179-1', severity: 'Elevated', description: 'Reliability ratio decay and SLA-miss-rate jump over 4 weeks.', remediation: 'Stage alternate supplier; tighten SLA monitoring.', linkedRisk: 'RSK-1063' },
    ],
  },
  {
    id: 'AUD-172', type: 'Process / SLA', scope: 'Approval pipeline — SAP black-hole detection', project: 'Portfolio', program: 'NA-West',
    auditorRole: 'ODC Controls', status: 'Closed', cadence: 'Continuous',
    controlPoints: { total: 16, pass: 16, partial: 0, fail: 0 },
    findings: [],
  },
]

// ── R-06 Impact explorer — exposure waterfall ──
export interface ImpactSlice { label: string; cost: number; days: number; kind: 'program' | 'category' | 'driver' }
export const IMPACT_BY_PROGRAM: ImpactSlice[] = [
  { label: 'NA-West', cost: 2.1, days: 7, kind: 'program' },
  { label: 'EMEA', cost: 1.4, days: 9, kind: 'program' },
  { label: 'NA-East', cost: 0.9, days: 3, kind: 'program' },
  { label: 'APAC', cost: 0.7, days: 6, kind: 'program' },
]
export const IMPACT_BY_CATEGORY: ImpactSlice[] = [
  { label: 'Cost', cost: 2.0, days: 2, kind: 'category' },
  { label: 'Legal', cost: 1.4, days: 9, kind: 'category' },
  { label: 'Supply-chain', cost: 1.1, days: 8, kind: 'category' },
  { label: 'Schedule', cost: 0.6, days: 6, kind: 'category' },
]
export const IMPACT_BY_DRIVER: ImpactSlice[] = [
  { label: 'Threshold breaches', cost: 3.0, days: 4, kind: 'driver' },
  { label: 'Absence (missing controls)', cost: 1.6, days: 12, kind: 'driver' },
  { label: 'Correlation', cost: 0.7, days: 6, kind: 'driver' },
  { label: 'Trend', cost: 0.8, days: 3, kind: 'driver' },
]

// ── Portfolio aggregates ──
export const TOTAL_EXPOSURE_COST = PORTFOLIO_HEATMAP.reduce((s, r) => s + r.exposure, 0) // 5.1M
export const TOTAL_EXPOSURE_DAYS = 7
export const OPEN_RISK_COUNT = RISK_ENTITIES.filter((r) => r.kind === 'RISK' && r.state !== 'Resolved').length
export const OPEN_ISSUE_COUNT = ISSUES.filter((i) => i.state !== 'Resolved').length
export const DISCOVERED_COUNT = RISK_ENTITIES.filter((r) => r.generator !== 'Manual').length
export const OPEN_AUDIT_COUNT = AUDITS.filter((a) => a.status !== 'Closed').length

// ── Archetype meta (§4.1) ──
export const ARCHETYPE_META: Record<Archetype, { blurb: string; example: string; generator: string }> = {
  Threshold: { blurb: 'A metric crosses a line.', example: 'CPI < 0.90 on Henderson → cost-overrun risk.', generator: 'Rules (ECA-native)' },
  Trend: { blurb: 'N periods of sustained movement.', example: 'SPI down 3 weeks on Pryor Creek → schedule slip.', generator: 'Rules + windowed state' },
  Correlation: { blurb: 'Independent signals align.', example: 'Conflict + EU LLE + critical path → supply risk.', generator: 'Agent A-305' },
  Absence: { blurb: 'Something expected is missing.', example: 'Permit due in 18d with no orchestration started.', generator: 'Rules (negative-space) + Agent' },
}

// ── Response strategy meta (§6.1) ──
export const RESPONSE_META: Record<ResponseStrategy, { when: string; action: string }> = {
  Mitigate: { when: 'Reduce probability or impact to tolerable.', action: 'Opens mitigation actions as Workflow Tasks on Service Roles; score recomputes as actions complete.' },
  Transfer: { when: 'Shift the consequence to another party.', action: 'Routes to contract / insurance / change-order workflow; links the responsible Party.' },
  Avoid: { when: 'Eliminate the risk by changing the plan.', action: 'Surfaces the plan change as a decision needing approval; records the trade-off.' },
  Accept: { when: 'Cost of response exceeds the exposure.', action: 'Moves to Accepted with a mandatory rationale and a monitoring threshold.' },
}

export const PROGRAMS = ['NA-West', 'NA-East', 'EMEA', 'APAC'] as const
export const CATEGORIES_ALL: RiskCategory[] = ['Cost', 'Schedule', 'Scope', 'Safety', 'Supply-chain', 'Legal', 'Technical', 'Resource', 'External']
export const OWNER_ROLES = ['ODC Cost Controls', 'ODC Schedule', 'ODC Resourcing', 'ODC Controls', 'ELS Legal', 'ELS Compliance', 'FeP Procurement', 'FeP Data Ops'] as const
