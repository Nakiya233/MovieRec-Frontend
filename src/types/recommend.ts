export interface RecommendRecord {
  rankNo: number
  movieId: number
  title: string
  posterUrl: string | null
  avgRating: number
  ratingCount: number
  genres: string[]
  scoreMix: number
  scoreUserCF: number
  scoreItemCF: number
  recommendReason: string | null
  jobId: number
}

export interface RecommendRes {
  records: RecommendRecord[]
  total: number
  page: number
  size: number
  source: 'mix' | 'hot'
  isColdStart: boolean
}
