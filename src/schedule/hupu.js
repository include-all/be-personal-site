const schedule = require('node-schedule')

const axios = require('../utils/axios')
const cheerio = require('cheerio');
const hupuPostModel = require('../model/hupu_post')

// cookie
const hupuCookie = 'acw_tc=2f624a3f16194037455927790e4e6d326956ec116be144549e8f5c31bdeae3; smidV2=20201026101055e6a2471bcaa8145b9d7d47d416920a940014d844dbd7c3240; _dacevid3=4e3a19a0.78fe.b829.b66c.c64592529efb; _cnzz_CV30020080=buzi_cookie%7C4e3a19a0.78fe.b829.b66c.c64592529efb%7C-1; Hm_lvt_4fac77ceccb0cd4ad5ef1be46d740615=1619403746; Hm_lvt_b241fb65ecc2ccf4e7e3b9601c7a50de=1619403746; Hm_lvt_39fc58a7ab8a311f2f6ca4dc1222a96e=1619403746; Hm_lpvt_39fc58a7ab8a311f2f6ca4dc1222a96e=1619403746; Hm_lpvt_4fac77ceccb0cd4ad5ef1be46d740615=1619403749; Hm_lpvt_b241fb65ecc2ccf4e7e3b9601c7a50de=1619403749; bbs_2020=1; sajssdk_2015_cross_new_user=1; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%221790bfc3886e39-0a92a218cc0884-103c6054-1296000-1790bfc3887ec3%22%2C%22%24device_id%22%3A%221790bfc3886e39-0a92a218cc0884-103c6054-1296000-1790bfc3887ec3%22%2C%22props%22%3A%7B%7D%7D; Hm_lvt_c324100ace03a4c61826ef5494c44048=1619403750; Hm_lpvt_c324100ace03a4c61826ef5494c44048=1619403750; __gads=ID=d064b6cfb21f497a:T=1619403749:S=ALNI_MYPDqwq8HpDY0Xfo_Wmj6QFnytnFQ; csrfToken=Bh3biitATQVMUCJ2ToojYuJu; __dacevst=4ddf7550.45f9f39c|1619405557363; Hm_lvt_df703c1d2273cc30ba452b4c15b16a0d=1619168708,1619168830,1619168991,1619401886; Hm_lpvt_df703c1d2273cc30ba452b4c15b16a0d=1619403758'

const getReplyCount = (replyDes) => {
  let splitFlag = replyDes.includes('/') ? '/' : '回复'
  return replyDes.split(splitFlag)[0].trim()
}

// 爬虎扑帖子
const getHupuHotPost = async ({
  type,
  wrapSelector,
  itemSelector,
  replySelector,
}) => {
  try {
    const html = await axios.get(`https://bbs.hupu.com/${type}`, {
      headers: {
        cookie: hupuCookie
      }
    })
    let $ = cheerio.load(html)
    let postWrap = $(wrapSelector)
    let res = []
    postWrap.each((index, node) => {
      let $post = $(node).find(itemSelector)
      let replyDes = $(node).find(replySelector).text()
      res.push({
        postName: $post.text().trim(),
        postHref: $post.attr('href'),
        replyCount: getReplyCount(replyDes),
        type,
      })
    })
    await hupuPostModel.updatePost(res, type)
  } catch (err) {
    console.log(err)
  }
}

const job = () => {
  // 按照规则执行定时任务
  const rule = new schedule.RecurrenceRule();
  rule.minute = [0, 30]
  schedule.scheduleJob(rule, () => {
    // 获取虎扑步行街热帖
    getHupuHotPost({
      type: 'all-gambia',
      wrapSelector: '.list-item-wrap>.list-item',
      itemSelector: '.t-info>a',
      replySelector: '.t-info>.t-replies'
    })
    // 获取虎扑历史区帖子
    getHupuHotPost({
      type: '12',
      wrapSelector: 'li.bbs-sl-web-post-layout',
      itemSelector: '.p-title',
      replySelector: '.post-datum'
    })
  })
}

module.exports = { getHupuHotPost, job }