const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRoutes');
const commentRoutes = require('./routes/commentRoutes');
const seedDemoData = require('./seed');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;

if (!JWT_SECRET) {
  console.error('JWT_SECRET manquant. Creez un fichier server/.env a partir de .env.example');
  process.exit(1);
}

if (!MONGODB_URI) {
  console.error('MONGODB_URI manquant. Creez un fichier server/.env a partir de .env.example');
  process.exit(1);
}

app.use(
  cors({
    origin: process.env.CLIENT_URL || '*'
  })
);
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'API Club Pulse operationnelle',
    routes: ['/api/auth/register', '/api/auth/login', '/api/articles', '/api/comments']
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/comments', commentRoutes);

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('MongoDB Atlas connecte');
    await seedDemoData();
    app.listen(PORT, '0.0.0.0', () => {
      console.log('Serveur Express lance sur le port ' + PORT);
    });
  })
  .catch((err) => {
    console.error('Erreur MongoDB :', err.message);
    process.exit(1);
  });
