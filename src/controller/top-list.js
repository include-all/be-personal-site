
const execError = require("../utils/exec-error")
const hupuPost = require("../model/hupu_post")
const ngaPost = require("../model/nga_post")
const thirdApi = require("../utils/third-api")
const getHupuTop = require("../schedule/hupu").getHupuTop
const getNgaPost = require("../schedule/nga").getNgaPost


const topList = {
  async getList(ctx) {
    try {
      const [
        hupu12List,
        ngaDuelLinkList,
        originWeiboHotSearchList,
        originZhihuTopList,
        originGuanchaLatestList,
      ] = await Promise.all(
        [
          hupuPost.getList('12'),
          ngaPost.getList('nga-duel-link'),
          thirdApi.requestThirdApi('weibo'),
          thirdApi.requestThirdApi('zhihu'),
          thirdApi.requestThirdApi('guancha')
        ]
      )
      // 修改weiboHotSearchList的属性名
      const weiboHotSearchList = originWeiboHotSearchList.map(v => {
        return {
          post_name: v.title,
          post_href: v.url
        }
      })
      const zhihuTopList = originZhihuTopList.map(v => {
        return {
          post_name: v.title,
          post_href: v.url
        }
      })
      const guanchaLatestList = originGuanchaLatestList.map(v => {
        return {
          post_name: v.title,
          post_href: v.url_pc,
          post_href_mobile: v.url
        }
      })
      ctx.body = {
        data: {
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
      const res = await thirdApi.requestThirdApi(type)
      const list = res.map(v => {
        return type === 'guancha' ?
          {
            post_name: v.title,
            post_href: v.url_pc,
            post_href_mobile: v.url
          } :
          {
            post_name: v.title,
            post_href: v.url
          }
      })
      ctx.body = {
        data: {
          list: list
        }
      }
    } catch {
      execError(e, ctx)
    }
  }
}

module.exports = topList;
