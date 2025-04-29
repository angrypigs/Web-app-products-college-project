const express = require('express');
const Product = require('../models/Product');
const Comment = require('../models/Comment');
const Category = require('../models/Category');
const User = require('../models/User');
const path = require('path');
const { Op } = require('sequelize');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', async (req, res) => {
  const phrase = req.query.phrase || '';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  const category_id = parseInt(req.query.id);

  const where = { 
    isDeleted: false,
    title: {
      [Op.like]: `%${phrase}%`
    }
  };

  const include = [];
  if (!isNaN(category_id)) {
    include.push({
      model: Category,
      through: { attributes: [] },
      where: { id: category_id }
    });
  }

  try {
    const products = await Product.findAll({
      where,
      include,
      limit,
      offset
    });

    const totalProducts = await Product.count({
      where,
      include
    });

    const totalPages = Math.ceil(totalProducts / limit);
    const isFirstPage = page === 1;
    const isLastPage = offset + products.length >= totalProducts;

    res.json({
      products,
      isFirstPage,
      isLastPage
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});
 

router.get('/data', async (req, res) => {
  const id = req.query.id || 1;
  try {
    const product = await Product.findOne({
      where: { 
        id: id, 
        isDeleted: false
      },
      attributes: ['id', 'title', 'description', 'imageUrl'],
      include: [
        {
          model: Comment,
          attributes: ['id', 'description', 'creationDate'],
          required: false,
          where: {
            isDeleted: false
          },
          include: [
            {
              model: User,
              attributes: ['username', 'id']
            }
          ]
        },
        {
          model: Category,
          attributes: ['id', 'name'],
          through: {
            attributes: []
          }
        }
      ]
    });
    
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

router.post('/new', verifyToken, async (req, res) => {
    const { title, description, imageUrl, categoryIds } = req.body;
    console.log(title, description)
    if (!title) {
      return res.json({ success: false, message: 'Tytuł jest wymagany' });
    }
    try {
      const newProduct = await Product.create({
        title,
        description,
        imageUrl,
        creatorUserId: req.user.id
      });
      if (Array.isArray(categoryIds) && categoryIds.length > 0) {
        await newProduct.addCategories(categoryIds);
      }
      res.json({ success: true, message: 'Produkt dodany', product: newProduct });
    } catch (err) {
      console.error(err);
      res.json({ success: false, message: 'Błąd przy dodawaniu produktu' });
    }
});

router.post('/delete', verifyToken, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByPk(req.body.id);
    if (!product) return res.json({ success: false, message: 'Produkt nie istnieje' });

    product.isDeleted = true;
    await product.save();

    res.json({ success: true, message: 'Produkt usunięty' });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: 'Błąd serwera' });
  }
});

router.post('/update', verifyToken, requireAdmin, async (req, res) => {
  const { productId, title, description, imageUrl } = req.body;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Brak dostępu' });
  }

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.json({ success: false, message: 'Produkt nie znaleziony' });
    }

    const updates = {};
    if (title) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;

    await product.update(updates);

    res.json({ success: true, message: 'Produkt zaktualizowany' });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: 'Błąd serwera' });
  }
});

module.exports = router;