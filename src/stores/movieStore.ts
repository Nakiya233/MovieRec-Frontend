import { defineStore } from 'pinia'
import { ref } from 'vue'
import { movieApi } from '@/api/movieApi'
import type { MovieCardData, MovieDetail, MovieQueryParams, MovieListRes } from '@/types/movie'

interface CacheEntry<T> {
  data: T
  timestamp: number
}

const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export const useMovieStore = defineStore('movie', () => {
  const listCache = ref<Map<string, CacheEntry<MovieListRes>>>(new Map())
  const detailCache = ref<Map<number, CacheEntry<MovieDetail>>>(new Map())
  const hotMovies = ref<MovieCardData[]>([])

  function cacheKey(params: MovieQueryParams): string {
    return `${params.page}_${params.genreId ?? ''}_${params.sortBy ?? ''}_${params.keyword ?? ''}`
  }

  async function fetchMovies(params: MovieQueryParams): Promise<MovieListRes> {
    const key = cacheKey(params)
    const cached = listCache.value.get(key)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data
    }
    const res = await movieApi.getList(params)
    listCache.value.set(key, { data: res.data.data, timestamp: Date.now() })
    return res.data.data
  }

  async function fetchMovieDetail(movieId: number): Promise<MovieDetail> {
    const cached = detailCache.value.get(movieId)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data
    }
    const res = await movieApi.getDetail(movieId)
    detailCache.value.set(movieId, { data: res.data.data, timestamp: Date.now() })
    return res.data.data
  }

  async function fetchHotMovies(): Promise<MovieCardData[]> {
    const res = await movieApi.getList({ page: 1, size: 8, sortBy: 'hot' })
    hotMovies.value = res.data.data.records
    return hotMovies.value
  }

  return { listCache, detailCache, hotMovies, fetchMovies, fetchMovieDetail, fetchHotMovies }
})
