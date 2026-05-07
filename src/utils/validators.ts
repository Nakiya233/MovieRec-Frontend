export function validateUsername(username: string): string | true {
  if (!username) return '请输入用户名'
  if (username.length < 4) return '用户名至少需要 4 个字符'
  if (username.length > 32) return '用户名不能超过 32 个字符'
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return '用户名只能包含字母、数字和下划线'
  return true
}

export function validatePassword(password: string): string | true {
  if (!password) return '请输入密码'
  if (password.length < 6) return '密码至少需要 6 个字符'
  if (password.length > 64) return '密码不能超过 64 个字符'
  return true
}

export function validateConfirmPassword(password: string, confirmPassword: string): string | true {
  if (!confirmPassword) return '请确认密码'
  if (password !== confirmPassword) return '两次输入的密码不一致'
  return true
}
