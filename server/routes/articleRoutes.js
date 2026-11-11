const express = require('express');
const Article = require('../models/Article');
const Comment = require('../models/Comment');
const protect = require('../middleware/protect');

const router = express.Router();

// GET /api/articles  (public) + populate du nom de l'auteur
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find()
      .populate('author', 'name email role')
      .sort({ createdAt: -1 });

    return res.status(200).json(articles);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la lecture des articles.' });
  }
});

// POST /api/articles  (protege JWT)
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Le titre et le contenu sont obligatoires.' });
    }

    const article = await Article.create({
      title: title.trim(),
      content: content.trim(),
      category: category || 'Annonce',
      author: req.user._id
    });

    const populated = await article.populate('author', 'name email role');
    return res.status(201).json(populated);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la creation de l article.' });
  }
});

// DELETE /api/articles/:id  (protege JWT)
router.delete('/:id', protect, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article introuvable.' });
    }

    await Comment.deleteMany({ article: article._id });
    await article.deleteOne();

    return res.status(200).json({ message: 'Article supprime.', id: req.params.id });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la suppression.' });
  }
});

module.exports = router;
