<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminApi } from '@/api/adminApi'
import { useAdminStore } from '@/stores/adminStore'
import { formatDateTime } from '@/utils/format'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UserManageItem } from '@/types/admin'

const adminStore = useAdminStore()
const users = ref<UserManageItem[]>([])
const total = ref(0)
const loading = ref(false)
const page = ref(1)
const pageSize = 10
const keyword = ref('')

async function loadUsers() {
  loading.value = true
  try {
    const res = await adminApi.getUsers({ page: page.value, size: pageSize, keyword: keyword.value || undefined })
    users.value = res.data.data.records
    total.value = res.data.data.total
  } finally {
    loading.value = false
  }
}

onMounted(() => loadUsers())

async function toggleUserStatus(user: UserManageItem) {
  const newStatus = user.status === 1 ? 0 : 1
  const action = newStatus === 0 ? '封禁' : '解封'
  try {
    await ElMessageBox.confirm(
      `确定要${action}用户「${user.username}」吗？`,
      `${action}确认`,
      { confirmButtonText: action, cancelButtonText: '取消', type: 'warning' }
    )
    await adminApi.updateUser(user.id, { status: newStatus })
    user.status = newStatus
    ElMessage.success(`已${action}`)
  } catch (e: any) {
    if (e !== 'cancel') {
      ElMessage.error(e?.message || '操作失败')
    }
  }
}

function onSearch() {
  page.value = 1
  loadUsers()
}
</script>

<template>
  <div>
    <div class="flex items-center gap-4 mb-6">
      <el-input
        v-model="keyword"
        placeholder="搜索用户名..."
        style="width:240px"
        clearable
        @clear="onSearch"
        @keyup.enter="onSearch"
      />
      <el-button type="default" @click="onSearch">搜索</el-button>
    </div>

    <div class="stat-card rounded-sm overflow-hidden">
      <el-table :data="users" v-loading="loading" stripe style="width:100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
              {{ row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button
              :type="row.status === 1 ? 'danger' : 'success'"
              link
              size="small"
              @click="toggleUserStatus(row)"
            >
              {{ row.status === 1 ? '封禁' : '解封' }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="注册时间" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.createdAt) }}
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
          @current-change="loadUsers"
        />
      </div>
    </div>
  </div>
</template>
