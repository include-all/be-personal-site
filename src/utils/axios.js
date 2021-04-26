const axios = require('axios')

axios.interceptors.request.use(
  (config) => config,
  (err) => Promise.reject(err),
)

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    return Promise.resolve(response.data)
  },
  (err) => {
    return Promise.reject(err)
  },
)

module.exports = axios
