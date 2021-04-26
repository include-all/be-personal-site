const { DataTypes } = require('sequelize');
const modelName = 't_nga_post'
const schema = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: 'id',
  },
  post_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '帖子名',
  },
  post_href: {
    type: DataTypes.STRING(150),
    allowNull: false,
    comment: '帖子链接',
  },
  reply_count: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: '帖子回复数',
  },
  type: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '帖子所属板块',
  }
}

const options = {
  createdAt: 'create_time',
  updatedAt: 'update_time',
  freezeTableName: true,
}

module.exports = { modelName, schema, options }