// ════════════════════════════════════════════════════════════════════════════
// PIP Governance & Audit — Shared Data Layer
// Controls Library · Controls Audit · Risk Audit · Compliance Audit
// ════════════════════════════════════════════════════════════════════════════

// ── Projects ──────────────────────────────────────────────────────────────
export const PROJECTS = [
  { id: 'PRJ-001', name: 'Henderson Substation', code: 'HDL', program: 'NA-East' },
  { id: 'PRJ-002', name: 'Pryor Creek', code: 'PRY', program: 'NA-East' },
  { id: 'PRJ-003', name: 'Mesa Power', code: 'MSP', program: 'NA-West' },
  { id: 'PRJ-004', name: 'Atlanta DC-3', code: 'ATL', program: 'NA-East' },
  { id: 'PRJ-005', name: 'Lenoir Fiber', code: 'LNR', program: 'NA-East' },
  { id: 'PRJ-006', name: 'Dallas Cooling', code: 'DLS', program: 'NA-West' },
  { id: 'PRJ-007', name: 'Council Bluffs', code: 'CBL', program: 'NA-West' },
  { id: 'PRJ-008', name: 'Ashburn Pod 6', code: 'ASH', program: 'NA-East' },
] as const

// ── Users ──────────────────────────────────────────────────────────────────
export type UserRole =
  | 'Portfolio Director'
  | 'Senior Director'
  | 'Portfolio Controls Lead'
  | 'Control Owner'
  | 'Risk Owner'
  | 'Contractor Compliance Reviewer'
  | 'Finance'
  | 'Legal'
  | 'Auditor'

export interface PIPUser {
  id: string
  name: string
  initials: string
  role: UserRole
  email: string
  region: string
}

export const USERS: PIPUser[] = [
  { id: 'USR-001', name: 'Brian Smith', initials: 'BS', role: 'Portfolio Director', email: 'b.smith@pip.internal', region: 'Global' },
  { id: 'USR-002', name: 'Anu Reddy', initials: 'AR', role: 'Senior Director', email: 'a.reddy@pip.internal', region: 'Global' },
  { id: 'USR-003', name: 'Hasit Chetal', initials: 'HC', role: 'Portfolio Controls Lead', email: 'h.chetal@pip.internal', region: 'Global' },
  { id: 'USR-004', name: 'Sophia Lam', initials: 'SL', role: 'Control Owner', email: 's.lam@pip.internal', region: 'NA-East' },
  { id: 'USR-005', name: 'Alice Cox', initials: 'AC', role: 'Control Owner', email: 'a.cox@pip.internal', region: 'NA-West' },
  { id: 'USR-006', name: 'Sreya Mukherjee', initials: 'SM', role: 'Risk Owner', email: 's.mukherjee@pip.internal', region: 'NA-East' },
  { id: 'USR-007', name: 'Daniel Cho', initials: 'DC', role: 'Auditor', email: 'd.cho@pip.internal', region: 'NA-West' },
  { id: 'USR-008', name: 'Lena Ortiz', initials: 'LO', role: 'Contractor Compliance Reviewer', email: 'l.ortiz@pip.internal', region: 'NA-East' },
  { id: 'USR-009', name: 'Priya Nair', initials: 'PN', role: 'Control Owner', email: 'p.nair@pip.internal', region: 'EMEA' },
]

// ════════════════════════════════════════════════════════════════════════════
// MODULE 1 — CONTROLS LIBRARY
// ════════════════════════════════════════════════════════════════════════════

export type ControlCategory =
  | 'Financial' | 'Operational' | 'Safety' | 'Cyber/IT'
  | 'Schedule' | 'Procurement' | 'Environmental' | 'Compliance'
export type ControlType = 'Preventive' | 'Detective' | 'Corrective'
export type ControlNature = 'Manual' | 'Automated' | 'Hybrid'
export type ControlEffectiveness = 'Effective' | 'Partially Effective' | 'Ineffective' | 'Not Tested'
export type ControlStatus = 'Active' | 'Draft' | 'Retired'
export type ControlFramework = 'SOX' | 'ISO 27001' | 'NIST CSF' | 'COSO' | 'OSHA' | 'EPA' | 'Contractual' | 'Internal'
export type TestFrequency = 'Monthly' | 'Quarterly' | 'Semi-Annual' | 'Annual'

export interface Control {
  id: string
  name: string
  category: ControlCategory
  type: ControlType
  nature: ControlNature
  objective: string
  ownerId: string | null
  ownerName: string | null
  projects: string[]
  framework: ControlFramework
  testFrequency: TestFrequency
  effectiveness: ControlEffectiveness
  lastTested: string | null
  nextDue: string
  linkedRiskIds: string[]
  status: ControlStatus
}

export const CONTROLS: Control[] = [
  {
    id: 'CTL-001', name: 'PO Approval Authority Limit Enforcement',
    category: 'Financial', type: 'Preventive', nature: 'Automated',
    objective: 'Block purchase orders that exceed the submitter\'s delegated approval authority ceiling before commitment.',
    ownerId: 'USR-003', ownerName: 'Hasit Chetal',
    projects: ['PRJ-001', 'PRJ-002', 'PRJ-004'],
    framework: 'COSO', testFrequency: 'Monthly',
    effectiveness: 'Effective', lastTested: '2026-06-01', nextDue: '2026-07-01',
    linkedRiskIds: ['R-001', 'R-005'], status: 'Active',
  },
  {
    id: 'CTL-002', name: 'Segregation of Duties — Spend Transactions',
    category: 'Financial', type: 'Preventive', nature: 'Automated',
    objective: 'Enforce that the approver, requester, and receiver of spend are distinct individuals on every transaction.',
    ownerId: 'USR-003', ownerName: 'Hasit Chetal',
    projects: ['PRJ-001', 'PRJ-002', 'PRJ-003', 'PRJ-004', 'PRJ-005', 'PRJ-006', 'PRJ-007', 'PRJ-008'],
    framework: 'SOX', testFrequency: 'Monthly',
    effectiveness: 'Effective', lastTested: '2026-06-20', nextDue: '2026-07-20',
    linkedRiskIds: ['R-001'], status: 'Active',
  },
  {
    id: 'CTL-003', name: 'Construction Start Permit Gate',
    category: 'Compliance', type: 'Preventive', nature: 'Manual',
    objective: 'Ensure no construction activity is initiated without an approved permit on file with the AHJ.',
    ownerId: 'USR-009', ownerName: 'Priya Nair',
    projects: ['PRJ-001', 'PRJ-003'],
    framework: 'OSHA', testFrequency: 'Quarterly',
    effectiveness: 'Ineffective', lastTested: '2026-04-10', nextDue: '2026-06-15',
    linkedRiskIds: ['R-003', 'R-007'], status: 'Active',
  },
  {
    id: 'CTL-004', name: 'Change Order Cost Review — Pre-Sign-Off',
    category: 'Financial', type: 'Detective', nature: 'Manual',
    objective: 'Attest that every change order has received an independent cost review before director sign-off.',
    ownerId: 'USR-004', ownerName: 'Sophia Lamb',
    projects: ['PRJ-002', 'PRJ-005', 'PRJ-008'],
    framework: 'COSO', testFrequency: 'Monthly',
    effectiveness: 'Partially Effective', lastTested: '2026-05-28', nextDue: '2026-06-28',
    linkedRiskIds: ['R-002'], status: 'Active',
  },
  {
    id: 'CTL-005', name: 'Vendor Invoice Three-Way Match',
    category: 'Procurement', type: 'Detective', nature: 'Automated',
    objective: 'Match purchase order, goods receipt, and vendor invoice before approving payment.',
    ownerId: 'USR-005', ownerName: 'Alice Cox',
    projects: ['PRJ-003', 'PRJ-006', 'PRJ-007'],
    framework: 'COSO', testFrequency: 'Monthly',
    effectiveness: 'Effective', lastTested: '2026-06-10', nextDue: '2026-07-10',
    linkedRiskIds: ['R-009'], status: 'Active',
  },
  {
    id: 'CTL-006', name: 'Schedule Variance Escalation Trigger',
    category: 'Schedule', type: 'Detective', nature: 'Automated',
    objective: 'Automatically escalate when SPI falls below 0.85 for two consecutive reporting periods.',
    ownerId: 'USR-004', ownerName: 'Sophia Lamb',
    projects: ['PRJ-001', 'PRJ-002', 'PRJ-004', 'PRJ-005'],
    framework: 'Internal', testFrequency: 'Monthly',
    effectiveness: 'Effective', lastTested: '2026-06-18', nextDue: '2026-07-18',
    linkedRiskIds: ['R-004'], status: 'Active',
  },
  {
    id: 'CTL-007', name: 'COI Verification Before Contractor Mobilisation',
    category: 'Compliance', type: 'Preventive', nature: 'Manual',
    objective: 'Verify Certificate of Insurance is valid and meets coverage minimums before a contractor mobilises on-site.',
    ownerId: 'USR-008', ownerName: 'Lena Ortiz',
    projects: ['PRJ-001', 'PRJ-002', 'PRJ-003', 'PRJ-004', 'PRJ-005', 'PRJ-006', 'PRJ-007', 'PRJ-008'],
    framework: 'Contractual', testFrequency: 'Quarterly',
    effectiveness: 'Partially Effective', lastTested: '2026-05-01', nextDue: '2026-06-20',
    linkedRiskIds: ['R-008'], status: 'Active',
  },
  {
    id: 'CTL-008', name: 'Safety Incident Reporting — 24h Gate',
    category: 'Safety', type: 'Detective', nature: 'Hybrid',
    objective: 'All on-site safety incidents must be reported and logged in the safety system within 24 hours.',
    ownerId: 'USR-009', ownerName: 'Priya Nair',
    projects: ['PRJ-001', 'PRJ-002', 'PRJ-003', 'PRJ-006'],
    framework: 'OSHA', testFrequency: 'Monthly',
    effectiveness: 'Effective', lastTested: '2026-06-15', nextDue: '2026-07-15',
    linkedRiskIds: ['R-010'], status: 'Active',
  },
  {
    id: 'CTL-009', name: 'Environmental Permit Renewal Tracking',
    category: 'Environmental', type: 'Preventive', nature: 'Manual',
    objective: 'Track EPA and local environmental permit expiry dates and initiate renewal 90 days before expiry.',
    ownerId: 'USR-009', ownerName: 'Priya Nair',
    projects: ['PRJ-003', 'PRJ-006', 'PRJ-007'],
    framework: 'EPA', testFrequency: 'Quarterly',
    effectiveness: 'Partially Effective', lastTested: '2026-03-15', nextDue: '2026-06-15',
    linkedRiskIds: ['R-006'], status: 'Active',
  },
  {
    id: 'CTL-010', name: 'Access Provisioning Review — Quarterly',
    category: 'Cyber/IT', type: 'Detective', nature: 'Manual',
    objective: 'Review and certify all system access rights quarterly; revoke stale or excess permissions.',
    ownerId: 'USR-005', ownerName: 'Alice Cox',
    projects: ['PRJ-004', 'PRJ-008'],
    framework: 'ISO 27001', testFrequency: 'Quarterly',
    effectiveness: 'Effective', lastTested: '2026-04-01', nextDue: '2026-07-01',
    linkedRiskIds: ['R-011'], status: 'Active',
  },
  {
    id: 'CTL-011', name: 'SOX Financial Close Attestation',
    category: 'Financial', type: 'Preventive', nature: 'Manual',
    objective: 'Controller must attest to completeness and accuracy of financial close data before submission.',
    ownerId: 'USR-004', ownerName: 'Sophia Lamb',
    projects: ['PRJ-001', 'PRJ-002', 'PRJ-003', 'PRJ-004', 'PRJ-005', 'PRJ-006', 'PRJ-007', 'PRJ-008'],
    framework: 'SOX', testFrequency: 'Quarterly',
    effectiveness: 'Effective', lastTested: '2026-04-30', nextDue: '2026-07-31',
    linkedRiskIds: ['R-001', 'R-002'], status: 'Active',
  },
  {
    id: 'CTL-012', name: 'Subcontractor Bid Evaluation Documented',
    category: 'Procurement', type: 'Preventive', nature: 'Manual',
    objective: 'All subcontractor bids above $50k must have a documented evaluation with at least 3 competing bids on file.',
    ownerId: 'USR-008', ownerName: 'Lena Ortiz',
    projects: ['PRJ-003', 'PRJ-005', 'PRJ-007'],
    framework: 'Contractual', testFrequency: 'Quarterly',
    effectiveness: 'Effective', lastTested: '2026-05-15', nextDue: '2026-08-15',
    linkedRiskIds: ['R-009'], status: 'Active',
  },
  {
    id: 'CTL-013', name: 'Data Backup Integrity Verification',
    category: 'Cyber/IT', type: 'Corrective', nature: 'Automated',
    objective: 'Verify daily that backup jobs completed successfully and run monthly restore tests.',
    ownerId: 'USR-005', ownerName: 'Alice Cox',
    projects: ['PRJ-004', 'PRJ-008'],
    framework: 'NIST CSF', testFrequency: 'Monthly',
    effectiveness: 'Not Tested', lastTested: null, nextDue: '2026-07-01',
    linkedRiskIds: ['R-011', 'R-012'], status: 'Active',
  },
  // 2 deliberately unassigned controls for gap KPI
  {
    id: 'CTL-014', name: 'Force Majeure Documentation Protocol',
    category: 'Operational', type: 'Corrective', nature: 'Manual',
    objective: 'Ensure any force majeure event is documented within 48h with evidence for contract claims.',
    ownerId: null, ownerName: null,
    projects: ['PRJ-001', 'PRJ-002'],
    framework: 'Contractual', testFrequency: 'Annual',
    effectiveness: 'Not Tested', lastTested: null, nextDue: '2026-09-30',
    linkedRiskIds: ['R-013'], status: 'Draft',
  },
  {
    id: 'CTL-015', name: 'Project Closeout Financial Reconciliation',
    category: 'Financial', type: 'Detective', nature: 'Manual',
    objective: 'Perform full financial reconciliation at project closeout; reconcile EAC vs actual spend within 2%.',
    ownerId: null, ownerName: null,
    projects: ['PRJ-005'],
    framework: 'COSO', testFrequency: 'Annual',
    effectiveness: 'Not Tested', lastTested: null, nextDue: '2026-12-31',
    linkedRiskIds: [], status: 'Draft',
  },
  {
    id: 'CTL-016', name: 'Stormwater Pollution Prevention Plan Compliance',
    category: 'Environmental', type: 'Preventive', nature: 'Hybrid',
    objective: 'Verify SWPPP controls are implemented and inspected at required intervals on active construction sites.',
    ownerId: 'USR-009', ownerName: 'Priya Nair',
    projects: ['PRJ-003', 'PRJ-006'],
    framework: 'EPA', testFrequency: 'Quarterly',
    effectiveness: 'Partially Effective', lastTested: '2026-05-20', nextDue: '2026-06-30',
    linkedRiskIds: ['R-006'], status: 'Active',
  },
]

