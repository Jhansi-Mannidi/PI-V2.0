// Recommendation Engine mock data — shared across all R-series screens

export type RecCategory =
  | 'Schedule Optimization'
  | 'Cost Mitigation'
  | 'Risk Prevention'
  | 'Resource Optimization'
  | 'Process Acceleration'
  | 'Compliance & Governance'
  | 'External Factor'
  | 'Contractor Management'

export type Urgency = 'Immediate' | 'This Week' | 'This Month'
export type Confidence = 'High' | 'Medium' | 'Low'
export type RecStatus = 'New' | 'Accepted' | 'Dismissed' | 'In Progress' | 'Completed'

export interface Recommendation {
  id: string
  headline: string
  category: RecCategory
  impact: string
  impactValue?: number
  evidence: string[]
  confidence: Confidence
  confidencePct: number
  urgency: Urgency
  affectedProjects: string[]
  suggestedActions: string[]
  reasoning: string
  source: string
  status: RecStatus
  createdAt: string
  feedbackGiven?: 'up' | 'down' | 'irrelevant'
}

export const categoryMeta: Record<RecCategory, { icon: string; color: string; bgClass: string; textClass: string; borderClass: string }> = {
  'Schedule Optimization': { icon: 'Calendar', color: 'teal', bgClass: 'bg-teal/10', textClass: 'text-teal', borderClass: 'border-teal/30' },
  'Cost Mitigation': { icon: 'DollarSign', color: 'gold', bgClass: 'bg-gold/10', textClass: 'text-gold', borderClass: 'border-gold/30' },
  'Risk Prevention': { icon: 'AlertTriangle', color: 'red', bgClass: 'bg-red/10', textClass: 'text-red', borderClass: 'border-red/30' },
  'Resource Optimization': { icon: 'Users', color: 'purple', bgClass: 'bg-purple-500/10', textClass: 'text-purple-500 dark:text-purple-400', borderClass: 'border-purple-500/30' },
  'Process Acceleration': { icon: 'Zap', color: 'navy', bgClass: 'bg-navy/10 dark:bg-blue-500/10', textClass: 'text-navy dark:text-blue-400', borderClass: 'border-navy/30 dark:border-blue-500/30' },
  'Compliance & Governance': { icon: 'Shield', color: 'slate', bgClass: 'bg-slate/10', textClass: 'text-slate', borderClass: 'border-slate/30' },
  'External Factor': { icon: 'Cloud', color: 'sky', bgClass: 'bg-sky-500/10', textClass: 'text-sky-600 dark:text-sky-400', borderClass: 'border-sky-500/30' },
  'Contractor Management': { icon: 'HardHat', color: 'amber', bgClass: 'bg-amber/10', textClass: 'text-amber', borderClass: 'border-amber/30' },
}

