export const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name; // Si le loggedUser a le même id que le user 0, alors afficher le nom de l'user 1 sinon afficher le nom de l'user 0
};

export const getSenderFull = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0]; // Si le loggedUser a le même id que le user 0, alors afficher le nom de l'user 1 sinon afficher le nom de l'user 0
};

export const isSameSender = (messages, message, i, userId) => {
    return (
        i < messages.length - 1 && //si l'index est < au nombre de messages - 1
        (messages[i + 1].sender._id !== message.sender._id || // si le prochain message n'est pas égal au sender actuel
        messages[i + 1].sender._id === undefined) && // ou si le prochain message n'est pas défini
        messages[i].sender._id !== userId // et si le sender message de l'index ne correspond à l'id de l'utilisateur courrant
    );
};

export const isLastMessage = (messages, message, i, userId) => {
    return (
        i === messages.length - 1 && // on vérifie si l'index est égal à celui du dernier message
        messages[messages.length - 1].sender._id !== userId && // on vérifie si l'id du dernier message est le même que celui de l'utilisateur connecté
        messages[messages.length - 1].sender._id // on vérifie si l'id du dernier message existe
    );
};

export const isSameSenderMargin = (messages, message, i, userId) => {
    if (
        i < messages.length - 1 &&
        messages[i + 1].sender._id === message.sender._id &&
        messages[i].sender._id !== userId
    )
    return 33; // mettre une marge de 33
    else if (
        (i < messages.length - 1 &&
            messages[i + 1].sender._id !== message.sender._id &&
            messages[i].sender._id !== userId) ||
        (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
    return 0; // mettre une marge de 0
    else return "auto";
};

export const isSameUser = (messages, message, i) => {
    return i > 0 && messages[i - 1].sender._id === message.sender._id // si i est inférieur à 0 et que l'id du sender du message précédent est le même que celui de l'actuel
};