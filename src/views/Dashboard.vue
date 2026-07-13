<template>
  <section>
    <div class="page-head">
      <div>
        <div class="title-line"><h1>咨询数据概览</h1><span class="live-badge"><i />实时数据</span></div>
        <p>联系渠道、咨询方向与客户地区一目了然</p>
      </div>
      <div class="head-actions">
        <span>已加载 {{ consultations.length }} / {{ totalConsultations }} 条</span>
        <el-button :loading="loading" @click="refresh">刷新数据</el-button>
        <RouterLink to="/consultations"><el-button type="primary">咨询管理</el-button></RouterLink>
      </div>
    </div>

    <el-row :gutter="16" class="metrics">
      <el-col v-for="metric in metrics" :key="metric.label" :xs="24" :sm="12" :xl="6">
        <el-card v-loading="loading" shadow="never" class="metric-card">
          <div class="metric-accent" :style="{ background: metric.color }" />
          <MetricIcon :name="metric.icon" :color="metric.color" :background="metric.background" />
          <div class="metric-copy">
            <strong>{{ metric.value }}</strong>
            <span>{{ metric.label }}</span>
            <small>{{ metric.note }}</small>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card v-loading="loading" shadow="never" class="chart-panel growth-panel">
      <template #header>
        <div class="growth-header">
          <ChartHeader title="咨询人数增长趋势" subtitle="根据咨询表创建时间按天统计" color="#6c5ce7" />
          <div class="growth-actions">
            <div class="period-summary"><strong>{{ growthPeriodTotal }}</strong><span>周期内新增</span></div>
            <el-segmented v-model="growthPeriod" :options="periodOptions" size="small" />
          </div>
        </div>
      </template>
      <div v-if="validCreateTimeCount === 0" class="time-warning">
        <span>!</span> 接口当前没有返回有效的创建时间，后端补齐 createTime 后趋势将自动生成
      </div>
      <BaseEChart :option="growthOption" height="320px" />
    </el-card>

    <el-row :gutter="16">
      <el-col :xs="24" :xl="9">
        <el-card v-loading="loading" shadow="never" class="chart-panel">
          <template #header><ChartHeader title="首选联系渠道" subtitle="客户可同时选择多个联系方式" color="#6c5ce7" /></template>
          <BaseEChart v-if="hasChannelData" :option="channelOption" height="330px" />
          <el-empty v-else :image-size="76" description="暂无渠道数据" />
        </el-card>
      </el-col>

      <el-col :xs="24" :xl="15">
        <el-card v-loading="loading" shadow="never" class="chart-panel">
          <template #header><ChartHeader title="热门咨询方向" subtitle="根据“正在探索什么”实时统计" color="#00a980" /></template>
          <BaseEChart v-if="topicStats.length" :option="topicOption" height="330px" />
          <el-empty v-else :image-size="76" description="暂无咨询方向数据" />
        </el-card>
      </el-col>
    </el-row>

    <el-card v-loading="loading" shadow="never" class="chart-panel location-panel">
      <template #header>
        <div class="location-header">
          <ChartHeader title="客户地区分布" subtitle="根据客户当前所在地统计" color="#2989e8" />
          <div class="scope-note"><span>{{ locationStats.length }}</span> 个地区 · 基于 {{ consultations.length }} 条记录</div>
        </div>
      </template>
      <BaseEChart v-if="locationStats.length" :option="locationOption" height="350px" />
      <el-empty v-else :image-size="76" description="暂无地区数据" />
    </el-card>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseEChart from '@/components/charts/BaseEChart.vue'
import ChartHeader from '@/components/dashboard/ChartHeader.vue'
import MetricIcon from '@/components/dashboard/MetricIcon.vue'
import { useConsultationDashboard } from '@/composables/useConsultationDashboard'
import { createChannelDonutOption, createGrowthTrendOption, createLocationRoseOption, createRankingBarOption } from '@/utils/dashboardChartOptions'
import type { GrowthPeriod } from '@/types/dashboard'

const {
  loading,
  consultations,
  totalConsultations,
  metrics,
  channelStats,
  topicStats,
  locationStats,
  growthPeriod,
  growthTrend,
  growthPeriodTotal,
  validCreateTimeCount,
  refresh,
} = useConsultationDashboard()

