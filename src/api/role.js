import axios from 'axios'

export function getRoles (params) {
    const url = '/v1/role/list'
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

  export function saveRole (params) {
    const url = '/v1/role/save'
    return axios({
      method: 'post',
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

  export function delRole (roleId) {
    const url = '/v1/role/del'
    return axios({
      method: 'post',
      url: url,
      params: {
        userId: roleId
      }
    }).then((res) => {
      if (res.data) {
        return Promise.resolve(res.data)
      }
    }).catch((erroe) => {
      return Promise.reject(erroe)
    })
  }

