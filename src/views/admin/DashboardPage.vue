<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue'
import { adminApi } from '@/api/adminApi'
import type { RecommendJob } from '@/types/admin'

const totalMovies = ref(0)
const totalUsers = ref(0)
const totalRatings = ref(0)
const totalComments = ref(0)
const latestJob = ref<RecommendJob | null>(null)

async function fetchStat(apiCall: () => Promise<any>, target: Ref<number>) {
  try {
    const res = await apiCall()
    target.value = res.data.data.total ?? 0
  } catch (e) {
    console.error('Dashboard stat fetch failed:', e)
  }
}

async function fetchLatestJob() {
  try {
    const jobsRes = await adminApi.getRecommendJobs({ page: 1, size: 1 })
    const jobs = jobsRes.data.data.records
    if (jobs.length > 0) {
      latestJob.value = jobs[0]
    }
  } catch (e) {
    console.error('Dashboard latest job fetch failed:', e)
  }
}

onMounted(() => {
  fetchStat(() => adminApi.getMovies({ page: 1, size: 1 }), totalMovies)
  fetchStat(() => adminApi.getUsers({ page: 1, size: 1 }), totalUsers)
  fetchStat(() => adminApi.getRatings({ page: 1, size: 1 }), totalRatings)
  fetchStat(() => adminApi.getComments({ page: 1, size: 1 }), totalComments)
  fetchLatestJob()
})

function statusType(status: string) {
  if (status === 'success') return 'success'
  if (status === 'failed') return 'danger'
  return 'warning'
}

function statusText(status: string) {
  if (status === 'success') return '成功'
  if (status === 'failed') return '失败'
  return '运行中'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="stat-card rounded-sm p-5">
        <p class="text-xs text-[#A1A1AA] font-medium uppercase tracking-wider mb-3">电影总数</p>
        <p class="font-heading text-3xl font-bold tracking-tight">{{ totalMovies.toLocaleString() }}</p>
      </div>
      <div class="stat-card rounded-sm p-5">
        <p class="text-xs text-[#A1A1AA] font-medium uppercase tracking-wider mb-3">注册用户</p>
        <p class="font-heading text-3xl font-bold tracking-tight">{{ totalUsers.toLocaleString() }}</p>
      </div>
      <div class="stat-card rounded-sm p-5">
        <p class="text-xs text-[#A1A1AA] font-medium uppercase tracking-wider mb-3">总评分数</p>
        <p class="font-heading text-3xl font-bold tracking-tight">{{ totalRatings.toLocaleString() }}</p>
      </div>
      <div class="stat-card rounded-sm p-5">
        <p class="text-xs text-[#A1A1AA] font-medium uppercase tracking-wider mb-3">总评论数</p>
        <p class="font-heading text-3xl font-bold tracking-tight">{{ totalComments.toLocaleString() }}</p>
      </div>
    </div>

    <!-- Latest Job -->
    <div class="stat-card rounded-sm p-5" v-if="latestJob">
      <div class="flex items-center gap-4">
        <span class="text-sm font-semibold">最新推荐批次</span>
        <span class="text-sm text-[#52525B]">{{ latestJob.runTime }}</span>
        <el-tag :type="statusType(latestJob.status)" size="small">{{ statusText(latestJob.status) }}</el-tag>
      </div>
    </div>
  </div>
</template>
