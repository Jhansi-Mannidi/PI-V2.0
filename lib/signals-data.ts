// Comprehensive External Signals Data for Portfolio Intelligence Platform
// Includes Labor Market, Weather, Supply Chain, Regulatory, and Utility signals
// with full project mappings and source attribution

export const laborMarketSignals = {
  skilledTrades: [
    {
      trade: 'Ironworkers',
      availability: 'Low',
      trend: 'down',
      trendPercent: '-12%',
      regions: ['Southwest', 'Mountain'],
      projects: ['Henderson Substation', 'Phoenix Field Office'],
      source: 'Bureau of Labor Statistics, Regional Labor Surveys Q2 2024',
      detail: 'Ironworker availability declining in Southwest region due to competing residential construction projects and seasonal demand.',
    },
    {
      trade: 'Electricians',
      availability: 'Medium',
      trend: 'stable',
      trendPercent: '+2%',
      regions: ['All'],
      projects: ['Atlas Data Center', 'Council Bluffs', 'Atlanta DC-3'],
      source: 'NECA Workforce Survey, Regional Union Halls',
      detail: 'Electrician supply remains stable nationally with slight uptick in Midwest. Some slack in Southeast.',
    },
    {
      trade: 'Equipment Operators',
      availability: 'High',
      trend: 'up',
      trendPercent: '+18%',
      regions: ['Midwest', 'Southeast'],
      projects: ['Council Bluffs Phase 4', 'Lenoir'],
      source: 'Associated General Contractors Labor Index',
      detail: 'Equipment operator availability up 18% in Midwest and Southeast, easing scheduling constraints.',
    },
  ],
  regionalWages: [
    { region: 'Southwest', wageInflation: 4.2, costHeadwind: 'Moderate', projects: ['Henderson', 'Phoenix'], source: 'BLS Wage Survey' },
    { region: 'Mountain', wageInflation: 5.1, costHeadwind: 'High', projects: ['Denver Area'], source: 'BLS Wage Survey' },
    { region: 'Midwest', wageInflation: 3.8, costHeadwind: 'Moderate', projects: ['Council Bluffs', 'Chicago'], source: 'BLS Wage Survey' },
    { region: 'Southeast', wageInflation: 2.9, costHeadwind: 'Low', projects: ['Atlanta DC-3', 'Lenoir'], source: 'BLS Wage Survey' },
    { region: 'Northeast', wageInflation: 6.2, costHeadwind: 'High', projects: ['Boston Area'], source: 'BLS Wage Survey' },
  ],
  apprenticeshipPipeline: [
    { year: 2024, southwest: 120, mountain: 95, midwest: 145, southeast: 110, northeast: 85 },
    { year: 2025, southwest: 130, mountain: 102, midwest: 158, southeast: 125, northeast: 92 },
    { year: 2026, southwest: 145, mountain: 115, midwest: 175, southeast: 140, northeast: 105 },
    { year: 2027, southwest: 160, mountain: 128, midwest: 192, southeast: 155, northeast: 120 },
  ],
  activeSignals: [
    {
      id: 'LM-001',
      type: 'Tight Labor Market',
      status: 'active',
      affectedRegions: ['Southwest', 'Mountain'],
      affectedProjects: ['Henderson Substation', 'Phoenix Field Office'],
      signal: 'Ironworker availability down 12% YoY in Southwest; avg wage increase 7.3%',
      source: 'BLS, Union Hiring Halls',
      recommendation: 'Prioritize Henderson mobilization; consider alternate crew models',
      date: '2024-05-15',
    },
    {
      id: 'LM-002',
      type: 'Apprenticeship Pipeline',
      status: 'watch',
      affectedRegions: ['All'],
      affectedProjects: ['All Future Projects'],
      signal: '4-year apprenticeship pipeline forecasts 22% growth; peak hiring in 2026-2027',
      source: 'NECA Apprenticeship Council',
      recommendation: 'Lock in apprentice commitments now for future phases',
      date: '2024-05-10',
    },
  ],
  bibliography: [
    { source: 'Bureau of Labor Statistics (BLS)', url: 'bls.gov', lastUpdated: '2024-05-15' },
    { source: 'NECA Workforce Survey', url: 'neca.org', lastUpdated: '2024-05-10' },
    { source: 'Associated General Contractors Labor Index', url: 'agc.org', lastUpdated: '2024-05-14' },
    { source: 'Regional Union Hiring Halls', url: 'unions.org', lastUpdated: '2024-05-16' },
  ],
}

export const weatherSignals = [
  {
    site: 'Pryor Creek',
    state: 'OK',
    event: '4-day rain event',
    dates: 'May 8-11',
    impact: 'Possible foundation excavation delay (2-3 days)',
    affectedProjects: ['Pryor Creek Data Center'],
    probability: 'High',
    source: 'NOAA National Weather Service',
  },
  {
    site: 'Mesa',
    state: 'AZ',
    event: 'High wind advisory',
    dates: 'May 10-11',
    impact: 'Crane operations suspended; possible schedule slip (1 day)',
    affectedProjects: ['Mesa Network Hub'],
    probability: 'High',
    source: 'NOAA National Weather Service',
  },
]

export const supplyChainSignals = [
  {
    commodity: 'Structural Steel',
    current: '11 weeks',
    change: '+37.5%',
    projects: ['Henderson Substation', 'Council Bluffs Phase 4'],
    source: 'Steel Service Center Institute Q2 Report',
    detail: 'Lead time increased due to tariff uncertainty and mill maintenance',
  },
  {
    commodity: 'Copper Wire (THHN)',
    current: '4 weeks',
    change: '+33%',
    projects: ['Atlas Data Center', 'Ashburn Pod 6'],
    source: 'COMEX Copper Futures + Distributor Survey',
    detail: 'Copper price spike driven by EV demand; some distributors rationing inventory',
  },
]

export const regulatorySignals = [
  {
    jurisdiction: 'Henderson, NV',
    permit: 'Electrical Inspection',
    daysToDeadline: 18,
    projects: ['Henderson Substation'],
    status: 'In Process',
    source: 'Clark County Building & Fire',
  },
  {
    jurisdiction: 'Council Bluffs, IA',
    permit: 'Site Permit Renewal',
    daysToDeadline: 24,
    projects: ['Council Bluffs Phase 4'],
    status: 'Pending',
    source: 'Pottawattamie County Planning',
  },
]

export const utilitySignals = [
  {
    site: 'Henderson',
    utility: 'NV Energy',
    status: 'Pending',
    detail: 'Power interconnect application under review; expected decision May 22',
    projects: ['Henderson Substation'],
    source: 'NV Energy Interconnection Queue',
  },
]

export const kpiMetrics = [
  { label: 'Active Signals', value: 12, change: '+3', status: 'warning' },
  { label: 'Risk Score', value: 7.2, change: '+0.4', status: 'warning' },
  { label: 'At-Risk Projects', value: 5, change: '+1', status: 'alert' },
  { label: 'Data Freshness', value: '2h ago', change: 'Real-time', status: 'info' },
  { label: 'Coverage', value: '100%', change: 'All Portfolio', status: 'success' },
]

export const signalSummary = [
  { label: 'Labor Market', count: 2, status: 'warning', color: 'red' },
  { label: 'Weather Alerts', count: 2, status: 'active', color: 'sky' },
  { label: 'Supply Chain', count: 2, status: 'watch', color: 'amber' },
  { label: 'Regulatory', count: 2, status: 'upcoming', color: 'slate' },
  { label: 'Utility', count: 1, status: 'pending', color: 'gold' },
]
