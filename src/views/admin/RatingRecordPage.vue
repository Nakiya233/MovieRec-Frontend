<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminApi } from '@/api/adminApi'
import { formatDateTime } from '@/utils/format'
import type { AdminRatingItem } from '@/types/admin'

const ratings = ref<AdminRatingItem[]>([])
const total = ref(0)
const loading = ref(false)
const page = ref(1)
const pageSize = 10
const filterUserId = ref('')
const filterMovieId = ref('')

async function loadRatings() {
  loading.value = true
  try {
    const res = await adminApi.getRatings({
      page: page.value,
      size: pageSize,
      userId: filterUserId.value ? Number(filterUserId.value) : undefined,
      movieId: filterMovieId.value ? Number(filterMovieId.value) : undefined
    })
    ratings.value = res.data.data.records
    total.value = res.data.data.total
  } finally {
    loading.value = false
  }
}

onMounted(() => loadRatings())

function onSearch() {
  page.value = 1
  loadRatings()
}
</script>

<template>
  <div>
    <div class="flex items-center gap-4 mb-6">
      <el-input v-model="filterUserId" placeholder="用户ID" style="width:120px" clearable @clear="onSearch" @keyup.enter="onSearch" />
      <el-input v-model="filterMovieId" placeholder="电影ID" style="width:120px" clearable @clear="onSearch" @keyup.enter="onSearch" />
      <el-button type="default" @click="onSearch">查询</el-button>
    </div>

    <div class="stat-card rounded-sm overflow-hidden">
      <el-table :data="ratings" v-loading="loading" stripe style="width:100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="userId" label="用户ID" width="100" />
        <el-table-column prop="movieTitle" label="电影名" />
        <el-table-column prop="score" label="评分" width="100">
          <template #default="{ row }">
            <span class="font-semibold">{{ row.score.toFixed(1) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="评分时间" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.ratedTime) }}
          </template>
        </el-table-column>
      </el-table>

      <div class="flex justify-end p-4">
        <el-pagination
          v-model:current-page="page"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next"
          small
          @current-change="loadRatings"
        />
      </div>
    </div>
  </div>
</template>
