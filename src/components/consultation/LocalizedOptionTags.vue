<template>
  <div v-if="options.length" class="option-tags">
    <el-tag
      v-for="option in options"
      :key="option.key"
      size="small"
      effect="plain"
      round
      class="option-tag"
      :class="`option-tag--${type}`"
    >
      {{ option.label }}
    </el-tag>
  </div>
  <span v-else class="empty-value">-</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getLocalizedOptionTags, type ConsultationOptionType } from '@/utils/consultationFormat'

const props = defineProps<{ value: string; type: ConsultationOptionType }>()
const options = computed(() => getLocalizedOptionTags(props.value, props.type))
</script>

<style scoped>
.option-tags {
  display: grid;
  grid-template-columns: repeat(2, max-content);
  align-items: center;
  align-content: center;
  gap: 8px 9px;
  padding: 3px 0;
}

.option-tag {
  height: 24px;
  padding: 0 10px;
  font-size: 11px;
  font-weight: 500;
}

.option-tag--timeline {
  border-color: #efc582;
  color: #bd7807;
  background: #fff8ea;
}

.option-tag--explore {
  border-color: #b9aefc;
  color: #6554dd;
  background: #f7f5ff;
}

.empty-value {
  color: var(--el-text-color-placeholder);
  font-size: 12px;
}
</style>
