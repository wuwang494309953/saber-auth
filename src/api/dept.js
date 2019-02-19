import axios from 'axios'

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