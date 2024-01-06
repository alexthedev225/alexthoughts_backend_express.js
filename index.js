const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const articleRoutes = require("./routes/article");
const commentRoutes = require('./routes/comments')
const nodemailerRoutes = require('./routes/nodemailer')
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");
const cors = require("cors");
const app = express();
const port = 3000;
const server = http.createServer(app);
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection error:", err));

// Configuration des options CORS
const corsOptions = {
  origin: 'https://alex-thoughts-six.vercel.app/', // Autoriser les demandes depuis ce domaine
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Autoriser les cookies et les en-têtes d'authentification
  optionsSuccessStatus: 204,
};

// Utilisation du middleware CORS
app.use(cors(corsOptions));

const io = socketIO(server, {
  cors: {
    origin: 'https://alex-thoughts-six.vercel.app/', // Autoriser les connexions depuis ce domaine
    methods: ['GET', 'POST'],
    credentials: true, // Autoriser les cookies
  },
});


// Middleware pour rendre io accessible dans les routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Gestion des connexions Socket.io
io.on("connection", (socket) => {
  console.log("Nouvelle connexion socket");

  socket.emit('message', 'Bienvenue !');

});

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/users", userRoutes);
app.use("/api/articles", articleRoutes, commentRoutes);
app.use('/api/contact', nodemailerRoutes)

app.head("/", (req, res) => {
  res.status(200).end();
})

app.get("/", (req, res) => {
  res.send("Hello, world! Welcome to my server. 😉");
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
