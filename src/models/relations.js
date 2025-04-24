const Product = require('./Product');
const Comment = require('./Comment');
const Category = require('./Category');
const User = require('./user');

// 1:N - komentarze do produktu
Product.hasMany(Comment, { foreignKey: 'productId' });
Comment.belongsTo(Product, { foreignKey: 'productId' });

// N:M - kategorie produktów
Product.belongsToMany(Category, {
  through: 'ProductCategories',
  foreignKey: 'productId'
});
Category.belongsToMany(Product, {
  through: 'ProductCategories',
  foreignKey: 'categoryId'
});

// 1:N - produkt i komentarz mają twórców (User)
User.hasMany(Product, { foreignKey: 'creatorUserId' });
Product.belongsTo(User, { foreignKey: 'creatorUserId' });

User.hasMany(Comment, { foreignKey: 'creatorUserId' });
Comment.belongsTo(User, { foreignKey: 'creatorUserId' });

module.exports = {
  Product,
  Comment,
  Category,
  User
};