const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const path = require('path');
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

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '1h' });

  console.log(`User ${username} logged in`);
  res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
  res.sendFile(path.join(__dirname, '../html', 'home.html'));
});

module.exports = router;