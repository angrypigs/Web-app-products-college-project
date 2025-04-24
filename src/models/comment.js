const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Comment = sequelize.define('Comment', {
  description: { type: DataTypes.TEXT, allowNull: false },
  creationDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  creatorUserId: { type: DataTypes.INTEGER, allowNull: false },
  productId: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = Comment;