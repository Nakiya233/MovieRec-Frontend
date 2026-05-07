import http from './request'
import type { ApiResponse } from '@/types/api'
import type { MovieQueryParams, MovieDetail, MovieListRes } from '@/types/movie'

export const movieApi = {
  getList(params: MovieQueryParams) {
    return http.get<ApiResponse<MovieListRes>>('/movies', { params })
  },
  getDetail(id: number) {
    return http.get<ApiResponse<MovieDetail>>(`/movies/${id}`)
  }
}
