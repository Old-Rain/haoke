// axios 优化
import axios from 'axios'
import { BASE_URL } from './url'
import { getToken, removeToken } from './token.js'

// 创建一个axios实例，配置好基础路径等并导出，使用时导入该文件，用返回的axios实例（API.get……）代替元素的axios.get
export const API = axios.create({
  baseURL: BASE_URL
})

API.interceptors.request.use(config => {
  // 拦截登录访问路由，在headers中添加Authorization，值为token
  const { url } = config // 这里的url显示有问题，打印出来的是请求路径，显示的是完整路径
  if (
    url.startsWith('/user') &&
    !url.startsWith('/user/login') &&
    !url.startsWith('/user/registered')
  ) {
    config.headers.Authorization = getToken()
  }
  return config
})

API.interceptors.response.use(response => {
  // 拦截登录访问的路由，如果token有问题就移除token
  const { url } = response.config
  const { status } = response.data
  if (
    url.startsWith(BASE_URL + '/user') &&
    !url.startsWith(BASE_URL + '/user/login') &&
    !url.startsWith(BASE_URL + '/user/registered') &&
    status !== 200
  ) {
    removeToken()
  }
  return response
})