export function effectivenessBadge(e: ControlEffectiveness): { cls: string; dot: string; label: string } {
  switch (e) {
    case 'Effective':          return { cls: 'bg-green-bg text-green border-green/30', dot: 'bg-green', label: 'Effective' }
    case 'Partially Effective': return { cls: 'bg-amber-bg text-amber border-amber/30', dot: 'bg-amber', label: 'Partial' }
    case 'Ineffective':        return { cls: 'bg-red-bg text-red border-red/30', dot: 'bg-red', label: 'Ineffective' }
    case 'Not Tested':         return { cls: 'bg-secondary text-muted-foreground border-line', dot: 'bg-slate-400', label: 'Not Tested' }
  }
}

export function controlTypeBadge(t: ControlType): string {
  switch (t) {
    case 'Preventive': return 'bg-navy/10 text-navy border-navy/20 dark:bg-navy/30'
    case 'Detective':  return 'bg-teal/10 text-teal border-teal/20'
    case 'Corrective': return 'bg-amber-bg text-amber border-amber/30'
  }
}

// Compute overdue tests (nextDue < today, lastTested not today)
export function isOverdueControl(c: Control): boolean {
  return c.nextDue < '2026-06-26' && c.status === 'Active'
}

// ════════════════════════════════════════════════════════════════════════════
// MODULE 2 — CONTROLS AUDIT (Schedules + Occurrences)
// ════════════════════════════════════════════════════════════════════════════

export type AuditType = 'controls' | 'risk' | 'compliance'
export type OccurrenceStatus = 'Scheduled' | 'In Progress' | 'Pending Review' | 'Completed' | 'Overdue'
export type ChecklistResult = 'Pass' | 'Fail' | 'Partial' | 'N/A'
export type FindingSeverity = 'Critical' | 'High' | 'Medium' | 'Low'
export type FindingStatus = 'Open' | 'In Progress' | 'Closed'
export type OverallResult = 'Pass' | 'Fail' | 'Partial'
export type ScheduleStatus = 'Active' | 'Paused' | 'Ended'
export type Frequency = 'One-time' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Semi-Annual' | 'Annual' | 'Custom'

export interface AuditSchedule {
  id: string
  name: string
  type: AuditType
  scopeProjects: string[]
  scopeItemIds: string[]
  frequency: Frequency
  startDate: string
  time: string
  timezone: string
  assignedAuditorId: string
  assignedAuditorName: string
  accountableOwnerId: string
  accountableOwnerName: string
  reminderLeadDays: number
  graceDays: number
  status: ScheduleStatus
  nextRun: string
  lastRun: string | null
}

export interface AuditFinding {
  id: string
  occurrenceId: string
  severity: FindingSeverity
  description: string
  remediationOwnerId: string
  remediationOwnerName: string
  dueDate: string
  status: FindingStatus
  linkedItemId: string
}

export interface ChecklistItem {
  itemId: string
  itemName: string
  result: ChecklistResult
  note: string
  evidence: string | null
  // risk-audit extras
  likelihood?: number
  impact?: number
  score?: number
  daysSinceReview?: number
  mitigationStatus?: string
  failReason?: string
  // compliance extras
  framework?: string
  expiryDate?: string
  daysToExpiry?: number
  lastVerified?: string
}

export interface AuditOccurrence {
  id: string
  scheduleId: string
  scheduleName: string
  type: AuditType
  projectNames: string[]
  dueDate: string
  auditorId: string
  auditorName: string
  ownerId: string
  ownerName: string
  status: OccurrenceStatus
  checklist: ChecklistItem[]
  overallResult: OverallResult | null
  findings: AuditFinding[]
  isAutoGenerated: boolean
  isAtRisk: boolean
  trailEntries: { action: string; user: string; initials: string; ts: string }[]
}

// ── Controls Audit Schedules ───────────────────────────────────────────────
export const CONTROLS_AUDIT_SCHEDULES: AuditSchedule[] = [
  {
    id: 'AS-001', name: 'Monthly Financial Controls Review — Henderson & Pryor Creek',
    type: 'controls', scopeProjects: ['PRJ-001', 'PRJ-002'],
    scopeItemIds: ['CTL-001', 'CTL-002', 'CTL-004', 'CTL-006'],
    frequency: 'Monthly', startDate: '2026-01-01', time: '09:00', timezone: 'America/New_York',
    assignedAuditorId: 'USR-007', assignedAuditorName: 'Daniel Cho',
    accountableOwnerId: 'USR-003', accountableOwnerName: 'Hasit Chetal',
    reminderLeadDays: 5, graceDays: 3, status: 'Active',
    nextRun: '2026-07-01', lastRun: '2026-06-01',
  },
  {
    id: 'AS-002', name: 'Quarterly SOX Controls Attestation — All Projects',
    type: 'controls', scopeProjects: ['PRJ-001','PRJ-002','PRJ-003','PRJ-004','PRJ-005','PRJ-006','PRJ-007','PRJ-008'],
    scopeItemIds: ['CTL-002', 'CTL-011'],
    frequency: 'Quarterly', startDate: '2026-01-01', time: '08:00', timezone: 'America/New_York',
    assignedAuditorId: 'USR-007', assignedAuditorName: 'Daniel Cho',
    accountableOwnerId: 'USR-003', accountableOwnerName: 'Hasit Chetal',
    reminderLeadDays: 7, graceDays: 5, status: 'Active',
    nextRun: '2026-07-31', lastRun: '2026-04-30',
  },
  {
    id: 'AS-003', name: 'Monthly Procurement Controls Check — Mesa, Dallas, Council Bluffs',
    type: 'controls', scopeProjects: ['PRJ-003', 'PRJ-006', 'PRJ-007'],
    scopeItemIds: ['CTL-005', 'CTL-012'],
    frequency: 'Monthly', startDate: '2026-01-01', time: '10:00', timezone: 'America/Chicago',
    assignedAuditorId: 'USR-005', assignedAuditorName: 'Alice Cox',
    accountableOwnerId: 'USR-003', accountableOwnerName: 'Hasit Chetal',
    reminderLeadDays: 3, graceDays: 2, status: 'Active',
    nextRun: '2026-07-10', lastRun: '2026-06-10',
  },
  {
    id: 'AS-004', name: 'Quarterly Permit & Compliance Controls — Construction Sites',
    type: 'controls', scopeProjects: ['PRJ-001', 'PRJ-003'],
    scopeItemIds: ['CTL-003', 'CTL-007', 'CTL-009'],
    frequency: 'Quarterly', startDate: '2026-01-01', time: '09:00', timezone: 'America/Los_Angeles',
    assignedAuditorId: 'USR-008', assignedAuditorName: 'Lena Ortiz',
    accountableOwnerId: 'USR-009', accountableOwnerName: 'Priya Nair',
    reminderLeadDays: 7, graceDays: 3, status: 'Active',
    nextRun: '2026-07-01', lastRun: '2026-04-01',
  },
  {
    id: 'AS-005', name: 'Monthly IT/Cyber Controls Review — Atlanta DC-3 & Ashburn Pod 6',
    type: 'controls', scopeProjects: ['PRJ-004', 'PRJ-008'],
    scopeItemIds: ['CTL-010', 'CTL-013'],
    frequency: 'Monthly', startDate: '2026-01-01', time: '14:00', timezone: 'America/New_York',
    assignedAuditorId: 'USR-007', assignedAuditorName: 'Daniel Cho',
    accountableOwnerId: 'USR-005', accountableOwnerName: 'Alice Cox',
    reminderLeadDays: 3, graceDays: 2, status: 'Active',
    nextRun: '2026-07-01', lastRun: '2026-06-01',
  },
  {
    id: 'AS-006', name: 'Semi-Annual Environmental Controls Review',
    type: 'controls', scopeProjects: ['PRJ-003', 'PRJ-006'],
    scopeItemIds: ['CTL-009', 'CTL-016'],
    frequency: 'Semi-Annual', startDate: '2026-01-01', time: '09:00', timezone: 'America/Chicago',
    assignedAuditorId: 'USR-007', assignedAuditorName: 'Daniel Cho',
    accountableOwnerId: 'USR-009', accountableOwnerName: 'Priya Nair',
    reminderLeadDays: 10, graceDays: 5, status: 'Active',
    nextRun: '2026-07-01', lastRun: '2026-01-01',
  },
]

