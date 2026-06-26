// ════════════════════════════════════════════════════════════════════════════
// Controls, Compliance & Auto-Audit — Data Layer (Pi-PRD-CTRL-002)
// Mirrors the Risk module spine: store events, derive state.
// ════════════════════════════════════════════════════════════════════════════

export type ControlTier = 'PORTFOLIO' | 'PROGRAM' | 'PROJECT'
export type ControlType = 'PREVENTIVE' | 'DETECTIVE' | 'CORRECTIVE' | 'COMPLIANCE' | 'ATTESTATION'
export type Archetype = 'THRESHOLD' | 'TREND' | 'CORRELATION' | 'ABSENCE'
export type TestMethod = 'RULE' | 'ML_MODEL' | 'EVIDENCE_CHECK' | 'HUMAN_ATTEST' | 'HYBRID'
export type Cadence = 'CONTINUOUS' | 'DAILY' | 'PER_EVENT' | 'MONTHLY'
export type TestResult = 'PASS' | 'PARTIAL' | 'FAIL' | 'NOT_TESTED'
export type CoverageState = 'COVERED' | 'DECAYING' | 'STALE' | 'UNVERIFIED'
export type ComplianceState = 'COMPLIANT' | 'AT_RISK' | 'NON_COMPLIANT' | 'UNVERIFIED'
export type Generator = 'RULE' | 'ML' | 'AGENT'
export type OperatingMode = 'SHADOW' | 'ADVISORY' | 'PRIMARY'

export interface ControlDomain {
  id: string
  label: string
}

// ── Control domains (heatmap rows) ──
export const CONTROL_DOMAINS: ControlDomain[] = [
  { id: 'approval', label: 'Approval Authority' },
  { id: 'permit', label: 'Permit / Compliance' },
  { id: 'po_sla', label: 'PO / SLA Adherence' },
  { id: 'sod', label: 'Segregation of Duties' },
  { id: 'data', label: 'Data Provenance' },
]

export const PROGRAMS = ['NA-W', 'NA-E', 'EMEA', 'APAC'] as const
export type Program = (typeof PROGRAMS)[number]

// ── C-01 Portfolio control-health heatmap (criticality-weighted posture) ──
export interface HeatmapRow {
  domainId: string
  domain: string
  scores: Record<Program, number>
  coverage: CoverageState
}

export const HEATMAP: HeatmapRow[] = [
  { domainId: 'approval', domain: 'Approval Authority', scores: { 'NA-W': 91, 'NA-E': 88, EMEA: 72, APAC: 84 }, coverage: 'COVERED' },
  { domainId: 'permit', domain: 'Permit / Compliance', scores: { 'NA-W': 55, 'NA-E': 63, EMEA: 38, APAC: 81 }, coverage: 'DECAYING' },
  { domainId: 'po_sla', domain: 'PO / SLA Adherence', scores: { 'NA-W': 47, 'NA-E': 70, EMEA: 58, APAC: 44 }, coverage: 'COVERED' },
  { domainId: 'sod', domain: 'Segregation of Duties', scores: { 'NA-W': 94, 'NA-E': 90, EMEA: 86, APAC: 89 }, coverage: 'COVERED' },
  { domainId: 'data', domain: 'Data Provenance', scores: { 'NA-W': 62, 'NA-E': 66, EMEA: 60, APAC: 35 }, coverage: 'STALE' },
]

// ── Canonical control objects ──
export interface ControlObject {
  id: string
  tier: ControlTier
  path: string
  domainId: string
  policyId: string
  title: string
  type: ControlType
  archetype: Archetype
  testMethod: TestMethod
  cadence: Cadence
  criticality: 1 | 2 | 3 | 4 | 5
  ownerRole: string
  lastTestedLabel: string
  lastResult: TestResult
  effectiveness: number
  coverageState: CoverageState
  linkedRiskId: string | null
  blastRadius: string
  testPriority: number
}

