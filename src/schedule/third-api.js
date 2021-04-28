
const axios = require('../utils/axios')

const schedule = require('node-schedule')

const thirdApiPost = require('../model/third_api_post')

/**
 * 微博热搜，知乎热榜，观察者网最新文章接口取自看云提供的免费api
 * https://www.kancloud.cn/rosysun/rosysun/1705501
 */
const api = {
  weibo: 'http://api.rosysun.cn/weibo/',
  zhihu: 'http://api.rosysun.cn/zhihu/',
  guancha: 'http://api.rosysun.cn/guancha/'
}

const requestThirdApi = async (type) => {
  const res = await axios.get(api[type])
  return res.data
}

// 处理数据格式的一些方法
const handleKanyunData = (list, type) => {
  return list.map(v => {
    return {
      post_name: v.title,
      post_href: v.url,
      type,
    }
  })
}

const handleKanyunSpData = (list, type) => {
  return list.map(v => {
    return {
      post_name: v.title,
      post_href: v.url_pc,
      post_href_mobile: v.url,
      type,
    }
  })
}

const getThirdApiPost = async (type) => {
  try {
    let data = await requestThirdApi(type)
    data = data.filter(v => v.title && v.url)
    const handleFunc = type === 'guancha' ? handleKanyunSpData : handleKanyunData
    console.log(handleFunc(data, type))
    await thirdApiPost.updatePost(handleFunc(data, type), type)
  } catch (e) {
    console.log(e)
  }
}

const job = () => {
  // 按照规则执行定时任务
  const rule = new schedule.RecurrenceRule();
  rule.minute = [0, 30]
  schedule.scheduleJob(rule, async () => {
    getThirdApiPost('weibo')
    getThirdApiPost('zhihu')
    getThirdApiPost('guancha')
  })
}

module.exports = {
  getThirdApiPost,
  job,
}