// ── Controls Audit Occurrences ─────────────────────────────────────────────
export const CONTROLS_AUDIT_OCCURRENCES: AuditOccurrence[] = [
  // AO-1201: Completed — Monthly Financial (Henderson/Pryor Creek)
  {
    id: 'AO-1201', scheduleId: 'AS-001', scheduleName: 'Monthly Financial Controls Review',
    type: 'controls', projectNames: ['Henderson Substation', 'Pryor Creek'],
    dueDate: '2026-06-01', auditorId: 'USR-007', auditorName: 'Daniel Cho',
    ownerId: 'USR-003', ownerName: 'Hasit Chetal',
    status: 'Completed', overallResult: 'Pass',
    isAutoGenerated: true, isAtRisk: false,
    checklist: [
      { itemId: 'CTL-001', itemName: 'PO Approval Authority Limit Enforcement', result: 'Pass', note: 'No breaches detected; 47 transactions reviewed.', evidence: 'CTL001-Jun01-evidence.pdf' },
      { itemId: 'CTL-002', itemName: 'Segregation of Duties — Spend Transactions', result: 'Pass', note: 'SoD graph clean; zero collisions.', evidence: 'CTL002-Jun01-sod-graph.pdf' },
      { itemId: 'CTL-004', itemName: 'Change Order Cost Review — Pre-Sign-Off', result: 'Partial', note: '2 of 9 change orders missing independent cost review signature.', evidence: null },
      { itemId: 'CTL-006', itemName: 'Schedule Variance Escalation Trigger', result: 'Pass', note: 'PRY-2 SPI at 0.91; no escalation threshold breached.', evidence: 'CTL006-Jun01-spi.csv' },
    ],
    findings: [
      { id: 'FND-001', occurrenceId: 'AO-1201', severity: 'Medium', description: '2 change orders on Pryor Creek (CO-447, CO-451) processed without independent cost review attestation.', remediationOwnerId: 'USR-004', remediationOwnerName: 'Sophia Lamb', dueDate: '2026-06-15', status: 'Closed', linkedItemId: 'CTL-004' },
    ],
    trailEntries: [
      { action: 'Occurrence created by A-206', user: 'A-206', initials: 'AI', ts: '2026-06-01T08:00:00Z' },
      { action: 'Checklist completed', user: 'Daniel Cho', initials: 'DC', ts: '2026-06-01T15:32:00Z' },
      { action: 'Submitted for review', user: 'Daniel Cho', initials: 'DC', ts: '2026-06-01T15:35:00Z' },
      { action: 'Approved — result: Pass', user: 'Hasit Chetal', initials: 'HC', ts: '2026-06-02T09:10:00Z' },
    ],
  },
  // AO-1202: Overdue — Permit controls (Construction Sites)
  {
    id: 'AO-1202', scheduleId: 'AS-004', scheduleName: 'Quarterly Permit & Compliance Controls',
    type: 'controls', projectNames: ['Henderson Substation', 'Mesa Power'],
    dueDate: '2026-06-15', auditorId: 'USR-008', auditorName: 'Lena Ortiz',
    ownerId: 'USR-009', ownerName: 'Priya Nair',
    status: 'Overdue', overallResult: null,
    isAutoGenerated: true, isAtRisk: false,
    checklist: [
      { itemId: 'CTL-003', itemName: 'Construction Start Permit Gate', result: 'Fail', note: 'Mesa Power Phase 2 mobilised 12 Jun with no approved permit on file. Stop-work risk.', evidence: null },
      { itemId: 'CTL-007', itemName: 'COI Verification Before Contractor Mobilisation', result: 'Partial', note: '3 of 8 contractors on site — COIs expired or missing.', evidence: null },
      { itemId: 'CTL-009', itemName: 'Environmental Permit Renewal Tracking', result: 'Fail', note: 'Mesa Power EPA stormwater permit expires 2026-07-15; no renewal initiated.', evidence: null },
    ],
    findings: [
      { id: 'FND-002', occurrenceId: 'AO-1202', severity: 'Critical', description: 'Mesa Power Phase 2 construction commenced without AHJ-approved permit. Immediate stop-work order risk.', remediationOwnerId: 'USR-009', remediationOwnerName: 'Priya Nair', dueDate: '2026-06-20', status: 'Open', linkedItemId: 'CTL-003' },
      { id: 'FND-003', occurrenceId: 'AO-1202', severity: 'High', description: 'Three contractors (Ridgeline Electric, Apex Steel, Crestway Concrete) on site with expired/missing COIs.', remediationOwnerId: 'USR-008', remediationOwnerName: 'Lena Ortiz', dueDate: '2026-06-22', status: 'In Progress', linkedItemId: 'CTL-007' },
      { id: 'FND-004', occurrenceId: 'AO-1202', severity: 'High', description: 'Mesa Power EPA permit expires in 19 days; renewal process not initiated. Risk of work stoppage.', remediationOwnerId: 'USR-009', remediationOwnerName: 'Priya Nair', dueDate: '2026-07-01', status: 'Open', linkedItemId: 'CTL-009' },
    ],
    trailEntries: [
      { action: 'Occurrence created by A-206', user: 'A-206', initials: 'AI', ts: '2026-06-15T08:00:00Z' },
      { action: 'Checklist partially completed', user: 'Lena Ortiz', initials: 'LO', ts: '2026-06-17T11:00:00Z' },
      { action: 'A-206: Flipped to Overdue — grace period expired', user: 'A-206', initials: 'AI', ts: '2026-06-18T08:00:00Z' },
      { action: 'Escalation sent to Hasit Chetal', user: 'A-206', initials: 'AI', ts: '2026-06-18T08:01:00Z' },
    ],
  },
  // AO-1203: In Progress — Monthly Procurement
  {
    id: 'AO-1203', scheduleId: 'AS-003', scheduleName: 'Monthly Procurement Controls Check',
    type: 'controls', projectNames: ['Mesa Power', 'Dallas Cooling', 'Council Bluffs'],
    dueDate: '2026-06-30', auditorId: 'USR-005', auditorName: 'Alice Cox',
    ownerId: 'USR-003', ownerName: 'Hasit Chetal',
    status: 'In Progress', overallResult: null,
    isAutoGenerated: false, isAtRisk: true,
    checklist: [
      { itemId: 'CTL-005', itemName: 'Vendor Invoice Three-Way Match', result: 'Pass', note: 'All 23 invoices matched. No exceptions.', evidence: 'CTL005-Jun-invoices.xlsx' },
      { itemId: 'CTL-012', itemName: 'Subcontractor Bid Evaluation Documented', result: 'N/A', note: 'No bids above $50k threshold this period.', evidence: null },
    ],
    findings: [],
    trailEntries: [
      { action: 'Occurrence created manually', user: 'Alice Cox', initials: 'AC', ts: '2026-06-10T09:00:00Z' },
      { action: 'CTL-005 tested — Pass', user: 'Alice Cox', initials: 'AC', ts: '2026-06-20T14:22:00Z' },
    ],
  },
  // AO-1204: Pending Review — Monthly IT/Cyber
  {
    id: 'AO-1204', scheduleId: 'AS-005', scheduleName: 'Monthly IT/Cyber Controls Review',
    type: 'controls', projectNames: ['Atlanta DC-3', 'Ashburn Pod 6'],
    dueDate: '2026-06-25', auditorId: 'USR-007', auditorName: 'Daniel Cho',
    ownerId: 'USR-005', ownerName: 'Alice Cox',
    status: 'Pending Review', overallResult: 'Partial',
    isAutoGenerated: true, isAtRisk: false,
    checklist: [
      { itemId: 'CTL-010', itemName: 'Access Provisioning Review — Quarterly', result: 'Partial', note: 'Access review complete but 4 stale accounts not yet revoked pending HR confirmation.', evidence: 'CTL010-Jun-access-report.pdf' },
      { itemId: 'CTL-013', itemName: 'Data Backup Integrity Verification', result: 'Pass', note: 'All backups verified. Restore test executed successfully on 2026-06-22.', evidence: 'CTL013-Jun-backup-log.txt' },
    ],
    findings: [
      { id: 'FND-005', occurrenceId: 'AO-1204', severity: 'Medium', description: '4 stale user accounts (ex-contractors) not yet deprovisioned from project management platform. Access risk.', remediationOwnerId: 'USR-005', remediationOwnerName: 'Alice Cox', dueDate: '2026-07-05', status: 'Open', linkedItemId: 'CTL-010' },
    ],
    trailEntries: [
      { action: 'Occurrence created by A-206', user: 'A-206', initials: 'AI', ts: '2026-06-01T08:00:00Z' },
      { action: 'Checklist completed', user: 'Daniel Cho', initials: 'DC', ts: '2026-06-24T16:45:00Z' },
      { action: 'Submitted for review — result: Partial', user: 'Daniel Cho', initials: 'DC', ts: '2026-06-24T16:48:00Z' },
    ],
  },
  // AO-1205: Completed — SOX Q1
  {
    id: 'AO-1205', scheduleId: 'AS-002', scheduleName: 'Quarterly SOX Controls Attestation',
    type: 'controls', projectNames: ['All Projects'],
    dueDate: '2026-04-30', auditorId: 'USR-007', auditorName: 'Daniel Cho',
    ownerId: 'USR-003', ownerName: 'Hasit Chetal',
    status: 'Completed', overallResult: 'Pass',
    isAutoGenerated: true, isAtRisk: false,
    checklist: [
      { itemId: 'CTL-002', itemName: 'Segregation of Duties — Spend Transactions', result: 'Pass', note: 'Q1 full-portfolio SoD graph review. Zero violations.', evidence: 'SOX-Q1-SoD.pdf' },
      { itemId: 'CTL-011', itemName: 'SOX Financial Close Attestation', result: 'Pass', note: 'Controller attestation on file for all 8 projects.', evidence: 'SOX-Q1-Attestation.pdf' },
    ],
    findings: [],
    trailEntries: [
      { action: 'Occurrence created by A-206', user: 'A-206', initials: 'AI', ts: '2026-04-30T08:00:00Z' },
      { action: 'Checklist completed', user: 'Daniel Cho', initials: 'DC', ts: '2026-04-30T11:00:00Z' },
      { action: 'Submitted for review', user: 'Daniel Cho', initials: 'DC', ts: '2026-04-30T11:05:00Z' },
      { action: 'Approved — result: Pass', user: 'Hasit Chetal', initials: 'HC', ts: '2026-05-01T09:00:00Z' },
    ],
  },
  // AO-1206: Scheduled — next month
  {
    id: 'AO-1206', scheduleId: 'AS-001', scheduleName: 'Monthly Financial Controls Review',
    type: 'controls', projectNames: ['Henderson Substation', 'Pryor Creek'],
    dueDate: '2026-07-01', auditorId: 'USR-007', auditorName: 'Daniel Cho',
    ownerId: 'USR-003', ownerName: 'Hasit Chetal',
    status: 'Scheduled', overallResult: null,
    isAutoGenerated: true, isAtRisk: false,
    checklist: [], findings: [],
    trailEntries: [
      { action: 'Occurrence created by A-206', user: 'A-206', initials: 'AI', ts: '2026-06-26T08:00:00Z' },
    ],
  },
  // AO-1207: Scheduled — Environmental
  {
    id: 'AO-1207', scheduleId: 'AS-006', scheduleName: 'Semi-Annual Environmental Controls Review',
    type: 'controls', projectNames: ['Mesa Power', 'Dallas Cooling'],
    dueDate: '2026-07-01', auditorId: 'USR-007', auditorName: 'Daniel Cho',
    ownerId: 'USR-009', ownerName: 'Priya Nair',
    status: 'Scheduled', overallResult: null,
    isAutoGenerated: true, isAtRisk: true,
    checklist: [], findings: [],
    trailEntries: [
      { action: 'Occurrence created by A-206', user: 'A-206', initials: 'AI', ts: '2026-06-20T08:00:00Z' },
      { action: 'A-206: Flagged At Risk — Priya Nair has 2 overdue items', user: 'A-206', initials: 'AI', ts: '2026-06-22T08:00:00Z' },
    ],
  },
  // AO-1208: Completed — Monthly Procurement prior month
  {
    id: 'AO-1208', scheduleId: 'AS-003', scheduleName: 'Monthly Procurement Controls Check',
    type: 'controls', projectNames: ['Mesa Power', 'Dallas Cooling', 'Council Bluffs'],
    dueDate: '2026-05-31', auditorId: 'USR-005', auditorName: 'Alice Cox',
    ownerId: 'USR-003', ownerName: 'Hasit Chetal',
    status: 'Completed', overallResult: 'Pass',
    isAutoGenerated: false, isAtRisk: false,
    checklist: [
      { itemId: 'CTL-005', itemName: 'Vendor Invoice Three-Way Match', result: 'Pass', note: 'All invoices matched.', evidence: 'CTL005-May-invoices.xlsx' },
      { itemId: 'CTL-012', itemName: 'Subcontractor Bid Evaluation Documented', result: 'Pass', note: 'Two bids above threshold; both have 3+ documented competing bids.', evidence: 'CTL012-May-bids.pdf' },
    ],
    findings: [],
    trailEntries: [
      { action: 'Occurrence created manually', user: 'Alice Cox', initials: 'AC', ts: '2026-06-01T09:30:00Z' },
      { action: 'Approved — result: Pass', user: 'Hasit Chetal', initials: 'HC', ts: '2026-06-03T10:00:00Z' },
    ],
  },
  // AO-1209: Scheduled — next quarter
  {
    id: 'AO-1209', scheduleId: 'AS-002', scheduleName: 'Quarterly SOX Controls Attestation',
    type: 'controls', projectNames: ['All Projects'],
    dueDate: '2026-07-31', auditorId: 'USR-007', auditorName: 'Daniel Cho',
    ownerId: 'USR-003', ownerName: 'Hasit Chetal',
    status: 'Scheduled', overallResult: null,
    isAutoGenerated: true, isAtRisk: false,
    checklist: [], findings: [],
    trailEntries: [
      { action: 'Occurrence created by A-206', user: 'A-206', initials: 'AI', ts: '2026-06-26T08:00:00Z' },
    ],
  },
]