export const recommendations: Recommendation[] = [
  {
    id: 'REC-001',
    headline: 'Move indoor electrical work forward — outdoor concrete pour blocked by 4-day rain forecast',
    category: 'Schedule Optimization',
    impact: 'Prevents 3-day critical path slip',
    impactValue: 3,
    evidence: [
      'Weather API: 4-day rain event starting Thursday at Pryor Creek site',
      'P6 Schedule: 3 outdoor activities on critical path (CP float = 0)',
      'Resource availability: Indoor electrical crew available with 60% capacity'
    ],
    confidence: 'High',
    confidencePct: 92,
    urgency: 'Immediate',
    affectedProjects: ['Pryor Creek New Build'],
    suggestedActions: [
      'Reschedule concrete pour to next dry window (Monday)',
      'Pull forward indoor electrical rough-in by 2 days',
      'Notify Acme Electrical of schedule change'
    ],
    reasoning: 'Weather forecast indicates a 4-day rain event starting Thursday. Three outdoor activities on the critical path at Pryor Creek have zero float. By pulling forward indoor electrical work (currently scheduled for next week), we can maintain progress while outdoor work is blocked. Indoor crew has 60% availability. This prevents a 3-day slip on the critical path.',
    source: 'A-305 Portfolio Recommendation Agent',
    status: 'New',
    createdAt: '2025-05-05T08:30:00Z',
  },
  {
    id: 'REC-002',
    headline: 'Consolidate 3 pending change orders into single CO package — saves $12K in processing',
    category: 'Cost Mitigation',
    impact: 'Saves $12K and reduces approval cycle by 8 days',
    impactValue: 12000,
    evidence: [
      'SAP: 3 COs pending for Pryor Creek (CO-0087, CO-0091, CO-0094)',
      'Historical: Bundled COs average 8 fewer days in approval cycle',
      'Cost model: Single package eliminates duplicate review fees ($4K each)'
    ],
    confidence: 'High',
    confidencePct: 88,
    urgency: 'This Week',
    affectedProjects: ['Pryor Creek New Build'],
    suggestedActions: [
      'Merge CO-0087, CO-0091, CO-0094 into single package',
      'Route consolidated CO to Director for single approval',
      'Notify cost engineer to prepare combined impact analysis'
    ],
    reasoning: 'Three change orders for Pryor Creek are currently in separate approval pipelines. Historical data shows bundled COs save an average of 8 days in total cycle time and eliminate duplicate review fees. Combined value is within single-approval authority threshold.',
    source: 'A-305 Portfolio Recommendation Agent',
    status: 'New',
    createdAt: '2025-05-05T07:15:00Z',
  },
  {
    id: 'REC-003',
    headline: 'Henderson Substation: CPI declining 3 consecutive weeks — recommend cost review before milestone gate',
    category: 'Risk Prevention',
    impact: 'Prevents potential $2.4M overrun',
    impactValue: 2400000,
    evidence: [
      'Cortex KPI: CPI dropped from 0.91 to 0.83 over 3 weeks',
      'Variance analysis: Labor cost 18% above estimate on structural work',
      'Milestone gate: Phase 4 gate review in 12 days'
    ],
    confidence: 'High',
    confidencePct: 94,
    urgency: 'Immediate',
    affectedProjects: ['Henderson Substation'],
    suggestedActions: [
      'Schedule cost review meeting with PM and cost engineer',
      'Request detailed variance breakdown by WBS element',
      'Prepare EAC re-forecast before gate review'
    ],
    reasoning: 'Henderson Substation CPI has declined for 3 consecutive weeks (0.91 -> 0.87 -> 0.83), driven primarily by labor cost overruns on structural work. With the Phase 4 milestone gate review in 12 days, a cost review now allows time for corrective action before the gate decision.',
    source: 'A-302 Variance Explainer + A-305',
    status: 'New',
    createdAt: '2025-05-05T06:00:00Z',
  },
  {
    id: 'REC-004',
    headline: 'Redistribute invoice review from Mike R. (142% capacity) to Jordan M. (40% available)',
    category: 'Resource Optimization',
    impact: 'Reduces SLA risk by 60% for invoice processing',
    impactValue: 60,
    evidence: [
      'A-203 Key-Person Risk: Mike R. at 142% capacity across 3 critical roles',
      'Orchestration: 8 invoice reviews pending in Mike R. queue (avg 4.2 days wait)',
      'A-203: Jordan M. has 40% availability and is qualified for invoice review'
    ],
    confidence: 'Medium',
    confidencePct: 76,
    urgency: 'This Week',
    affectedProjects: ['Dallas Cooling Retrofit', 'Mesa Power Upgrade'],
    suggestedActions: [
      'Reassign 5 pending invoice reviews to Jordan M.',
      'Update service role mapping for invoice review',
      'Schedule 30-min knowledge transfer session'
    ],
    reasoning: 'Mike R. is currently overloaded at 142% capacity, filling Cost Engineer, Invoice Reviewer, and CO Approver roles simultaneously. This creates concentration risk and SLA risk exposure. Jordan M. has the qualifications and 40% available capacity to absorb invoice review responsibilities.',
    source: 'A-203 Key-Person Risk + A-305',
    status: 'New',
    createdAt: '2025-05-04T22:00:00Z',
  },
  {
    id: 'REC-005',
    headline: 'RFI response time for Structural trade averaging 6.2 days — assign dedicated reviewer',
    category: 'Process Acceleration',
    impact: 'Reduces RFI cycle time by 50% (6.2 to ~3 days)',
    impactValue: 50,
    evidence: [
      'Party features: Structural trade RFI response = 6.2 days vs 3.1 days portfolio avg',
      'Process intelligence: 4 RFIs currently pending > 5 days',
      'Bottleneck analysis: Design Review stage is the constraint'
    ],
    confidence: 'Medium',
    confidencePct: 72,
    urgency: 'This Week',
    affectedProjects: ['Pryor Creek New Build', 'Council Bluffs Phase 4'],
    suggestedActions: [
      'Assign dedicated structural reviewer for Pryor Creek',
      'Set up expedited review queue for structural RFIs',
      'Escalate 4 pending RFIs past 5-day threshold'
    ],
    reasoning: 'Structural trade RFI response times are 2x the portfolio average, creating downstream schedule delays. The bottleneck is in the Design Review stage where structural RFIs compete with other trades. A dedicated reviewer for the highest-volume project would reduce queue time significantly.',
    source: 'A-202 Bottleneck Detector + A-305',
    status: 'In Progress',
    createdAt: '2025-05-04T18:00:00Z',
  },
  {
    id: 'REC-006',
    headline: 'Henderson Substation building permit renewal due in 18 days — no orchestration started',
    category: 'Compliance & Governance',
    impact: 'Prevents work stoppage (est. 2-week delay if permit lapses)',
    impactValue: 14,
    evidence: [
      'Regulatory calendar: Henderson building permit expires May 23',
      'Orchestration state: No permit renewal process instance found',
      'Historical: Permit renewals average 12 business days to complete'
    ],
    confidence: 'High',
    confidencePct: 96,
    urgency: 'Immediate',
    affectedProjects: ['Henderson Substation'],
    suggestedActions: [
      'Initiate permit renewal orchestration immediately',
      'Assign compliance officer as process owner',
      'Pre-fill renewal application with existing permit data'
    ],
    reasoning: 'The Henderson Substation building permit expires on May 23 (18 days from now). No renewal orchestration has been initiated. Historical data shows permit renewals take 12 business days on average. Starting immediately provides only a 2-day buffer. A permit lapse would cause a mandatory work stoppage.',
    source: 'A-305 Portfolio Recommendation Agent',
    status: 'New',
    createdAt: '2025-05-05T09:00:00Z',
  },
  {
    id: 'REC-007',
    headline: 'Weather alert: 4-day rain event forecast for Pryor Creek — 3 outdoor activities on critical path',
    category: 'External Factor',
    impact: 'Proactive mitigation prevents 3-day schedule slip',
    impactValue: 3,
    evidence: [
      'Weather API: 80-95% precipitation probability Thu-Sun',
      'P6: 3 critical-path outdoor activities scheduled',
      'Site logistics: No covered work areas available'
    ],
    confidence: 'High',
    confidencePct: 90,
    urgency: 'Immediate',
    affectedProjects: ['Pryor Creek New Build'],
    suggestedActions: [
      'Notify site superintendent of weather window',
      'Accelerate outdoor work that can complete before Thursday',
      'Prepare indoor alternative work packages'
    ],
    reasoning: 'A significant rain event is forecast for the Pryor Creek site from Thursday through Sunday. Three outdoor activities on the critical path are at risk. Early notification allows the site team to accelerate completable work and prepare indoor alternatives.',
    source: 'A-305 Portfolio Recommendation Agent',
    status: 'Accepted',
    createdAt: '2025-05-05T05:00:00Z',
  },
  {
    id: 'REC-008',
    headline: 'Acme Electrical SLA-miss rate trending up +6% — recommend performance review before next mobilization',
    category: 'Contractor Management',
    impact: 'Prevents recurring SLA misses on 2 upcoming projects',
    impactValue: 2,
    evidence: [
      'Party features: Acme Electrical SLA-miss rate increased from 12% to 18% (drift detected)',
      'Anomaly detection: Acme flagged as anomalous vs electrical trade peers',
      'Pipeline: 2 upcoming mobilizations planned for Acme in June'
    ],
    confidence: 'Medium',
    confidencePct: 78,
    urgency: 'This Week',
    affectedProjects: ['Pryor Creek New Build', 'Council Bluffs Phase 4'],
    suggestedActions: [
      'Schedule performance review meeting with Acme management',
      'Prepare SLA-miss trend analysis for discussion',
      'Identify backup electrical contractor for June mobilizations'
    ],
    reasoning: 'Acme Electrical SLA-miss rate has increased 6 percentage points over the past month and the Isolation Forest anomaly model has flagged them as an outlier vs. peers. With two new mobilizations planned, addressing performance now prevents issues on upcoming work.',
    source: 'A-305 Portfolio Recommendation Agent',
    status: 'New',
    createdAt: '2025-05-04T14:00:00Z',
  },
  {
    id: 'REC-009',
    headline: 'Consolidate Dallas and Mesa procurement orders — bulk pricing saves estimated $34K',
    category: 'Cost Mitigation',
    impact: 'Saves estimated $34K through bulk procurement',
    impactValue: 34000,
    evidence: [
      'SAP: Similar electrical equipment orders pending for both projects',
      'Supplier quotes: 15-20% bulk discount available for combined order',
      'Schedule: Both projects need delivery within same 2-week window'
    ],
    confidence: 'Medium',
    confidencePct: 74,
    urgency: 'This Week',
    affectedProjects: ['Dallas Cooling Retrofit', 'Mesa Power Upgrade'],
    suggestedActions: [
      'Combine purchase requisitions for electrical switchgear',
      'Request consolidated quote from approved supplier',
      'Coordinate delivery schedule with both site logistics teams'
    ],
    reasoning: 'Both Dallas and Mesa have pending orders for similar electrical equipment within the same delivery window. Combining orders qualifies for bulk pricing tier, generating estimated 18% savings ($34K). Delivery coordination is feasible given overlapping timelines.',
    source: 'A-305 Portfolio Recommendation Agent',
    status: 'New',
    createdAt: '2025-05-04T10:00:00Z',
  },
  {
    id: 'REC-010',
    headline: 'Ashburn Pod 6 ahead of schedule — recommend pulling forward fiber installation to capture float',
    category: 'Schedule Optimization',
    impact: 'Captures 5 days of positive float for downstream activities',
    impactValue: 5,
    evidence: [
      'P6: Ashburn Pod 6 SPI = 1.05, currently 5 days ahead of baseline',
      'Resource availability: Fiber installation crew available next week',
      'Dependency analysis: Early fiber allows earlier testing start'
    ],
    confidence: 'Medium',
    confidencePct: 70,
    urgency: 'This Month',
    affectedProjects: ['Ashburn Pod 6'],
    suggestedActions: [
      'Pull forward fiber installation by 5 days',
      'Confirm crew availability with subcontractor',
      'Update P6 schedule and notify downstream activity owners'
    ],
    reasoning: 'Ashburn Pod 6 is performing above plan with SPI of 1.05. The current positive float of 5 days can be captured by pulling forward fiber installation work. This creates buffer for downstream testing activities which historically experience delays.',
    source: 'A-305 Portfolio Recommendation Agent',
    status: 'Completed',
    createdAt: '2025-05-03T08:00:00Z',
  },
  {
    id: 'REC-011',
    headline: 'Lenoir Fiber Build approaching contingency threshold — 78% of contingency consumed at 60% completion',
    category: 'Risk Prevention',
    impact: 'Early intervention prevents contingency exhaustion',
    impactValue: 0,
    evidence: [
      'Cortex KPI: Contingency burn rate 78% at 60% project completion',
      'Trend analysis: Linear projection shows contingency exhaustion at 82% completion',
      'Risk register: 2 unmitigated P1 risks remain'
    ],
    confidence: 'High',
    confidencePct: 86,
    urgency: 'This Week',
    affectedProjects: ['Lenoir Fiber Build'],
    suggestedActions: [
      'Conduct contingency review with PM and cost engineer',
      'Evaluate remaining P1 risks for probability-adjusted impact',
      'Consider requesting additional contingency allocation if warranted'
    ],
    reasoning: 'Lenoir Fiber Build has consumed 78% of its contingency budget at only 60% completion. At the current burn rate, contingency will be exhausted before project completion. With 2 unmitigated P1 risks remaining, early intervention is critical to ensure adequate reserves.',
    source: 'A-302 Variance Explainer + A-305',
    status: 'New',
    createdAt: '2025-05-04T16:00:00Z',
  },
  {
    id: 'REC-012',
    headline: 'Council Bluffs safety certification expiring for 2 key roles — schedule recertification',
    category: 'Compliance & Governance',
    impact: 'Prevents work stoppage due to expired certifications',
    impactValue: 0,
    evidence: [
      'HR System: Safety Officer cert expires May 20, Quality Inspector cert expires May 25',
      'Regulatory: Both roles require active certification for on-site work',
      'Historical: Recertification takes 5-7 business days'
    ],
    confidence: 'High',
    confidencePct: 98,
    urgency: 'Immediate',
    affectedProjects: ['Council Bluffs Phase 4'],
    suggestedActions: [
      'Schedule recertification for Safety Officer this week',
      'Schedule recertification for Quality Inspector next week',
      'Identify backup certified personnel as contingency'
    ],
    reasoning: 'Two key roles at Council Bluffs have certifications expiring within the next 3 weeks. Both roles are regulatory requirements for on-site work. Given 5-7 day recertification lead time, immediate scheduling is needed to avoid any work disruption.',
    source: 'A-305 Portfolio Recommendation Agent',
    status: 'Accepted',
    createdAt: '2025-05-05T04:00:00Z',
  },
]

