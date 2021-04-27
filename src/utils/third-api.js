const axios = require('./axios')

/**
 * 微博热搜，知乎热榜，观察者网最新文章接口取自看云提供的免费api
 * https://www.kancloud.cn/rosysun/rosysun/1705501
 */
const api = {
  weibo: 'http://api.rosysun.cn/weibo/',
  zhihu: 'http://api.rosysun.cn/zhihu/',
  guancha: 'http://api.rosysun.cn/guancha/'
}
module.exports = {
  requestThirdApi: async (type) => {
    const res = await axios.get(api[type])
    return res.data
  },
}