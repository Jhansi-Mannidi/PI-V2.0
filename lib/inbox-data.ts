export type TaskType = 'doc' | 'invoice' | 'rfi' | 'schedule'
export type SLAState = 'breach' | 'warn' | 'ok'

export interface InboxTask {
  id: string
  title: string
  project: string
  type: TaskType
  slaDisplay: string
  slaMinutes: number // for sorting -- minutes remaining (negative = breached)
  state: SLAState
  agentProcessed: boolean
  agentId?: string
  agentName?: string
}

export const allTasks: InboxTask[] = [
  // Urgent -- breach / warn
  {
    id: 'T-001',
    title: 'Three-Way Match — INV-4421',
    project: 'Henderson Substation',
    type: 'invoice',
    slaDisplay: 'PAST SLA',
    slaMinutes: -120,
    state: 'breach',
    agentProcessed: true,
    agentId: 'A-102',
    agentName: 'Invoice Match Agent',
  },
  {
    id: 'T-002',
    title: 'Review COI — Acme Electrical',
    project: 'Pryor Creek New Build',
    type: 'doc',
    slaDisplay: '2h 15m',
    slaMinutes: 135,
    state: 'warn',
    agentProcessed: false,
  },
  {
    id: 'T-003',
    title: 'Review CO Draft — CO-0087',
    project: 'Henderson Substation',
    type: 'doc',
    slaDisplay: '30m',
    slaMinutes: 30,
    state: 'warn',
    agentProcessed: false,
  },
  // On track
  {
    id: 'T-004',
    title: 'Classify RFI-1188',
    project: 'Mesa Power Upgrade',
    type: 'rfi',
    slaDisplay: '4h 30m',
    slaMinutes: 270,
    state: 'ok',
    agentProcessed: true,
    agentId: 'A-105',
    agentName: 'RFI Classifier',
  },
  {
    id: 'T-005',
    title: 'Review Schedule Delta — Week 18',
    project: 'Atlanta DC-3 Expansion',
    type: 'schedule',
    slaDisplay: '1d 2h',
    slaMinutes: 1560,
    state: 'ok',
    agentProcessed: false,
  },
  {
    id: 'T-006',
    title: 'Review COI — Pacific Mechanical',
    project: 'Mesa Power Upgrade',
    type: 'doc',
    slaDisplay: '6h 10m',
    slaMinutes: 370,
    state: 'ok',
    agentProcessed: false,
  },
  {
    id: 'T-007',
    title: 'Classify RFI-1192',
    project: 'Pryor Creek New Build',
    type: 'rfi',
    slaDisplay: '3h 45m',
    slaMinutes: 225,
    state: 'ok',
    agentProcessed: true,
    agentId: 'A-105',
    agentName: 'RFI Classifier',
  },
  {
    id: 'T-008',
    title: 'Three-Way Match — INV-4433',
    project: 'Dallas Cooling Retrofit',
    type: 'invoice',
    slaDisplay: '8h 20m',
    slaMinutes: 500,
    state: 'ok',
    agentProcessed: true,
    agentId: 'A-102',
    agentName: 'Invoice Match Agent',
  },
  {
    id: 'T-009',
    title: 'Approve Submittal — HVAC Layout Rev C',
    project: 'Ashburn Pod 6',
    type: 'doc',
    slaDisplay: '1d 8h',
    slaMinutes: 1920,
    state: 'ok',
    agentProcessed: false,
  },
  {
    id: 'T-010',
    title: 'Three-Way Match — INV-4440',
    project: 'Lenoir Fiber Build',
    type: 'invoice',
    slaDisplay: '5h',
    slaMinutes: 300,
    state: 'ok',
    agentProcessed: true,
    agentId: 'A-102',
    agentName: 'Invoice Match Agent',
  },
  {
    id: 'T-011',
    title: 'Review COI — Delta Fire Protection',
    project: 'Council Bluffs Phase 4',
    type: 'doc',
    slaDisplay: '22h',
    slaMinutes: 1320,
    state: 'ok',
    agentProcessed: false,
  },
  {
    id: 'T-012',
    title: 'Classify RFI-1195',
    project: 'Atlanta DC-3 Expansion',
    type: 'rfi',
    slaDisplay: '7h',
    slaMinutes: 420,
    state: 'ok',
    agentProcessed: true,
    agentId: 'A-105',
    agentName: 'RFI Classifier',
  },
]

export function getUrgentTasks(tasks: InboxTask[]) {
  return tasks.filter((t) => t.state === 'breach' || t.state === 'warn')
}

export function getOnTrackTasks(tasks: InboxTask[]) {
  return tasks.filter((t) => t.state === 'ok').sort((a, b) => a.slaMinutes - b.slaMinutes)
}
