const jwt = require('jsonwebtoken');
const SECRET = 'tajnyklucz';

function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect('/error?message=Brak%20tokena');

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.redirect('/error?message=Nieprawidłowy%20token');
    req.user = decoded;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.redirect('/error?message=Brak%20uprawnień%20administratora');
  }
  next();
}

module.exports = { verifyToken, requireAdmin };