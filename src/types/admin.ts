import type { PageParams } from './api'

export interface AdminUserQuery extends PageParams {
  keyword?: string
  status?: number
}

export interface AdminMovieQuery extends PageParams {
  keyword?: string
  genreId?: number
}

export interface AdminCommentQuery extends PageParams {
  keyword?: string
}

export interface AdminRatingQuery extends PageParams {
  userId?: number
  movieId?: number
}

export interface UserManageItem {
  id: number
  username: string
  email: string | null
  status: number
  role: number
  createdAt: string
}

export interface AdminMovieItem {
  id: number
  title: string
  overview: string | null
  releaseDate: string | null
  tmdbId: number | null
  posterUrl: string | null
  avgRating: number
  ratingCount: number
  genres: string[]
  status: number
}

export interface AdminCommentItem {
  id: number
  userId: number
  username: string
  movieId: number
  movieTitle: string
  content: string
  isDeleted: boolean
  createdTime: string
  updatedTime?: string
}

export interface AdminRatingItem {
  id: number
  userId: number
  movieId: number
  movieTitle: string
  score: number
  ratedTime: string
  updatedTime?: string
}

export interface MetricsItem {
  algorithm: string
  kValue: number
  precisionK: number
  recallK: number
  coverage: number
  novelty: number
}

export interface RecommendJob {
  id: number
  runTime: string
  status: string
}

export interface UserListRes {
  records: UserManageItem[]
  total: number
}

export interface CommentListRes {
  records: AdminCommentItem[]
  total: number
}

export interface RatingListRes {
  records: AdminRatingItem[]
  total: number
}

export interface MovieListAdminRes {
  records: AdminMovieItem[]
  total: number
}