const periodOptions: Array<{ label: string; value: GrowthPeriod }> = [
  { label: '近 7 天', value: 7 },
  { label: '近 30 天', value: 30 },
  { label: '近 90 天', value: 90 },
]

const growthOption = computed(() => createGrowthTrendOption(growthTrend.value))
const hasChannelData = computed(() => channelStats.value.some((item) => item.count > 0))
const channelOption = computed(() => createChannelDonutOption(channelStats.value))
const topicOption = computed(() => createRankingBarOption(topicStats.value, '#00a980'))
const locationOption = computed(() => createLocationRoseOption(locationStats.value))
</script>

<style scoped>
.page-head{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:22px}.title-line{display:flex;align-items:center;gap:12px}.page-head h1{margin:0;color:#242235;font-size:28px}.page-head p{margin:7px 0 0;color:#8c899d;font-size:14px}.live-badge{display:flex;align-items:center;gap:6px;padding:5px 9px;border-radius:999px;color:#008f6f;font-size:11px;font-weight:600;background:#e8faf5}.live-badge i{width:6px;height:6px;border-radius:50%;background:#00b894;box-shadow:0 0 0 4px rgba(0,184,148,.1)}.head-actions{display:flex;align-items:center;gap:10px}.head-actions>span{margin-right:4px;color:#9996a8;font-size:12px}.head-actions a{text-decoration:none}
.metrics{margin-bottom:0}.metric-card{position:relative;margin-bottom:16px;overflow:hidden;border:1px solid #ececf3;border-radius:16px;transition:transform .2s,box-shadow .2s}.metric-card:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(42,38,72,.07)}.metric-card :deep(.el-card__body){display:flex;align-items:center;gap:16px;padding:21px}.metric-accent{position:absolute;top:0;right:0;width:70px;height:70px;border-radius:0 0 0 70px;opacity:.055}.metric-copy strong,.metric-copy span,.metric-copy small{display:block}.metric-copy strong{color:#242235;font-size:28px;line-height:1}.metric-copy span{margin-top:6px;color:#4f4c60;font-size:13px;font-weight:600}.metric-copy small{margin-top:4px;color:#aaa7b7;font-size:10px}
.chart-panel{min-height:410px;margin-bottom:16px;border:1px solid #ececf3;border-radius:16px;transition:box-shadow .2s}.chart-panel:hover{box-shadow:0 12px 30px rgba(42,38,72,.055)}.chart-panel :deep(.el-card__header){padding:19px 22px;border-bottom:1px solid #f0eff4}.chart-panel :deep(.el-card__body){padding:14px 20px 18px}.location-panel{min-height:430px}.location-header{display:flex;align-items:center;justify-content:space-between}.scope-note{padding:7px 11px;border-radius:9px;color:#9996a8;font-size:11px;background:#f7f7fa}.scope-note span{color:#2989e8;font-size:14px;font-weight:700}
.growth-panel{position:relative;min-height:430px}.growth-header{display:flex;align-items:center;justify-content:space-between;gap:20px}.growth-actions{display:flex;align-items:center;gap:18px}.period-summary{text-align:right}.period-summary strong,.period-summary span{display:block}.period-summary strong{color:#302e40;font-size:18px}.period-summary span{margin-top:2px;color:#aaa7b7;font-size:10px}.time-warning{display:flex;align-items:center;gap:8px;margin:1px 4px 0;padding:9px 12px;border:1px solid #f6d99d;border-radius:9px;color:#a66b08;font-size:11px;background:#fff9ed}.time-warning span{display:grid;width:17px;height:17px;place-items:center;border-radius:50%;color:#fff;font-size:10px;font-weight:700;background:#e6a23c}
@media(max-width:760px){.page-head{align-items:flex-start;gap:16px}.head-actions>span,.page-head p{display:none}.head-actions{flex-wrap:wrap}.title-line{align-items:flex-start;flex-direction:column;gap:6px}.location-header{align-items:flex-start;gap:12px}.scope-note{display:none}.growth-header{align-items:flex-start;flex-direction:column}.growth-actions{width:100%;justify-content:space-between}.period-summary{text-align:left}}
</style>
