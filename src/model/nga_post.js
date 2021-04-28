const ngaPostSchema = require('./schema/nga_post_schema')
const db = require('../../config/mysql.js')


class NgaPost {
  model;
  constructor() {
    try {
      this.model = db.sequelize.define(
        ngaPostSchema.modelName,
        ngaPostSchema.schema,
        ngaPostSchema.options,
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
      })
      for (let i = 0; i < list.length; i++) {
        await this.model.create({
          post_name: list[i].post_name,
          post_href: list[i].post_href,
          reply_count: list[i].reply_count,
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

let ngaPost = new NgaPost()

module.exports = ngaPost