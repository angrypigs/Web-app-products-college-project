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
  const { commentId } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Komentarz nie znaleziony' });
    }
    if (comment.creatorUserId !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'Brak uprawnień' });
    }

    comment.isDeleted = true;
    await comment.save();
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

router.post('/update', verifyToken, async (req, res) => {
  const { commentId, newDescription } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Komentarz nie znaleziony' });
    }

    if (comment.creatorUserId !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'Brak uprawnień' });
    }

    comment.description = newDescription;
    await comment.save();
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

module.exports = router;