const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const colors = require('colors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();
dotenv.config();
connectDB();
app.use(cors());

app.use(express.json()); // permet de convertir les données envoyées du frontend en json

app.get("/", (req, res) => { // on va get de l'information à la route '/'
    res.send("API is running successfully");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001; // fait appel à la constante PORT dans le fichier .env

app.listen(PORT, console.log(`Server started on port ${PORT}`.yellow.bold));