// Henderson Substation specific recommendations (R-02)
export const hendersonRecommendations: Recommendation[] = [
  {
    id: 'HEN-001',
    headline: 'Initiate building permit renewal — 18 days until expiry',
    category: 'Compliance & Governance',
    impact: 'Prevents work stoppage (est. 2-week delay if permit lapses)',
    impactValue: 14,
    evidence: [
      'Regulatory calendar: Henderson building permit expires May 23, 2026',
      'Orchestration state: No permit renewal process instance found in system',
      'Historical: Permit renewals in Clark County average 12 business days to complete',
      'Risk: Permit lapse triggers mandatory work stoppage under NV Rev. Stat. § 624'
    ],
    confidence: 'High',
    confidencePct: 98,
    urgency: 'Immediate',
    affectedProjects: ['Henderson Substation'],
    suggestedActions: [
      'Initiate permit renewal orchestration immediately',
      'Assign compliance officer as process owner',
      'Pre-fill renewal application with existing permit data',
      'Escalate to Director if not actioned within 24 hours'
    ],
    reasoning: 'The Henderson Substation building permit expires on May 23 (18 days from now). No renewal orchestration has been initiated. Historical data shows Clark County permit renewals take 12 business days on average. Starting immediately provides only a 2-day buffer. A permit lapse would cause a mandatory work stoppage under Nevada statute.',
    source: 'A-305 Portfolio Recommendation Agent',
    status: 'New',
    createdAt: '2026-05-05T09:00:00Z',
  },
  {
    id: 'HEN-002',
    headline: 'Consolidate 3 change orders into single package — saves $18K processing',
    category: 'Cost Mitigation',
    impact: 'Saves $18K and reduces approval cycle by 10 days',
    impactValue: 18000,
    evidence: [
      'SAP: 3 COs pending for Henderson (CO-0102, CO-0108, CO-0112)',
      'Historical: Bundled COs for Henderson average 10 fewer days in approval',
      'Cost model: Single package eliminates duplicate review fees ($6K each)',
      'Authority: Combined value ($145K) is within single-approval threshold'
    ],
    confidence: 'High',
    confidencePct: 92,
    urgency: 'This Week',
    affectedProjects: ['Henderson Substation'],
    suggestedActions: [
      'Merge CO-0102, CO-0108, CO-0112 into single package',
      'Route consolidated CO to Director for single approval',
      'Notify cost engineer to prepare combined impact analysis'
    ],
    reasoning: 'Three change orders for Henderson Substation are in separate approval pipelines. Historical data shows bundled COs save an average of 10 days in total cycle time for this project. Combined value of $145K is within single-approval authority threshold, avoiding committee review.',
    source: 'A-305 Portfolio Recommendation Agent',
    status: 'New',
    createdAt: '2026-05-05T07:30:00Z',
  },
  {
    id: 'HEN-003',
    headline: 'CPI declining 3 consecutive weeks — schedule cost deep-dive',
    category: 'Risk Prevention',
    impact: 'Prevents potential $3.1M overrun at completion',
    impactValue: 3100000,
    evidence: [
      'Cortex KPI: CPI dropped from 0.91 → 0.87 → 0.83 over 3 weeks',
      'Variance analysis: Labor cost 22% above estimate on structural work',
      'EAC projection: Current trend projects $3.1M overrun at completion',
      'Milestone gate: Phase 4 gate review in 12 days'
    ],
    confidence: 'High',
    confidencePct: 88,
    urgency: 'This Week',
    affectedProjects: ['Henderson Substation'],
    suggestedActions: [
      'Schedule cost review meeting with PM and cost engineer this week',
      'Request detailed variance breakdown by WBS element',
      'Prepare EAC re-forecast before Phase 4 gate review',
      'Identify top 3 cost drivers for corrective action'
    ],
    reasoning: 'Henderson Substation CPI has declined for 3 consecutive weeks (0.91 → 0.87 → 0.83), driven primarily by labor cost overruns on structural work at 22% above estimate. With the Phase 4 milestone gate review in 12 days, a cost review now allows time for corrective action before the gate decision. Current trend projects a $3.1M overrun at completion.',
    source: 'A-302 Variance Explainer + A-305',
    status: 'New',
    createdAt: '2026-05-05T06:00:00Z',
  },
  {
    id: 'HEN-004',
    headline: 'Acme Electrical drift detected — performance review due',
    category: 'Contractor Management',
    impact: 'Prevents recurring SLA misses (18% → target 8%)',
    impactValue: 2,
    evidence: [
      'Party features: Acme Electrical SLA-miss rate increased from 12% to 18% (drift)',
      'Anomaly detection: Acme flagged as anomalous vs electrical trade peers (z=2.4)',
      'Impact: 3 active SLA misses attributed to Acme at Henderson site',
      'Trend: 6 percentage point increase over 30 days, accelerating'
    ],
    confidence: 'High',
    confidencePct: 85,
    urgency: 'This Week',
    affectedProjects: ['Henderson Substation'],
    suggestedActions: [
      'Schedule performance review meeting with Acme management',
      'Prepare SLA-miss trend analysis and anomaly report for discussion',
      'Issue formal performance notice per contract Section 8.2',
      'Identify backup electrical contractor as contingency'
    ],
    reasoning: 'Acme Electrical SLA-miss rate at Henderson has increased 6 percentage points over the past month (12% to 18%) and the Isolation Forest anomaly model has flagged them as a statistical outlier vs. peer electrical contractors (z-score 2.4). Three active SLA misses at Henderson are directly attributed to Acme delays.',
    source: 'A-201 Party Features + A-305',
    status: 'New',
    createdAt: '2026-05-04T14:00:00Z',
  },
  {
    id: 'HEN-005',
    headline: 'Reassign Mike R.\'s invoice queue — 142% capacity utilization',
    category: 'Resource Optimization',
    impact: 'Reduces SLA risk by 65% for invoice processing',
    impactValue: 65,
    evidence: [
      'A-203 Key-Person Risk: Mike R. at 142% capacity across 3 critical roles',
      'Queue depth: 11 invoice reviews pending (avg 5.1 days wait)',
      'SLA: 4 invoices already past SLA threshold, 3 approaching',
      'A-203: Jordan M. has 45% availability and is qualified for invoice review'
    ],
    confidence: 'High',
    confidencePct: 95,
    urgency: 'Immediate',
    affectedProjects: ['Henderson Substation'],
    suggestedActions: [
      'Reassign 7 pending invoice reviews to Jordan M. immediately',
      'Update service role mapping for Henderson invoice review',
      'Schedule 30-min knowledge transfer session for project-specific items',
      'Set up monitoring alert if Mike R. exceeds 120% capacity again'
    ],
    reasoning: 'Mike R. is at 142% capacity, holding Cost Engineer, Invoice Reviewer, and CO Approver roles simultaneously at Henderson. His invoice review queue has 11 items with an average 5.1-day wait (SLA = 4 days). Jordan M. has the qualifications and 45% available capacity to absorb the invoice review workload.',
    source: 'A-203 Key-Person Risk + A-305',
    status: 'New',
    createdAt: '2026-05-05T08:15:00Z',
  },
  {
    id: 'HEN-006',
    headline: 'Add second shift for substation electrical work to recover 5 days of float',
    category: 'Schedule Optimization',
    impact: 'Recovers 5 days float, saves $135K in avoided standby costs',
    impactValue: 135000,
    evidence: [
      'P6 Schedule: 5 days of float consumed on electrical critical path',
      'Cost analysis: Second shift costs $45K but avoids $180K in standby charges',
      'Resource check: Acme has night crews available (confirmed via Service Role query)',
      'Safety: Night work certification for Henderson site valid through June 2026'
    ],
    confidence: 'Medium',
    confidencePct: 71,
    urgency: 'This Month',
    affectedProjects: ['Henderson Substation'],
    suggestedActions: [
      'Request second shift proposal from Acme Electrical',
      'Verify night work permits and safety certifications',
      'Coordinate with site superintendent on logistics',
      'Update P6 schedule with second-shift scenario'
    ],
    reasoning: 'P6 shows 5 days of float consumed on the electrical path at Henderson. Second shift would cost $45K but recover $180K in avoided standby costs downstream. Acme has crews available for night shift (confirmed via Service Role query). Safety certification for night work at Henderson is valid through June 2026.',
    source: 'A-305 Portfolio Recommendation Agent',
    status: 'New',
    createdAt: '2026-05-04T20:00:00Z',
  },
  {
    id: 'HEN-007',
    headline: 'No weather impacts forecast for Henderson site in next 10 days',
    category: 'External Factor',
    impact: 'Informational — clear weather window confirmed',
    impactValue: 0,
    evidence: [
      'Weather API: 0% precipitation probability next 10 days at Henderson, NV',
      'Temperature: 78-92°F range, within safe working limits',
      'Wind: <15mph sustained, no high-wind restrictions anticipated',
      'Air quality: Good (AQI <50), no heat advisories'
    ],
    confidence: 'High',
    confidencePct: 97,
    urgency: 'This Month',
    affectedProjects: ['Henderson Substation'],
    suggestedActions: [
      'Maximize outdoor work scheduling during clear window',
      'Consider accelerating weather-dependent activities',
    ],
    reasoning: 'Weather API confirms a clear 10-day window for the Henderson site with no precipitation, moderate temperatures, and low wind. This is an informational recommendation confirming the absence of weather risk — the engine also flags when conditions are favorable.',
    source: 'A-305 Portfolio Recommendation Agent',
    status: 'Accepted',
    createdAt: '2026-05-05T05:30:00Z',
  },
  {
    id: 'HEN-008',
    headline: 'Milestone M-4 gate review: pre-stage evidence packages now — 3 of 7 items missing',
    category: 'Compliance & Governance',
    impact: 'Prevents milestone gate delay (60% historical delay rate when <10 days prep)',
    impactValue: 7,
    evidence: [
      'Milestone gate M-4 requires 7 evidence packages for sign-off',
      'Current status: 4 uploaded, 3 missing (structural inspection report, updated cost forecast, contractor compliance bundle)',
      'Historical: 60% of milestone gates that start evidence collection <10 days before gate date end up delayed',
      'Gate date: May 17 (12 days away)'
    ],
    confidence: 'High',
    confidencePct: 90,
    urgency: 'This Week',
    affectedProjects: ['Henderson Substation'],
    suggestedActions: [
      'Request structural inspection report from site engineer (due in 3 days)',
      'Generate updated cost forecast from latest EAC data',
      'Compile contractor compliance bundle from Acme and Pacific records',
      'Schedule pre-gate review with PM to verify completeness'
    ],
    reasoning: 'Milestone gate M-4 at Henderson requires 7 evidence packages. Currently 4 are uploaded and 3 are missing. The gate is in 12 days, and historical data shows that 60% of gates where evidence collection starts less than 10 days before the gate date experience delays. Proactively staging evidence now significantly improves the probability of on-time gate passage.',
    source: 'A-305 Portfolio Recommendation Agent',
    status: 'New',
    createdAt: '2026-05-05T07:00:00Z',
  },
]

