import { defineStore } from 'pinia'
import { ref } from 'vue'
import { recommendApi } from '@/api/recommendApi'
import type { RecommendRecord } from '@/types/recommend'

export const useRecommendStore = defineStore('recommend', () => {
  const results = ref<RecommendRecord[]>([])
  const source = ref<'mix' | 'hot'>('mix')
  const isColdStart = ref(false)
  const total = ref(0)
  const page = ref(1)

  async function fetchRecommendations(pageNum: number, size: number) {
    const res = await recommendApi.getList({ page: pageNum, size })
    const data = res.data.data
    results.value = data.records.map((r: any) => ({ ...r, movieId: r.id ?? r.movieId, recommendReason: r.reason ?? r.recommendReason }))
    source.value = data.source
    isColdStart.value = data.isColdStart
    total.value = data.total
    page.value = data.page
  }

  return { results, source, isColdStart, total, page, fetchRecommendations }
})
