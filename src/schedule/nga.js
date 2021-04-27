const schedule = require('node-schedule')

const cheerio = require('cheerio');
const ngaPostModel = require('../model/nga_post')
const puppeteer = require('puppeteer')

// 爬数据+插数据库
/**
 * 利用puppeteer模拟浏览器操作，从而可以避免nga的限制
 */
const getNgaPost = async () => {
  try {
    let url = `https://bbs.nga.cn/thread.php?fid=765&rand=${parseInt(1000 * Math.random())}`
    //打开一个浏览器
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    // 打开一个页面
    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: 'networkidle0'
    });
    await new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 5000)
    })
    const html = await page.content();
    let $ = cheerio.load(html)
    let rowWrap = $('.topicrow')
    let res = []
    rowWrap.each((index, node) => {
      let $post = $(node).find('.c2>a')
      let $postDatum = $(node).find('.c1 a')
      res.push({
        postName: $post.text().trim(),
        postHref: $post.attr('href'),
        replyCount: $postDatum.text(),
        type: 'nga-duel-link'
      })
    })
    await ngaPostModel.updatePost(res.filter(v => v.replyCount))
  } catch (err) {
    console.log(err)
  }
}


const job = () => {
  // 按照规则执行定时任务
  const rule = new schedule.RecurrenceRule();
  rule.minute = [0, 30]
  schedule.scheduleJob(rule, async () => {
    getNgaPost()
  })
}

module.exports = { getNgaPost, job }