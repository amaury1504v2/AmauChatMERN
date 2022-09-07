// le modèle permet de structurer les champs qu'on va entrer dans la base de données
const mongoose = require('mongoose');

const chatModel = mongoose.Schema(
    {
        chatName: {type: String, trim: true},
        isGroupChat: {type: Boolean, default: false},
        users: [
            {
                type: mongoose.Schema.Types.ObjectId, // Ça va contenir l'id de l'utilisateur en particulier
                ref: "User" // On fait une référence au userModel
            }
        ],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message" // On fait une référence au messageModel
        },
        groupAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;