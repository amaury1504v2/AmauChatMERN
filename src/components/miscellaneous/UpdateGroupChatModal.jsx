import React, { Fragment, useState } from 'react';
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Spinner, Text, useDisclosure, useToast } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import { ChatState } from '../../context/ChatProvider';
import UserBadgeItem from '../userAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../userAvatar/UserListItem';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { selectedChat, setSelectedChat, user } = ChatState();

    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const toast = useToast();

    const handleAddUser = async (user1) => {
        if(selectedChat.users.find((u) => u._id === user1._id)) {
            toast({
                title: 'User already in the group.',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            });
            return;
        }

        if(selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: 'Only the admin can add someone.',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.put("/api/chat/groupadd", {
                chatId: selectedChat._id,
                userId: user1._id
            }, config);

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast({
                title: 'Failed to add user(s)',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            });
            setLoading(false);
        }
    };

    const handleRemove = async (user1) => {
        if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast({
                title: 'Only the admin can remove someone.',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.put("/api/chat/groupremove", {
                chatId: selectedChat._id,
                userId: user1._id
            }, config);

            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        } catch (error) {
            toast({
                title: 'Failed to remove user(s)',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            });
            setLoading(false);
        }
    };

    const handleRename = async () => {
        if(!groupChatName) return;

        try {
            setRenameLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.put("/api/chat/rename", {
                chatId: selectedChat._id,
                chatName: groupChatName
            }, config);

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);

            toast({
                title: 'Group chat renamed.',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
        } catch (error) {
            toast({
                title: 'Could not rename group chat',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            });
            setRenameLoading(false);
            setGroupChatName("");
        }
    };

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
  return (
    <Fragment>
        <IconButton
            display={{ base: "flex" }}
            icon={<ViewIcon />}
            onClick={onOpen}
        />
        <Modal isCentered isOpen={isOpen} onClose={onClose} isCentered>
            <ModalContent>
            <ModalHeader
                fontSize="30px"
                fontFamily="Work sans"
                display="flex"
                justifyContent="center"
            >{selectedChat.chatName}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Box
                    display="flex"
                    w="100%"
                    flexWrap="wrap"
                    pb={3}
                >
                    {selectedChat.users.map((user) => (
                        <UserBadgeItem 
                            key={user._id} 
                            user={user} 
                            handleFunction={() => handleRemove(user)} 
                        />
                    ))}
                </Box>
                <FormControl display="flex">
                    <Input
                        placeholder="Chat Name"
                        mb={3}
                        value={groupChatName}
                        onChange={(e) => setGroupChatName(e.target.value)}
                    />
                    <Button
                        variant="solid"
                        colorScheme="teal"
                        ml={1}
                        isLoading={renameLoading}
                        onClick={handleRename}
                    >
                        Update
                    </Button>
                </FormControl>
                <FormControl>
                    <Input 
                        placeholder='Add User(s) to Group'
                        mb={1}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </FormControl>
                {loading ? (
                    <Spinner size="lg" />
                ) : (
                    searchResults?.map((user) => (
                        <UserListItem
                            key={user._id}
                            user={user}
                            handleFunction={() => handleAddUser(user)}
                        />
                    ))
                )}
            </ModalBody>
            <ModalFooter>
                <Button onClick={() => handleRemove(user)} colorScheme="red">Leave Group</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    </Fragment>
  )
}

export default UpdateGroupChatModal