// ════════════════════════════════════════════════════════════════════════════
// MODULE 3 — RISK AUDIT
// ════════════════════════════════════════════════════════════════════════════

export type RiskCategory = 'Financial' | 'Legal/Compliance' | 'Supply Chain' | 'Schedule' | 'Safety' | 'Operational' | 'Environmental' | 'Cyber/IT'
export type RiskMitigationStatus = 'Planned' | 'In-Progress' | 'Done' | 'Overdue'
export type RiskStatus = 'Open' | 'Monitoring' | 'Closed'
export type RiskFailReason = 'Stale' | 'Score Drift' | 'No/Weak Mitigation' | 'Owner Unassigned' | 'Mitigation Overdue'

export interface RiskItem {
  id: string
  project: string
  projectName: string
  category: RiskCategory
  title: string
  likelihood: 1 | 2 | 3 | 4 | 5
  impact: 1 | 2 | 3 | 4 | 5
  score: number
  ownerId: string
  ownerName: string
  mitigation: string
  mitigationStatus: RiskMitigationStatus
  status: RiskStatus
  lastReviewed: string | null
  daysSinceReview: number
}

export const RISK_ITEMS: RiskItem[] = [
  { id: 'R-001', project: 'PRJ-001', projectName: 'Henderson Substation', category: 'Financial', title: 'PO approval authority exceeded — potential unauthorised commitment', likelihood: 3, impact: 4, score: 12, ownerId: 'USR-003', ownerName: 'Hasit Chetal', mitigation: 'Automated threshold enforcement in ERP; weekly exception report to Controls Lead.', mitigationStatus: 'In-Progress', status: 'Open', lastReviewed: '2026-06-01', daysSinceReview: 25 },
  { id: 'R-002', project: 'PRJ-002', projectName: 'Pryor Creek', category: 'Financial', title: 'Change order scope creep exceeding approved budget envelope', likelihood: 4, impact: 4, score: 16, ownerId: 'USR-004', ownerName: 'Sophia Lamb', mitigation: 'Change control board review required for COs above 5% of contract value.', mitigationStatus: 'In-Progress', status: 'Open', lastReviewed: '2026-06-10', daysSinceReview: 16 },
  { id: 'R-003', project: 'PRJ-003', projectName: 'Mesa Power', category: 'Legal/Compliance', title: 'Construction commenced without valid AHJ permit', likelihood: 4, impact: 5, score: 20, ownerId: 'USR-009', ownerName: 'Priya Nair', mitigation: 'Immediate halt to Phase 2 mobilisation until permit received; AHJ expedite request filed.', mitigationStatus: 'Overdue', status: 'Open', lastReviewed: '2026-06-15', daysSinceReview: 11 },
  { id: 'R-004', project: 'PRJ-002', projectName: 'Pryor Creek', category: 'Schedule', title: 'SPI drift risk — civil works bottleneck post-weather event', likelihood: 3, impact: 3, score: 9, ownerId: 'USR-004', ownerName: 'Sophia Lamb', mitigation: 'Weekend crew mobilisation approved; crane re-sequenced to avoid critical path delay.', mitigationStatus: 'In-Progress', status: 'Monitoring', lastReviewed: '2026-06-20', daysSinceReview: 6 },
  { id: 'R-005', project: 'PRJ-004', projectName: 'Atlanta DC-3', category: 'Financial', title: 'Delegated approval ceiling not enforced in interim procurement system', likelihood: 2, impact: 4, score: 8, ownerId: 'USR-003', ownerName: 'Hasit Chetal', mitigation: 'Manual approval gate implemented; ERP upgrade scheduled for Q3.', mitigationStatus: 'In-Progress', status: 'Monitoring', lastReviewed: '2026-06-01', daysSinceReview: 25 },
  { id: 'R-006', project: 'PRJ-003', projectName: 'Mesa Power', category: 'Environmental', title: 'EPA stormwater permit expiry — potential stop-work order', likelihood: 4, impact: 4, score: 16, ownerId: 'USR-009', ownerName: 'Priya Nair', mitigation: 'Permit renewal package submitted to EPA; response expected within 30 days.', mitigationStatus: 'In-Progress', status: 'Open', lastReviewed: '2026-06-18', daysSinceReview: 8 },
  { id: 'R-007', project: 'PRJ-001', projectName: 'Henderson Substation', category: 'Legal/Compliance', title: 'Utility interconnect agreement milestones not tracked', likelihood: 2, impact: 5, score: 10, ownerId: 'USR-009', ownerName: 'Priya Nair', mitigation: 'Milestone calendar established in project tracking; Legal review scheduled quarterly.', mitigationStatus: 'Planned', status: 'Open', lastReviewed: null, daysSinceReview: 180 },
  { id: 'R-008', project: 'PRJ-005', projectName: 'Lenoir Fiber', category: 'Operational', title: 'Contractor COI gaps — liability exposure during construction', likelihood: 3, impact: 3, score: 9, ownerId: 'USR-008', ownerName: 'Lena Ortiz', mitigation: 'COI tracking spreadsheet reviewed weekly; non-compliant contractors suspended.', mitigationStatus: 'In-Progress', status: 'Open', lastReviewed: '2026-05-01', daysSinceReview: 56 },
  { id: 'R-009', project: 'PRJ-003', projectName: 'Mesa Power', category: 'Supply Chain', title: 'Single-source transformer vendor risk — 18-week lead time exposure', likelihood: 3, impact: 5, score: 15, ownerId: 'USR-003', ownerName: 'Hasit Chetal', mitigation: 'Second-source vendor qualified; split order placed to reduce single-source dependency.', mitigationStatus: 'In-Progress', status: 'Open', lastReviewed: '2026-06-05', daysSinceReview: 21 },
  { id: 'R-010', project: 'PRJ-001', projectName: 'Henderson Substation', category: 'Safety', title: 'High-voltage energisation near active construction crew', likelihood: 2, impact: 5, score: 10, ownerId: 'USR-009', ownerName: 'Priya Nair', mitigation: 'Exclusion zone established; toolbox talks held daily during energisation window.', mitigationStatus: 'Done', status: 'Monitoring', lastReviewed: '2026-06-22', daysSinceReview: 4 },
  { id: 'R-011', project: 'PRJ-004', projectName: 'Atlanta DC-3', category: 'Cyber/IT', title: 'Stale contractor accounts with active system access', likelihood: 3, impact: 3, score: 9, ownerId: 'USR-005', ownerName: 'Alice Cox', mitigation: 'HR-IT offboarding process tightened; automated deprovisioning script in UAT.', mitigationStatus: 'In-Progress', status: 'Open', lastReviewed: '2026-06-24', daysSinceReview: 2 },
  { id: 'R-012', project: 'PRJ-008', projectName: 'Ashburn Pod 6', category: 'Cyber/IT', title: 'Backup restore not tested in > 90 days', likelihood: 2, impact: 4, score: 8, ownerId: 'USR-005', ownerName: 'Alice Cox', mitigation: 'Monthly backup restore test added to IT runbook; first test completed 2026-06-22.', mitigationStatus: 'Done', status: 'Monitoring', lastReviewed: '2026-03-01', daysSinceReview: 117 },
  // Two with no/weak mitigation — stale
  { id: 'R-013', project: 'PRJ-001', projectName: 'Henderson Substation', category: 'Operational', title: 'Force majeure event without documented protocol', likelihood: 1, impact: 3, score: 3, ownerId: 'USR-003', ownerName: 'Hasit Chetal', mitigation: '', mitigationStatus: 'Planned', status: 'Open', lastReviewed: null, daysSinceReview: 210 },
  { id: 'R-014', project: 'PRJ-007', projectName: 'Council Bluffs', category: 'Supply Chain', title: 'LLE cable sourcing shortage — 12-week buffer exhausted', likelihood: 4, impact: 4, score: 16, ownerId: 'USR-006', ownerName: 'Sreya Mukherjee', mitigation: '', mitigationStatus: 'Planned', status: 'Open', lastReviewed: '2026-03-15', daysSinceReview: 103 },
]

