const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Article = require('./models/Article');

async function seedDemoData() {
  const userCount = await User.countDocuments();
  if (userCount > 0) {
    return;
  }

  const hashed = await bcrypt.hash('123456', 10);

  const gueddes = await User.create({
    name: 'Dr. Abdelweheb GUEDDES',
    email: 'gueddes@poly.tn',
    password: hashed,
    role: 'Admin'
  });

  const aya = await User.create({
    name: 'Aya Ben Amor',
    email: 'aya@poly.tn',
    password: hashed,
    role: 'Membre'
  });

  await Article.create([
    {
      title: 'Kick-off du Club Pulse 2026',
      content:
        'Reunion de rentree du club etudiant : presentation du planning, des ateliers MERN et des idees de projets a deployer.',
      category: 'Evenement',
      author: gueddes._id
    },
    {
      title: 'Atelier JWT et Bcrypt',
      content:
        'Seance pratique : hachage des mots de passe, generation du token JWT et middleware sentinelle protect.',
      category: 'Annonce',
      author: aya._id
    },
    {
      title: 'Boite a idees : hackathon interne',
      content:
        'Proposez un theme de hackathon pour le semestre. Les meilleures idees seront votees en assemblee generale.',
      category: 'Idee',
      author: aya._id
    }
  ]);

  console.log('Comptes demo crees : gueddes@poly.tn / 123456 et aya@poly.tn / 123456');
}

module.exports = seedDemoData;
