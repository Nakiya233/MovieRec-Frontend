import dayjs from 'dayjs'

export function formatDate(date: string | Date, template = 'YYYY-MM-DD'): string {
  return dayjs(date).format(template)
}

export function formatRating(score: number): string {
  return score.toFixed(1)
}

export function formatDateTime(date: string | Date): string {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

export function timeAgo(date: string | Date): string {
  const now = dayjs()
  const target = dayjs(date)
  const seconds = now.diff(target, 'second')

  if (seconds < 60) return '刚刚'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} 分钟前`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} 小时前`
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)} 天前`
  return formatDate(date)
}
