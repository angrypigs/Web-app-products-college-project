const express = require('express');
const Product = require('../models/Product');
const Comment = require('../models/Comment');
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
  try {
      const products = await Product.findAll({
        where: { 
          isDeleted: false,
          title: {
            [Op.like]: `%${phrase}%`
          }
        },
        limit: limit,
        offset: offset
      });
      const totalProducts = await Product.count({
        where: { 
          isDeleted: false,
          title: {
            [Op.like]: `%${phrase}%`
          }
        },
      });
  
      const totalPages = Math.ceil(totalProducts / limit);
      const isFirstPage = page === 1;
      const isLastPage = page === totalPages;
  
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
      where: { id: id },
      attributes: ['id', 'title', 'description', 'imageUrl'],
      include: [
        {
          model: Comment,
          attributes: ['id', 'description', 'creationDate'],
          include: [
            {
              model: User,
              attributes: ['username']
            }
          ]
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
    const { title, description, imageUrl } = req.body;
    console.log(title, description)
    if (!title) {
      return res.json({ success: false, message: 'Tytuł jest wymagany' });
    }
    try {
      const newProduct = await Product.create({
        title,
        description,
        creatorUserId: req.user.id
      });
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

module.exports = router;