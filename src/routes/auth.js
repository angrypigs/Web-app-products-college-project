const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const path = require('path');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = express.Router();

const SECRET = 'tajnyklucz';

// Rejestracja
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ username, password: hashedPassword, role });

  res.json({ message: 'Użytkownik zarejestrowany' });
});

// Logowanie
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });

  if (!user) return res.status(401).json({ message: 'Nie znaleziono użytkownika' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Nieprawidłowe hasło' });

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET, { expiresIn: '1h' });

  console.log(`User ${username} logged in`);
  res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
  res.sendFile(path.join(__dirname, '../html', 'home.html'));
});

router.get('/me', verifyToken, (req, res) => {
  res.json({ username: req.user.username, role: req.user.role });
});

router.get('/list', async (req, res) => {
  try {
      const users = await User.findAll({
      });
      res.json({users});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Błąd serwera' });
    }
});

router.post('/update', async (req, res) => {
  const { ids, role } = req.body;
  try {
      const users = await User.update(
        {role: role},
        {where: {id: ids}}
      )
      res.json({success: true});
    } catch (error) {
      console.error(error);
      res.json({ success: false, message: 'Błąd serwera' });
    }
});

module.exports = router;