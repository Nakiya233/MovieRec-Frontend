import http from './request'
import type { ApiResponse } from '@/types/api'
import type { MovieQueryParams, MovieDetail, MovieListRes, CommentListRes } from '@/types/movie'

export const movieApi = {
  getList(params: MovieQueryParams) {
    return http.get<ApiResponse<MovieListRes>>('/movies', { params })
  },
  getDetail(id: number) {
    return http.get<ApiResponse<MovieDetail>>(`/movies/${id}`)
  },
  getComments(id: number, params: { page: number; size: number }) {
    return http.get<ApiResponse<CommentListRes>>(`/movies/${id}/comments`, { params })
  },
}
