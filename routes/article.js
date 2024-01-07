const express = require("express");
const router = express.Router();
const Article = require("../models/articles");
const multer = require("../middleware/multer-config");

router.post("/", multer, async (req, res) => {
  try {
    // Création de l'article
    const article = new Article({
      ...req.body,
      image: `https://${req.get("host")}/images/${req.file.filename}`,
    });

    // Enregistrement de l'article
    await article.save();

    // Renvoyer une réponse avec le lien HTTPS
    res.status(201).json({ article });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'article :", error);
    res.status(500).json({ error: "Erreur lors de la création de l'article." });
  }
});

// Récupération de l'article avec les commentaires
router.get("/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      res.status(404).json({ error: "Article introuvable." });
      return;
    }
    res.status(200).json({ article });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération de l'article." });
  }
});

router.get("/", async (req, res) => {
  // Récupération de tous les articles
  const articles = await Article.find();

  // Réponse
  res.status(200).json(articles);
});

router.put("/:id", multer, async (req, res) => {
  // Validation des données
  const errors = {};

  if (Object.keys(errors).length > 0) {
    res.status(422).json({ errors });
    return;
  }

  // Récupération de l'article
  const article = await Article.findByIdAndUpdate(req.params.id, {
    ...req.body,
    image: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  });

  // Vérification si l'article existe et renvoi d'une erreur si nécessaire
  if (!article) {
    res.status(404).json({ error: "Article introuvable." });
    return;
  }

  // Réponse
  return await article.save();
});

router.delete("/:id", async (req, res) => {
  // Suppression de l'article
  await Article.findByIdAndDelete(req.params.id);

  // Réponse
  res.status(200).json({ message: "Article supprimé avec succès." });
});

module.exports = router;