// Henderson recommendation history (past 90 days)
export interface RecHistoryItem {
  date: string
  recommendation: string
  category: RecCategory
  status: 'Accepted' | 'Declined' | 'Expired'
  outcome: string
}

export const hendersonHistory: RecHistoryItem[] = [
  { date: 'Mar 12', recommendation: 'Bring concrete crew forward — freeze risk', category: 'External Factor', status: 'Accepted', outcome: 'Saved 2 days, $90K avoided' },
  { date: 'Mar 18', recommendation: 'Consolidate RFI responses for structural', category: 'Process Acceleration', status: 'Accepted', outcome: 'Cycle time reduced 40%' },
  { date: 'Mar 25', recommendation: 'Add night shift for foundation work', category: 'Schedule Optimization', status: 'Declined', outcome: 'PM deemed cost too high' },
  { date: 'Apr 2', recommendation: 'Flag Pacific Electrical invoice discrepancy', category: 'Cost Mitigation', status: 'Accepted', outcome: '$8.2K variance caught' },
  { date: 'Apr 10', recommendation: 'Reassign 3 RFIs from overloaded reviewer', category: 'Resource Optimization', status: 'Accepted', outcome: 'RFI backlog cleared in 3 days' },
  { date: 'Apr 15', recommendation: 'Preemptive safety inspection before OSHA window', category: 'Compliance & Governance', status: 'Accepted', outcome: 'Passed inspection, no delays' },
  { date: 'Apr 22', recommendation: 'Defer non-critical MEP changes to Phase 5', category: 'Schedule Optimization', status: 'Accepted', outcome: 'Recovered 4 days on critical path' },
  { date: 'Apr 28', recommendation: 'Replace concrete supplier due to quality variance', category: 'Contractor Management', status: 'Declined', outcome: 'PM preferred to issue corrective notice' },
]

