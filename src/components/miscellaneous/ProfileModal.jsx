import React, { Fragment } from 'react';
import { useDisclosure } from '@chakra-ui/hooks';
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';

const ProfileModal = ({user, children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Fragment>
        {children ? 
            <span onClick={onOpen}>{children}</span>
        : (
            <IconButton
                display={{ base: 'flex'}}
                icon={<ViewIcon />}
                onClick={onOpen}
            />
        )}
        <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader
                fontSize="40px"
                fontFamily="Work sans"
                display="flex"
                justifyContent="center"
            >{user.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="space-between"
            >
                <Image 
                    borderRadius="full"
                    boxSize="150px"
                    src={user.picture}
                    alt={user.name}
                />
                <Text
                    fontSize={{ base: "28px", md: "30px" }}
                >
                    Email: {user.email}
                </Text>
            </ModalBody>
            <ModalFooter>
                <Button onClick={onClose}>Close</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    </Fragment>
  )
}

export default ProfileModal