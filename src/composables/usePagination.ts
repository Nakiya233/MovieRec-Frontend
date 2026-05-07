import { ref, computed } from 'vue'

export function usePagination(initialPage = 1, initialSize = 12) {
  const page = ref(initialPage)
  const size = ref(initialSize)
  const total = ref(0)

  const totalPages = computed(() => Math.ceil(total.value / size.value) || 1)

  function reset() {
    page.value = 1
  }

  function setTotal(t: number) {
    total.value = t
  }

  return { page, size, total, totalPages, reset, setTotal }
}
