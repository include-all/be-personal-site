const userSchema = require('./schema/user')
const db = require('../../config/mysql.js')


class User {
  // model;
  constructor() {
    try {
      this.model = db.sequelize.define(
        userSchema.modelName,
        userSchema.schema,
        userSchema.options,
      )
    } catch (err) {
      console.log(err)
    }
  }
  async getUserLoginInfo(username) {
    return await this.model.findOne({
      where: {
        username,
      }
    })
  }
}

module.exports = new User()