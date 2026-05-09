import http from './request'
import type { ApiResponse } from '@/types/api'
import type { CommentItem } from '@/types/movie'

export interface CommentReq {
  movieId: number
  content: string
}

export const commentApi = {
  submit(data: CommentReq) {
    return http.post<ApiResponse<CommentItem>>('/user/comments', data)
  }
}
