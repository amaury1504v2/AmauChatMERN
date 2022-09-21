export const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name; // Si le loggedUser a le même id que le user 0, alors afficher le nom de l'user 1 sinon afficher le nom de l'user 0
};

export const getSenderFull = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0]; // Si le loggedUser a le même id que le user 0, alors afficher le nom de l'user 1 sinon afficher le nom de l'user 0
};

