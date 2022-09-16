import React, { useEffect } from 'react';
import { Container, Box, Text, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import Login from '../components/authentication/Login';
import SignUp from '../components/authentication/SignUp';

import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    useEffect(()=> {
        const user = JSON.parse(localStorage.getItem('userInfo')); // On récupère le userInfo du localstorage que l'on met sous le format JSON

        if(user) {
            navigate("/chats");
        }
    }, []);
  return (
   <Container maxW="xl" centerContent>
    <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
    >
        <Text fontSize="4xl" fontFamily="Work sans" color="black">AmauChat</Text>
    </Box>
    <Box bg="white" w="100%" p={4} borderWidth="1px" borderRadius="lg">
        <Tabs variant='soft-rounded' colorScheme='blue'>
            <TabList mb="1em">
                <Tab width="50%">Login</Tab>
                <Tab width="50%">Sign Up</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <Login />
                </TabPanel>
                <TabPanel>
                    <SignUp />
                </TabPanel>
            </TabPanels>
        </Tabs>
    </Box>
   </Container>
  )
}

export default HomePage