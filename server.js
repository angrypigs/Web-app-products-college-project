const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const sequelize = require('./src/models/index');
const User = require('./src/models/user');
const homeRoutes = require('./src/routes/homeAuth');
const authRoutes = require('./src/routes/auth');



const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use('/home', homeRoutes);
app.use('/auth', authRoutes);

app.use(express.static(path.join(__dirname, 'src/public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/html', 'loginMenu.html'));
});

sequelize.sync().then(() => {
  console.log('Baza danych gotowa.');
  app.listen(3000, () => console.log('Serwer działa na http://localhost:3000'));
});