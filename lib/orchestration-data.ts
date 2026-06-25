export type SLAStatus = 'BREACH' | 'SEVERE' | 'PRE-BREACH' | 'ON TRACK'

export interface SLAInfo {
  eventStart: string
  eventEnd: string
  target: string
  elapsedFormatted: string
  variance?: string
}

export interface RecentEvent {
  time: string
  eventType: string
  source: string
}

export interface Orchestration {
  id: string
  process: string
  project: string
  stage: string
  ownerRole: string
  currentFiller: string
  status: SLAStatus
  elapsed: string
  elapsedMinutes: number // for sorting
  agent: string | null
  agentId: string | null
  // Detail drawer data
  stages?: StageInfo[]
  slaCountdown?: string
  evidenceLinks?: { label: string; url: string }[]
  comments?: CommentEntry[]
  agentReasoning?: string
  // Party intelligence
  contractorIntel?: ContractorIntel
  // SLA tooltip info
  slaInfo?: SLAInfo
  // Recent events for detail drawer
  recentEvents?: RecentEvent[]
}

export interface StageInfo {
  name: string
  state: 'done' | 'active' | 'pending'
}

export interface CommentEntry {
  author: string
  time: string
  text: string
}

export interface ContractorIntel {
  breachRate30d: string
  completionReliability: string
  driftDetected: boolean
  driftDetail?: string
}

