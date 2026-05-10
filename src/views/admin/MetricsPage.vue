<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminApi } from '@/api/adminApi'
import type { MetricsItem, RecommendJob } from '@/types/admin'

const jobs = ref<RecommendJob[]>([])
const selectedJobId = ref<number | null>(null)
const metrics = ref<MetricsItem[]>([])
const loading = ref(false)
const jobPage = ref(1)
const jobTotal = ref(0)
const jobPageSize = 10

onMounted(() => { loadJobs() })

async function loadJobs() {
  try {
    const res = await adminApi.getRecommendJobs({ page: jobPage.value, size: jobPageSize })
    const data = res.data.data
    jobs.value = data.records
    jobTotal.value = data.total
    if (selectedJobId.value === null && data.records.length > 0) {
      selectedJobId.value = data.records[0].id
      await loadMetrics()
    }
  } catch { /* ignore */ }
}

async function loadMetrics() {
  if (!selectedJobId.value) return
  loading.value = true
  try {
    const res = await adminApi.getMetrics(selectedJobId.value)
    metrics.value = res.data.data
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <span class="text-sm font-medium">选择批次：</span>
      <el-select v-model="selectedJobId" placeholder="选择批次" style="width:400px" @change="loadMetrics">
        <el-option
          v-for="job in jobs"
          :key="job.id"
          :label="`#${job.id} — ${job.dataset}${job.version ? ' v' + job.version : ''} — ${job.runTime} — ${job.status}`"
          :value="job.id"
        />
      </el-select>
      <el-pagination
        v-model:current-page="jobPage"
        :page-size="jobPageSize"
        :total="jobTotal"
        layout="prev, pager, next"
        small
        @current-change="loadJobs"
      />
    </div>

    <div v-if="jobs.length === 0" class="text-sm text-[#A1A1AA] py-10 text-center">
      暂无推荐任务批次
    </div>

    <template v-else>
      <!-- Summary Table -->
      <div class="stat-card rounded-sm overflow-hidden">
        <div class="p-5 pb-3">
          <h3 class="text-sm font-semibold">指标汇总</h3>
        </div>
        <el-table :data="metrics" stripe style="width:100%">
          <el-table-column prop="algorithm" label="算法" width="120" />
          <el-table-column prop="kvalue" label="K" width="60" />
          <el-table-column label="Precision" width="100">
            <template #default="{ row }">{{ row.precisionK.toFixed(4) }}</template>
          </el-table-column>
          <el-table-column label="Recall" width="100">
            <template #default="{ row }">{{ row.recallK.toFixed(4) }}</template>
          </el-table-column>
          <el-table-column label="Coverage" width="100">
            <template #default="{ row }">{{ row.coverage.toFixed(4) }}</template>
          </el-table-column>
          <el-table-column label="Novelty" width="100">
            <template #default="{ row }">{{ row.novelty.toFixed(4) }}</template>
          </el-table-column>
        </el-table>
      </div>
    </template>
  </div>
</template>
