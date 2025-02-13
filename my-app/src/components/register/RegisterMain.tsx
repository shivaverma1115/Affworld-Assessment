'use client'
import { Box, Button, Input, Stack, Heading, Text } from '@chakra-ui/react';
import React, { useState } from 'react'
import { IUser } from '../../interface/interFace';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-toastify';

const RegisterMain = () => {
    const [registerInfo, setregisterInfo] = useState<IUser | undefined>();

    const handleInputInfos = (e: React.ChangeEvent<HTMLInputElement>) => {
        setregisterInfo((prevregisterInfo: any) => ({
            ...prevregisterInfo,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(registerInfo);
        axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}user/register`, registerInfo)
            .then((res) => {
                console.log(res)
                toast.success(res.data.message)
            })
            .catch((err) => {
                console.log(err)
                toast.error(err.data.message)
            })
    };
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            bg="gray.50"
            p={4}
        >
            <Box
                maxW="md"
                w="100%"
                boxShadow="lg"
                rounded="lg"
                p={8}
            >
                <Heading textAlign="center" mb={6} fontWeight={800} fontSize={'25px'} >
                    Register User
                </Heading>
                <form onSubmit={handleSubmit} >
                    <Stack >
                        <label htmlFor="name">Full Name</label>
                        <Input
                            id="name"
                            name='name'
                            type="text"
                            placeholder="Enter your full name"
                            px={3}
                            border={'1px solid gray'}
                            required
                            onChange={handleInputInfos}
                        />
                        <label htmlFor="email">Email Address</label>
                        <Input
                            id="email"
                            name='email'
                            type="email"
                            placeholder="Enter your email"
                            px={3}
                            border={'1px solid gray'}
                            required
                            onChange={handleInputInfos}
                        />
                        <label htmlFor="password">Password</label>
                        <Input
                            id="password"
                            name='password'
                            type="password"
                            placeholder="Enter your password"
                            px={3}
                            border={'1px solid gray'}
                            required
                            onChange={handleInputInfos}
                        />
                        <Button
                            bg="teal.500" variant="solid"
                            size="lg"
                            width="full"
                            mt={4}
                            type="submit"
                        >
                            Register
                        </Button>
                    </Stack>
                </form>
                <Box mt={4} textAlign="center" >
                    <Text>
                        Already Registered?{' '}
                        <Link href="/login" color="blue.500" style={{ textDecoration: 'underline' }}>
                            Login here
                        </Link>
                    </Text>
                </Box>
            </Box>
        </Box>
    )
}

export default RegisterMain
