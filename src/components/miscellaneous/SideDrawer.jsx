import React, { useState, Fragment } from 'react';
import axios from 'axios';
import { ChatState } from '../../context/ChatProvider';

import { 
    Avatar, 
    Box, 
    Button, 
    Menu, 
    MenuButton, 
    MenuDivider, 
    MenuItem, 
    MenuList, 
    Text, 
    Tooltip, 
    useDisclosure, 
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    Input,
    useToast,
    Spinner
 } from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import ChatLoading from '../ChatLoading';
import UserListItem from '../userAvatar/UserListItem';

const SideDrawer = () => {
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const toast = useToast();

    const { user, setSelectedChat, chats, setChats } = ChatState();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const navigate = useNavigate();

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        navigate("/");
    };

    const handleSearch = async () => {
        if(!search) {
            toast({
                title: 'Please enter something in the search',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "top-left"
            });
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.get(`api/user?search=${search}`, config);

            setLoading(false);
            setSearchResults(data);
        } catch (error) {
            toast({
                title: 'Error occured',
                description: 'Failed to load the search results',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            });
        }
    };

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);

            const config = {
                headers: {
                    "Content-Type": "application/json", // on veut parser les données en JSON pour le backend
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.post("/api/chat", { userId }, config);

            if(!chats.find((chat) => chat._id === data._id)) { // Si on trouve le chat déjà existant dans la liste
                setChats([data, ...chats]); // On met à jour les chats, en ajoutant les nouveaux chats
            }

            setLoadingChat(false);
            setSelectedChat(data);
        } catch (error) {
            toast({
                title: 'Error occured',
                description: 'Failed to fetch the chat',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            });
        }
    };

  return (
    <Fragment>
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            bg="white"
            w="100%"
            p="5px 10px 5px 10px"
        >
            <Tooltip 
                label="Search users to chat"
                color="white"
                hasArrow
                placement="bottom-end"
                background="#494A93"
            >
                <Button variant="ghost" onClick={onOpen}>
                    <i className="fa-sharp fa-solid fa-magnifying-glass"></i>
                    <Text display={{ base: "none", md: "flex" }} px="4">
                        Search User
                    </Text>
                </Button>
            </Tooltip>
            <Text fontSize="2xl" fontFamily="Work sans">
                AmauChat
            </Text>
            <div>
                <Menu>
                    <MenuButton p={1}>
                        <BellIcon fontSize="2xl" margin={1} />
                        {/* <MenuList></MenuList> */}
                    </MenuButton>
                    <MenuButton p={1} as={Button} rightIcon={<ChevronDownIcon />}>
                        <Avatar size="sm" cursor="pointer" name={user.name} src={user.picture}></Avatar>
                    </MenuButton>
                    <MenuList>
                        <ProfileModal user={user}>
                            <MenuItem>My Profile</MenuItem>
                        </ProfileModal>
                        <MenuDivider />
                        <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                    </MenuList>
                </Menu>
            </div>
        </Box>
        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader borderWidth="1px">
                    Search Users
                </DrawerHeader>
                <DrawerBody>
                    <Box display="flex" pb={2}>
                        <Input
                            placeholder="Search by name or email"
                            mr={2}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button
                            onClick={handleSearch}
                        >Go</Button>
                    </Box>
                    {loading ? (
                        <ChatLoading />
                    ) : (
                        searchResults?.map(user => (
                            <UserListItem 
                                key={user._id}
                                user={user}
                                handleFunction={() => accessChat(user._id)}
                            />
                        ))
                    )}
                    {loadingChat && <Spinner ml="auto" display="flex" />}
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    </Fragment>
  )
}

export default SideDrawer