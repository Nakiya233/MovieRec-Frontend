export interface UserInfo {
  id: number
  username: string
  role: number
  email?: string
  createdTime?: string
}

export interface LoginReq {
  username: string
  password: string
}

export interface RegisterReq {
  username: string
  password: string
  confirmPassword: string
}

export interface LoginRes {
  token: string
  user: UserInfo
}