export const orchestrationData: Orchestration[] = [
  // BREACHED items
  {
    id: 'ORCH-001',
    process: 'RFI Response',
    project: 'Henderson Power Shell',
    stage: 'Vendor Review',
    ownerRole: 'Electrical Lead',
    currentFiller: 'Marcus T.',
    status: 'BREACH',
    elapsed: '38h 12m',
    elapsedMinutes: 2292,
    agent: 'Cortex A-042',
    agentId: 'A-042',
    stages: [
      { name: 'Submitted', state: 'done' },
      { name: 'Trade Review', state: 'done' },
      { name: 'Vendor Review', state: 'active' },
      { name: 'PM Sign-off', state: 'pending' },
      { name: 'Closed', state: 'pending' },
    ],
    slaCountdown: 'Overdue by 14h 12m',
    evidenceLinks: [
      { label: 'RFI-2847 Specification', url: '#' },
      { label: 'Vendor correspondence', url: '#' },
    ],
    comments: [
      { author: 'Marcus T.', time: '6h ago', text: 'Waiting on vendor for updated spec sheet. Followed up twice.' },
      { author: 'Cortex A-042', time: '4h ago', text: 'Auto-escalated to PM. Vendor response SLA exceeded by 14h.' },
      { author: 'Brian Steinberg', time: '2h ago', text: 'Contacted vendor directly. Expected response by EOD.' },
    ],
    agentReasoning: 'Agent A-042 detected vendor non-response exceeding 24h SLA threshold. Initiated auto-escalation per ECA rule E-RFI-003. PM notified via Slack integration.',
    contractorIntel: {
      breachRate30d: '12%',
      completionReliability: '0.94',
      driftDetected: true,
      driftDetail: 'SLA-miss rate +4% vs 90d baseline',
    },
    slaInfo: {
      eventStart: 'e_vendor_review_started',
      eventEnd: 'e_vendor_review_completed',
      target: '24h',
      elapsedFormatted: '38h 12m',
      variance: '+14h 12m',
    },
    recentEvents: [
      { time: 'Thu 14:22', eventType: 'e_vendor_review_started', source: 'eBuilder' },
      { time: 'Thu 16:30', eventType: 'e_vendor_followup_sent', source: 'Cortex A-042' },
      { time: 'Fri 08:15', eventType: 'e_sla_warning_triggered', source: 'PIP Engine' },
      { time: 'Fri 10:00', eventType: 'e_auto_escalation_fired', source: 'Cortex A-042' },
      { time: 'Fri 14:22', eventType: 'e_sla_breach_detected', source: 'PIP Engine' },
    ],
  },
  {
    id: 'ORCH-002',
    process: 'Change Order Routing',
    project: 'Council Bluffs Phase 4',
    stage: 'Cost Validation',
    ownerRole: 'Cost Engineer',
    currentFiller: 'Mike R.',
    status: 'BREACH',
    elapsed: '26h 45m',
    elapsedMinutes: 1605,
    agent: null,
    agentId: null,
    stages: [
      { name: 'Initiated', state: 'done' },
      { name: 'Cost Validation', state: 'active' },
      { name: 'PM Approval', state: 'pending' },
      { name: 'Executed', state: 'pending' },
    ],
    slaCountdown: 'Overdue by 2h 45m',
    evidenceLinks: [
      { label: 'CO-0092 Document', url: '#' },
    ],
    comments: [
      { author: 'Mike R.', time: '8h ago', text: 'Discrepancy in line items 4-7. Needs vendor clarification.' },
      { author: 'Hasit Chetal', time: '3h ago', text: 'Priority bump. Blocking milestone gate review.' },
    ],
    slaInfo: {
      eventStart: 'e_cost_validation_started',
      eventEnd: 'e_cost_validation_completed',
      target: '24h',
      elapsedFormatted: '26h 45m',
      variance: '+2h 45m',
    },
    recentEvents: [
      { time: 'Wed 10:00', eventType: 'e_co_initiated', source: 'eBuilder' },
      { time: 'Wed 12:30', eventType: 'e_cost_validation_started', source: 'SAP' },
      { time: 'Wed 18:00', eventType: 'e_discrepancy_flagged', source: 'Mike R.' },
      { time: 'Thu 09:15', eventType: 'e_priority_bumped', source: 'Hasit Chetal' },
      { time: 'Thu 12:45', eventType: 'e_sla_breach_detected', source: 'PIP Engine' },
    ],
  },
  {
    id: 'ORCH-003',
    process: 'Invoice Reconciliation',
    project: 'Ashburn Pod 6',
    stage: 'PO Match',
    ownerRole: 'AP Analyst',
    currentFiller: 'Lin S.',
    status: 'BREACH',
    elapsed: '29h 03m',
    elapsedMinutes: 1743,
    agent: 'Cortex A-102',
    agentId: 'A-102',
    stages: [
      { name: 'Received', state: 'done' },
      { name: 'PO Match', state: 'active' },
      { name: 'Approval', state: 'pending' },
      { name: 'Paid', state: 'pending' },
    ],
    slaCountdown: 'Overdue by 5h 03m',
    evidenceLinks: [
      { label: 'INV-20458', url: '#' },
      { label: 'PO-38291', url: '#' },
    ],
    comments: [
      { author: 'Cortex A-102', time: '5h ago', text: 'PO amount mismatch detected: $142K invoice vs $138K PO. Flagged for review.' },
      { author: 'Lin S.', time: '1h ago', text: 'Investigating variance. May need CO amendment.' },
    ],
    agentReasoning: 'Agent A-102 performed automated PO-to-invoice matching. Detected $4K variance exceeding 2% threshold. Blocked auto-approval and flagged for human review per policy FIN-007.',
    slaInfo: {
      eventStart: 'e_po_match_started',
      eventEnd: 'e_po_match_completed',
      target: '24h',
      elapsedFormatted: '29h 03m',
      variance: '+5h 03m',
    },
    recentEvents: [
      { time: 'Wed 08:00', eventType: 'e_invoice_received', source: 'SAP' },
      { time: 'Wed 09:30', eventType: 'e_po_match_started', source: 'Cortex A-102' },
      { time: 'Wed 10:15', eventType: 'e_variance_detected', source: 'Cortex A-102' },
      { time: 'Thu 08:00', eventType: 'e_human_review_requested', source: 'PIP Engine' },
      { time: 'Thu 13:03', eventType: 'e_sla_breach_detected', source: 'PIP Engine' },
    ],
  },
  {
    id: 'ORCH-004',
    process: 'Milestone Gate Review',
    project: 'Dallas Cooling Retrofit',
    stage: 'Document Assembly',
    ownerRole: 'Project Controls',
    currentFiller: 'Anita K.',
    status: 'BREACH',
    elapsed: '18h 30m',
    elapsedMinutes: 1110,
    agent: null,
    agentId: null,
    stages: [
      { name: 'Triggered', state: 'done' },
      { name: 'Document Assembly', state: 'active' },
      { name: 'Review', state: 'pending' },
      { name: 'Decision', state: 'pending' },
    ],
    slaCountdown: 'Overdue by 2h 30m',
    evidenceLinks: [
      { label: 'Gate 3 checklist', url: '#' },
    ],
    comments: [
      { author: 'Anita K.', time: '4h ago', text: 'Missing as-built drawings from mechanical sub. Requested urgently.' },
    ],
    slaInfo: {
      eventStart: 'e_doc_assembly_started',
      eventEnd: 'e_doc_assembly_completed',
      target: '16h',
      elapsedFormatted: '18h 30m',
      variance: '+2h 30m',
    },
    recentEvents: [
      { time: 'Wed 08:00', eventType: 'e_gate_triggered', source: 'P6' },
      { time: 'Wed 09:00', eventType: 'e_doc_assembly_started', source: 'Anita K.' },
      { time: 'Wed 14:00', eventType: 'e_doc_request_sent', source: 'Anita K.' },
      { time: 'Thu 00:00', eventType: 'e_sla_warning_triggered', source: 'PIP Engine' },
      { time: 'Thu 03:30', eventType: 'e_sla_breach_detected', source: 'PIP Engine' },
    ],
  },
  // SEVERE
  {
    id: 'ORCH-005',
    process: 'Contractor Onboarding',
    project: 'Henderson Power Shell',
    stage: 'Background Check',
    ownerRole: 'HR / Compliance',
    currentFiller: 'David M.',
    status: 'SEVERE',
    elapsed: '52h 18m',
    elapsedMinutes: 3138,
    agent: 'Cortex A-088',
    agentId: 'A-088',
    stages: [
      { name: 'Application', state: 'done' },
      { name: 'Background Check', state: 'active' },
      { name: 'Badge/Site Access', state: 'pending' },
      { name: 'Orientation', state: 'pending' },
      { name: 'Active', state: 'pending' },
    ],
    slaCountdown: 'Overdue by 28h 18m',
    evidenceLinks: [
      { label: 'Contractor: Vertex Electric', url: '#' },
      { label: 'Background check submission', url: '#' },
    ],
    comments: [
      { author: 'Cortex A-088', time: '12h ago', text: 'Third-party background check provider unresponsive. Auto-escalated to compliance director.' },
      { author: 'David M.', time: '6h ago', text: 'Provider confirmed backlog. ETA 12h for results.' },
      { author: 'Hasit Chetal', time: '2h ago', text: 'Critical path. Henderson electrical scope cannot start without this crew.' },
    ],
    agentReasoning: 'Agent A-088 monitors onboarding SLA. Detected background check provider exceeded 24h SLA twice in 30 days. Flagged provider reliability concern per ECA rule ON-005. Recommended alternate provider evaluation.',
    contractorIntel: {
      breachRate30d: '18%',
      completionReliability: '0.82',
      driftDetected: true,
      driftDetail: 'SLA-miss rate +7% vs 90d baseline',
    },
    slaInfo: {
      eventStart: 'e_background_check_started',
      eventEnd: 'e_background_check_completed',
      target: '24h',
      elapsedFormatted: '52h 18m',
      variance: '+28h 18m',
    },
    recentEvents: [
      { time: 'Mon 10:00', eventType: 'e_application_submitted', source: 'eBuilder' },
      { time: 'Mon 14:00', eventType: 'e_background_check_started', source: 'BrightHub' },
      { time: 'Tue 14:00', eventType: 'e_sla_breach_detected', source: 'PIP Engine' },
      { time: 'Wed 08:00', eventType: 'e_auto_escalation_fired', source: 'Cortex A-088' },
      { time: 'Thu 18:18', eventType: 'e_severe_breach_alert', source: 'PIP Engine' },
    ],
  },
  // PRE-BREACH
  {
    id: 'ORCH-006',
    process: 'Monthly Report',
    project: 'Lenoir Fiber Build',
    stage: 'Data Assembly',
    ownerRole: 'LineSight',
    currentFiller: 'Alice Cox',
    status: 'PRE-BREACH',
    elapsed: '14h 22m',
    elapsedMinutes: 862,
    agent: null,
    agentId: null,
    stages: [
      { name: 'Triggered', state: 'done' },
      { name: 'Data Assembly', state: 'active' },
      { name: 'Draft', state: 'pending' },
      { name: 'Review', state: 'pending' },
      { name: 'Published', state: 'pending' },
    ],
    slaCountdown: '1h 38m remaining',
    evidenceLinks: [
      { label: 'Report template', url: '#' },
    ],
    comments: [
      { author: 'Alice Cox', time: '2h ago', text: 'Waiting on cost data from Council Bluffs. Rest of data pulled.' },
    ],
    slaInfo: {
      eventStart: 'e_data_assembly_started',
      eventEnd: 'e_data_assembly_completed',
      target: '16h',
      elapsedFormatted: '14h 22m',
      variance: '-1h 38m remaining',
    },
    recentEvents: [
      { time: 'Wed 16:00', eventType: 'e_report_triggered', source: 'P6' },
      { time: 'Wed 18:00', eventType: 'e_data_assembly_started', source: 'Alice Cox' },
      { time: 'Thu 04:00', eventType: 'e_partial_data_received', source: 'SAP' },
      { time: 'Thu 06:22', eventType: 'e_pre_breach_warning', source: 'PIP Engine' },
      { time: 'Thu 08:00', eventType: 'e_data_request_sent', source: 'Alice Cox' },
    ],
  },
  {
    id: 'ORCH-007',
    process: 'Submittal Approval',
    project: 'Council Bluffs Phase 4',
    stage: 'Engineering Review',
    ownerRole: 'Structural Lead',
    currentFiller: 'James P.',
    status: 'PRE-BREACH',
    elapsed: '12h 05m',
    elapsedMinutes: 725,
    agent: 'Cortex A-104',
    agentId: 'A-104',
    stages: [
      { name: 'Submitted', state: 'done' },
      { name: 'Engineering Review', state: 'active' },
      { name: 'PM Sign-off', state: 'pending' },
      { name: 'Accepted', state: 'pending' },
    ],
    slaCountdown: '3h 55m remaining',
    evidenceLinks: [
      { label: 'SUB-0394 Package', url: '#' },
    ],
    comments: [
      { author: 'Cortex A-104', time: '1h ago', text: 'Approaching-SLA alert triggered. Notified structural lead via email.' },
      { author: 'James P.', time: '30m ago', text: 'Reviewing now. Should complete within 2h.' },
    ],
    agentReasoning: 'Agent A-104 predicted SLA risk at 87% confidence based on current elapsed time and historical stage duration distribution. Proactively notified filler.',
    slaInfo: {
      eventStart: 'e_engineering_review_started',
      eventEnd: 'e_engineering_review_completed',
      target: '16h',
      elapsedFormatted: '12h 05m',
      variance: '-3h 55m remaining',
    },
    recentEvents: [
      { time: 'Wed 20:00', eventType: 'e_submittal_submitted', source: 'eBuilder' },
      { time: 'Wed 22:00', eventType: 'e_engineering_review_started', source: 'James P.' },
      { time: 'Thu 06:05', eventType: 'e_pre_breach_warning', source: 'Cortex A-104' },
      { time: 'Thu 08:00', eventType: 'e_notification_sent', source: 'Cortex A-104' },
      { time: 'Thu 10:05', eventType: 'e_review_in_progress', source: 'James P.' },
    ],
  },
  // ON TRACK
  {
    id: 'ORCH-008',
    process: 'Contractor Onboarding',
    project: 'Ashburn Pod 6',
    stage: 'Badge/Site Access',
    ownerRole: 'Facilities',
    currentFiller: 'Tom W.',
    status: 'ON TRACK',
    elapsed: '4h 20m',
    elapsedMinutes: 260,
    agent: null,
    agentId: null,
    stages: [
      { name: 'Application', state: 'done' },
      { name: 'Background Check', state: 'done' },
      { name: 'Badge/Site Access', state: 'active' },
      { name: 'Orientation', state: 'pending' },
      { name: 'Active', state: 'pending' },
    ],
    slaCountdown: '19h 40m remaining',
    comments: [
      { author: 'Tom W.', time: '1h ago', text: 'Badge request submitted. Processing normally.' },
    ],
  },
  {
    id: 'ORCH-009',
    process: 'RFI Response',
    project: 'Lenoir Fiber Build',
    stage: 'Trade Review',
    ownerRole: 'Mechanical Lead',
    currentFiller: 'Jordan M.',
    status: 'ON TRACK',
    elapsed: '1d 6h',
    elapsedMinutes: 1800,
    agent: 'Cortex A-104',
    agentId: 'A-104',
    stages: [
      { name: 'Submitted', state: 'done' },
      { name: 'Trade Review', state: 'active' },
      { name: 'Vendor Review', state: 'pending' },
      { name: 'PM Sign-off', state: 'pending' },
      { name: 'Closed', state: 'pending' },
    ],
    slaCountdown: '18h remaining',
    comments: [
      { author: 'Jordan M.', time: '3h ago', text: 'Trade review in progress. No blockers.' },
    ],
  },
  {
    id: 'ORCH-010',
    process: 'Invoice Reconciliation',
    project: 'Council Bluffs Phase 4',
    stage: 'PO Match',
    ownerRole: 'Cost Engineer',
    currentFiller: 'Mike R.',
    status: 'ON TRACK',
    elapsed: '8h 10m',
    elapsedMinutes: 490,
    agent: 'Cortex A-102',
    agentId: 'A-102',
    stages: [
      { name: 'Received', state: 'done' },
      { name: 'PO Match', state: 'active' },
      { name: 'Approval', state: 'pending' },
      { name: 'Paid', state: 'pending' },
    ],
    slaCountdown: '15h 50m remaining',
    comments: [
      { author: 'Cortex A-102', time: '2h ago', text: 'Automated PO match in progress. 3 of 5 line items matched.' },
    ],
    agentReasoning: 'Agent A-102 performing automated line-item matching. 3/5 items matched. Remaining items require manual review due to description mismatch.',
  },
  {
    id: 'ORCH-011',
    process: 'Monthly Report',
    project: 'Dallas Cooling Retrofit',
    stage: 'Data Assembly',
    ownerRole: 'LineSight',
    currentFiller: 'Alice Cox',
    status: 'ON TRACK',
    elapsed: '2d 1h',
    elapsedMinutes: 2940,
    agent: null,
    agentId: null,
    stages: [
      { name: 'Triggered', state: 'done' },
      { name: 'Data Assembly', state: 'active' },
      { name: 'Draft', state: 'pending' },
      { name: 'Review', state: 'pending' },
      { name: 'Published', state: 'pending' },
    ],
    slaCountdown: '22h remaining',
    comments: [
      { author: 'Alice Cox', time: '5h ago', text: 'All data sources connected. Assembly proceeding on schedule.' },
    ],
  },
  {
    id: 'ORCH-012',
    process: 'Submittal Approval',
    project: 'Ashburn Pod 6',
    stage: 'PM Sign-off',
    ownerRole: 'Brian Steinberg',
    currentFiller: 'Brian Steinberg',
    status: 'ON TRACK',
    elapsed: '6h',
    elapsedMinutes: 360,
    agent: null,
    agentId: null,
    stages: [
      { name: 'Submitted', state: 'done' },
      { name: 'Engineering Review', state: 'done' },
      { name: 'PM Sign-off', state: 'active' },
      { name: 'Accepted', state: 'pending' },
    ],
    slaCountdown: '18h remaining',
    comments: [
      { author: 'Brian Steinberg', time: '1h ago', text: 'Reviewing submittal package. Looks straightforward.' },
    ],
  },
]

