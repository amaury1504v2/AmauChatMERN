import React, { useState } from 'react';
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';


const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [picture, setPicture] = useState("");
  const [show, setShow] = useState(false);
  const [pictureLoading, setPictureLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const handleClick = () => {
    setShow(!show);
  };

  const postDetails = (pictures) => {
    setPictureLoading(true);

    if(pictures === undefined) {
      toast({
        title: 'Please select a picture',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom'
      });
      return;
    };

    console.log(pictures);
    if(pictures.type === 'image/jpeg' || pictures.type === 'image/png') { // si les images sont du type png ou image
      const data = new FormData();

      data.append("file", pictures); // on crée le fichier qui contient les images
      data.append("upload_preset", "AmauChat"); // l'endroit où on upload: AmauChat
      data.append("cloud_name", "amauchat");

      fetch("https://api.cloudinary.com/v1_1/amauchat/image/upload", {
        method: "post",
        body: data
      })
      .then((res) => {res.json()})
      .then((data) => {
        setPicture(data.url.toString());
        console.log(data.url.toString());
        setPictureLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setPictureLoading(false);
      });
    } else {
      toast({
        title: 'Please select a picture',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom'
      });
      setPictureLoading(false);
      return;
    }
  };

  const submitHandler = async () => {
    setPictureLoading(true);
    
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      });
      setPictureLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      });
      return;
    }

    console.log(name, email, password, picture);

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          picture,
        },
        config
      );

      console.log(data);

      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setPictureLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPictureLoading(false);
    };
  };

  

  

  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input 
          placeholder="Enter Your Name"
          onChange={  (e) => { setName(e.target.value) }  }
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input 
          placeholder="Enter Your Email"
          onChange={  (e) => { setEmail(e.target.value) }  }
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input 
            placeholder="Enter Your Password"
            type={show ? "text" : "password" }
            onChange={  (e) => { setPassword(e.target.value) }  }
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="small" background="transparent" onClick={handleClick}>
              {!show ? "Show" : "Hide"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="confirm-pasword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input 
            placeholder="Re-enter Your Password"
            type={show ? "text" : "password" }
            onChange={  (e) => { setConfirmPassword(e.target.value) }  }
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="small" background="transparent" onClick={handleClick}>
              {!show ? "Show" : "Hide"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="picture" isRequired>
        <FormLabel>Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          placeholder="Upload A Picture"
          onChange={(e) => { postDetails(e.target.files[0]) }}
        />
      </FormControl>
      <br />
      <Button
        colorScheme="blue"
        w="100%"
        marginTop="15px"
        onClick={submitHandler}
        isLoading={pictureLoading}
      >
        Sign Up
      </Button>
    </VStack>
  )
}

export default SignUp