<template>
  <div class="chart-header">
    <span class="marker" :style="{ background: color }" />
    <div><strong>{{ title }}</strong><small>{{ subtitle }}</small></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; subtitle: string; color: string }>()
</script>

<style scoped>
.chart-header{display:flex;align-items:center;gap:11px}.marker{width:4px;height:30px;border-radius:4px}.chart-header strong,.chart-header small{display:block}.chart-header strong{color:#302e40;font-size:15px}.chart-header small{margin-top:4px;color:#aaa7b7;font-size:11px;font-weight:400}
</style>
