import http from './request'
import type { ApiResponse } from '@/types/api'

export interface RatingReq {
  movieId: number
  score: number
}

export interface RatingRes {
  id: number
  movieId: number
  score: number
  avgRating: number
}

export interface UserRatingRecord {
  id: number
  movieId: number
  movieTitle: string
  score: number
  ratedTime: string
}

export const ratingApi = {
  submit(data: RatingReq) {
    return http.post<ApiResponse<RatingRes>>('/user/ratings', data)
  },
  getMyRatings(params: { page: number; size: number; movieId?: number }) {
    return http.get<ApiResponse<{ records: UserRatingRecord[]; total: number }>>('/user/ratings', { params })
  },
}
