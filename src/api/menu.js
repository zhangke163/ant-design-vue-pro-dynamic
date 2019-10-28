import api from './index'
import { axios } from '@/utils/request'

export function GetMenuByRID (parameter) {
  return axios({
    url: api.querymenuByID,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: parameter
  })
}
