const thirdApiPostSchema = require('./schema/third_api_post_schema')
const db = require('../../config/mysql.js')


class ThirdApiPost {
  // model;
  constructor() {
    try {
      this.model = db.sequelize.define(
        thirdApiPostSchema.modelName,
        thirdApiPostSchema.schema,
        thirdApiPostSchema.options,
      )
    } catch (err) {
      console.log(err)
    }
  }
  // 更新帖子
  async updatePost(list, type) {
    try {
      await this.model.destroy({
        where: {
          type
        },
      })
      for (let i = 0; i < list.length; i++) {
        await this.model.create({
          post_name: list[i].post_name,
          post_href: list[i].post_href,
          post_href_mobile: list[i].post_href_mobile,
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

let thirdApiPost = new ThirdApiPost()

module.exports = thirdApiPost