export const CONTROLS: ControlObject[] = [
  {
    id: 'CTRL-001', tier: 'PROJECT', path: '/NA-W/HDL-Hub1-1/', domainId: 'approval', policyId: 'POL-01',
    title: 'Block PO approval above role authority limit', type: 'PREVENTIVE', archetype: 'THRESHOLD',
    testMethod: 'RULE', cadence: 'CONTINUOUS', criticality: 5, ownerRole: 'ODC Controls',
    lastTestedLabel: '2 min ago', lastResult: 'PASS', effectiveness: 96, coverageState: 'COVERED',
    linkedRiskId: null, blastRadius: '$12.4M · 9 projects', testPriority: 12,
  },
  {
    id: 'CTRL-002', tier: 'PROJECT', path: '/NA-W/HDL-Hub1-1/', domainId: 'sod', policyId: 'POL-02',
    title: 'Approver ≠ requester ≠ receiver on spend', type: 'PREVENTIVE', archetype: 'ABSENCE',
    testMethod: 'HYBRID', cadence: 'CONTINUOUS', criticality: 5, ownerRole: 'ODC Controls',
    lastTestedLabel: '6 min ago', lastResult: 'PASS', effectiveness: 94, coverageState: 'COVERED',
    linkedRiskId: null, blastRadius: '$8.1M · 14 projects', testPriority: 18,
  },
  {
    id: 'CTRL-003', tier: 'PROGRAM', path: '/EMEA/', domainId: 'permit', policyId: 'POL-03',
    title: 'No construction-start orchestration without approved permit', type: 'COMPLIANCE', archetype: 'ABSENCE',
    testMethod: 'EVIDENCE_CHECK', cadence: 'PER_EVENT', criticality: 5, ownerRole: 'FeP Compliance',
    lastTestedLabel: '38 days ago', lastResult: 'FAIL', effectiveness: 38, coverageState: 'STALE',
    linkedRiskId: 'RISK-2231', blastRadius: '$22.0M · 3 hubs', testPriority: 96,
  },
  {
    id: 'CTRL-004', tier: 'PORTFOLIO', path: '/', domainId: 'data', policyId: 'POL-04',
    title: 'Certify data provenance across stitched sources', type: 'DETECTIVE', archetype: 'TREND',
    testMethod: 'ML_MODEL', cadence: 'DAILY', criticality: 4, ownerRole: 'Data Quality',
    lastTestedLabel: '54 days ago', lastResult: 'NOT_TESTED', effectiveness: 35, coverageState: 'UNVERIFIED',
    linkedRiskId: 'RISK-2248', blastRadius: '$5.6M · APAC', testPriority: 88,
  },
  {
    id: 'CTRL-005', tier: 'PROJECT', path: '/NA-E/PRY-2/', domainId: 'po_sla', policyId: 'POL-05',
    title: 'PO issued within 14-day Seed target', type: 'DETECTIVE', archetype: 'THRESHOLD',
    testMethod: 'RULE', cadence: 'DAILY', criticality: 3, ownerRole: 'Funding Ops',
    lastTestedLabel: '1 hr ago', lastResult: 'PARTIAL', effectiveness: 70, coverageState: 'COVERED',
    linkedRiskId: null, blastRadius: '$3.2M · 6 projects', testPriority: 41,
  },
  {
    id: 'CTRL-006', tier: 'PROJECT', path: '/NA-W/MESA-1/', domainId: 'po_sla', policyId: 'POL-05',
    title: 'Three-way-match integrity on invoice posting', type: 'PREVENTIVE', archetype: 'ABSENCE',
    testMethod: 'RULE', cadence: 'CONTINUOUS', criticality: 4, ownerRole: 'Funding Ops',
    lastTestedLabel: '11 min ago', lastResult: 'PASS', effectiveness: 88, coverageState: 'COVERED',
    linkedRiskId: null, blastRadius: '$4.7M · NA-W', testPriority: 22,
  },
  {
    id: 'CTRL-007', tier: 'PROGRAM', path: '/APAC/', domainId: 'data', policyId: 'POL-04',
    title: 'Detect manual-stitching exposure in certified layer', type: 'DETECTIVE', archetype: 'TREND',
    testMethod: 'ML_MODEL', cadence: 'DAILY', criticality: 4, ownerRole: 'Data Quality',
    lastTestedLabel: '21 days ago', lastResult: 'PARTIAL', effectiveness: 60, coverageState: 'DECAYING',
    linkedRiskId: null, blastRadius: '$5.6M · APAC', testPriority: 64,
  },
  {
    id: 'CTRL-008', tier: 'PROGRAM', path: '/EMEA/', domainId: 'permit', policyId: 'POL-03',
    title: 'STB AHJ sustainability gate cleared before energization', type: 'COMPLIANCE', archetype: 'ABSENCE',
    testMethod: 'EVIDENCE_CHECK', cadence: 'PER_EVENT', criticality: 5, ownerRole: 'FeP Compliance',
    lastTestedLabel: '41 days ago', lastResult: 'FAIL', effectiveness: 42, coverageState: 'STALE',
    linkedRiskId: 'RISK-2231', blastRadius: '$18.0M · EMEA', testPriority: 92,
  },
  {
    id: 'CTRL-009', tier: 'PORTFOLIO', path: '/', domainId: 'approval', policyId: 'POL-06',
    title: 'Cashflow-confidence tiering discipline (no tier gaming)', type: 'DETECTIVE', archetype: 'TREND',
    testMethod: 'ML_MODEL', cadence: 'DAILY', criticality: 4, ownerRole: 'FP&A',
    lastTestedLabel: '3 hr ago', lastResult: 'PASS', effectiveness: 84, coverageState: 'COVERED',
    linkedRiskId: null, blastRadius: '$31.0M · portfolio', testPriority: 33,
  },
  {
    id: 'CTRL-010', tier: 'PROJECT', path: '/NA-E/PAP-3/', domainId: 'approval', policyId: 'POL-07',
    title: 'Change-order cost review attested before sign-off', type: 'ATTESTATION', archetype: 'ABSENCE',
    testMethod: 'HUMAN_ATTEST', cadence: 'PER_EVENT', criticality: 3, ownerRole: 'Program Controls',
    lastTestedLabel: '9 days ago', lastResult: 'PASS', effectiveness: 79, coverageState: 'DECAYING',
    linkedRiskId: null, blastRadius: '$2.1M · NA-E', testPriority: 47,
  },
  {
    id: 'CTRL-011', tier: 'PROGRAM', path: '/NA-W/', domainId: 'permit', policyId: 'POL-08',
    title: 'FeP validation steps present for project type', type: 'COMPLIANCE', archetype: 'ABSENCE',
    testMethod: 'HYBRID', cadence: 'PER_EVENT', criticality: 4, ownerRole: 'FeP Compliance',
    lastTestedLabel: '2 days ago', lastResult: 'PARTIAL', effectiveness: 55, coverageState: 'DECAYING',
    linkedRiskId: null, blastRadius: '$6.4M · NA-W', testPriority: 58,
  },
  {
    id: 'CTRL-012', tier: 'PROJECT', path: '/APAC/SNG-1/', domainId: 'po_sla', policyId: 'POL-05',
    title: 'Escalation fires on SLA breach within 4h', type: 'CORRECTIVE', archetype: 'CORRELATION',
    testMethod: 'RULE', cadence: 'PER_EVENT', criticality: 3, ownerRole: 'Orchestration',
    lastTestedLabel: '44 min ago', lastResult: 'FAIL', effectiveness: 44, coverageState: 'COVERED',
    linkedRiskId: 'RISK-2255', blastRadius: '$1.9M · APAC', testPriority: 71,
  },
]

// ── §3 Policy & Compliance register ──
export type PolicySource = 'INTERNAL_STANDARD' | 'REGULATORY' | 'CONTRACTUAL' | 'BEST_PRACTICE'

export interface PolicyObject {
  id: string
  title: string
  source: PolicySource
  authority: string
  controlIds: string[]
  applicability: string
  complianceState: ComplianceState
  compliancePct: number
}

export const POLICIES: PolicyObject[] = [
  {
    id: 'POL-01', title: 'Approvals stay within authority limits', source: 'INTERNAL_STANDARD',
    authority: 'ODC Governance', controlIds: ['CTRL-001'], applicability: 'All tiers · all regions',
    complianceState: 'COMPLIANT', compliancePct: 96,
  },
  {
    id: 'POL-02', title: 'Segregation of duties on spend', source: 'INTERNAL_STANDARD',
    authority: 'ODC Governance · SoD Policy', controlIds: ['CTRL-002'], applicability: 'All spend transactions',
    complianceState: 'COMPLIANT', compliancePct: 94,
  },
  {
    id: 'POL-03', title: 'Permits precede construction', source: 'REGULATORY',
    authority: 'AHJ Requirements', controlIds: ['CTRL-003', 'CTRL-008'], applicability: 'EMEA · construction-start gates',
    complianceState: 'NON_COMPLIANT', compliancePct: 40,
  },
  {
    id: 'POL-04', title: 'Certified data is trustworthy & provenanced', source: 'INTERNAL_STANDARD',
    authority: 'Data Governance', controlIds: ['CTRL-004', 'CTRL-007'], applicability: 'Portfolio · stitched sources',
    complianceState: 'AT_RISK', compliancePct: 48,
  },
  {
    id: 'POL-05', title: 'PO / SLA adherence & match integrity', source: 'CONTRACTUAL',
    authority: 'SLA Commitments', controlIds: ['CTRL-005', 'CTRL-006', 'CTRL-012'], applicability: 'All POs · 14-day Seed target',
    complianceState: 'AT_RISK', compliancePct: 67,
  },
  {
    id: 'POL-06', title: 'Cashflow confidence is honestly tiered', source: 'INTERNAL_STANDARD',
    authority: 'FP&A Standard', controlIds: ['CTRL-009'], applicability: 'Portfolio · forecast tiers',
    complianceState: 'COMPLIANT', compliancePct: 84,
  },
  {
    id: 'POL-07', title: 'Change orders carry a cost review', source: 'INTERNAL_STANDARD',
    authority: 'Program Governance', controlIds: ['CTRL-010'], applicability: 'All change orders',
    complianceState: 'AT_RISK', compliancePct: 79,
  },
  {
    id: 'POL-08', title: 'FeP validation by project type', source: 'INTERNAL_STANDARD',
    authority: 'FeP Standard', controlIds: ['CTRL-011'], applicability: 'Seed / Construction / CLC / Sprout',
    complianceState: 'AT_RISK', compliancePct: 55,
  },
]

