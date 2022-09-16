export const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name; // Si le loggedUser a le même id que le user 0, alors afficher le nom de l'user 1 sinon afficher le nom de l'user 0
};