<template>
  <span
    class="metric-icon"
    :style="{
      '--metric-icon-color': color,
      '--metric-icon-background': background,
    }"
  >
    <el-icon :size="23">
      <component :is="iconComponent" />
    </el-icon>
  </span>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import { Calendar, Connection, DataAnalysis, Location } from '@element-plus/icons-vue'
import type { DashboardMetricIcon } from '@/types/dashboard'

const props = defineProps<{
  name: DashboardMetricIcon
  color: string
  background: string
}>()

const icons: Record<DashboardMetricIcon, Component> = {
  analytics: DataAnalysis,
  calendar: Calendar,
  connection: Connection,
  location: Location,
}

const iconComponent = computed(() => icons[props.name])
</script>

<style scoped>
.metric-icon {
  position: relative;
  display: grid;
  width: 52px;
  height: 52px;
  flex: 0 0 52px;
  place-items: center;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--metric-icon-color) 12%, white);
  border-radius: 16px;
  color: var(--metric-icon-color);
  background:
    radial-gradient(circle at 75% 20%, rgba(255, 255, 255, .85), transparent 34%),
    linear-gradient(145deg, #fff, var(--metric-icon-background));
  box-shadow:
    0 9px 20px color-mix(in srgb, var(--metric-icon-color) 14%, transparent),
    inset 0 1px 0 rgba(255, 255, 255, .9);
}

.metric-icon::after {
  position: absolute;
  right: -8px;
  bottom: -8px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: var(--metric-icon-color);
  content: '';
  opacity: .08;
}

.metric-icon :deep(svg) {
  stroke-width: 1.7;
}
</style>
