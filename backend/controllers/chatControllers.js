const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

const accessChat = asyncHandler(async (req, res) => { // permet d'accéder ou de créer des chats un à un
    const { userId } = req.body;

    if(!userId) { // Si on n'a pas de user id, erreur
        console.log("userId param is not sent with the request");
        return res.sendStatus(400);
    }

    var isChat = await Chat.find({
        isGroupChat: false, // n'est pas un chat de groupe: est un chat entre 2 personnes
        $and: [ // signifie contrairement au $or que les 2 requêtes doivent être vraies
            { users: { $elemMatch: { $eq: req.user._id } } }, // l'un des users doit avoir un id égal à celui de l'utilisateur de la requête
            { users: { $elemMatch: { $eq: userId } } } // l'un des users doit avoir un id égal au userId
        ]
    })
        .populate("users", "-password") // si toutes les conditions de la requête sont vraies, ajouter toutes les informations des users à part les mots de passe 
        .populate("latestMessage");
    
    isChat = await User.populate(isChat, { // on cherche à populer dans isChat 
        path: "latestMessage.sender", // et on cherche à populer dans latestMessage.sender (latestMessage a une ref au messageModel dans lequel on trouve sender)
        select: "name picture email" // on souhaite sélectionner le nom, l'image et l'email du user
    });

    if(isChat.length > 0){ // si le tableau isChat a une longueur > 0
        res.send(isChat[0]); // on prend l'index 0 de isChat
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId] // les utilisatuers seront l'utilisateur loggedin puis l'utilisateur dont son id sera utilisé pour créer le chat
        }
    }

    try {
        const createdChat = await Chat.create(chatData); // on crée un chat en se basant sur le chatModel puis on met en paramètre de la fonction create le chatData

        const fullChat = await Chat.findOne({_id: createdChat._id}) // on récupère un chat en se basant sur le chatModel en utilisant l'id du createdChat
            .populate("users", "-password"); // on ajoute les informations de l'utilisateur basées sur le userModel, en retirant le mot de passe

        res.status(200).send(fullChat); // on envoie le fullChat
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const fetchChats = asyncHandler(async (req, res) => { // permet de récupérer un chat et donne les utilisateurs, l'admin, le dernier message
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } }) // on récupère le chat via l'id de l'utilisateur
            .populate("users", "-password") // on retourne les utilisateurs
            .populate("groupAdmin", "-password") // on retourne l'admin
            .populate("latestMessage") // on retourne le dernier message
            .sort({ updatedAt: -1 }) // on les trie par date de création
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name picture email"
                });

                res.status(200).send(results); // on retourne les résultats
            });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const createGroupChat = asyncHandler(async (req, res) => { // permet de créer un chat de groupe
    if(!req.body.users || !req.body.name) {
        return res.status(400).send({ message: 'Please send all the fields'});
    }

    var users = JSON.parse(req.body.users); // on récupère les strings qui représentent les utilisateurs que l'admin a entré et on parse ces strings dans un JSON

    if(users.length < 2) {
        return res.status(400).send({ message: 'Creating a group chat requires more than 2 users' });
    }

    users.push(req.user); // on ajoute l''utilisateur à l'array des utilisateurs

    try {
        const groupChat = await Chat.create({ // se basant sur le chatModel, on crée
            chatName: req.body.name, // le nom du groupe sera égal au nom qu'on met dans le body de la requête
            users: users,
            isGroupChat: true, // il s'agit d'un group chat
            groupAdmin: req.user // l'admin est l'utilisateur loggé (qui a créé le groupe)
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        
        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(chatId, { chatName }, { new: true })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if(!updatedChat) {
        res.status(404);
        throw new Error("Chat not found");
    } else {
        res.json(updatedChat);
    }
});

const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(
        chatId, // on donne l'id du chat
        {
            $push: { users: userId } // on va pusher le userId dans le users Array
        },
        {
            new: true // on indique que c'est un changement
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if(!added) {
        res.status(404);
        throw new Error("Chat not found");
    } else {
        res.json(added);
    }
});

const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    const removed = await Chat.findByIdAndUpdate(
        chatId, // on donne l'id du chat
        {
            $pull: { users: userId } // on va supprimer le userId dans le users Array
        },
        {
            new: true // on indique que c'est un changement
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if(!removed) {
        res.status(404);
        throw new Error("Chat not found");
    } else {
        res.json(removed);
    }
});

module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup };