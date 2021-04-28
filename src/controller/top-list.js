
const execError = require("../utils/exec-error")
const hupuPost = require("../model/hupu_post")
const ngaPost = require("../model/nga_post")
const thirdApi = require("../utils/third-api")
const getHupuHotPost = require("../schedule/hupu").getHupuHotPost
const getNgaPost = require("../schedule/nga").getNgaPost

// 处理数据格式的一些方法
const handleKanyunData = (list) => {
  const now = new Date()
  return list.map(v => {
    return {
      post_name: v.title,
      post_href: v.url,
      create_time: now,
    }
  })
}

const handleKanyunSpData = (list) => {
  const now = new Date()
  return list.map(v => {
    return {
      post_name: v.title,
      post_href: v.url_pc,
      post_href_mobile: v.url,
      create_time: now,
    }
  })
}

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
          hupuPost.getList({ type: '12' }),
          hupuPost.getList({ type: 'all-gambia' }),
          ngaPost.getList('nga-duel-link'),
          thirdApi.requestThirdApi('weibo'),
          thirdApi.requestThirdApi('zhihu'),
          thirdApi.requestThirdApi('guancha')
        ]
      )
      // 组织数据
      ctx.body = {
        data: {
          hupuAllGambia: {
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
            list: handleKanyunData(weiboHotSearchList),
          },
          zhihuTopList: {
            name: '知乎热榜',
            list: handleKanyunData(zhihuTopList),
          },
          guanchaLatestArticle: {
            name: '观察者网最新文章',
            list: handleKanyunSpData(guanchaLatestList),
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
      if (type === 'all-gambia') {
        await getHupuHotPost({
          type: 'all-gambia',
          wrapSelector: '.list-item-wrap>.list-item',
          itemSelector: '.t-info>a',
          replySelector: '.t-info>.t-replies'
        })
      } else if (type === '12') {
        await getHupuHotPost({
          type: '12',
          wrapSelector: 'li.bbs-sl-web-post-layout',
          itemSelector: '.p-title',
          replySelector: '.post-datum'
        })
      }
      const hupuPostList = await hupuPost.getList({ type })
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
      const res = await thirdApi.requestThirdApi(type)
      const now = new Date()
      const list = res.map(v => {
        return type === 'guancha' ?
          {
            post_name: v.title,
            post_href: v.url_pc,
            post_href_mobile: v.url,
            create_time: now
          } :
          {
            post_name: v.title,
            post_href: v.url,
            create_time: now
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
