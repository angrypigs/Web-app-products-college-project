const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const sequelize = require('./src/models/index');
const User = require('./src/models/user');
const relations = require('./src/models/relations')
const homeRoutes = require('./src/routes/homeAuth');
const authRoutes = require('./src/routes/auth');
const productRoutes = require('./src/routes/product');



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

app.use(express.static(path.join(__dirname, 'src/public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/html', 'loginMenu.html'));
});

sequelize.sync().then(() => {
  console.log('Baza danych gotowa.');
  app.listen(3000, () => console.log('Serwer działa na http://localhost:3000'));
});