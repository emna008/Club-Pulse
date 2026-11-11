const mongoose = require('mongoose');

// Modele 2 : Annonce / Article du club (metier principal)
// Relation 1 -> N : un utilisateur publie plusieurs articles (ref User)
const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre est obligatoire'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Le contenu est obligatoire'],
      trim: true
    },
    category: {
      type: String,
      enum: ['Evenement', 'Annonce', 'Idee', 'Temoignage'],
      default: 'Annonce'
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Article', articleSchema);
