const express = require('express');
const { chats } = require('./data/data');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();
dotenv.config();
app.use(cors());

app.get("/", (req, res) => { // on va get de l'information à la route '/'
    res.send("API is running successfully");
});

app.get("/api/chat", (req, res) => { // lorsqu'on va sur le lien .../api/chat, on reçoit
    res.send(chats); // une réponse envoyée qui correspond aux chats
});

app.get("/api/chat/:id", function (req, res) {
    // console.log(req.params.id); 
    const singleChat = chats.find(chat => chat._id === req.params.id); // find renvoie la valeur du premier élément trouvé dans le tableau/objet, qui est égal à l'id que l'on met dans l'url
    res.send(singleChat); // on reçoit la réponse envoyée qui est singleChat
});

const PORT = process.env.PORT || 5001; // fait appel à la constante PORT dans le fichier .env

app.listen(PORT, console.log(`Server started on port ${PORT}`));