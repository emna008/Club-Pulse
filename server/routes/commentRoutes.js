const express = require('express');
const Comment = require('../models/Comment');
const Article = require('../models/Article');
const protect = require('../middleware/protect');

const router = express.Router();

// GET /api/comments/article/:articleId  (public) + populate auteur
router.get('/article/:articleId', async (req, res) => {
  try {
    const comments = await Comment.find({ article: req.params.articleId })
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la lecture des commentaires.' });
  }
});

// POST /api/comments/article/:articleId  (protege JWT)
router.post('/article/:articleId', protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Le commentaire ne peut pas etre vide.' });
    }

    const article = await Article.findById(req.params.articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article introuvable.' });
    }

    const comment = await Comment.create({
      text: text.trim(),
      article: article._id,
      author: req.user._id
    });

    const populated = await comment.populate('author', 'name');
    return res.status(201).json(populated);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de l ajout du commentaire.' });
  }
});

// POST /api/comments/:id/like  (protege JWT) : like ou unlike
router.post('/:id/like', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    let comment = await Comment.findOneAndUpdate(
      { _id: req.params.id, likedBy: userId },
      { $pull: { likedBy: userId } },
      { returnDocument: 'after' }
    );

    if (!comment) {
      const exists = await Comment.exists({ _id: req.params.id });
      if (!exists) {
        return res.status(404).json({ message: 'Commentaire introuvable.' });
      }

      comment = await Comment.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { likedBy: userId } },
        { returnDocument: 'after' }
      );
    }

    const populated = await comment.populate('author', 'name');
    return res.status(200).json(populated);
  } catch (error) {
    console.error('Erreur lors du like du commentaire :', error);
    return res.status(500).json({ message: 'Erreur lors du like du commentaire.' });
  }
});

// DELETE /api/comments/:id  (protege JWT)
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Commentaire introuvable.' });
    }

    await comment.deleteOne();
    return res.status(200).json({ message: 'Commentaire supprime.', id: req.params.id });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la suppression du commentaire.' });
  }
});

module.exports = router;
