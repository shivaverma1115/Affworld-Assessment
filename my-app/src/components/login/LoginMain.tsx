'use client'
import { Box, Button, Input, Stack, Heading, Text } from '@chakra-ui/react';
import React, { useState } from 'react'
import { IUser } from '../../interface/interFace';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-toastify';
import useGlobalContext from '@/hook/use-context';
import { useRouter } from 'next/navigation';
import LoginWithGoogle from './LoginWithGoogle';

const LoginMain = () => {
    const { user, setLoggedIn } = useGlobalContext();
    const [loginInfo, setLoginInfo] = useState<IUser | undefined>();
    const router = useRouter();
    if (user) {
        router.push('/task-management');
        return;
    }

    const handleInputInfos = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginInfo((prevLoginInfo: any) => ({
            ...prevLoginInfo,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(loginInfo);
        axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}user/login`, loginInfo)
            .then((res) => {
                setLoggedIn(true);
                if (typeof window !== "undefined") localStorage.setItem("userToken", res.data.token)
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
                    Login to your account
                </Heading>
                <form onSubmit={handleSubmit} >
                    <Stack >
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
                            color={'white'}
                        >
                            Login
                        </Button>
                    </Stack>
                </form>
                <LoginWithGoogle setLoggedIn={setLoggedIn} />
                <Box mt={4} textAlign="center">
                    <Text>
                        New User?{' '}
                        <Link href="/register" color="blue.500" style={{ textDecoration: 'underline' }}>
                            Register here
                        </Link>
                    </Text>
                    <Text>
                        Forget Password?{' '}
                        <Link href="/forget-password" color="blue.500" style={{ textDecoration: 'underline' }}>
                            click here
                        </Link>
                    </Text>
                </Box>
            </Box>
        </Box>
    )
}

export default LoginMain