// ── Risk Audit Schedules ───────────────────────────────────────────────────
export const RISK_AUDIT_SCHEDULES: AuditSchedule[] = [
  {
    id: 'AS-101', name: 'Quarterly Risk Register Review — Henderson & Pryor Creek',
    type: 'risk', scopeProjects: ['PRJ-001', 'PRJ-002'],
    scopeItemIds: ['R-001', 'R-002', 'R-004', 'R-005', 'R-007', 'R-010', 'R-013'],
    frequency: 'Quarterly', startDate: '2026-01-01', time: '09:00', timezone: 'America/New_York',
    assignedAuditorId: 'USR-007', assignedAuditorName: 'Daniel Cho',
    accountableOwnerId: 'USR-003', accountableOwnerName: 'Hasit Chetal',
    reminderLeadDays: 7, graceDays: 3, status: 'Active',
    nextRun: '2026-07-01', lastRun: '2026-04-01',
  },
  {
    id: 'AS-102', name: 'Monthly Critical Risk Flash — Mesa Power',
    type: 'risk', scopeProjects: ['PRJ-003'],
    scopeItemIds: ['R-003', 'R-006', 'R-009'],
    frequency: 'Monthly', startDate: '2026-03-01', time: '08:00', timezone: 'America/Los_Angeles',
    assignedAuditorId: 'USR-007', assignedAuditorName: 'Daniel Cho',
    accountableOwnerId: 'USR-009', accountableOwnerName: 'Priya Nair',
    reminderLeadDays: 3, graceDays: 2, status: 'Active',
    nextRun: '2026-06-30', lastRun: '2026-05-31',
  },
  {
    id: 'AS-103', name: 'Quarterly Supply Chain & Environmental Risk Review',
    type: 'risk', scopeProjects: ['PRJ-003', 'PRJ-007'],
    scopeItemIds: ['R-006', 'R-009', 'R-014'],
    frequency: 'Quarterly', startDate: '2026-01-01', time: '10:00', timezone: 'America/Chicago',
    assignedAuditorId: 'USR-006', assignedAuditorName: 'Sreya Mukherjee',
    accountableOwnerId: 'USR-003', accountableOwnerName: 'Hasit Chetal',
    reminderLeadDays: 7, graceDays: 5, status: 'Active',
    nextRun: '2026-07-01', lastRun: '2026-04-01',
  },
  {
    id: 'AS-104', name: 'Monthly IT & Safety Risk Review — Atlanta DC-3 & Ashburn Pod 6',
    type: 'risk', scopeProjects: ['PRJ-004', 'PRJ-008'],
    scopeItemIds: ['R-011', 'R-012'],
    frequency: 'Monthly', startDate: '2026-01-01', time: '14:00', timezone: 'America/New_York',
    assignedAuditorId: 'USR-007', assignedAuditorName: 'Daniel Cho',
    accountableOwnerId: 'USR-005', accountableOwnerName: 'Alice Cox',
    reminderLeadDays: 3, graceDays: 2, status: 'Active',
    nextRun: '2026-07-01', lastRun: '2026-06-01',
  },
  {
    id: 'AS-105', name: 'Weekly Critical Risk Watchlist — Open P1 Risks',
    type: 'risk', scopeProjects: ['PRJ-001','PRJ-002','PRJ-003','PRJ-004','PRJ-005','PRJ-006','PRJ-007','PRJ-008'],
    scopeItemIds: ['R-002', 'R-003', 'R-006', 'R-009', 'R-014'],
    frequency: 'Weekly', startDate: '2026-06-01', time: '08:00', timezone: 'America/New_York',
    assignedAuditorId: 'USR-003', assignedAuditorName: 'Hasit Chetal',
    accountableOwnerId: 'USR-001', accountableOwnerName: 'Brian Smith',
    reminderLeadDays: 1, graceDays: 1, status: 'Active',
    nextRun: '2026-06-27', lastRun: '2026-06-20',
  },
]

// ── Risk Audit Occurrences ─────────────────────────────────────────────────
export const RISK_AUDIT_OCCURRENCES: AuditOccurrence[] = [
  // AO-2101: Completed — Q1 Henderson/Pryor Creek
  {
    id: 'AO-2101', scheduleId: 'AS-101', scheduleName: 'Quarterly Risk Register Review',
    type: 'risk', projectNames: ['Henderson Substation', 'Pryor Creek'],
    dueDate: '2026-04-01', auditorId: 'USR-007', auditorName: 'Daniel Cho',
    ownerId: 'USR-003', ownerName: 'Hasit Chetal',
    status: 'Completed', overallResult: 'Partial',
    isAutoGenerated: true, isAtRisk: false,
    checklist: [
      { itemId: 'R-001', itemName: 'PO approval authority exceeded', result: 'Pass', note: 'Score unchanged. Mitigation progressing well.', likelihood: 3, impact: 4, score: 12, daysSinceReview: 0, mitigationStatus: 'In-Progress', evidence: null },
      { itemId: 'R-002', itemName: 'Change order scope creep', result: 'Pass', note: 'Change control board active. No budget breaches.', likelihood: 4, impact: 4, score: 16, daysSinceReview: 0, mitigationStatus: 'In-Progress', evidence: null },
      { itemId: 'R-007', itemName: 'Utility interconnect agreement milestones not tracked', result: 'Fail', note: 'No owner assigned. Last reviewed > 90d ago. Risk of milestone slippage.', likelihood: 2, impact: 5, score: 10, daysSinceReview: 120, mitigationStatus: 'Planned', failReason: 'Owner Unassigned', evidence: null },
      { itemId: 'R-013', itemName: 'Force majeure event without documented protocol', result: 'Fail', note: 'No mitigation plan on file. Never reviewed.', likelihood: 1, impact: 3, score: 3, daysSinceReview: 180, mitigationStatus: 'Planned', failReason: 'No/Weak Mitigation', evidence: null },
    ],
    findings: [
      { id: 'FND-R001', occurrenceId: 'AO-2101', severity: 'High', description: 'R-007: No owner assigned to utility interconnect risk. Milestone calendar not in place.', remediationOwnerId: 'USR-003', remediationOwnerName: 'Hasit Chetal', dueDate: '2026-04-15', status: 'Closed', linkedItemId: 'R-007' },
    ],
    trailEntries: [
      { action: 'Occurrence created by A-206', user: 'A-206', initials: 'AI', ts: '2026-04-01T08:00:00Z' },
      { action: 'Checklist completed', user: 'Daniel Cho', initials: 'DC', ts: '2026-04-01T14:00:00Z' },
      { action: 'Submitted for review', user: 'Daniel Cho', initials: 'DC', ts: '2026-04-01T14:05:00Z' },
      { action: 'Approved — result: Partial', user: 'Hasit Chetal', initials: 'HC', ts: '2026-04-02T09:00:00Z' },
    ],
  },
  // AO-2102: Overdue — Mesa Power monthly (Q2 June)
  {
    id: 'AO-2102', scheduleId: 'AS-102', scheduleName: 'Monthly Critical Risk Flash — Mesa Power',
    type: 'risk', projectNames: ['Mesa Power'],
    dueDate: '2026-05-31', auditorId: 'USR-007', auditorName: 'Daniel Cho',
    ownerId: 'USR-009', ownerName: 'Priya Nair',
    status: 'Overdue', overallResult: null,
    isAutoGenerated: true, isAtRisk: false,
    checklist: [
      { itemId: 'R-003', itemName: 'Construction commenced without valid AHJ permit', result: 'Fail', note: 'Confirmed — Phase 2 mobilised without permit. Stop-work risk active.', likelihood: 4, impact: 5, score: 20, daysSinceReview: 0, mitigationStatus: 'Overdue', failReason: 'Mitigation Overdue', evidence: null },
    ],
    findings: [
      { id: 'FND-R002', occurrenceId: 'AO-2102', severity: 'Critical', description: 'R-003: Mesa Power Phase 2 construction commenced without AHJ permit. Immediate regulatory risk.', remediationOwnerId: 'USR-009', remediationOwnerName: 'Priya Nair', dueDate: '2026-06-05', status: 'In Progress', linkedItemId: 'R-003' },
    ],
    trailEntries: [
      { action: 'Occurrence created by A-206', user: 'A-206', initials: 'AI', ts: '2026-05-31T08:00:00Z' },
      { action: 'A-206: Flipped to Overdue — grace period expired', user: 'A-206', initials: 'AI', ts: '2026-06-03T08:00:00Z' },
    ],
  },
  // AO-2103: In Progress — Weekly P1 watchlist
  {
    id: 'AO-2103', scheduleId: 'AS-105', scheduleName: 'Weekly Critical Risk Watchlist',
    type: 'risk', projectNames: ['Multiple'],
    dueDate: '2026-06-27', auditorId: 'USR-003', auditorName: 'Hasit Chetal',
    ownerId: 'USR-001', ownerName: 'Brian Smith',
    status: 'In Progress', overallResult: null,
    isAutoGenerated: true, isAtRisk: false,
    checklist: [
      { itemId: 'R-002', itemName: 'Change order scope creep', result: 'Pass', note: 'Within tolerance. One CO pending review.', likelihood: 4, impact: 4, score: 16, daysSinceReview: 6, mitigationStatus: 'In-Progress', evidence: null },
      { itemId: 'R-003', itemName: 'Construction commenced without valid AHJ permit', result: 'Fail', note: 'Permit still outstanding. No progress since last week.', likelihood: 4, impact: 5, score: 20, daysSinceReview: 11, mitigationStatus: 'Overdue', failReason: 'Mitigation Overdue', evidence: null },
      { itemId: 'R-006', itemName: 'EPA stormwater permit expiry', result: 'Partial', note: 'Renewal submitted but no confirmation. 19 days to expiry.', likelihood: 4, impact: 4, score: 16, daysSinceReview: 8, mitigationStatus: 'In-Progress', evidence: null },
      { itemId: 'R-009', itemName: 'Single-source transformer vendor risk', result: 'N/A', note: 'Second source confirmed — risk downgraded to monitoring.', likelihood: 3, impact: 5, score: 15, daysSinceReview: 21, mitigationStatus: 'In-Progress', evidence: null },
      { itemId: 'R-014', itemName: 'LLE cable sourcing shortage', result: 'Fail', note: 'No mitigation plan. 103d since last review.', likelihood: 4, impact: 4, score: 16, daysSinceReview: 103, mitigationStatus: 'Planned', failReason: 'Stale', evidence: null },
    ],
    findings: [],
    trailEntries: [
      { action: 'Occurrence created by A-206', user: 'A-206', initials: 'AI', ts: '2026-06-26T08:00:00Z' },
      { action: 'Review in progress', user: 'Hasit Chetal', initials: 'HC', ts: '2026-06-26T10:00:00Z' },
    ],
  },
  // AO-2104: Pending Review — IT/Safety
  {
    id: 'AO-2104', scheduleId: 'AS-104', scheduleName: 'Monthly IT & Safety Risk Review',
    type: 'risk', projectNames: ['Atlanta DC-3', 'Ashburn Pod 6'],
    dueDate: '2026-06-25', auditorId: 'USR-007', auditorName: 'Daniel Cho',
    ownerId: 'USR-005', ownerName: 'Alice Cox',
    status: 'Pending Review', overallResult: 'Partial',
    isAutoGenerated: false, isAtRisk: false,
    checklist: [
      { itemId: 'R-011', itemName: 'Stale contractor accounts with active system access', result: 'Partial', note: 'Deprovisioning script in UAT. 4 accounts still active.', likelihood: 3, impact: 3, score: 9, daysSinceReview: 2, mitigationStatus: 'In-Progress', evidence: null },
      { itemId: 'R-012', itemName: 'Backup restore not tested in > 90 days', result: 'Pass', note: 'Restore test passed on 2026-06-22. Monthly schedule in place.', likelihood: 2, impact: 4, score: 8, daysSinceReview: 2, mitigationStatus: 'Done', evidence: 'backup-restore-log-Jun22.txt' },
    ],
    findings: [
      { id: 'FND-R003', occurrenceId: 'AO-2104', severity: 'Medium', description: 'R-011: 4 stale contractor accounts remain active pending deprovisioning script deployment.', remediationOwnerId: 'USR-005', remediationOwnerName: 'Alice Cox', dueDate: '2026-07-05', status: 'Open', linkedItemId: 'R-011' },
    ],
    trailEntries: [
      { action: 'Occurrence created manually', user: 'Alice Cox', initials: 'AC', ts: '2026-06-20T09:00:00Z' },
      { action: 'Checklist completed', user: 'Daniel Cho', initials: 'DC', ts: '2026-06-25T15:00:00Z' },
      { action: 'Submitted for review', user: 'Daniel Cho', initials: 'DC', ts: '2026-06-25T15:03:00Z' },
    ],
  },
  // AO-2105: Scheduled — Q3 Henderson/Pryor Creek
  {
    id: 'AO-2105', scheduleId: 'AS-101', scheduleName: 'Quarterly Risk Register Review',
    type: 'risk', projectNames: ['Henderson Substation', 'Pryor Creek'],
    dueDate: '2026-07-01', auditorId: 'USR-007', auditorName: 'Daniel Cho',
    ownerId: 'USR-003', ownerName: 'Hasit Chetal',
    status: 'Scheduled', overallResult: null,
    isAutoGenerated: true, isAtRisk: true,
    checklist: [], findings: [],
    trailEntries: [
      { action: 'Occurrence created by A-206', user: 'A-206', initials: 'AI', ts: '2026-06-24T08:00:00Z' },
      { action: 'A-206: Flagged At Risk — 2 stale risks (R-007, R-013) likely to fail', user: 'A-206', initials: 'AI', ts: '2026-06-24T08:01:00Z' },
    ],
  },
  // AO-2106: Scheduled — Supply Chain Q3
  {
    id: 'AO-2106', scheduleId: 'AS-103', scheduleName: 'Quarterly Supply Chain & Environmental Risk Review',
    type: 'risk', projectNames: ['Mesa Power', 'Council Bluffs'],
    dueDate: '2026-07-01', auditorId: 'USR-006', auditorName: 'Sreya Mukherjee',
    ownerId: 'USR-003', ownerName: 'Hasit Chetal',
    status: 'Scheduled', overallResult: null,
    isAutoGenerated: true, isAtRisk: false,
    checklist: [], findings: [],
    trailEntries: [
      { action: 'Occurrence created by A-206', user: 'A-206', initials: 'AI', ts: '2026-06-24T08:00:00Z' },
    ],
  },
]