// ── §4 Auto-Audit Engine — live verdict stream ──
export interface AuditVerdict {
  id: string
  controlId: string
  controlTitle: string
  generator: Generator
  result: TestResult
  confidence: number
  timeLabel: string
  evidence: string
  raisesRisk: boolean
}

export const RECENT_VERDICTS: AuditVerdict[] = [
  {
    id: 'V-9001', controlId: 'CTRL-008', controlTitle: 'STB AHJ sustainability gate cleared before energization',
    generator: 'AGENT', result: 'FAIL', confidence: 91, timeLabel: '12s ago',
    evidence: 'No approved AHJ sustainability certificate found for STB-Hub2 energization order ORC-4471. Two corroborating signals + agent trace.',
    raisesRisk: true,
  },
  {
    id: 'V-9002', controlId: 'CTRL-001', controlTitle: 'Block PO approval above role authority limit',
    generator: 'RULE', result: 'PASS', confidence: 100, timeLabel: '41s ago',
    evidence: 'PO-88213 ($1.8M) approved by role within $2.5M ceiling. Rule evaluated on event stream.',
    raisesRisk: false,
  },
  {
    id: 'V-9003', controlId: 'CTRL-012', controlTitle: 'Escalation fires on SLA breach within 4h',
    generator: 'RULE', result: 'FAIL', confidence: 88, timeLabel: '1m ago',
    evidence: 'SLA breach on ORC-4480 at 02:14; no escalation event within 4h window. Corrective control did not fire.',
    raisesRisk: true,
  },
  {
    id: 'V-9004', controlId: 'CTRL-009', controlTitle: 'Cashflow-confidence tiering discipline',
    generator: 'ML', result: 'PASS', confidence: 82, timeLabel: '3m ago',
    evidence: 'No anomalous Forecast→Committed tier transitions detected across 1,204 line items. Model conf 0.82.',
    raisesRisk: false,
  },
  {
    id: 'V-9005', controlId: 'CTRL-007', controlTitle: 'Detect manual-stitching exposure in certified layer',
    generator: 'ML', result: 'PARTIAL', confidence: 67, timeLabel: '6m ago',
    evidence: 'Elevated manual-stitch rate on APAC sources (p82). Below FAIL threshold; flagged for re-test at raised priority.',
    raisesRisk: false,
  },
  {
    id: 'V-9006', controlId: 'CTRL-002', controlTitle: 'Approver ≠ requester ≠ receiver on spend',
    generator: 'RULE', result: 'PASS', confidence: 100, timeLabel: '9m ago',
    evidence: 'Graph check on 312 transactions: no SoD collisions. Rule + graph check clean.',
    raisesRisk: false,
  },
  {
    id: 'V-9007', controlId: 'CTRL-003', controlTitle: 'No construction-start without approved permit',
    generator: 'AGENT', result: 'FAIL', confidence: 93, timeLabel: '14m ago',
    evidence: 'EMEA-Hub1 construction-start orchestration ORC-4455 has no permit evidence on file. Agent gathered 3 system sources.',
    raisesRisk: true,
  },
]

// ── §4.3 Test queue (ranked by assurance gain) ──
export interface QueuedTest {
  controlId: string
  controlTitle: string
  generator: Generator
  priority: number
  reason: string
}

export const TEST_QUEUE: QueuedTest[] = [
  { controlId: 'CTRL-008', controlTitle: 'STB AHJ sustainability gate', generator: 'AGENT', priority: 96, reason: 'Critical · 41d decay · $18M blast' },
  { controlId: 'CTRL-003', controlTitle: 'Permit precedes construction', generator: 'AGENT', priority: 92, reason: 'Critical · 38d decay · 3 hubs' },
  { controlId: 'CTRL-004', controlTitle: 'Certify data provenance', generator: 'ML', priority: 88, reason: 'Unverified · 54d · APAC' },
  { controlId: 'CTRL-012', controlTitle: 'Escalation on SLA breach', generator: 'RULE', priority: 71, reason: 'Recent FAIL · re-confirm' },
  { controlId: 'CTRL-007', controlTitle: 'Manual-stitching exposure', generator: 'ML', priority: 64, reason: 'Decaying · 21d · APAC' },
  { controlId: 'CTRL-011', controlTitle: 'FeP validation by type', generator: 'AGENT', priority: 58, reason: 'Partial · NA-W' },
]

// ── Generator mix (§6.2) ──
export const GENERATOR_MIX = [
  { generator: 'RULE' as Generator, label: 'Rule-Based Tester', pct: 58, precision: 99.2, mode: 'PRIMARY' as OperatingMode },
  { generator: 'ML' as Generator, label: 'ML Tester (BQML/Vertex)', pct: 27, precision: 91.4, mode: 'ADVISORY' as OperatingMode },
  { generator: 'AGENT' as Generator, label: 'Agentic Evidence (A-305)', pct: 15, precision: 87.6, mode: 'ADVISORY' as OperatingMode },
]

// ── C-06 Control gaps (unverified & stale, ranked by exposure) ──
export interface ControlGap {
  controlId: string
  title: string
  coverageState: CoverageState
  daysSinceTest: number
  blastRadius: string
  exposureValue: number
  region: string
  autoRaisedRisk: string | null
}