// Weekly Digest data (R-03)
export const weeklyDigest = {
  weekNumber: 19,
  year: 2026,
  generatedAt: 'Monday, May 5 at 06:00',
  totalActive: 23,
  urgent: 7,
  valueAtStake: '$4.2M',
  executiveSummary:
    'This week\'s portfolio has 3 critical attention areas: (1) Henderson Substation permit renewal must be initiated by Wednesday or risk 6-8 week construction halt, (2) 4-day rain event at Pryor Creek starting Thursday requires immediate schedule adjustment, (3) Mike R. is at 142% capacity with no backup — 8 invoices aging. Estimated value at stake: $4.2M.',
  lastWeekScorecard: {
    generated: 19,
    accepted: 14,
    acceptedPct: 74,
    implemented: 11,
    implementedPct: 58,
    valueDelivered: '$1.4M',
    bestOutcome: 'Weather-driven reschedule on Atlanta DC-3 saved 3 days and $210K',
    learning: '2 declined recommendations were later proven correct — consider lowering the action threshold for weather-related recommendations',
  },
  trendData: [
    { week: 'W16', generated: 14, acceptanceRate: 65, valueDelivered: 420 },
    { week: 'W17', generated: 17, acceptanceRate: 71, valueDelivered: 780 },
    { week: 'W18', generated: 19, acceptanceRate: 74, valueDelivered: 1400 },
    { week: 'W19', generated: 23, acceptanceRate: 0, valueDelivered: 0 },
  ],
  actToday: [
    'Henderson Substation building permit renewal — 18 days until expiry',
    'Pryor Creek: reschedule outdoor work — 4-day rain event starting Thursday',
    'Redistribute Mike R. invoice queue — 142% capacity utilization',
    'Council Bluffs safety certification renewal — Safety Officer cert expires May 20',
    'Henderson CPI declining 3 weeks — schedule cost review before milestone gate',
    'Lenoir Fiber contingency review — 78% consumed at 60% completion',
    'Atlanta DC-3: HVAC subcontractor late mobilization — escalate or replace',
  ],
  thisWeek: [
    'Consolidate 3 change orders for Pryor Creek into single package',
      'Acme Electrical performance review — SLA-miss rate +6%',
    'Assign dedicated structural RFI reviewer for Pryor Creek',
    'Henderson: consolidate 3 change orders — saves $18K',
    'Henderson: Acme Electrical drift — schedule performance review',
    'Henderson: pre-stage milestone M-4 evidence packages (3 of 7 missing)',
    'Consolidate Dallas/Mesa procurement orders — bulk savings $34K',
    'Lenoir: evaluate remaining P1 risks for probability-adjusted impact',
    'Council Bluffs: Quality Inspector recertification',
    'Mesa Power: escalate Trade Lead RFI backlog (4 pending >5 days)',
    'Dallas Cooling: update EAC forecast with latest vendor quotes',
  ],
  thisMonth: [
    'Ashburn Pod 6: capture positive float — pull forward fiber installation',
    'Henderson: evaluate second shift for electrical work',
    'Dallas: MEP sequencing optimization for Phase 3',
    'Council Bluffs: contractor performance deep-dive for Q3 planning',
    'Henderson: no weather impacts in next 10 days — maximize outdoor work',
  ],
}

export const engineStats = {
  totalGenerated: 47,
  accepted: 18,
  dismissed: 6,
  inProgress: 8,
  completed: 3,
  avgConfidence: 82,
  estimatedSavings: '$186K',
  daysPreventedSlip: 24,
  lastRun: '2 min ago',
  nextRun: '28 min',
  agentVersion: 'A-305 v2.1.4',
  modelAccuracy: 87,
}
