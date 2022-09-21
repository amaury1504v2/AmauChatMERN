const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');
const User = require('../models/userModel');

const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if(!content || !chatId) {
        console.log("Invalid data passed into the request");
        res.sendStatus(400);
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    };

    try {
        var message = await Message.create(newMessage);

        message = await message.populate("sender", "name picture");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name picture email"
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message //on remplace l'avant dernier message par le dernier
        });
        
        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const allMessages = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({chat: req.params.chatId}) // on accède aux params /:chatId de la route
            .populate("sender", "name picture email") 
            .populate("chat");

        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

module.exports = { sendMessage, allMessages };