export const CONTROL_GAPS: ControlGap[] = [
  { controlId: 'CTRL-008', title: 'STB AHJ sustainability gate cleared before energization', coverageState: 'STALE', daysSinceTest: 41, blastRadius: '$18.0M · EMEA', exposureValue: 18.0, region: 'EMEA', autoRaisedRisk: 'RISK-2231' },
  { controlId: 'CTRL-003', title: 'No construction-start without approved permit', coverageState: 'STALE', daysSinceTest: 38, blastRadius: '$22.0M · 3 hubs', exposureValue: 22.0, region: 'EMEA', autoRaisedRisk: 'RISK-2231' },
  { controlId: 'CTRL-004', title: 'Certify data provenance across stitched sources', coverageState: 'UNVERIFIED', daysSinceTest: 54, blastRadius: '$5.6M · APAC', exposureValue: 5.6, region: 'APAC', autoRaisedRisk: 'RISK-2248' },
  { controlId: 'CTRL-007', title: 'Detect manual-stitching exposure', coverageState: 'DECAYING', daysSinceTest: 21, blastRadius: '$5.6M · APAC', exposureValue: 5.6, region: 'APAC', autoRaisedRisk: null },
  { controlId: 'CTRL-011', title: 'FeP validation steps present for project type', coverageState: 'DECAYING', daysSinceTest: 2, blastRadius: '$6.4M · NA-W', exposureValue: 6.4, region: 'NA-W', autoRaisedRisk: null },
  { controlId: 'CTRL-010', title: 'Change-order cost review attested before sign-off', coverageState: 'DECAYING', daysSinceTest: 9, blastRadius: '$2.1M · NA-E', exposureValue: 2.1, region: 'NA-E', autoRaisedRisk: null },
]

// ── Portfolio KPI posture ──
export const CONTROL_KPIS = {
  compliancePosture: 71,
  controlsCovered: 64,
  totalControls: 248,
  autoAuditPrecision: 94.3,
  openGaps: 17,
  gapExposure: 59.7,
  testsToday: 1842,
  attestationQueue: 6,
}

// ════════════════════════════════════════════════════════════════════════════
// Helpers
// ════════════════════════════════════════════════════════════════════════════

export function scoreColor(score: number): { bg: string; text: string; label: string } {
  if (score >= 85) return { bg: 'bg-green/15', text: 'text-green', label: 'Strong' }
  if (score >= 70) return { bg: 'bg-teal/15', text: 'text-teal', label: 'Sound' }
  if (score >= 55) return { bg: 'bg-amber/20', text: 'text-amber', label: 'Softening' }
  return { bg: 'bg-red/20', text: 'text-red', label: 'Weak' }
}

export function resultBadge(result: TestResult): { cls: string; label: string } {
  switch (result) {
    case 'PASS': return { cls: 'bg-green-bg text-green border-green/30', label: 'Pass' }
    case 'PARTIAL': return { cls: 'bg-amber-bg text-amber border-amber/30', label: 'Partial' }
    case 'FAIL': return { cls: 'bg-red-bg text-red border-red/30', label: 'Fail' }
    case 'NOT_TESTED': return { cls: 'bg-secondary text-muted-foreground border-line', label: 'Not Tested' }
  }
}

export function coverageBadge(state: CoverageState): { cls: string; label: string; dot: string } {
  switch (state) {
    case 'COVERED': return { cls: 'bg-green-bg text-green border-green/30', label: 'Covered', dot: 'bg-green' }
    case 'DECAYING': return { cls: 'bg-amber-bg text-amber border-amber/30', label: 'Decaying', dot: 'bg-amber' }
    case 'STALE': return { cls: 'bg-red-bg text-red border-red/30', label: 'Stale', dot: 'bg-red' }
    case 'UNVERIFIED': return { cls: 'bg-secondary text-muted-foreground border-line', label: 'Unverified', dot: 'bg-slate' }
  }
}

export function complianceBadge(state: ComplianceState): { cls: string; label: string } {
  switch (state) {
    case 'COMPLIANT': return { cls: 'bg-green-bg text-green border-green/30', label: 'Compliant' }
    case 'AT_RISK': return { cls: 'bg-amber-bg text-amber border-amber/30', label: 'At Risk' }
    case 'NON_COMPLIANT': return { cls: 'bg-red-bg text-red border-red/30', label: 'Non-Compliant' }
    case 'UNVERIFIED': return { cls: 'bg-secondary text-muted-foreground border-line', label: 'Unverified' }
  }
}

export function generatorMeta(g: Generator): { label: string; short: string; cls: string; dot: string } {
  switch (g) {
    case 'RULE': return { label: 'Rule-Based Tester', short: 'Rule', cls: 'bg-navy/10 text-navy border-navy/20', dot: 'bg-navy' }
    case 'ML': return { label: 'ML Tester', short: 'ML', cls: 'bg-teal/10 text-teal border-teal/25', dot: 'bg-teal' }
    case 'AGENT': return { label: 'Agentic Evidence (A-305)', short: 'Agent', cls: 'bg-gold/15 text-gold border-gold/30', dot: 'bg-gold' }
  }
}

export function typeBadge(type: ControlType): string {
  switch (type) {
    case 'PREVENTIVE': return 'bg-navy/10 text-navy border-navy/20'
    case 'DETECTIVE': return 'bg-teal/10 text-teal border-teal/25'
    case 'CORRECTIVE': return 'bg-amber-bg text-amber border-amber/30'
    case 'COMPLIANCE': return 'bg-gold/15 text-gold border-gold/30'
    case 'ATTESTATION': return 'bg-secondary text-muted-foreground border-line'
  }
}

// ════════════════════════════════════════════════════════════════════════════
// Controls Library — Owner Assignment (New Module)
// Assigns control responsibility to named owners for specific projects/programs
// ════════════════════════════════════════════════════════════════════════════

export type OwnerStatus = 'ACTIVE' | 'PENDING' | 'ESCALATED' | 'OVERDUE'
export type OwnerTier = 'PRIMARY' | 'SECONDARY' | 'DELEGATE'

export interface ControlOwner {
  id: string
  name: string
  serviceRole: string
  email: string
  region: string
  program: string
  initials: string
  capacity: number       // 0-100 workload %
  activeControls: number
  overdueControls: number
}

export interface ControlAssignment {
  id: string
  controlId: string
  controlTitle: string
  controlDomainId: string
  projectCode: string
  program: string
  tier: OwnerTier
  ownerId: string
  ownerName: string
  ownerRole: string
  assignedAt: string
  dueDate: string
  status: OwnerStatus
  lastAttestation: string | null
  nextReview: string
  notes: string
  priority: 1 | 2 | 3 | 4 | 5
}

