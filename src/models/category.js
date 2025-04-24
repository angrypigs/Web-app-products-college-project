const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Category = sequelize.define('Category', {
  name: { type: DataTypes.STRING, allowNull: false },
  isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = Category;