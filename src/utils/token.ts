const TOKEN_KEY = 'movierec_token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export function getUser(): { id: number; username: string; role: number } | null {
  const raw = localStorage.getItem('movierec_user')
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setUser(user: { id: number; username: string; role: number }): void {
  localStorage.setItem('movierec_user', JSON.stringify(user))
}

export function removeUser(): void {
  localStorage.removeItem('movierec_user')
}
