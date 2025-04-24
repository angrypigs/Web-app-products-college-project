const express = require('express');
const Product = require('../models/Product');
const path = require('path');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = express.Router();

// Logowanie
router.get('/', async (req, res) => {
    try {
        const products = await Product.findAll({
          where: { isDeleted: false },
        });
        res.json(products);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Błąd serwera' });
      }
});

router.post('/new', verifyToken, async (req, res) => {

    const { title, description, imageUrl } = req.body;
  
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

module.exports = router;