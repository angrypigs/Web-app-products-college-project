const express = require('express');
const Product = require('../models/Product');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Category = require('../models/Category');
const path = require('path');
const { Op } = require('sequelize');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
      const categories = await Category.findAll({
        where: { 
          isDeleted: false,
        },
      });
  
      res.json({ categories });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Błąd serwera' });
    }
});

router.post('/new', verifyToken, requireAdmin, async (req, res) => {
    const { name } = req.body;
    if (!name) {
      return res.json({ success: false, message: 'Nazwa jest wymagana' });
    }
    try {
      const newCategory = await Category.create({
        name
      });
      res.json({ success: true, message: 'Kategoria dodana', product: newCategory });
    } catch (err) {
      console.error(err);
      res.json({ success: false, message: 'Błąd przy dodawaniu kategorii' });
    }
});

router.post('/delete', verifyToken, requireAdmin, async (req, res) => {
  try {
    const category = await Category.findByPk(req.body.id);
    if (!category) return res.json({ success: false, message: 'Kategoria nie istnieje' });

    category.isDeleted = true;
    await category.save();

    res.json({ success: true, message: 'Kategoria usunięta' });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: 'Błąd serwera' });
  }
});

router.post('/update', async (req, res) => {
    const { id, name } = req.body;
    try {
        const category = await Category.update(
          {name: name},
          {where: {id: id}}
        )
        res.json({success: true});
      } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Błąd serwera' });
      }
});

module.exports = router;