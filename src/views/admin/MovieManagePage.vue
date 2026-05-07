<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminApi } from '@/api/adminApi'
import MovieFormDialog from '@/components/admin/MovieFormDialog.vue'
import { formatRating } from '@/utils/format'
import type { AdminMovieItem, MovieListAdminRes } from '@/types/admin'
import type { MovieFormData } from '@/types/movie'
import { ElMessage, ElMessageBox } from 'element-plus'

const movies = ref<AdminMovieItem[]>([])
const total = ref(0)
const loading = ref(false)
const page = ref(1)
const pageSize = 10
const keyword = ref('')

const dialogVisible = ref(false)
const editingMovie = ref<MovieFormData | null>(null)

async function loadMovies() {
  loading.value = true
  try {
    const res = await adminApi.getMovies({ page: page.value, size: pageSize, keyword: keyword.value || undefined })
    movies.value = res.data.data.records
    total.value = res.data.data.total
  } finally {
    loading.value = false
  }
}

onMounted(() => loadMovies())

function openCreate() {
  editingMovie.value = null
  dialogVisible.value = true
}

function openEdit(movie: AdminMovieItem) {
  editingMovie.value = {
    title: movie.title,
    releaseDate: movie.releaseDate || '',
    genres: movie.genres
  }
  dialogVisible.value = true
}

async function handleSubmit(data: MovieFormData) {
  try {
    if (editingMovie.value) {
      await adminApi.updateMovie((editingMovie.value as any).movieId, data)
    } else {
      await adminApi.createMovie(data)
    }
    dialogVisible.value = false
    ElMessage.success(editingMovie.value ? '更新成功' : '创建成功')
    loadMovies()
  } catch (e: any) {
    ElMessage.error(e?.message || '操作失败')
  }
}

function onSearch() {
  page.value = 1
  loadMovies()
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <el-input
          v-model="keyword"
          placeholder="搜索电影..."
          style="width:240px"
          clearable
          @clear="onSearch"
          @keyup.enter="onSearch"
        />
        <el-button type="default" @click="onSearch">搜索</el-button>
      </div>
      <el-button type="primary" @click="openCreate">添加电影</el-button>
    </div>

    <div class="stat-card rounded-sm overflow-hidden">
      <el-table :data="movies" v-loading="loading" stripe style="width:100%">
        <el-table-column prop="movieId" label="ID" width="80" />
        <el-table-column prop="title" label="电影名称" />
        <el-table-column prop="releaseDate" label="年份" width="100" />
        <el-table-column label="评分" width="100">
          <template #default="{ row }">
            <span class="font-semibold">{{ formatRating(row.avgRating) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ratingCount" label="评分人数" width="100" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="openEdit(row)">编辑</el-button>
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
          @current-change="loadMovies"
        />
      </div>
    </div>

    <MovieFormDialog
      :visible="dialogVisible"
      :movie="editingMovie"
      @close="dialogVisible = false"
      @submit="handleSubmit"
    />
  </div>
</template>
