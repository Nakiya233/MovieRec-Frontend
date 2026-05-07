export interface MovieCardData {
  movieId: number
  title: string
  posterUrl: string | null
  avgRating: number
  ratingCount: number
  genres: string[]
  year?: number
}

export interface MovieDetail {
  movieId: number
  title: string
  overview: string | null
  posterUrl: string | null
  releaseDate: string | null
  avgRating: number
  ratingCount: number
  genres: string[]
  tmdbId: number | null
  latestComments: CommentItem[]
}

export interface CommentItem {
  id: number
  userId: number
  username: string
  content: string
  status: number
  createdAt: string
}

export interface MovieQueryParams {
  page: number
  size: number
  genreId?: number
  keyword?: string
  sortBy?: 'hot' | 'rating' | 'time'
}

export interface MovieListRes {
  records: MovieCardData[]
  total: number
  page: number
  size: number
}

export interface MovieFormData {
  title: string
  overview?: string
  releaseDate?: string
  tmdbId?: number
  posterUrl?: string
  genres?: string[]
}
