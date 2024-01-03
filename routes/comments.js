// Route pour gérer les commentaires (dans routes/comments.js)
const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");
const Article = require('../models/articles')

// Obtenir les commentaires d'un article
router.get("/:articleId/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ articleId: req.params.articleId });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ajouter un nouveau commentaire avec io en tant qu'argument
router.post("/:articleId/comments", async (req, res) => {
    const io = req.io;  // Utilise req.io directement pour obtenir io depuis le middleware
  
    const comment = new Comment({
      author: req.body.author,
      content: req.body.content,
      articleId: req.params.articleId,
    });
  
    try {
      const newComment = await comment.save();
  
      // Ajouter le commentaire à l'article
      const article = await Article.findByIdAndUpdate(
        req.params.articleId,
        { $push: { comments: newComment._id } },
        { new: true }
      );

      // Émettre un événement socket pour informer les clients d'un nouveau commentaire
      io.emit("newComment", { articleId: req.params.articleId, newComment });

      // Retourner la réponse JSON mise à jour
      res.status(201).json({ article });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});

  
module.exports = router;
