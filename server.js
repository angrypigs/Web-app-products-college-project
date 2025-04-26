const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const sequelize = require('./src/models/index');
const User = require('./src/models/User');
const relations = require('./src/models/relations')
const homeRoutes = require('./src/routes/homeAuth');
const authRoutes = require('./src/routes/auth');
const commentRoutes = require('./src/routes/comment');
const productRoutes = require('./src/routes/product');
const adminRoutes = require('./src/routes/admin');
const categoryRoutes = require('./src/routes/category');



const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.use('/home', homeRoutes);
app.use('/auth', authRoutes);
app.use('/product', productRoutes);
app.use('/comment', commentRoutes);
app.use('/admin', adminRoutes);
app.use('/category', categoryRoutes);

app.use('/error', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.sendFile(path.join(__dirname, 'src/html', 'error.html'));
});

app.use(express.static(path.join(__dirname, 'src/public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/html', 'loginMenu.html'));
});

sequelize.sync().then(() => {
  console.log('Baza danych gotowa.');
  app.listen(3000, () => console.log('Serwer działa na http://localhost:3000'));
});