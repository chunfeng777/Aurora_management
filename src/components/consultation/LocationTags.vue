<template>
  <div v-if="locations.length" class="location-tags">
    <el-tag
      v-for="location in locations"
      :key="location.key"
      size="small"
      effect="plain"
      round
      class="location-tag"
    >
      {{ location.label }}
    </el-tag>
  </div>
  <span v-else class="empty-value">-</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getLocationTags } from '@/utils/consultationFormat'

const props = defineProps<{ value: string }>()
const locations = computed(() => getLocationTags(props.value))
</script>

<style scoped>
.location-tags {
  display: grid;
  grid-template-columns: repeat(2, max-content);
  align-items: center;
  align-content: center;
  gap: 8px 9px;
  padding: 3px 0;
}

.location-tag {
  height: 24px;
  padding: 0 10px;
  border-color: #a9c9f5;
  color: #2879bd;
  font-size: 11px;
  font-weight: 500;
  background: #f3f8ff;
}

.empty-value {
  color: var(--el-text-color-placeholder);
  font-size: 12px;
}
</style>