// Additional on-track items to fill out the 34 count
// We'll generate these programmatically for density
const additionalOnTrack: Orchestration[] = Array.from({ length: 29 }, (_, i) => {
  const processes = ['RFI Response', 'Invoice Reconciliation', 'Change Order Routing', 'Contractor Onboarding', 'Submittal Approval', 'Monthly Report', 'Milestone Gate Review']
  const projects = ['Ashburn Pod 6', 'Henderson Power Shell', 'Council Bluffs Phase 4', 'Dallas Cooling Retrofit', 'Lenoir Fiber Build', 'Phoenix Solar Farm', 'Atlanta Hub Expansion']
  const stages = ['In Progress', 'Under Review', 'Pending Approval', 'Data Collection', 'Validation']
  const roles = ['Cost Engineer', 'Mechanical Lead', 'Electrical Lead', 'PM', 'Facilities', 'Structural Lead']
  const fillers = ['Tom W.', 'Jordan M.', 'Mike R.', 'Alice Cox', 'Brian Steinberg', 'Marcus T.', 'Lin S.', 'James P.', 'David M.', 'Anita K.']
  const hours = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 18, 20]

  const h = hours[i % hours.length]
  return {
    id: `ORCH-${String(13 + i).padStart(3, '0')}`,
    process: processes[i % processes.length],
    project: projects[i % projects.length],
    stage: stages[i % stages.length],
    ownerRole: roles[i % roles.length],
    currentFiller: fillers[i % fillers.length],
    status: 'ON TRACK' as SLAStatus,
    elapsed: `${h}h ${(i * 7) % 60}m`,
    elapsedMinutes: h * 60 + (i * 7) % 60,
    agent: i % 4 === 0 ? `Cortex A-${100 + (i % 10)}` : null,
    agentId: i % 4 === 0 ? `A-${100 + (i % 10)}` : null,
    stages: [
      { name: 'Started', state: 'done' as const },
      { name: 'In Progress', state: 'active' as const },
      { name: 'Review', state: 'pending' as const },
      { name: 'Complete', state: 'pending' as const },
    ],
    slaCountdown: `${24 - h}h remaining`,
    comments: [],
  }
})

export const allOrchestrations: Orchestration[] = [...orchestrationData, ...additionalOnTrack]

export function getStatusCounts(data: Orchestration[]) {
  return {
    all: data.length,
    breach: data.filter(d => d.status === 'BREACH').length,
    severe: data.filter(d => d.status === 'SEVERE').length,
    preBreach: data.filter(d => d.status === 'PRE-BREACH').length,
    onTrack: data.filter(d => d.status === 'ON TRACK').length,
    agentInvolved: data.filter(d => d.agent !== null).length,
  }
}
