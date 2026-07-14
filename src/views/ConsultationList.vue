<template>
  <section>
    <div class="page-head">
      <div><span class="eyebrow">CUSTOMER INQUIRIES</span><h1>咨询信息管理</h1><p>查看、搜索并维护客户提交的咨询信息</p></div>
    </div>

    <el-card shadow="never" class="table-card">
      <div class="toolbar">
        <el-input
          v-model="query.keywords"
          clearable
          placeholder="搜索名字"
          class="search"
          @keyup.enter="search"
          @clear="search"
        ><template #prefix>⌕</template></el-input>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
        <el-button class="refresh" :loading="loading" @click="load">刷新</el-button>
      </div>

      <el-table v-loading="loading" :data="records" row-key="id" class="consultation-table">
        <el-table-column prop="id" label="ID" width="72" />
        <el-table-column label="咨询人" prop="fullName" min-width="140">
          <template #default="scope">{{ scope.row.fullName || '-' }}</template>
        </el-table-column>
        <el-table-column label="首选联系方式" min-width="220">
          <template #default="scope"><ContactMethodTags :value="scope.row.preferredContactMethod" /></template>
        </el-table-column>
        <el-table-column label="邮箱" min-width="190">
          <template #default="scope">{{ scope.row.email || '-' }}</template>
        </el-table-column>
        <el-table-column label="电话 / WhatsApp" min-width="165">
          <template #default="scope">{{ scope.row.whatsapp || '-' }}</template>
        </el-table-column>
        <el-table-column label="微信号" min-width="140">
          <template #default="scope">{{ scope.row.wechat || '-' }}</template>
        </el-table-column>
        <el-table-column label="期望联系时间" min-width="190">
          <template #default="scope"><LocalizedOptionTags :value="scope.row.expectedContactTime" type="timeline" /></template>
        </el-table-column>
        <el-table-column label="探索方向" min-width="220">
          <template #default="scope"><LocalizedOptionTags :value="scope.row.explore" type="explore" /></template>
        </el-table-column>
        <el-table-column prop="message" label="情况说明" min-width="240" show-overflow-tooltip />
        <el-table-column label="当前所在地" min-width="240">
          <template #default="scope"><LocationTags :value="scope.row.currentLocation" /></template>
        </el-table-column>
        <el-table-column label="创建时间" width="150"><template #default="scope">{{ formatConsultationDate(scope.row.createTime) }}</template></el-table-column>
        <el-table-column label="操作" width="170" fixed="right">
          <template #default="scope">
            <el-button type="primary" link @click="edit(scope.row.id)">查看/编辑</el-button>
            <el-popconfirm title="确定删除这条咨询记录吗？" confirm-button-text="删除" cancel-button-text="取消" confirm-button-type="danger" @confirm="remove(scope.row.id)">
              <template #reference><el-button type="danger" link :loading="deletingId === scope.row.id">删除</el-button></template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <span>共 {{ total }} 条记录</span>
        <el-pagination
          v-model:current-page="query.pageNum"
          v-model:page-size="query.pageSize"
          :page-sizes="[10, 20, 50]"
          :total="total"
          layout="sizes, prev, pager, next"
          background
          @current-change="load"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <ConsultationEditDialog v-model="dialogVisible" :consultation-id="selectedId" @saved="load" />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ConsultationEditDialog from '@/components/consultation/ConsultationEditDialog.vue'
import ContactMethodTags from '@/components/consultation/ContactMethodTags.vue'
import LocationTags from '@/components/consultation/LocationTags.vue'
import LocalizedOptionTags from '@/components/consultation/LocalizedOptionTags.vue'
import { useConsultationList } from '@/composables/useConsultationList'
import { formatConsultationDate } from '@/utils/consultationFormat'

const { loading, deletingId, records, total, query, load, remove, search, reset } = useConsultationList()
const dialogVisible = ref(false)
const selectedId = ref<number | null>(null)

function edit(id: number): void {
  selectedId.value = id
  dialogVisible.value = true
}

function handleSizeChange(): void {
  query.pageNum = 1
  void load()
}

onMounted(() => void load())
</script>

<style scoped>
.page-head { margin-bottom:24px; }.eyebrow { color:#6c5ce7;font-size:11px;font-weight:800;letter-spacing:1.5px}.page-head h1{margin:7px 0 5px;color:#242235;font-size:28px}.page-head p{margin:0;color:#8c899d;font-size:14px}
.table-card{border:1px solid #ececf3;border-radius:16px}.toolbar{display:flex;align-items:center;gap:10px;margin-bottom:20px}.search{width:360px}.refresh{margin-left:auto}.consultation-table{width:100%}.pagination{display:flex;align-items:center;justify-content:space-between;margin-top:20px;padding-top:18px;border-top:1px solid #f0eff4;color:#9996a8;font-size:12px}
@media(max-width:700px){.toolbar{flex-wrap:wrap}.search{width:100%}.refresh{margin-left:0}.pagination{align-items:flex-start;gap:12px;overflow:auto}.page-head p{display:none}}
</style>
