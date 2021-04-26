const hupuPostSchema = require('./schema/hupu_post_schema')
const db = require('../../config/mysql.js')


class HupuPost {
  model;
  constructor() {
    try {
      this.model = db.sequelize.define(
        hupuPostSchema.modelName,
        hupuPostSchema.schema,
        hupuPostSchema.options,
      )
    } catch (err) {
      console.log(err)
    }
  }
  // 更新帖子
  async updatePost(list) {
    try {
      await this.model.destroy({
        where: {},
        truncate: true
      })
      for (let i = 0; i < list.length; i++) {
        await this.model.create({
          post_name: list[i].postName,
          post_href: list[i].postHref,
          reply_count: list[i].replyCount,
          type: list[i].type,
        })
      }
    } catch (e) {
      console.log('updatePost:' + e)
    }
  }
  // 获取列表
  async getList(type) {
    const list = await this.model.findAll({
      where: {
        type,
      }
    })
    return list
  }
}

let hupuPost = new HupuPost()

module.exports = hupuPost