import axios from 'axios'
import Qs from 'qs'

export function savePermissionModule (params) {
  let url = '/v1/permission_module/save'
  return axios({
    method: 'post',
    url: url,
    data: params,
    transformRequest: [function (data) {
      data = Qs.stringify(data)
      return data
    }]
  }).then((res) => {
    if (res.data) {
      return Promise.resolve(res.data)
    }
  }).catch((erroe) => {
    return Promise.reject(erroe)
  })
}

export function delPermissionModule (permissionModuleId) {
  let url = '/v1/permission_module/del'
  return axios({
    method: 'post',
    url: url,
    params: {
      permissionModuleId: permissionModuleId
    }
  }).then((res) => {
    if (res.data) {
      return Promise.resolve(res.data)
    }
  }).catch((erroe) => {
    return Promise.reject(erroe)
  })
}

export function getPermissionModuleTree () {
  let url = '/v1/permission_module/tree'
  return axios({
    method: 'get',
    url: url
  }).then((res) => {
    if (res.data) {
      return Promise.resolve(res.data)
    }
  }).catch((erroe) => {
    return Promise.reject(erroe)
  })
}
