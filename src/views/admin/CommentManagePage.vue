<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminApi } from '@/api/adminApi'
import { formatDateTime } from '@/utils/format'
import type { AdminCommentItem } from '@/types/admin'
import { ElMessage, ElMessageBox } from 'element-plus'

const comments = ref<AdminCommentItem[]>([])
const total = ref(0)
const loading = ref(false)
const page = ref(1)
const pageSize = 10
const keyword = ref('')

async function loadComments() {
  loading.value = true
  try {
    const res = await adminApi.getComments({ page: page.value, size: pageSize, keyword: keyword.value || undefined })
    comments.value = res.data.data.records
    total.value = res.data.data.total
  } finally {
    loading.value = false
  }
}

onMounted(() => loadComments())

async function handleDelete(id: number) {
  try {
    await ElMessageBox.confirm('确定删除该评论？', '确认', { type: 'warning' })
    await adminApi.deleteComment(id)
    ElMessage.success('删除成功')
    loadComments()
  } catch {
    // cancelled
  }
}

function onSearch() {
  page.value = 1
  loadComments()
}
</script>

<template>
  <div>
    <div class="flex items-center gap-4 mb-6">
      <el-input
        v-model="keyword"
        placeholder="搜索评论内容..."
        style="width:240px"
        clearable
        @clear="onSearch"
        @keyup.enter="onSearch"
      />
    </div>

    <div class="stat-card rounded-sm overflow-hidden">
      <el-table :data="comments" v-loading="loading" stripe style="width:100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="movieTitle" label="电影名" width="160" />
        <el-table-column prop="content" label="内容" show-overflow-tooltip />
        <el-table-column label="时间" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template #default="{ row }">
            <el-button type="danger" link size="small" @click="handleDelete(row.id)">删除</el-button>
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
          @current-change="loadComments"
        />
      </div>
    </div>
  </div>
</template>
