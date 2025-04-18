const express = require('express');
const path = require('path');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', verifyToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../html/home.html'));
});

module.exports = router;