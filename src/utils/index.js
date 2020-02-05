// 优化axios 下面的都不要了，留个纪念
// import axios from 'axios'
// import { BASE_URL } from './url'
// console.log(BASE_URL)

import { API } from './api'

// 获取当前城市
export const getCurrentCity = () => {
  const loaclCity = JSON.parse(sessionStorage.getItem('hkzf_city'))
  if (!loaclCity) {
    var myCity = new window.BMap.LocalCity()
    return new Promise((resolve, reject) => {
      myCity.get(async result => {
        console.log(result)
        try {
          const { data: res } = await API.get('/area/info', {
            params: { name: result.name }
          })
          console.log(res)
          sessionStorage.setItem('hkzf_city', JSON.stringify(res.body))
          resolve(res.body)
        } catch (error) {
          reject(error)
        }
      })
    })
  }
  return Promise.resolve(loaclCity)
}