// ════════════════════════════════════════════════════════════════════════════
// MODULE 4 — COMPLIANCE AUDIT
// ════════════════════════════════════════════════════════════════════════════

export type ComplianceFramework = 'OSHA' | 'EPA' | 'SOX' | 'Local Permit' | 'Contractual' | 'ISO 27001'
export type ComplianceItemStatus = 'Compliant' | 'Non-Compliant' | 'Expiring' | 'Pending'
export type OccurrenceCheckResult = 'Compliant' | 'Non-Compliant' | 'Expiring'

export interface ComplianceItem {
  id: string
  requirement: string
  framework: ComplianceFramework
  project: string
  projectName: string
  ownerId: string
  ownerName: string
  evidence: string
  expiryDate: string | null
  daysToExpiry: number | null
  status: ComplianceItemStatus
  lastVerified: string | null
}

export const COMPLIANCE_ITEMS: ComplianceItem[] = [
  { id: 'CMP-001', requirement: 'Certificate of Insurance — General Liability — Ridgeline Electric', framework: 'Contractual', project: 'PRJ-003', projectName: 'Mesa Power', ownerId: 'USR-008', ownerName: 'Lena Ortiz', evidence: 'COI-Ridgeline-Electric-2026.pdf', expiryDate: '2026-07-10', daysToExpiry: 14, status: 'Expiring', lastVerified: '2026-06-01' },
  { id: 'CMP-002', requirement: 'Certificate of Insurance — Workers Comp — Apex Steel', framework: 'Contractual', project: 'PRJ-001', projectName: 'Henderson Substation', ownerId: 'USR-008', ownerName: 'Lena Ortiz', evidence: 'COI-Apex-Steel-WC-2026.pdf', expiryDate: '2026-08-31', daysToExpiry: 66, status: 'Compliant', lastVerified: '2026-06-10' },
  { id: 'CMP-003', requirement: 'AHJ Construction Permit — Mesa Power Phase 2', framework: 'Local Permit', project: 'PRJ-003', projectName: 'Mesa Power', ownerId: 'USR-009', ownerName: 'Priya Nair', evidence: 'MISSING', expiryDate: null, daysToExpiry: null, status: 'Non-Compliant', lastVerified: '2026-04-10' },
  { id: 'CMP-004', requirement: 'EPA Stormwater (SWPPP) Permit — Mesa Power', framework: 'EPA', project: 'PRJ-003', projectName: 'Mesa Power', ownerId: 'USR-009', ownerName: 'Priya Nair', evidence: 'EPA-SWPPP-Mesa-2025.pdf', expiryDate: '2026-07-15', daysToExpiry: 19, status: 'Expiring', lastVerified: '2026-06-01' },
  { id: 'CMP-005', requirement: 'OSHA 300 Log — Safety Incident Register (YTD)', framework: 'OSHA', project: 'PRJ-001', projectName: 'Henderson Substation', ownerId: 'USR-009', ownerName: 'Priya Nair', evidence: 'OSHA-300-Henderson-2026-YTD.xlsx', expiryDate: null, daysToExpiry: null, status: 'Compliant', lastVerified: '2026-06-15' },
  { id: 'CMP-006', requirement: 'SOX Internal Controls Evidence Pack — Q2 2026', framework: 'SOX', project: 'PRJ-001', projectName: 'Henderson Substation', ownerId: 'USR-003', ownerName: 'Hasit Chetal', evidence: 'SOX-Q2-Controls-Evidence.pdf', expiryDate: '2026-07-31', daysToExpiry: 35, status: 'Pending', lastVerified: null },
  { id: 'CMP-007', requirement: 'Certificate of Insurance — General Liability — Crestway Concrete', framework: 'Contractual', project: 'PRJ-002', projectName: 'Pryor Creek', ownerId: 'USR-008', ownerName: 'Lena Ortiz', evidence: 'COI-Crestway-2026.pdf', expiryDate: '2026-06-30', daysToExpiry: 4, status: 'Expiring', lastVerified: '2026-05-01' },
  { id: 'CMP-008', requirement: 'Utility Interconnect Agreement — Henderson AHJ', framework: 'Local Permit', project: 'PRJ-001', projectName: 'Henderson Substation', ownerId: 'USR-009', ownerName: 'Priya Nair', evidence: 'MISSING', expiryDate: null, daysToExpiry: null, status: 'Non-Compliant', lastVerified: null },
  { id: 'CMP-009', requirement: 'ISO 27001 Access Control Evidence — Atlanta DC-3', framework: 'ISO 27001', project: 'PRJ-004', projectName: 'Atlanta DC-3', ownerId: 'USR-005', ownerName: 'Alice Cox', evidence: 'ISO27001-Access-Q2-2026.pdf', expiryDate: '2026-09-30', daysToExpiry: 96, status: 'Compliant', lastVerified: '2026-06-24' },
  { id: 'CMP-010', requirement: 'Environmental Compliance Certificate — Dallas Cooling', framework: 'EPA', project: 'PRJ-006', projectName: 'Dallas Cooling', ownerId: 'USR-009', ownerName: 'Priya Nair', evidence: 'EPA-Dallas-Cooling-2026.pdf', expiryDate: '2026-12-31', daysToExpiry: 188, status: 'Compliant', lastVerified: '2026-04-01' },
  { id: 'CMP-011', requirement: 'Contractor Safety Orientation Records — Council Bluffs', framework: 'OSHA', project: 'PRJ-007', projectName: 'Council Bluffs', ownerId: 'USR-008', ownerName: 'Lena Ortiz', evidence: 'Safety-Orient-CBL-Jun2026.pdf', expiryDate: null, daysToExpiry: null, status: 'Compliant', lastVerified: '2026-06-20' },
  { id: 'CMP-012', requirement: 'Certificate of Insurance — Professional Liability — Lenoir Fiber PM', framework: 'Contractual', project: 'PRJ-005', projectName: 'Lenoir Fiber', ownerId: 'USR-008', ownerName: 'Lena Ortiz', evidence: 'COI-LNR-ProfLiab-2026.pdf', expiryDate: '2026-07-20', daysToExpiry: 24, status: 'Expiring', lastVerified: '2026-05-20' },
  { id: 'CMP-013', requirement: 'SOX Financial Close Sign-Off — Q1 2026 — All Projects', framework: 'SOX', project: 'PRJ-001', projectName: 'Henderson Substation', ownerId: 'USR-004', ownerName: 'Sophia Lamb', evidence: 'SOX-Q1-Financial-Close.pdf', expiryDate: null, daysToExpiry: null, status: 'Compliant', lastVerified: '2026-04-30' },
  { id: 'CMP-014', requirement: 'OSHA 300 Log — Mesa Power (YTD)', framework: 'OSHA', project: 'PRJ-003', projectName: 'Mesa Power', ownerId: 'USR-009', ownerName: 'Priya Nair', evidence: 'OSHA-300-Mesa-2026-YTD.xlsx', expiryDate: null, daysToExpiry: null, status: 'Compliant', lastVerified: '2026-06-15' },
  { id: 'CMP-015', requirement: 'Certificate of Insurance — General Liability — Ashburn Pod 6 Main GC', framework: 'Contractual', project: 'PRJ-008', projectName: 'Ashburn Pod 6', ownerId: 'USR-008', ownerName: 'Lena Ortiz', evidence: 'COI-Ashburn-GC-2026.pdf', expiryDate: '2026-09-15', daysToExpiry: 81, status: 'Compliant', lastVerified: '2026-06-05' },
  { id: 'CMP-016', requirement: 'Local Grading Permit — Council Bluffs Phase 1', framework: 'Local Permit', project: 'PRJ-007', projectName: 'Council Bluffs', ownerId: 'USR-009', ownerName: 'Priya Nair', evidence: 'MISSING', expiryDate: null, daysToExpiry: null, status: 'Non-Compliant', lastVerified: '2026-05-01' },
  { id: 'CMP-017', requirement: 'ISO 27001 Backup & Recovery Evidence — Ashburn Pod 6', framework: 'ISO 27001', project: 'PRJ-008', projectName: 'Ashburn Pod 6', ownerId: 'USR-005', ownerName: 'Alice Cox', evidence: 'ISO27001-Backup-Ashburn-Q2.pdf', expiryDate: '2026-09-30', daysToExpiry: 96, status: 'Compliant', lastVerified: '2026-06-22' },
  { id: 'CMP-018', requirement: 'EPA Air Quality Compliance Certificate — Council Bluffs', framework: 'EPA', project: 'PRJ-007', projectName: 'Council Bluffs', ownerId: 'USR-009', ownerName: 'Priya Nair', evidence: 'EPA-Air-Quality-CBL-2026.pdf', expiryDate: '2026-08-01', daysToExpiry: 36, status: 'Expiring', lastVerified: '2026-05-01' },
]

