const jwt = require('jsonwebtoken');
const SECRET = 'tajnyklucz';

function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(403).json({ message: 'Brak tokena' });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Nieprawidłowy token' });
    req.user = decoded;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Brak uprawnień administratora' });
  }
  next();
}

module.exports = { verifyToken, requireAdmin };