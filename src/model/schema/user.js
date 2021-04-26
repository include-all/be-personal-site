const Sequelize = require("sequelize")
const modelName = 'user'
const schema = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '用户id',
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    comment: '用户名',
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    comment: '用户密码',
  }
}

const options = {
  createdAt: 'create_time',
  updatedAt: 'update_time',
  freezeTableName: true,
}

module.exports = { modelName, schema, options }