// ── Compliance Audit Schedules ─────────────────────────────────────────────
export const COMPLIANCE_AUDIT_SCHEDULES: AuditSchedule[] = [
  {
    id: 'AS-201', name: 'Monthly COI Verification — All Projects',
    type: 'compliance', scopeProjects: ['PRJ-001','PRJ-002','PRJ-003','PRJ-004','PRJ-005','PRJ-006','PRJ-007','PRJ-008'],
    scopeItemIds: ['CMP-001','CMP-002','CMP-007','CMP-012','CMP-015'],
    frequency: 'Monthly', startDate: '2026-01-01', time: '09:00', timezone: 'America/New_York',
    assignedAuditorId: 'USR-008', assignedAuditorName: 'Lena Ortiz',
    accountableOwnerId: 'USR-003', accountableOwnerName: 'Hasit Chetal',
    reminderLeadDays: 5, graceDays: 2, status: 'Active',
    nextRun: '2026-06-30', lastRun: '2026-05-31',
  },
  {
    id: 'AS-202', name: 'Quarterly Permit Review — Mesa Power',
    type: 'compliance', scopeProjects: ['PRJ-003'],
    scopeItemIds: ['CMP-003', 'CMP-004'],
    frequency: 'Quarterly', startDate: '2026-01-01', time: '09:00', timezone: 'America/Los_Angeles',
    assignedAuditorId: 'USR-009', assignedAuditorName: 'Priya Nair',
    accountableOwnerId: 'USR-009', accountableOwnerName: 'Priya Nair',
    reminderLeadDays: 7, graceDays: 3, status: 'Active',
    nextRun: '2026-07-01', lastRun: '2026-04-01',
  },
  {
    id: 'AS-203', name: 'Annual SOX Controls Evidence Collection',
    type: 'compliance', scopeProjects: ['PRJ-001','PRJ-002','PRJ-003','PRJ-004','PRJ-005','PRJ-006','PRJ-007','PRJ-008'],
    scopeItemIds: ['CMP-006', 'CMP-013'],
    frequency: 'Annual', startDate: '2026-01-01', time: '08:00', timezone: 'America/New_York',
    assignedAuditorId: 'USR-007', assignedAuditorName: 'Daniel Cho',
    accountableOwnerId: 'USR-004', accountableOwnerName: 'Sophia Lamb',
    reminderLeadDays: 14, graceDays: 7, status: 'Active',
    nextRun: '2026-07-31', lastRun: '2026-04-30',
  },
  {
    id: 'AS-204', name: 'Bi-Monthly OSHA Safety Record Review',
    type: 'compliance', scopeProjects: ['PRJ-001', 'PRJ-003', 'PRJ-007'],
    scopeItemIds: ['CMP-005', 'CMP-011', 'CMP-014'],
    frequency: 'Monthly', startDate: '2026-01-01', time: '10:00', timezone: 'America/Chicago',
    assignedAuditorId: 'USR-008', assignedAuditorName: 'Lena Ortiz',
    accountableOwnerId: 'USR-009', accountableOwnerName: 'Priya Nair',
    reminderLeadDays: 3, graceDays: 2, status: 'Active',
    nextRun: '2026-07-01', lastRun: '2026-06-01',
  },
  {
    id: 'AS-205', name: 'Quarterly ISO 27001 Evidence Review — Data Centers',
    type: 'compliance', scopeProjects: ['PRJ-004', 'PRJ-008'],
    scopeItemIds: ['CMP-009', 'CMP-017'],
    frequency: 'Quarterly', startDate: '2026-01-01', time: '14:00', timezone: 'America/New_York',
    assignedAuditorId: 'USR-007', assignedAuditorName: 'Daniel Cho',
    accountableOwnerId: 'USR-005', accountableOwnerName: 'Alice Cox',
    reminderLeadDays: 7, graceDays: 3, status: 'Active',
    nextRun: '2026-07-01', lastRun: '2026-04-01',
  },
]

// ── Compliance Audit Occurrences ───────────────────────────────────────────
export const COMPLIANCE_AUDIT_OCCURRENCES: AuditOccurrence[] = [
  // AO-3201: Overdue — COI Monthly (June)
  {
    id: 'AO-3201', scheduleId: 'AS-201', scheduleName: 'Monthly COI Verification',
    type: 'compliance', projectNames: ['All Projects'],
    dueDate: '2026-05-31', auditorId: 'USR-008', auditorName: 'Lena Ortiz',
    ownerId: 'USR-003', ownerName: 'Hasit Chetal',
    status: 'Overdue', overallResult: null,
    isAutoGenerated: true, isAtRisk: false,
    checklist: [
      { itemId: 'CMP-001', itemName: 'COI — General Liability — Ridgeline Electric', result: 'Expiring', note: 'Expires 2026-07-10. Renewal requested 2026-06-01.', framework: 'Contractual', expiryDate: '2026-07-10', daysToExpiry: 14, lastVerified: '2026-06-01', evidence: 'COI-Ridgeline-Electric-2026.pdf' },
      { itemId: 'CMP-007', itemName: 'COI — General Liability — Crestway Concrete', result: 'Non-Compliant', note: 'Expires 2026-06-30. No renewal received. Contractor on-site. Immediate risk.', framework: 'Contractual', expiryDate: '2026-06-30', daysToExpiry: 4, lastVerified: '2026-05-01', evidence: null },
      { itemId: 'CMP-012', itemName: 'COI — Professional Liability — Lenoir Fiber PM', result: 'Expiring', note: 'Expires 2026-07-20. Owner notified.', framework: 'Contractual', expiryDate: '2026-07-20', daysToExpiry: 24, lastVerified: '2026-05-20', evidence: 'COI-LNR-ProfLiab-2026.pdf' },
      { itemId: 'CMP-002', itemName: 'COI — Workers Comp — Apex Steel', result: 'Compliant', note: 'Valid through 2026-08-31.', framework: 'Contractual', expiryDate: '2026-08-31', daysToExpiry: 66, lastVerified: '2026-06-10', evidence: 'COI-Apex-Steel-WC-2026.pdf' },
    ],
    findings: [
      { id: 'FND-C001', occurrenceId: 'AO-3201', severity: 'Critical', description: 'Crestway Concrete (Pryor Creek) COI expires in 4 days with no renewal. Active on-site — immediate liability exposure.', remediationOwnerId: 'USR-008', remediationOwnerName: 'Lena Ortiz', dueDate: '2026-06-28', status: 'Open', linkedItemId: 'CMP-007' },
      { id: 'FND-C002', occurrenceId: 'AO-3201', severity: 'High', description: 'Ridgeline Electric (Mesa Power) COI expiring in 14 days. Renewal must be received before expiry.', remediationOwnerId: 'USR-008', remediationOwnerName: 'Lena Ortiz', dueDate: '2026-07-05', status: 'In Progress', linkedItemId: 'CMP-001' },
    ],
    trailEntries: [
      { action: 'Occurrence created by A-206', user: 'A-206', initials: 'AI', ts: '2026-05-31T08:00:00Z' },
      { action: 'Partial checklist completed', user: 'Lena Ortiz', initials: 'LO', ts: '2026-06-03T10:00:00Z' },
      { action: 'A-206: Flipped to Overdue — grace period expired', user: 'A-206', initials: 'AI', ts: '2026-06-03T08:00:00Z' },
    ],
  },
  // AO-3202: Completed — OSHA Safety Record
  {
    id: 'AO-3202', scheduleId: 'AS-204', scheduleName: 'Bi-Monthly OSHA Safety Record Review',
    type: 'compliance', projectNames: ['Henderson Substation', 'Mesa Power', 'Council Bluffs'],
    dueDate: '2026-06-01', auditorId: 'USR-008', auditorName: 'Lena Ortiz',
    ownerId: 'USR-009', ownerName: 'Priya Nair',
    status: 'Completed', overallResult: 'Pass',
    isAutoGenerated: false, isAtRisk: false,
    checklist: [
      { itemId: 'CMP-005', itemName: 'OSHA 300 Log — Henderson Substation', result: 'Compliant', note: 'Log current; 1 recordable incident (OSHA-2026-03) properly documented.', framework: 'OSHA', expiryDate: null, daysToExpiry: null, lastVerified: '2026-06-15', evidence: 'OSHA-300-Henderson-2026-YTD.xlsx' },
      { itemId: 'CMP-011', itemName: 'Safety Orientation Records — Council Bluffs', result: 'Compliant', note: 'All 34 personnel on site have current orientation on file.', framework: 'OSHA', expiryDate: null, daysToExpiry: null, lastVerified: '2026-06-20', evidence: 'Safety-Orient-CBL-Jun2026.pdf' },
      { itemId: 'CMP-014', itemName: 'OSHA 300 Log — Mesa Power', result: 'Compliant', note: 'Log current; no recordable incidents in May 2026.', framework: 'OSHA', expiryDate: null, daysToExpiry: null, lastVerified: '2026-06-15', evidence: 'OSHA-300-Mesa-2026-YTD.xlsx' },
    ],
    findings: [],
    trailEntries: [
      { action: 'Occurrence created manually', user: 'Lena Ortiz', initials: 'LO', ts: '2026-06-01T08:00:00Z' },
      { action: 'Checklist completed', user: 'Lena Ortiz', initials: 'LO', ts: '2026-06-01T12:00:00Z' },
      { action: 'Submitted for review', user: 'Lena Ortiz', initials: 'LO', ts: '2026-06-01T12:05:00Z' },
      { action: 'Approved — result: Pass', user: 'Hasit Chetal', initials: 'HC', ts: '2026-06-02T09:00:00Z' },
    ],
  },
  // AO-3203: In Progress — Permit Review Mesa Power
  {
    id: 'AO-3203', scheduleId: 'AS-202', scheduleName: 'Quarterly Permit Review — Mesa Power',
    type: 'compliance', projectNames: ['Mesa Power'],
    dueDate: '2026-06-30', auditorId: 'USR-009', auditorName: 'Priya Nair',
    ownerId: 'USR-009', ownerName: 'Priya Nair',
    status: 'In Progress', overallResult: null,
    isAutoGenerated: true, isAtRisk: true,
    checklist: [
      { itemId: 'CMP-003', itemName: 'AHJ Construction Permit — Mesa Power Phase 2', result: 'Non-Compliant', note: 'No permit on file. Phase 2 active construction. Stop-work risk.', framework: 'Local Permit', expiryDate: null, daysToExpiry: null, lastVerified: null, evidence: null },
      { itemId: 'CMP-004', itemName: 'EPA Stormwater Permit — Mesa Power', result: 'Expiring', note: 'Expires 2026-07-15. Renewal submitted; awaiting EPA confirmation.', framework: 'EPA', expiryDate: '2026-07-15', daysToExpiry: 19, lastVerified: '2026-06-01', evidence: 'EPA-SWPPP-Mesa-2025.pdf' },
    ],
    findings: [
      { id: 'FND-C003', occurrenceId: 'AO-3203', severity: 'Critical', description: 'Mesa Power Phase 2 AHJ construction permit missing. Active construction underway — regulatory stop-work risk.', remediationOwnerId: 'USR-009', remediationOwnerName: 'Priya Nair', dueDate: '2026-06-28', status: 'Open', linkedItemId: 'CMP-003' },
    ],
    trailEntries: [
      { action: 'Occurrence created by A-206', user: 'A-206', initials: 'AI', ts: '2026-06-01T08:00:00Z' },
      { action: 'CMP-003 tested — Non-Compliant', user: 'Priya Nair', initials: 'PN', ts: '2026-06-15T11:00:00Z' },
      { action: 'A-206: Flagged At Risk — critical finding open', user: 'A-206', initials: 'AI', ts: '2026-06-15T11:01:00Z' },
    ],
  },
  // AO-3204: Pending Review — ISO 27001
  {
    id: 'AO-3204', scheduleId: 'AS-205', scheduleName: 'Quarterly ISO 27001 Evidence Review',
    type: 'compliance', projectNames: ['Atlanta DC-3', 'Ashburn Pod 6'],
    dueDate: '2026-06-25', auditorId: 'USR-007', auditorName: 'Daniel Cho',
    ownerId: 'USR-005', ownerName: 'Alice Cox',
    status: 'Pending Review', overallResult: 'Pass',
    isAutoGenerated: true, isAtRisk: false,
    checklist: [
      { itemId: 'CMP-009', itemName: 'ISO 27001 Access Control Evidence — Atlanta DC-3', result: 'Compliant', note: 'Evidence pack current; quarterly review completed.', framework: 'ISO 27001', expiryDate: '2026-09-30', daysToExpiry: 96, lastVerified: '2026-06-24', evidence: 'ISO27001-Access-Q2-2026.pdf' },
      { itemId: 'CMP-017', itemName: 'ISO 27001 Backup & Recovery Evidence — Ashburn Pod 6', result: 'Compliant', note: 'Backup restore test passed. Evidence on file.', framework: 'ISO 27001', expiryDate: '2026-09-30', daysToExpiry: 96, lastVerified: '2026-06-22', evidence: 'ISO27001-Backup-Ashburn-Q2.pdf' },
    ],
    findings: [],
    trailEntries: [
      { action: 'Occurrence created by A-206', user: 'A-206', initials: 'AI', ts: '2026-06-01T08:00:00Z' },
      { action: 'Checklist completed', user: 'Daniel Cho', initials: 'DC', ts: '2026-06-24T16:00:00Z' },
      { action: 'Submitted for review', user: 'Daniel Cho', initials: 'DC', ts: '2026-06-24T16:03:00Z' },
    ],
  },
  // AO-3205: Scheduled — Monthly COI July
  {
    id: 'AO-3205', scheduleId: 'AS-201', scheduleName: 'Monthly COI Verification',
    type: 'compliance', projectNames: ['All Projects'],
    dueDate: '2026-06-30', auditorId: 'USR-008', auditorName: 'Lena Ortiz',
    ownerId: 'USR-003', ownerName: 'Hasit Chetal',
    status: 'Scheduled', overallResult: null,
    isAutoGenerated: true, isAtRisk: true,
    checklist: [], findings: [],
    trailEntries: [
      { action: 'Occurrence created by A-206', user: 'A-206', initials: 'AI', ts: '2026-06-24T08:00:00Z' },
      { action: 'A-206: Flagged At Risk — 2 COIs expiring within 30 days', user: 'A-206', initials: 'AI', ts: '2026-06-24T08:01:00Z' },
    ],
  },
  // AO-3206: Scheduled — SOX Annual
  {
    id: 'AO-3206', scheduleId: 'AS-203', scheduleName: 'Annual SOX Controls Evidence Collection',
    type: 'compliance', projectNames: ['All Projects'],
    dueDate: '2026-07-31', auditorId: 'USR-007', auditorName: 'Daniel Cho',
    ownerId: 'USR-004', ownerName: 'Sophia Lamb',
    status: 'Scheduled', overallResult: null,
    isAutoGenerated: true, isAtRisk: false,
    checklist: [], findings: [],
    trailEntries: [
      { action: 'Occurrence created by A-206', user: 'A-206', initials: 'AI', ts: '2026-06-24T08:00:00Z' },
    ],
  },
  // AO-3207: Completed — Q1 ISO 27001
  {
    id: 'AO-3207', scheduleId: 'AS-205', scheduleName: 'Quarterly ISO 27001 Evidence Review',
    type: 'compliance', projectNames: ['Atlanta DC-3', 'Ashburn Pod 6'],
    dueDate: '2026-04-01', auditorId: 'USR-007', auditorName: 'Daniel Cho',
    ownerId: 'USR-005', ownerName: 'Alice Cox',
    status: 'Completed', overallResult: 'Pass',
    isAutoGenerated: true, isAtRisk: false,
    checklist: [
      { itemId: 'CMP-009', itemName: 'ISO 27001 Access Control Evidence — Atlanta DC-3', result: 'Compliant', note: 'Q1 evidence pack complete.', framework: 'ISO 27001', expiryDate: null, daysToExpiry: null, lastVerified: '2026-04-01', evidence: 'ISO27001-Access-Q1-2026.pdf' },
    ],
    findings: [],
    trailEntries: [
      { action: 'Occurrence created by A-206', user: 'A-206', initials: 'AI', ts: '2026-04-01T08:00:00Z' },
      { action: 'Approved — result: Pass', user: 'Alice Cox', initials: 'AC', ts: '2026-04-02T09:00:00Z' },
    ],
  },
]

