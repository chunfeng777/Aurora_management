<template>
  <div v-if="methods.length" class="contact-method-tags">
    <el-tag
      v-for="method in methods"
      :key="method.key"
      size="small"
      effect="plain"
      round
      class="contact-tag"
      :class="`contact-tag--${method.key}`"
    >
      {{ method.label }}
    </el-tag>
  </div>
  <span v-else class="empty-value">未指定</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getContactMethodTags } from '@/utils/consultationFormat'

const props = defineProps<{ value: string }>()
const methods = computed(() => getContactMethodTags(props.value))
</script>

<style scoped>
.contact-method-tags {
  display: grid;
  grid-template-columns: repeat(2, max-content);
  align-items: center;
  align-content: center;
  gap: 8px 9px;
  padding: 3px 0;
}

.contact-tag {
  height: 24px;
  padding: 0 10px;
  border-width: 1px;
  font-size: 11px;
  font-weight: 500;
}

.contact-tag--email {
  border-color: #b9aefc;
  color: #6554dd;
  background: #f7f5ff;
}

.contact-tag--phone {
  border-color: #9dccf8;
  color: #247fc7;
  background: #f2f8ff;
}

.contact-tag--whatsapp {
  border-color: #91dbc7;
  color: #008f6f;
  background: #effbf7;
}

.contact-tag--wechat {
  border-color: #f2c77e;
  color: #c57b00;
  background: #fff8ea;
}

.empty-value {
  color: var(--el-text-color-placeholder);
  font-size: 12px;
}
</style>
