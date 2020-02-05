const TOKEN = 'hkzf_token'

export const getToken = () => localStorage.getItem(TOKEN)

// 设置 token
export const setToken = value => localStorage.setItem(TOKEN, value)

// 删除 token
export const removeToken = () => localStorage.removeItem(TOKEN)

// 是否登录（有权限）
export const isAuth = () => !!getToken()