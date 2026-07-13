export interface DashboardChannelStat {
  key: string
  label: string
  count: number
  percentage: number
  color: string
}

export interface DashboardRankingItem {
  label: string
  count: number
  percentage: number
}

export interface DashboardMetric {
  label: string
  value: number
  note: string
  icon: DashboardMetricIcon
  color: string
  background: string
}
export type DashboardMetricIcon = 'analytics' | 'calendar' | 'connection' | 'location'

export type GrowthPeriod = 7 | 30 | 90

export interface DashboardTrendPoint {
  date: string
  label: string
  count: number
}
