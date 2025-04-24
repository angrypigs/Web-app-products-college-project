const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Product = sequelize.define('Product', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  creationDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  creatorUserId: { type: DataTypes.INTEGER, allowNull: false },
  imageUrl: DataTypes.STRING
});

module.exports = Product;