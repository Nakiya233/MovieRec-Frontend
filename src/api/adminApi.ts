import http from './request'
import type { ApiResponse } from '@/types/api'
import type { AdminUserQuery, AdminMovieQuery, AdminCommentQuery, AdminRatingQuery, UserListRes, AdminMovieItem, MovieListAdminRes, AdminCommentItem, CommentListRes, AdminRatingItem, RatingListRes, MetricsItem, RecommendJob } from '@/types/admin'
import type { MovieFormData } from '@/types/movie'
import type { RecommendRes } from '@/types/recommend'

export const adminApi = {
  getUsers(params: AdminUserQuery) {
    return http.get<ApiResponse<UserListRes>>('/admin/users', { params })
  },
  getMovies(params: AdminMovieQuery) {
    return http.get<ApiResponse<MovieListAdminRes>>('/admin/movies', { params })
  },
  createMovie(data: MovieFormData) {
    return http.post<ApiResponse<{ movieId: number }>>('/admin/movies', data)
  },
  updateMovie(id: number, data: MovieFormData) {
    return http.put<ApiResponse<void>>(`/admin/movies/${id}`, data)
  },
  deleteMovie(id: number) {
    return http.delete<ApiResponse<void>>(`/admin/movies/${id}`)
  },
  getComments(params: AdminCommentQuery) {
    return http.get<ApiResponse<CommentListRes>>('/admin/comments', { params })
  },
  deleteComment(id: number) {
    return http.delete<ApiResponse<boolean>>(`/admin/comments/${id}`)
  },
  getRatings(params: AdminRatingQuery) {
    return http.get<ApiResponse<RatingListRes>>('/admin/ratings', { params })
  },
  getRecommendations(userId: number, params: { page: number; size: number }) {
    return http.get<ApiResponse<RecommendRes>>(`/admin/recommendations/${userId}`, { params })
  },
  getMetrics(jobId?: number) {
    return http.get<ApiResponse<MetricsItem[]>>('/admin/metrics', { params: jobId ? { jobId } : {} })
  },
  getRecommendJobs() {
    return http.get<ApiResponse<RecommendJob[]>>('/admin/recommend-jobs')
  }
}
