const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const colors = require('colors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
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
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001; // fait appel à la constante PORT dans le fichier .env

const server = app.listen(PORT, console.log(`Server started on port ${PORT}`.yellow.bold)); // on met le app.listen... dans une const pour pouvoir l'utiliser dans socket.io, sinon, pas besoin

// npm i socket.io
// in the frontend folder: npm i socket.io-client

const io = require('socket.io')(server, {
    pingTimeout: 60000, // c'est le temps d'inactivité des utilisateurs avant de pouvoir fermer la connexion 
    cors: {
        origin: 'http://localhost:3000'
    }
});

io.on("connection", (socket) => {
    console.log("Connected to Socket.io");

    socket.on("setup", (userData) => { 
        socket.join(userData._id); // on crée une nouvelle room avec l'id du userData
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User joined room " + room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing")); // permet d'ajouter le typing en temps réel. Dans la room concernée émettre : typing
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing")); // permet d'ajouter le typing en temps réel. Dans la room concernée émettre : stop typing

    socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if(!chat.users) return console.log("chat.users no defined");

        chat.users.forEach((user) => {
            if(user._id == newMessageReceived.sender._id) return;

            socket.in(user._id).emit("message received", newMessageReceived);
        });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id); // on quitte la room
    });
});