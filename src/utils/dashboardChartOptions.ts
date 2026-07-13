import type { EChartsOption } from 'echarts'
import type { DashboardChannelStat, DashboardRankingItem, DashboardTrendPoint } from '@/types/dashboard'

const textColor = '#777486'
const gridLine = '#efeff5'

export function createGrowthTrendOption(points: DashboardTrendPoint[]): EChartsOption {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'line', lineStyle: { color: '#a99ff5', type: 'dashed' } },
      formatter: (params: unknown) => {
        const list = params as Array<{ axisValue: string; value: number }>
        const item = list[0]
        return item ? `${item.axisValue}<br/><strong>${item.value}</strong> 人` : ''
      },
      backgroundColor: '#242235',
      borderWidth: 0,
      textStyle: { color: '#fff' },
    },
    grid: { left: 18, right: 22, top: 25, bottom: 12, containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: points.map((item) => item.label),
      axisTick: { show: false },
      axisLine: { lineStyle: { color: gridLine } },
      axisLabel: { color: '#aaa7b7', fontSize: 10, hideOverlap: true },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#aaa7b7', fontSize: 10 },
      splitLine: { lineStyle: { color: gridLine, type: 'dashed' } },
    },
    series: [{
      name: '新增咨询',
      type: 'line',
      smooth: 0.35,
      showSymbol: false,
      symbol: 'circle',
      symbolSize: 7,
      data: points.map((item) => item.count),
      lineStyle: { width: 3, color: '#6c5ce7' },
      itemStyle: { color: '#6c5ce7', borderColor: '#fff', borderWidth: 2 },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(108, 92, 231, .30)' },
            { offset: 1, color: 'rgba(108, 92, 231, .015)' },
          ],
        },
      },
      emphasis: { focus: 'series', scale: true },
    }],
  }
}

export function createChannelDonutOption(stats: DashboardChannelStat[]): EChartsOption {
  const selectedCount = stats.reduce((sum, item) => sum + item.count, 0)
  return {
    color: stats.map((item) => item.color),
    tooltip: {
      trigger: 'item',
      formatter: '{b}<br/><strong>{c}</strong> 条 · {d}%',
      backgroundColor: '#242235',
      borderWidth: 0,
      textStyle: { color: '#fff' },
    },
    legend: {
      bottom: 2,
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 18,
      textStyle: { color: textColor, fontSize: 11 },
    },
    graphic: [
      { type: 'text', left: 'center', top: '36%', style: { text: String(selectedCount), fill: '#242235', fontSize: 28, fontWeight: 700, align: 'center' } },
      { type: 'text', left: 'center', top: '48%', style: { text: '渠道选择', fill: '#aaa7b7', fontSize: 11, align: 'center' } },
    ],
    series: [{
      type: 'pie',
      radius: ['48%', '70%'],
      center: ['50%', '42%'],
      avoidLabelOverlap: true,
      itemStyle: { borderColor: '#fff', borderWidth: 5, borderRadius: 8 },
      label: { show: false },
      emphasis: { scale: true, scaleSize: 7 },
      data: stats.map((item) => ({ name: item.label, value: item.count })),
    }],
  }
}

export function createRankingBarOption(items: DashboardRankingItem[], color: string): EChartsOption {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: '{b}<br/><strong>{c}</strong> 条咨询',
      backgroundColor: '#242235',
      borderWidth: 0,
      textStyle: { color: '#fff' },
    },
    grid: { left: 12, right: 24, top: 12, bottom: 4, containLabel: true },
    xAxis: {
      type: 'value',
      minInterval: 1,
      axisLabel: { color: '#aaa7b7', fontSize: 10 },
      splitLine: { lineStyle: { color: gridLine, type: 'dashed' } },
    },
    yAxis: {
      type: 'category',
      inverse: true,
      data: items.map((item) => item.label),
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: { color: textColor, fontSize: 11, width: 110, overflow: 'truncate' },
    },
    series: [{
      type: 'bar',
      data: items.map((item) => item.count),
      barWidth: 16,
      showBackground: true,
      backgroundStyle: { color: '#f5f5f8', borderRadius: 8 },
      itemStyle: { color, borderRadius: [0, 8, 8, 0] },
      label: { show: true, position: 'right', color: textColor, fontSize: 10 },
    }],
  }
}

export function createLocationRoseOption(items: DashboardRankingItem[]): EChartsOption {
  const colors = ['#5b4bd9', '#00a980', '#2989e8', '#f2a93b', '#ec6f91']
  return {
    color: colors,
    tooltip: {
      trigger: 'item',
      formatter: '{b}<br/><strong>{c}</strong> 条 · {d}%',
      backgroundColor: '#242235',
      borderWidth: 0,
      textStyle: { color: '#fff' },
    },
    legend: {
      orient: 'vertical',
      right: '7%',
      top: 'center',
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 18,
      textStyle: { color: textColor, fontSize: 11 },
    },
    series: [{
      type: 'pie',
      roseType: 'radius',
      radius: ['22%', '72%'],
      center: ['36%', '50%'],
      itemStyle: { borderColor: '#fff', borderWidth: 4, borderRadius: 7 },
      label: { show: false },
      data: items.map((item) => ({ name: item.label, value: item.count })),
    }],
  }
}
