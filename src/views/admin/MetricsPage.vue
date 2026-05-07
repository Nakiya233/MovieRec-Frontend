<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminApi } from '@/api/adminApi'
import MetricChart from '@/components/admin/MetricChart.vue'
import type { MetricsItem, RecommendJob } from '@/types/admin'

const jobs = ref<RecommendJob[]>([])
const selectedJobId = ref<number | null>(null)
const metrics = ref<MetricsItem[]>([])
const loading = ref(false)

onMounted(async () => {
  try {
    const res = await adminApi.getRecommendJobs()
    const successJobs = res.data.data.filter(j => j.status === 'success')
    jobs.value = successJobs
    if (successJobs.length > 0) {
      selectedJobId.value = successJobs[0].id
      await loadMetrics()
    }
  } catch { /* ignore */ }
})

async function loadMetrics() {
  if (!selectedJobId.value) return
  loading.value = true
  try {
    const res = await adminApi.getMetrics(selectedJobId.value)
    metrics.value = res.data.data.metrics
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <span class="text-sm font-medium">选择批次：</span>
      <el-select v-model="selectedJobId" placeholder="选择批次" style="width:320px" @change="loadMetrics">
        <el-option
          v-for="job in jobs"
          :key="job.id"
          :label="`批次 #${job.id} — ${job.runTime}`"
          :value="job.id"
        />
      </el-select>
    </div>

    <div v-if="selectedJobId === null" class="text-sm text-[#A1A1AA] py-10 text-center">
      暂无成功批次的推荐任务
    </div>

    <template v-else>
      <MetricChart v-if="metrics.length > 0" :metrics="metrics" />

      <!-- Summary Table -->
      <div class="stat-card rounded-sm overflow-hidden">
        <div class="p-5 pb-3">
          <h3 class="text-sm font-semibold">指标汇总</h3>
        </div>
        <el-table :data="metrics" stripe style="width:100%">
          <el-table-column prop="algorithm" label="算法" width="120" />
          <el-table-column prop="k" label="K" width="60" />
          <el-table-column label="Precision" width="100">
            <template #default="{ row }">{{ row.precision.toFixed(4) }}</template>
          </el-table-column>
          <el-table-column label="Recall" width="100">
            <template #default="{ row }">{{ row.recall.toFixed(4) }}</template>
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
