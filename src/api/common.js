import axios from '@/libs/api.request'
// 下拉ajax获取选项

export const extendTime = () => {
  return axios.request({
    url: '/auth/extendTime',
    method: 'get'
  })
}

export const ks3Auth = () => {
  return axios.request({
    url: '/common/ks3Auth',
    method: 'get'
  })
}

export const getGroupList = () => {
  return axios.request({
    url: '/common/getGroupList',
    method: 'get'
  })
}

