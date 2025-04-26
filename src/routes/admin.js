const express = require('express');
const path = require('path');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', verifyToken, requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '../html/adminPanel.html'));
});

module.exports = router;