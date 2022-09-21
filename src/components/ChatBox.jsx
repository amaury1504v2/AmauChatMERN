import { Box } from '@chakra-ui/react';
import React from 'react';
import { ChatState } from '../context/ChatProvider';
import SingleChat from './SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDirection="column"
      w={{ base: "100%", md: "68%" }}
      p={3}
      borderRadius="lg"
      borderWidth="1px"
      backgroundColor="white"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  )
}

export default ChatBox