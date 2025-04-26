const express = require('express');
const path = require('path');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', verifyToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../html/home.html'));
});

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.sendFile(path.join(__dirname, '../html/loginMenu.html'));
});

router.get('/new-product', verifyToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../html/newProduct.html'));
});

router.get('/product', verifyToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../html/productPage.html'));
});

module.exports = router;