// Créer un contexte permet d'appeler un state de n'importe quel composant, sans passer par tous les composants
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({children}) => {
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);

    const navigate = useNavigate();

    useEffect(()=> {
        const userInfo = JSON.parse(localStorage.getItem('userInfo')); // On récupère le userInfo du localstorage que l'on met sous le format JSON

        setUser(userInfo);

        if(!userInfo) {
            navigate("/");
        }
    }, [navigate]);

    return (
        <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}>{children}</ChatContext.Provider>
    );
};

export const ChatState = () => {
    return useContext(ChatContext); // Permet de pouvoir utiliser le context dans toute l'App
};

export default ChatProvider;