export const CONTROL_OWNERS: ControlOwner[] = [
  { id: 'OWN-001', name: 'Hasit Chetal', serviceRole: 'Portfolio Controls Lead', email: 'h.chetal@odc.internal', region: 'Global', program: 'All', initials: 'HC', capacity: 82, activeControls: 14, overdueControls: 2 },
  { id: 'OWN-002', name: 'Priya Anand', serviceRole: 'EMEA Compliance Officer', email: 'p.anand@fep.internal', region: 'EMEA', program: 'EMEA', initials: 'PA', capacity: 91, activeControls: 8, overdueControls: 3 },
  { id: 'OWN-003', name: 'James Keller', serviceRole: 'NA-West Controls Analyst', email: 'j.keller@odc.internal', region: 'NA-West', program: 'NA-West', initials: 'JK', capacity: 68, activeControls: 11, overdueControls: 0 },
  { id: 'OWN-004', name: 'Ling Zhao', serviceRole: 'APAC Data Quality Lead', email: 'l.zhao@fep.internal', region: 'APAC', program: 'APAC', initials: 'LZ', capacity: 74, activeControls: 6, overdueControls: 1 },
  { id: 'OWN-005', name: 'Akosua Mensah', serviceRole: 'Funding Ops Specialist', email: 'a.mensah@odc.internal', region: 'NA-East', program: 'NA-East', initials: 'AM', capacity: 55, activeControls: 9, overdueControls: 0 },
  { id: 'OWN-006', name: 'Dmitri Volkov', serviceRole: 'Orchestration Engineer', email: 'd.volkov@fep.internal', region: 'APAC', program: 'APAC', initials: 'DV', capacity: 63, activeControls: 5, overdueControls: 1 },
  { id: 'OWN-007', name: 'Sarah Okonkwo', serviceRole: 'FP&A Controls Partner', email: 's.okonkwo@odc.internal', region: 'Global', program: 'All', initials: 'SO', capacity: 77, activeControls: 7, overdueControls: 0 },
  { id: 'OWN-008', name: 'Rajan Pillai', serviceRole: 'FeP Compliance Analyst', email: 'r.pillai@fep.internal', region: 'EMEA', program: 'EMEA', initials: 'RP', capacity: 88, activeControls: 10, overdueControls: 2 },
]

export const CONTROL_ASSIGNMENTS: ControlAssignment[] = [
  {
    id: 'ASGN-001', controlId: 'CTRL-001', controlTitle: 'Block PO approval above role authority limit',
    controlDomainId: 'approval', projectCode: 'HDL-Hub1-1', program: 'NA-East',
    tier: 'PRIMARY', ownerId: 'OWN-001', ownerName: 'Hasit Chetal', ownerRole: 'Portfolio Controls Lead',
    assignedAt: '2026-05-01', dueDate: '2026-08-01', status: 'ACTIVE',
    lastAttestation: '2026-06-20', nextReview: '2026-07-20',
    notes: 'Continuous rule gate — threshold set at role authority ceiling. Daily attestation required.', priority: 5,
  },
  {
    id: 'ASGN-002', controlId: 'CTRL-002', controlTitle: 'Approver ≠ requester ≠ receiver on spend',
    controlDomainId: 'sod', projectCode: 'HDL-Hub1-1', program: 'NA-East',
    tier: 'PRIMARY', ownerId: 'OWN-001', ownerName: 'Hasit Chetal', ownerRole: 'Portfolio Controls Lead',
    assignedAt: '2026-05-01', dueDate: '2026-08-01', status: 'ACTIVE',
    lastAttestation: '2026-06-21', nextReview: '2026-07-21',
    notes: 'SoD graph check runs continuously. Owner reviews any collision alerts within 2h.', priority: 5,
  },
  {
    id: 'ASGN-003', controlId: 'CTRL-003', controlTitle: 'No construction-start without approved permit',
    controlDomainId: 'permit', projectCode: 'EMEA-Hub1', program: 'EMEA',
    tier: 'PRIMARY', ownerId: 'OWN-002', ownerName: 'Priya Anand', ownerRole: 'EMEA Compliance Officer',
    assignedAt: '2026-04-15', dueDate: '2026-07-02', status: 'OVERDUE',
    lastAttestation: '2026-05-18', nextReview: '2026-06-28',
    notes: 'FAIL state for 38d. Requires permit evidence upload before next construction start event.', priority: 5,
  },
  {
    id: 'ASGN-004', controlId: 'CTRL-008', controlTitle: 'STB AHJ sustainability gate cleared before energization',
    controlDomainId: 'permit', projectCode: 'STB', program: 'EMEA',
    tier: 'PRIMARY', ownerId: 'OWN-002', ownerName: 'Priya Anand', ownerRole: 'EMEA Compliance Officer',
    assignedAt: '2026-04-15', dueDate: '2026-07-02', status: 'ESCALATED',
    lastAttestation: null, nextReview: '2026-06-27',
    notes: 'AHJ sustainability certificate missing. Linked to RSK-1037. Escalated to ELS Legal.', priority: 5,
  },
  {
    id: 'ASGN-005', controlId: 'CTRL-004', controlTitle: 'Certify data provenance across stitched sources',
    controlDomainId: 'data', projectCode: 'Portfolio', program: 'APAC',
    tier: 'PRIMARY', ownerId: 'OWN-004', ownerName: 'Ling Zhao', ownerRole: 'APAC Data Quality Lead',
    assignedAt: '2026-04-01', dueDate: '2026-07-15', status: 'OVERDUE',
    lastAttestation: null, nextReview: '2026-06-28',
    notes: 'Not tested for 54d. Requires ML model recertification and manual provenance sign-off.', priority: 4,
  },
  {
    id: 'ASGN-006', controlId: 'CTRL-005', controlTitle: 'PO issued within 14-day Seed target',
    controlDomainId: 'po_sla', projectCode: 'PRY-2', program: 'NA-East',
    tier: 'PRIMARY', ownerId: 'OWN-005', ownerName: 'Akosua Mensah', ownerRole: 'Funding Ops Specialist',
    assignedAt: '2026-05-10', dueDate: '2026-07-10', status: 'ACTIVE',
    lastAttestation: '2026-06-22', nextReview: '2026-07-05',
    notes: 'PARTIAL result — 2 of 8 POs exceeded 14d window. Under active monitoring.', priority: 3,
  },
  {
    id: 'ASGN-007', controlId: 'CTRL-006', controlTitle: 'Three-way-match integrity on invoice posting',
    controlDomainId: 'po_sla', projectCode: 'MESA-1', program: 'NA-West',
    tier: 'PRIMARY', ownerId: 'OWN-003', ownerName: 'James Keller', ownerRole: 'NA-West Controls Analyst',
    assignedAt: '2026-05-15', dueDate: '2026-08-15', status: 'ACTIVE',
    lastAttestation: '2026-06-23', nextReview: '2026-07-15',
    notes: 'Continuous rule passing. Next scheduled attestation on 15 July.', priority: 4,
  },
  {
    id: 'ASGN-008', controlId: 'CTRL-007', controlTitle: 'Detect manual-stitching exposure in certified layer',
    controlDomainId: 'data', projectCode: 'SNG-1', program: 'APAC',
    tier: 'PRIMARY', ownerId: 'OWN-004', ownerName: 'Ling Zhao', ownerRole: 'APAC Data Quality Lead',
    assignedAt: '2026-04-01', dueDate: '2026-07-15', status: 'PENDING',
    lastAttestation: '2026-06-05', nextReview: '2026-07-01',
    notes: 'Decaying — 21d since last test. ML model re-run scheduled for 1 July.', priority: 4,
  },
  {
    id: 'ASGN-009', controlId: 'CTRL-009', controlTitle: 'Cashflow-confidence tiering discipline',
    controlDomainId: 'approval', projectCode: 'Portfolio', program: 'All',
    tier: 'PRIMARY', ownerId: 'OWN-007', ownerName: 'Sarah Okonkwo', ownerRole: 'FP&A Controls Partner',
    assignedAt: '2026-05-01', dueDate: '2026-08-01', status: 'ACTIVE',
    lastAttestation: '2026-06-20', nextReview: '2026-07-20',
    notes: 'Daily ML sweep. No anomalous tier transitions in last 30d.', priority: 4,
  },
  {
    id: 'ASGN-010', controlId: 'CTRL-012', controlTitle: 'Escalation fires on SLA breach within 4h',
    controlDomainId: 'po_sla', projectCode: 'SNG-1', program: 'APAC',
    tier: 'PRIMARY', ownerId: 'OWN-006', ownerName: 'Dmitri Volkov', ownerRole: 'Orchestration Engineer',
    assignedAt: '2026-05-20', dueDate: '2026-07-20', status: 'ESCALATED',
    lastAttestation: '2026-06-15', nextReview: '2026-06-27',
    notes: 'Corrective control failed on ORC-4480. Escalated for rule review. Owner must sign off fix within 48h.', priority: 3,
  },
  {
    id: 'ASGN-011', controlId: 'CTRL-010', controlTitle: 'Change-order cost review attested before sign-off',
    controlDomainId: 'approval', projectCode: 'PAP-3', program: 'NA-East',
    tier: 'SECONDARY', ownerId: 'OWN-005', ownerName: 'Akosua Mensah', ownerRole: 'Funding Ops Specialist',
    assignedAt: '2026-05-10', dueDate: '2026-08-10', status: 'PENDING',
    lastAttestation: '2026-06-17', nextReview: '2026-07-10',
    notes: 'Human attestation per event. Secondary owner reviews if primary is unavailable.', priority: 3,
  },
  {
    id: 'ASGN-012', controlId: 'CTRL-011', controlTitle: 'FeP validation steps present for project type',
    controlDomainId: 'permit', projectCode: 'NA-W Hub', program: 'NA-West',
    tier: 'PRIMARY', ownerId: 'OWN-008', ownerName: 'Rajan Pillai', ownerRole: 'FeP Compliance Analyst',
    assignedAt: '2026-04-20', dueDate: '2026-07-20', status: 'PENDING',
    lastAttestation: '2026-06-24', nextReview: '2026-07-04',
    notes: 'Partial compliance — Seed/Construction gate present; CLC/Sprout gates missing.', priority: 4,
  },
]

