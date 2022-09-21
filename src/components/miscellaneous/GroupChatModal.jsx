import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';
import { ChatState } from '../../context/ChatProvider';
import axios from 'axios';
import UserListItem from '../userAvatar/UserListItem';
import UserBadgeItem from '../userAvatar/UserBadgeItem';

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if(!query) {
        return;
    }

    try {
        setLoading(true);

        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        };

        const { data } = await axios.get(`/api/user?search=${search}`, config);
        
        setLoading(false);
        setSearchResults(data);
    } catch (error) {
        toast({
            title: 'An error occurred.',
            description: 'Unable to load users.',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'bottom-left'
        });
    }
  };

  const handleSubmit = async () => {
    if(!groupChatName || !selectedUsers) {
        toast({
            title: 'Please fill all of the fields.',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: 'top'
        });
        return;
    }

    try {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        };

        const { data } = await axios.post("/api/chat/group", {
            name: groupChatName,
            users: JSON.stringify(selectedUsers.map((user) => user._id)),

        }, config);

        setChats([data, ...chats]); // on ajoute le chat qu'on a créé (data) aux chats déjà existants
        onClose();
        toast({
            title: 'Group chat created.',
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'bottom-left'
        });
    } catch (error) {
        toast({
            title: 'Could not create the chat.',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'bottom-left'
        });
    }
  };

  const handleGroup = (userToAdd) => {
    if(selectedUsers.includes(userToAdd)) {
        toast({
            title: 'User already added.',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: 'top'
        });
        return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]); // on copie les valeurs de selectedUsers, puis on y ajoute les nouvelles
  };

  const handleDelete = (deleteUser) => {
    setSelectedUsers(selectedUsers.filter((selected) => selected._id !== deleteUser._id));
  };
  return (
    <div>
        <span onClick={onOpen}>{children}</span>
        <Modal onClose={onClose} isOpen={isOpen}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader
                    fontSize="35px"
                    fontFamily="Work sans"
                    display="flex"
                    justifyContent="center"
                >
                    Create Group Chat
                </ModalHeader>
            <ModalCloseButton />
            <ModalBody
                display="flex"
                flexDirection="column"
                alignItems="center"
            >
                <FormControl>
                    <Input 
                        placeholder='Chat Name'
                        mb={3}
                        onChange={(e) => setGroupChatName(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <Input 
                        placeholder='Add Users eg: John, Jane, Elvis'
                        mb={1}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </FormControl>
                <Box w="100%" display="flex" flexWrap="wrap">
                    {selectedUsers.map((user) => (
                        <UserBadgeItem key={user._id} user={user} handleFunction={() => handleDelete(user)} />
                    ))}
                </Box>

                {loading ? <Spinner size="lg" /> : (
                    searchResults?.slice(0, 4).map((user) => (
                        <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                    ))
                )}
            </ModalBody>
            <ModalFooter>
                <Button onClick={handleSubmit}>Create Chat</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    </div>
  )
}

export default GroupChatModal