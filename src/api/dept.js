import axios from 'axios'
import Qs from 'qs'

export function getFootDept (deptName) {
    const url = '/v1/dept/foot'
  
    // const data = {}
    return axios.get(url, {
        params: {
            deptName: deptName
        }
    }).then((res) => {
      if (res.data) {
        return Promise.resolve(res.data)
      }
    })
}

export function getDepts (params) {
  const url = '/v1/dept/list'
  // const data = {}
  return axios.get(url, {
      params: params
  }).then((res) => {
    if (res.data) {
      return Promise.resolve(res.data)
    }
  })
}

export function getDeptOptions (parentId) {
  let url = '/v1/dept/parent'
  if (parentId) {
    url = url + '/' + parentId
  }
  // const data = {}
  return axios.get(url).then((res) => {
    if (res.data) {
      return Promise.resolve(res.data)
    }
  })
}

export function addDept (params) {
  let url = '/v1/dept/save'
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

export function delDept (deptId) {
  let url = '/v1/dept/del'
  return axios({
    method: 'post',
    url: url,
    params: {
      deptId: deptId
    }
  }).then((res) => {
    if (res.data) {
      return Promise.resolve(res.data)
    }
  }).catch((erroe) => {
    return Promise.reject(erroe)
  })
}

export function getDeptTree () {
  let url = '/v1/dept/tree'
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
