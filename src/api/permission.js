import axios from 'axios'

export function getPermissions (params) {
  const url = '/v1/permission/list'
  // const data = {}
  return axios({
    method: 'get',
    url: url,
    params: params
  }).then((res) => {
    if (res.data) {
      return Promise.resolve(res.data)
    }
  }).catch((erroe) => {
    return Promise.reject(erroe)
  })
}

export function savePermission (params) {
  let url = '/v1/permission/save'
  return axios({
    method: 'post',
    url: url,
    data: params
  }).then((res) => {
    if (res.data) {
      return Promise.resolve(res.data)
    }
  }).catch((erroe) => {
    return Promise.reject(erroe)
  })
}

export function delPermission (permissionId) {
  let url = '/v1/permission/del'
  return axios({
    method: 'post',
    url: url,
    params: {
      permissionId: permissionId
    }
  }).then((res) => {
    if (res.data) {
      return Promise.resolve(res.data)
    }
  }).catch((erroe) => {
    return Promise.reject(erroe)
  })
}

