// npm i bcrypt
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        picture: { 
            type: String,
            default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" 
        },
    },
    {
        timestamps: true
    }
);

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password); // on compare le mot de passe entré par l'utilisateur avec celui du userModel
}

userSchema.pre('save', async function (next) { // avant d'enregistrer le userSchema, executer :
    if(!this.isModified) { // si le mot de passe courant n'est pas modifié
        next(); // passer à l'argument suivant (const User = ..., dans ce cas)
    }

    const salt = await bcrypt.genSalt(10); // on génère un salt de 10 (le plus grand nombre de caractères encryptées)
    this.password = await bcrypt.hash(this.password, salt); // on hash le mot de passe (password) en utilisant la méthode salt
});

const User = mongoose.model("User", userSchema);

module.exports = User;