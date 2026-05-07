import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdminStore = defineStore('admin', () => {
  const userManageKeyword = ref('')
  const movieManageKeyword = ref('')
  const commentManageKeyword = ref('')

  return { userManageKeyword, movieManageKeyword, commentManageKeyword }
})
