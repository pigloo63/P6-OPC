const express = require('express');
const mongoose = require('mongoose');
const app = express();
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauces')
const path = require('path');
const helmet = require('helmet');

const dotenv = require('dotenv');
const result = dotenv.config();

app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.use(express.json());

app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);

module.exports = app;