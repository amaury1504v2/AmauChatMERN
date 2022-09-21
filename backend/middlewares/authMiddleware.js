const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => { 
    let token;

    if( // si dans les headers de la requête on a une authorization puis l'autorisation commence avec Bearer
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(" ")[1]; // req.headers.authorization = "Bearer numérodutoken" et là on va séparer la chaine en 2 par l'espace et prendre la chaine [1] qui sera le token

            const decoded = jwt.verify(token, process.env.JWT_SECRET); // on décode le token en vérifiant avec jwt puis on utilise le JWT_SECRET pour pouvoir décoder

            req.user = await User.findById(decoded.id).select("-password"); // On cherche dans le userModel via l'id l'utilisateur que l'on retourne sans le mot de passe

            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    };

    if(!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    };
});

module.exports = { protect };