// ════════════════════════════════════════════════════════════════════════════
// Shared helpers
// ════════════════════════════════════════════════════════════════════════════

export function occurrenceStatusBadge(s: OccurrenceStatus): { cls: string; dot: string; label: string } {
  switch (s) {
    case 'Scheduled':      return { cls: 'bg-secondary text-muted-foreground border-line', dot: 'bg-slate-400', label: 'Scheduled' }
    case 'In Progress':    return { cls: 'bg-amber-bg text-amber border-amber/30', dot: 'bg-amber', label: 'In Progress' }
    case 'Pending Review': return { cls: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500', label: 'Pending Review' }
    case 'Completed':      return { cls: 'bg-green-bg text-green border-green/30', dot: 'bg-green', label: 'Completed' }
    case 'Overdue':        return { cls: 'bg-red-bg text-red border-red/30', dot: 'bg-red', label: 'Overdue' }
  }
}

export function overallResultBadge(r: OverallResult): { cls: string; label: string } {
  switch (r) {
    case 'Pass':    return { cls: 'bg-green-bg text-green border-green/30', label: 'Pass' }
    case 'Fail':    return { cls: 'bg-red-bg text-red border-red/30', label: 'Fail' }
    case 'Partial': return { cls: 'bg-amber-bg text-amber border-amber/30', label: 'Partial' }
  }
}

export function findingSeverityBadge(s: FindingSeverity): { cls: string; dot: string } {
  switch (s) {
    case 'Critical': return { cls: 'bg-red-bg text-red border-red/30', dot: 'bg-red' }
    case 'High':     return { cls: 'bg-red-bg/60 text-red border-red/20', dot: 'bg-red/70' }
    case 'Medium':   return { cls: 'bg-amber-bg text-amber border-amber/30', dot: 'bg-amber' }
    case 'Low':      return { cls: 'bg-secondary text-muted-foreground border-line', dot: 'bg-slate-400' }
  }
}

export function checklistResultBadge(r: ChecklistResult): { cls: string; label: string } {
  switch (r) {
    case 'Pass':    return { cls: 'bg-green-bg text-green border-green/30', label: 'Pass' }
    case 'Fail':    return { cls: 'bg-red-bg text-red border-red/30', label: 'Fail' }
    case 'Partial': return { cls: 'bg-amber-bg text-amber border-amber/30', label: 'Partial' }
    case 'N/A':     return { cls: 'bg-secondary text-muted-foreground border-line', label: 'N/A' }
  }
}

export function complianceStatusBadge(s: ComplianceItemStatus): { cls: string; dot: string; label: string } {
  switch (s) {
    case 'Compliant':     return { cls: 'bg-green-bg text-green border-green/30', dot: 'bg-green', label: 'Compliant' }
    case 'Non-Compliant': return { cls: 'bg-red-bg text-red border-red/30', dot: 'bg-red', label: 'Non-Compliant' }
    case 'Expiring':      return { cls: 'bg-amber-bg text-amber border-amber/30', dot: 'bg-amber', label: 'Expiring' }
    case 'Pending':       return { cls: 'bg-secondary text-muted-foreground border-line', dot: 'bg-slate-400', label: 'Pending' }
  }
}

export function scheduleStatusBadge(s: ScheduleStatus): { cls: string } {
  switch (s) {
    case 'Active': return { cls: 'bg-green-bg text-green border-green/30' }
    case 'Paused': return { cls: 'bg-amber-bg text-amber border-amber/30' }
    case 'Ended':  return { cls: 'bg-secondary text-muted-foreground border-line' }
  }
}

// Controls Library KPIs
export function getControlsLibraryKpis() {
  const total = CONTROLS.length
  const unassigned = CONTROLS.filter((c) => !c.ownerId).length
  const overdueTests = CONTROLS.filter(isOverdueControl).length
  const effective = CONTROLS.filter((c) => c.effectiveness === 'Effective').length
  const partial = CONTROLS.filter((c) => c.effectiveness === 'Partially Effective').length
  const ineffective = CONTROLS.filter((c) => c.effectiveness === 'Ineffective').length
  const owners = new Set(CONTROLS.filter((c) => c.ownerId).map((c) => c.ownerId)).size
  const effectivePct = Math.round((effective / total) * 100)
  return { total, unassigned, overdueTests, effective, partial, ineffective, owners, effectivePct }
}

// Controls Audit KPIs
export function getControlsAuditKpis() {
  const thisMonth = CONTROLS_AUDIT_OCCURRENCES.filter((o) => o.dueDate.startsWith('2026-06')).length
  const completed = CONTROLS_AUDIT_OCCURRENCES.filter((o) => o.status === 'Completed').length
  const overdue = CONTROLS_AUDIT_OCCURRENCES.filter((o) => o.status === 'Overdue').length
  const pendingReview = CONTROLS_AUDIT_OCCURRENCES.filter((o) => o.status === 'Pending Review').length
  const completedWithResult = CONTROLS_AUDIT_OCCURRENCES.filter((o) => o.overallResult)
  const passed = completedWithResult.filter((o) => o.overallResult === 'Pass').length
  const passRate = completedWithResult.length ? Math.round((passed / completedWithResult.length) * 100) : 0
  const openFindings = CONTROLS_AUDIT_OCCURRENCES.flatMap((o) => o.findings).filter((f) => f.status !== 'Closed').length
  return { thisMonth, completed, overdue, pendingReview, passRate, openFindings, badgeCount: overdue + pendingReview }
}

// Risk Audit KPIs
export function getRiskAuditKpis() {
  const reviewed = RISK_AUDIT_OCCURRENCES.filter((o) => o.status === 'Completed').length
  const overdue = RISK_AUDIT_OCCURRENCES.filter((o) => o.status === 'Overdue').length
  const pendingReview = RISK_AUDIT_OCCURRENCES.filter((o) => o.status === 'Pending Review').length
  const failing = RISK_AUDIT_OCCURRENCES.filter((o) => o.overallResult === 'Fail').length
  const stale = RISK_ITEMS.filter((r) => r.daysSinceReview > 90).length
  const openFindings = RISK_AUDIT_OCCURRENCES.flatMap((o) => o.findings).filter((f) => f.status !== 'Closed').length
  return { reviewed, overdue, pendingReview, failing, stale, openFindings, badgeCount: overdue + pendingReview }
}

// Compliance Audit KPIs
export function getComplianceAuditKpis() {
  const total = COMPLIANCE_ITEMS.length
  const compliant = COMPLIANCE_ITEMS.filter((c) => c.status === 'Compliant').length
  const nonCompliant = COMPLIANCE_ITEMS.filter((c) => c.status === 'Non-Compliant').length
  const expiring30 = COMPLIANCE_ITEMS.filter((c) => c.daysToExpiry !== null && c.daysToExpiry <= 30).length
  const overdueAudits = COMPLIANCE_AUDIT_OCCURRENCES.filter((o) => o.status === 'Overdue').length
  const pendingReview = COMPLIANCE_AUDIT_OCCURRENCES.filter((o) => o.status === 'Pending Review').length
  const openFindings = COMPLIANCE_AUDIT_OCCURRENCES.flatMap((o) => o.findings).filter((f) => f.status !== 'Closed').length
  const complianceRate = Math.round((compliant / total) * 100)
  return { total, compliant, nonCompliant, expiring30, overdueAudits, pendingReview, openFindings, complianceRate, badgeCount: overdueAudits + expiring30 }
}
