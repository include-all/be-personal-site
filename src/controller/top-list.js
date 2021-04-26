
const execError = require("../utils/exec-error")
const hupuPost = require("../model/hupu_post")
const getHupuTop = require("../schedule/hupu").getHupuTop

const topList = {
  async getList(ctx) {
    try {
      const hupu12List = await hupuPost.getList('12')
      ctx.body = {
        data: {
          hupu12: {
            origin: 'https://bbs.hupu.com',
            name: '虎扑历史区',
            list: hupu12List,
          },
        }
      }
    } catch (e) {
      execError(e, ctx)
    }
  },
  async reGetHupu12List(ctx) {
    try {
      await getHupuTop({
        type: '12',
        wrapSelector: 'li.bbs-sl-web-post-layout',
        itemSelector: '.p-title'
      })
      const hupu12List = await hupuPost.getList('12')
      ctx.body = {
        data: {
          list: hupu12List
        }
      }
    } catch (e) {
      execError(e, ctx)
    }
  }
}

module.exports = topList;
