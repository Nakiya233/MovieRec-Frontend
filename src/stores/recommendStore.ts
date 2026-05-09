import { defineStore } from 'pinia'
import { ref } from 'vue'
import { recommendApi } from '@/api/recommendApi'
import { useMovieStore } from '@/stores/movieStore'
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
    const rawRecords: any[] = data.records.map((r: any) => ({
      ...r,
      movieId: r.id ?? r.movieId,
      recommendReason: r.reason ?? r.recommendReason,
    }))

    const movieStore = useMovieStore()
    const enriched = await Promise.all(
      rawRecords.map(async (rec) => {
        try {
          const detail = await movieStore.fetchMovieDetail(rec.movieId)
          return {
            ...rec,
            posterUrl: rec.posterUrl ?? detail.posterUrl,
            avgRating: rec.avgRating ?? detail.avgRating,
            ratingCount: rec.ratingCount ?? detail.ratingCount,
            genres: rec.genres ?? detail.genres,
          }
        } catch {
          return rec
        }
      }),
    )

    results.value = enriched
    source.value = data.source
    isColdStart.value = data.isColdStart
    total.value = data.total
    page.value = data.page
  }

  return { results, source, isColdStart, total, page, fetchRecommendations }
})
