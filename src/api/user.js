import axios from 'axios'
// import Qs from 'qs'

export function getUsers (params) {
    const url = '/v1/user/list'
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
