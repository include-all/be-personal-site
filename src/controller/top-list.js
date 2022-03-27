
const execError = require("../utils/exec-error")
const hupuPost = require("../model/hupu_post")
const ngaPost = require("../model/nga_post")
const thirdApiPost = require("../model/third_api_post")

const getHupuHotPost = require("../schedule/hupu").getHupuHotPost
const getNgaPost = require("../schedule/nga").getNgaPost
const getThirdApiPost = require("../schedule/third-api").getThirdApiPost

const topList = {
  async getList(ctx) {
    try {
      const [
        hupu12List,
        hupuAllGambiaList,
        ngaDuelLinkList,
        weiboHotSearchList,
        zhihuTopList,
        guanchaLatestList,
      ] = await Promise.all(
        [
          hupuPost.getList('12'),
          hupuPost.getList('bxj'),
          ngaPost.getList('nga-duel-link'),
          thirdApiPost.getList('weibo'),
          thirdApiPost.getList('zhihu'),
          thirdApiPost.getList('guancha'),
        ]
      )
      // 组织数据
      ctx.body = {
        data: {
          bxj: {
            origin: 'https://bbs.hupu.com',
            name: '虎扑步行街',
            list: hupuAllGambiaList,
          },
          hupu12: {
            origin: 'https://bbs.hupu.com',
            name: '虎扑历史区',
            list: hupu12List,
          },
          ngaDuelLink: {
            name: 'NGA决斗链接',
            list: ngaDuelLinkList,
          },
          weiboHotSearch: {
            name: '微博热搜',
            list: weiboHotSearchList,
          },
          zhihuTopList: {
            name: '知乎热榜',
            list: zhihuTopList,
          },
          guanchaLatestArticle: {
            name: '观察者网最新文章',
            list: guanchaLatestList,
          }
        }
      }
    } catch (e) {
      execError(e, ctx)
    }
  },
  // 刷新虎扑历史区帖子
  async reGetHupuPostList(ctx) {
    try {
      const type = ctx.request.query.type
      if (type === 'bxj') {
        await getHupuHotPost({
          type: 'bxj',
          wrapSelector: 'li>.bbs-sl-web-post-layout',
          itemSelector: '.post-title>a',
          replySelector: '.post-datum'
        })
      } else if (type === '12') {
        await getHupuHotPost({
          type: '12',
          wrapSelector: 'li>.bbs-sl-web-post-layout',
          itemSelector: '.p-title',
          replySelector: '.post-datum'
        })
      }
      const hupuPostList = await hupuPost.getList(type)
      ctx.body = {
        data: {
          list: hupuPostList
        }
      }
    } catch (e) {
      execError(e, ctx)
    }
  },
  // 刷新nga决斗链接帖子
  async reGetNgaPostList(ctx) {
    try {
      await getNgaPost()
      const ngaDuelLinkList = await ngaPost.getList('nga-duel-link')
      ctx.body = {
        data: {
          list: ngaDuelLinkList
        }
      }
    } catch (e) {
      execError(e, ctx)
    }
  },
  // 刷新看云三个api的帖子
  async reGetThirdApiList(ctx) {
    try {
      const type = ctx.request.query.type
      await getThirdApiPost(type)
      const list = await thirdApiPost.getList(type)
      ctx.body = {
        data: {
          list,
        }
      }
    } catch {
      execError(e, ctx)
    }
  }
}

module.exports = topList;
