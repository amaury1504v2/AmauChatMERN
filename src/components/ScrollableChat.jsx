import { Avatar, Text, Tooltip } from '@chakra-ui/react';
import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { isLastMessage, isSameSender, isSameSenderMargin } from '../config/ChatLogics';
import { ChatState } from '../context/ChatProvider';
// npm i react-scrollable-feed

const ScrollableChat = ({ messages }) => {
    const { user } = ChatState();
  return (
    <ScrollableFeed>
        {messages ? (
            messages.map((message, i) => (
                <div style={{ display: 'flex' }} key={message._id}>
                    {(isSameSender(messages, message, i, user._id) 
                        || isLastMessage(messages, message, i, user._id)
                    ) && (
                        <Tooltip
                            label={message.sender.name}
                            placement="bottom-start"
                            hasArrow
                        >
                            <Avatar
                                mt="7px"
                                mr={1}
                                size="sm"
                                cursor="pointer"
                                name={message.sender.name}
                                src={message.sender.picture}
                            />
                        </Tooltip>
                    )}
                    <span 
                        style={{ 
                            backgroundColor: `${
                                message.sender._id === user._id ? '#494A93' : 'white'
                            }`,
                            color: `${
                                message.sender._id === user._id ? 'white' : 'black'
                            }`,
                            borderRadius: '20px',
                            padding: '5px 15px',
                            maxWidth: '75%',
                            marginLeft: isSameSenderMargin(messages, message, i, user._id),
                            marginTop: isSameSender(messages, message, i, user._id) ? 3 : 10
                        }}
                    >
                        {message.content}
                    </span>
                </div>
            ))
        ) : (
            <div>
                <Text>Say something</Text>
            </div>
        )}
    </ScrollableFeed>
  )
}

export default ScrollableChat