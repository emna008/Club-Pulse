const mongoose = require('mongoose');

// Modele 3 : Commentaire / Feedback
// Relation 1 -> N : un article contient plusieurs commentaires (ref Article)
const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Le texte du commentaire est obligatoire'],
      trim: true
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article',
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
