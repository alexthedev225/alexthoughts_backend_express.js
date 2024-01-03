const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
require("dotenv").config(); // Charge les variables d'environnement depuis le fichier .env

router.post("/send-email", async (req, res) => {
  const { nom, prenom, email, message } = req.body;
  const name = `${nom} ${prenom}`;
  // Configurez le transporteur Nodemailer avec vos informations SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Options de l'e-mail
  const mailOptions = {
    from: email,
    to: "alexcode225@gmail.com",
    subject: `Avis des utilisateurs sur Alex's Thoughs`,
    text: `Nom: ${name}\nE-mail: ${email}\nMessage: ${message}`,
  };

  try {
    // Envoyer l'e-mail
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "E-mail envoyé avec succès !" });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'e-mail :", error);
    res.status(500).json({
      error: "Une erreur s'est produite lors de l'envoi de l'e-mail.",
    });
  }
});

module.exports = router;
