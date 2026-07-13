<template>
  <div ref="chartElement" class="echart" :style="{ height }" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { init, use, type EChartsType } from 'echarts/core'
import { BarChart, PieChart } from 'echarts/charts'
import { GraphicComponent, GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsOption } from 'echarts'

use([BarChart, PieChart, GraphicComponent, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer])

const props = withDefaults(defineProps<{ option: EChartsOption; height?: string }>(), {
  height: '320px',
})

const chartElement = ref<HTMLDivElement>()
let chart: EChartsType | undefined
let resizeObserver: ResizeObserver | undefined

function renderChart(): void {
  chart?.setOption(props.option, { notMerge: true })
}

onMounted(() => {
  if (!chartElement.value) return
  chart = init(chartElement.value, undefined, { renderer: 'canvas' })
  renderChart()
  resizeObserver = new ResizeObserver(() => chart?.resize())
  resizeObserver.observe(chartElement.value)
})

watch(() => props.option, renderChart, { deep: true })

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  chart?.dispose()
})
</script>

<style scoped>
.echart { width: 100%; min-width: 0; }
</style>