// ════════════════════════════════════════════════════════════════════════════
// Controls Audit Scheduler — Recurring Audit Schedule (New Module)
// Schedule control audits on recurring basis across the portfolio
// ════════════════════════════════════════════════════════════════════════════

export type AuditFrequency = 'DAILY' | 'WEEKLY' | 'BI_WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'PER_EVENT'
export type ScheduledAuditStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED'
export type AuditCategory = 'CONTROLS' | 'RISK' | 'COMPLIANCE'

export interface AuditSchedule {
  id: string
  category: AuditCategory
  title: string
  scope: string
  program: string
  projectCode: string
  frequency: AuditFrequency
  auditorRole: string
  assignedOwnerId: string
  assignedOwnerName: string
  lastRunDate: string | null
  nextRunDate: string
  status: ScheduledAuditStatus
  linkedControlIds: string[]
  linkedPolicyIds: string[]
  linkedRiskIds: string[]
  completionRate: number     // % of last audit cycle completed
  findingsCount: number
  criticalFindings: number
  description: string
  autoTrigger: boolean       // system-triggered vs manually scheduled
  notifyOnComplete: string[] // roles to notify
}

export const AUDIT_SCHEDULES: AuditSchedule[] = [
  // ── Controls Audits ──
  {
    id: 'SCHED-001', category: 'CONTROLS',
    title: 'Portfolio Approval Authority Controls Sweep',
    scope: 'All approval-domain controls across 4 programs — CTRL-001, CTRL-009, CTRL-010',
    program: 'All', projectCode: 'Portfolio', frequency: 'WEEKLY',
    auditorRole: 'ODC Controls', assignedOwnerId: 'OWN-001', assignedOwnerName: 'Hasit Chetal',
    lastRunDate: '2026-06-19', nextRunDate: '2026-06-26',
    status: 'SCHEDULED', linkedControlIds: ['CTRL-001', 'CTRL-009', 'CTRL-010'],
    linkedPolicyIds: ['POL-01', 'POL-06', 'POL-07'], linkedRiskIds: [],
    completionRate: 100, findingsCount: 0, criticalFindings: 0,
    description: 'Weekly sweep of all approval-authority controls. Validates rule evaluations, authority ceiling breaches, and attestation completeness.',
    autoTrigger: true, notifyOnComplete: ['Portfolio Controls Lead', 'FP&A Controls Partner'],
  },
  {
    id: 'SCHED-002', category: 'CONTROLS',
    title: 'EMEA Permit Compliance Controls Audit',
    scope: 'CTRL-003, CTRL-008 — Construction-start permit & AHJ sustainability gate',
    program: 'EMEA', projectCode: 'STB / EMEA-Hub1', frequency: 'BI_WEEKLY',
    auditorRole: 'FeP Compliance', assignedOwnerId: 'OWN-002', assignedOwnerName: 'Priya Anand',
    lastRunDate: '2026-06-11', nextRunDate: '2026-06-25',
    status: 'OVERDUE', linkedControlIds: ['CTRL-003', 'CTRL-008'],
    linkedPolicyIds: ['POL-03'], linkedRiskIds: ['RISK-2231'],
    completionRate: 38, findingsCount: 4, criticalFindings: 2,
    description: 'Bi-weekly evidence-check audit for EMEA permit controls. Critical pathway — construction events blocked until cleared.',
    autoTrigger: false, notifyOnComplete: ['EMEA Compliance Officer', 'Portfolio Controls Lead', 'ELS Legal'],
  },
  {
    id: 'SCHED-003', category: 'CONTROLS',
    title: 'SoD Graph Integrity Continuous Check',
    scope: 'CTRL-002 — Segregation of Duties on spend transactions',
    program: 'All', projectCode: 'Portfolio', frequency: 'DAILY',
    auditorRole: 'ODC Controls', assignedOwnerId: 'OWN-001', assignedOwnerName: 'Hasit Chetal',
    lastRunDate: '2026-06-25', nextRunDate: '2026-06-26',
    status: 'COMPLETED', linkedControlIds: ['CTRL-002'],
    linkedPolicyIds: ['POL-02'], linkedRiskIds: [],
    completionRate: 100, findingsCount: 0, criticalFindings: 0,
    description: 'Daily graph-check sweep across all spend transactions. Auto-passes on zero SoD collisions.',
    autoTrigger: true, notifyOnComplete: ['Portfolio Controls Lead'],
  },
  {
    id: 'SCHED-004', category: 'CONTROLS',
    title: 'APAC Data Provenance Quarterly Certification',
    scope: 'CTRL-004, CTRL-007 — Stitched data sources and ML model certification',
    program: 'APAC', projectCode: 'SNG / Portfolio', frequency: 'QUARTERLY',
    auditorRole: 'FeP Data Ops', assignedOwnerId: 'OWN-004', assignedOwnerName: 'Ling Zhao',
    lastRunDate: '2026-03-15', nextRunDate: '2026-07-01',
    status: 'SCHEDULED', linkedControlIds: ['CTRL-004', 'CTRL-007'],
    linkedPolicyIds: ['POL-04'], linkedRiskIds: ['RISK-2248'],
    completionRate: 0, findingsCount: 0, criticalFindings: 0,
    description: 'Quarterly ML model recertification and manual data provenance sign-off. Includes APAC stitch-rate analysis.',
    autoTrigger: false, notifyOnComplete: ['APAC Data Quality Lead', 'Portfolio Controls Lead'],
  },
  {
    id: 'SCHED-005', category: 'CONTROLS',
    title: 'PO & SLA Adherence Monthly Audit',
    scope: 'CTRL-005, CTRL-006, CTRL-012 — PO cycle times, invoice match, SLA escalation',
    program: 'NA-East / APAC', projectCode: 'PRY-2 / MESA-1 / SNG-1', frequency: 'MONTHLY',
    auditorRole: 'Funding Ops', assignedOwnerId: 'OWN-005', assignedOwnerName: 'Akosua Mensah',
    lastRunDate: '2026-05-31', nextRunDate: '2026-06-30',
    status: 'IN_PROGRESS', linkedControlIds: ['CTRL-005', 'CTRL-006', 'CTRL-012'],
    linkedPolicyIds: ['POL-05'], linkedRiskIds: ['RISK-2255'],
    completionRate: 72, findingsCount: 1, criticalFindings: 0,
    description: 'Monthly audit of PO issuance cycle times, three-way-match integrity, and SLA escalation trigger accuracy.',
    autoTrigger: true, notifyOnComplete: ['Funding Ops Specialist', 'Portfolio Controls Lead'],
  },
  // ── Risk Audits ──
  {
    id: 'SCHED-006', category: 'RISK',
    title: 'Portfolio Risk Register Quarterly Review',
    scope: 'All open risks — scoring validation, state machine accuracy, mitigation progress',
    program: 'All', projectCode: 'Portfolio', frequency: 'QUARTERLY',
    auditorRole: 'ODC Controls', assignedOwnerId: 'OWN-001', assignedOwnerName: 'Hasit Chetal',
    lastRunDate: '2026-03-31', nextRunDate: '2026-06-30',
    status: 'OVERDUE', linkedControlIds: [],
    linkedPolicyIds: [], linkedRiskIds: ['RSK-1042', 'RSK-1037', 'RSK-1051', 'RSK-1029'],
    completionRate: 0, findingsCount: 0, criticalFindings: 0,
    description: 'Quarterly deep-dive risk register review. Validates score accuracy, state transitions, and mitigation effectiveness across all 4 programs.',
    autoTrigger: false, notifyOnComplete: ['Portfolio Controls Lead', 'Portfolio Director'],
  },
  {
    id: 'SCHED-007', category: 'RISK',
    title: 'EMEA Legal & Permit Risk Bi-Weekly Scan',
    scope: 'Legal and Compliance risk categories in EMEA — RSK-1037, AHJ-linked risks',
    program: 'EMEA', projectCode: 'STB / DUB', frequency: 'BI_WEEKLY',
    auditorRole: 'ELS Compliance', assignedOwnerId: 'OWN-002', assignedOwnerName: 'Priya Anand',
    lastRunDate: '2026-06-12', nextRunDate: '2026-06-26',
    status: 'IN_PROGRESS', linkedControlIds: ['CTRL-003', 'CTRL-008'],
    linkedPolicyIds: ['POL-03'], linkedRiskIds: ['RSK-1037'],
    completionRate: 60, findingsCount: 2, criticalFindings: 1,
    description: 'Bi-weekly legal and permit risk scan for EMEA. Covers AHJ readiness, sustainability compliance gaps, and permit renewal timelines.',
    autoTrigger: true, notifyOnComplete: ['EMEA Compliance Officer', 'ELS Legal'],
  },
  {
    id: 'SCHED-008', category: 'RISK',
    title: 'Supply-Chain Risk Monthly Exposure Audit',
    scope: 'Supply-chain risks across APAC and NA-East — LLE sourcing, contractor reliability',
    program: 'APAC / NA-East', projectCode: 'SNG / NAE-2', frequency: 'MONTHLY',
    auditorRole: 'FeP Procurement', assignedOwnerId: 'OWN-004', assignedOwnerName: 'Ling Zhao',
    lastRunDate: '2026-05-31', nextRunDate: '2026-06-30',
    status: 'SCHEDULED', linkedControlIds: [],
    linkedPolicyIds: [], linkedRiskIds: ['RSK-1051', 'RSK-1063'],
    completionRate: 0, findingsCount: 0, criticalFindings: 0,
    description: 'Monthly supply-chain risk audit. Reviews LLE delivery status, contractor reliability drift, and alternate-sourcing readiness.',
    autoTrigger: false, notifyOnComplete: ['APAC Data Quality Lead', 'FeP Procurement'],
  },
  {
    id: 'SCHED-009', category: 'RISK',
    title: 'Cost & Schedule Risk Weekly Flash',
    scope: 'Cost and Schedule risk categories — CPI/SPI thresholds, EAC drift',
    program: 'NA-West / NA-East', projectCode: 'VLB / PRY / HDL', frequency: 'WEEKLY',
    auditorRole: 'ODC Cost Controls', assignedOwnerId: 'OWN-003', assignedOwnerName: 'James Keller',
    lastRunDate: '2026-06-19', nextRunDate: '2026-06-26',
    status: 'SCHEDULED', linkedControlIds: ['CTRL-001'],
    linkedPolicyIds: ['POL-06'], linkedRiskIds: ['RSK-1042', 'RSK-1029', 'RSK-1018'],
    completionRate: 0, findingsCount: 0, criticalFindings: 0,
    description: 'Weekly cost and schedule risk flash review. Validates CPI/SPI thresholds, EAC drift, and escalation triggers.',
    autoTrigger: true, notifyOnComplete: ['NA-West Controls Analyst', 'Portfolio Director'],
  },
  // ── Compliance Audits ──
  {
    id: 'SCHED-010', category: 'COMPLIANCE',
    title: 'Regulatory Compliance Annual Assessment',
    scope: 'Full portfolio regulatory compliance — POL-03 (AHJ), SOX controls, data residency',
    program: 'All', projectCode: 'Portfolio', frequency: 'ANNUAL',
    auditorRole: 'ELS Compliance', assignedOwnerId: 'OWN-002', assignedOwnerName: 'Priya Anand',
    lastRunDate: '2026-01-15', nextRunDate: '2027-01-15',
    status: 'COMPLETED', linkedControlIds: ['CTRL-003', 'CTRL-008'],
    linkedPolicyIds: ['POL-03'], linkedRiskIds: [],
    completionRate: 100, findingsCount: 3, criticalFindings: 1,
    description: 'Annual full-portfolio regulatory compliance assessment. Covers AHJ requirements, SOX control effectiveness, GDPR data residency, and sustainability mandates.',
    autoTrigger: false, notifyOnComplete: ['Portfolio Director', 'EMEA Compliance Officer', 'ELS Legal'],
  },
  {
    id: 'SCHED-011', category: 'COMPLIANCE',
    title: 'SoD & Internal Controls Monthly Compliance Check',
    scope: 'Internal governance policies — POL-01, POL-02, POL-06, POL-07',
    program: 'All', projectCode: 'Portfolio', frequency: 'MONTHLY',
    auditorRole: 'ODC Controls', assignedOwnerId: 'OWN-007', assignedOwnerName: 'Sarah Okonkwo',
    lastRunDate: '2026-05-31', nextRunDate: '2026-06-30',
    status: 'OVERDUE', linkedControlIds: ['CTRL-001', 'CTRL-002', 'CTRL-009', 'CTRL-010'],
    linkedPolicyIds: ['POL-01', 'POL-02', 'POL-06', 'POL-07'], linkedRiskIds: [],
    completionRate: 0, findingsCount: 0, criticalFindings: 0,
    description: 'Monthly internal compliance check covering SoD, approval authority limits, cashflow tiering, and change-order governance.',
    autoTrigger: true, notifyOnComplete: ['FP&A Controls Partner', 'Portfolio Controls Lead'],
  },
  {
    id: 'SCHED-012', category: 'COMPLIANCE',
    title: 'Contractual SLA & PO Compliance Quarterly Audit',
    scope: 'Contractual obligations — POL-05, SLA commitments, PO adherence',
    program: 'NA-East / APAC', projectCode: 'PRY-2 / SNG-1 / MESA-1', frequency: 'QUARTERLY',
    auditorRole: 'Funding Ops', assignedOwnerId: 'OWN-005', assignedOwnerName: 'Akosua Mensah',
    lastRunDate: '2026-03-31', nextRunDate: '2026-06-30',
    status: 'IN_PROGRESS', linkedControlIds: ['CTRL-005', 'CTRL-006', 'CTRL-012'],
    linkedPolicyIds: ['POL-05'], linkedRiskIds: [],
    completionRate: 45, findingsCount: 1, criticalFindings: 0,
    description: 'Quarterly contractual SLA compliance audit. Reviews PO cycle adherence, invoice match rates, and escalation trigger accuracy against SLA commitments.',
    autoTrigger: false, notifyOnComplete: ['Funding Ops Specialist', 'Portfolio Controls Lead'],
  },
  {
    id: 'SCHED-013', category: 'COMPLIANCE',
    title: 'Data Governance & Provenance Bi-Weekly Check',
    scope: 'POL-04 — Data certification, provenance, and manual-stitching exposure',
    program: 'APAC', projectCode: 'SNG / Portfolio', frequency: 'BI_WEEKLY',
    auditorRole: 'FeP Data Ops', assignedOwnerId: 'OWN-004', assignedOwnerName: 'Ling Zhao',
    lastRunDate: '2026-06-12', nextRunDate: '2026-06-26',
    status: 'SCHEDULED', linkedControlIds: ['CTRL-004', 'CTRL-007'],
    linkedPolicyIds: ['POL-04'], linkedRiskIds: ['RISK-2248'],
    completionRate: 0, findingsCount: 0, criticalFindings: 0,
    description: 'Bi-weekly data governance check. Reviews ML model certification status, manual-stitch rates, and data residency compliance.',
    autoTrigger: false, notifyOnComplete: ['APAC Data Quality Lead'],
  },
]

