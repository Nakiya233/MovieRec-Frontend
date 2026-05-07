<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { adminApi } from '@/api/adminApi'
import { formatRating } from '@/utils/format'
import type { RecommendRecord } from '@/types/recommend'

const route = useRoute()
const results = ref<RecommendRecord[]>([])
const total = ref(0)
const loading = ref(false)
const page = ref(1)
const pageSize = 10
const userId = ref('')

watch(() => route.params.userId, (val) => {
  if (val) { userId.value = String(val); loadRecommendations() }
}, { immediate: true })

async function loadRecommendations() {
  if (!userId.value) return
  loading.value = true
  try {
    const res = await adminApi.getRecommendations(Number(userId.value), { page: page.value, size: pageSize })
    results.value = res.data.data.records
    total.value = res.data.data.total
  } finally {
    loading.value = false
  }
}

function onSearch() {
  page.value = 1
  loadRecommendations()
}
</script>

<template>
  <div>
    <div class="flex items-center gap-4 mb-6">
      <el-input
        v-model="userId"
        placeholder="用户ID"
        style="width:160px"
        @keyup.enter="onSearch"
      />
      <el-button type="default" @click="onSearch">查看</el-button>
    </div>

    <div class="stat-card rounded-sm overflow-hidden">
      <el-table :data="results" v-loading="loading" stripe style="width:100%">
        <el-table-column prop="rankNo" label="排名" width="60" />
        <el-table-column prop="title" label="电影名" />
        <el-table-column label="混合分" width="90">
          <template #default="{ row }">{{ formatRating(row.scoreMix) }}</template>
        </el-table-column>
        <el-table-column label="UserCF" width="90">
          <template #default="{ row }">{{ formatRating(row.scoreUserCF) }}</template>
        </el-table-column>
        <el-table-column label="ItemCF" width="90">
          <template #default="{ row }">{{ formatRating(row.scoreItemCF) }}</template>
        </el-table-column>
        <el-table-column prop="jobId" label="批次ID" width="80" />
      </el-table>

      <div class="flex justify-end p-4">
        <el-pagination
          v-model:current-page="page"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next"
          small
          @current-change="loadRecommendations"
        />
      </div>
    </div>
  </div>
</template>
