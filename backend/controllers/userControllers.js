// npm i express-async-handler : permet de gérer toutes les erreurs
const asyncHandler = require('express-async-handler');
const generateToken = require('../config/generateToken');
const User = require('../models/userModel');

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, picture } = req.body; // on demande à récupérer ces variables du body de la requête

    if(!name || !email || !password) { // on vérifie si l'utilisateur a oublié de remplir des champs requis
        res.status(400);
        throw new Error('Please enter all the required fields');
    };

    const userExists = await User.findOne({ email }); // on vérifie si un utilisateur déjà existant a le même email que celui entré (dans le userModel) au Sign Up

    if(userExists) { // Si le mail est déjà pris, erreur
        res.status(400);
        throw new Error('User already exists');
    };

    const user = await User.create({ // sinon, on crée un utilisateur se basant sur le userModel
        name,
        email,
        password,
        picture
    });

    if(user) {
        res.status(201).json({ // on envoie une réponse de status 201 convertit en json avec les infos de user
            _id: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error('Failed to create the user');
    }
});

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });

    if(userExists && (await userExists.matchPassword(password))) {
        res.status(201).json({ // on envoie une réponse de status 201 convertit en json avec les infos de user
            _id: userExists._id,
            name: userExists.name,
            email: userExists.email,
            picture: userExists.picture,
            token: generateToken(userExists._id)
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search ? { // s'il y a un paramètre search
        $or: [ // si l'une des 2 queries matchent avec ce qui est écrit dans la barre de recherche, ça va les retourner
            { name: { $regex: req.query.search, $options: "i" } }, // le regex aide à matcher plus facilement ce qu'on recherche avec ce qu'il y a dans la base de données
            { email: { $regex: req.query.search, $options: "i" } }  // le $options: "i" veut dire qu'on a choisi l'option i qui permet de désensibiliser à la casse (les maj et minuscules)
        ]
    } : {}

    const users = await User.find(keyword).find({ _id:{ $ne: req.user._id} }); // chercher les utilisateurs qui matchent à part l'utilisateur déjà connecté
    res.send(users)
});



module.exports = { registerUser, authUser, allUsers };