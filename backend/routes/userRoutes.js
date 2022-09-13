const express = require('express');
const { registerUser, authUser, allUsers } = require('../controllers/userControllers');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router(); // on utilise le router d'express

router.route("/").post(registerUser).get(protect, allUsers); // on fait appel au controller registerUser avec la méthode post sur le / et également au controller allUsers sur le /
// protect est un middleware qu'on a créé dans le dossier middleware pour 
router.post("/login", authUser);

module.exports = router;