// ── Audit Schedule helpers ──
export const frequencyLabel: Record<AuditFrequency, string> = {
  DAILY: 'Daily', WEEKLY: 'Weekly', BI_WEEKLY: 'Bi-Weekly', MONTHLY: 'Monthly',
  QUARTERLY: 'Quarterly', ANNUAL: 'Annual', PER_EVENT: 'Per Event',
}

export const scheduledStatusBadge: Record<ScheduledAuditStatus, { cls: string; label: string; dot: string }> = {
  SCHEDULED: { cls: 'bg-secondary text-muted-foreground border-line', label: 'Scheduled', dot: 'bg-slate' },
  IN_PROGRESS: { cls: 'bg-teal/10 text-teal border-teal/20', label: 'In Progress', dot: 'bg-teal' },
  COMPLETED: { cls: 'bg-green-bg text-green border-green/30', label: 'Completed', dot: 'bg-green' },
  OVERDUE: { cls: 'bg-red-bg text-red border-red/30', label: 'Overdue', dot: 'bg-red' },
  CANCELLED: { cls: 'bg-secondary text-muted-foreground border-line', label: 'Cancelled', dot: 'bg-slate' },
}

export const categoryMeta: Record<AuditCategory, { label: string; cls: string; icon: string }> = {
  CONTROLS: { label: 'Controls Audit', cls: 'bg-gold/15 text-gold border-gold/30', icon: 'ShieldCheck' },
  RISK: { label: 'Risk Audit', cls: 'bg-red-bg text-red border-red/30', icon: 'AlertTriangle' },
  COMPLIANCE: { label: 'Compliance Audit', cls: 'bg-teal/10 text-teal border-teal/20', icon: 'Scale' },
}

export const ownerStatusBadge: Record<OwnerStatus, { cls: string; label: string; dot: string }> = {
  ACTIVE: { cls: 'bg-green-bg text-green border-green/30', label: 'Active', dot: 'bg-green' },
  PENDING: { cls: 'bg-amber-bg text-amber border-amber/30', label: 'Pending Review', dot: 'bg-amber' },
  ESCALATED: { cls: 'bg-red-bg text-red border-red/30', label: 'Escalated', dot: 'bg-red' },
  OVERDUE: { cls: 'bg-red-bg text-red border-red/50', label: 'Overdue', dot: 'bg-red' },
}

export const AUDIT_SCHEDULE_KPIS = {
  totalScheduled: 13,
  overdue: 3,
  inProgress: 4,
  completedThisMonth: 3,
  avgCompletionRate: 71,
  criticalFindings: 4,
  nextAuditDue: '2026-06-26',
}
