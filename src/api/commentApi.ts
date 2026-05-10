import http from './request'
import type { ApiResponse } from '@/types/api'
import type { CommentItem } from '@/types/movie'

export interface CommentReq {
  movieId: number
  content: string
}

export interface UserCommentRecord {
  id: number
  movieId: number
  movieTitle: string
  content: string
  createdTime: string
}

export const commentApi = {
  submit(data: CommentReq) {
    return http.post<ApiResponse<CommentItem>>('/user/comments', data)
  },
  getMyComments(params: { page: number; size: number; movieId?: number }) {
    return http.get<ApiResponse<{ records: UserCommentRecord[]; total: number }>>('/user/comments', { params })
  },
}
