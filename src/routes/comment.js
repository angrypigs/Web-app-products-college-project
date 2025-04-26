const express = require('express');
const Product = require('../models/Product');
const Comment = require('../models/Comment');
const User = require('../models/User');
const path = require('path');
const { Op } = require('sequelize');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/new', verifyToken, async (req, res) => {
    const { description, productId } = req.body;
    if (!description) {
      return res.json({ success: false, message: 'Treść jest wymagana' });
    }
    try {
      const newComment = await Comment.create({
        description,
        productId,
        creatorUserId: req.user.id
      });
      res.json({ success: true, message: 'Komentarz dodany', product: newComment });
    } catch (err) {
      console.error(err);
      res.json({ success: false, message: 'Błąd przy dodawaniu produktu' });
    }
});

router.post('/delete', verifyToken, async (req, res) => {
  try {
    const comment = await Product.findByPk(req.body.id);
    if (!comment) return res.json({ success: false, message: 'Komentarz nie istnieje' });
    if (comment.id === req.user.id) {
        comment.isDeleted = true;
        await comment.save();
        res.json({ success: true, message: 'Produkt usunięty' });
    } else {
        res.json({ success: false, message: 'Komentarz nie należy do użytkownika' });
    }
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: 'Błąd serwera' });
  }
});

module.exports = router;