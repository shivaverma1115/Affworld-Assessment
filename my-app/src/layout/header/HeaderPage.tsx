'use client'
import React from 'react';
import { Box, Flex, Text, Button, Spacer } from '@chakra-ui/react';
import useGlobalContext from '@/hook/use-context';

const HeaderPage = () => {
    const { user, logout } = useGlobalContext();
    return (
        <Box bg="blue.500" p={4}>
            <Flex align="center" maxW="1200px" mx="auto">
                <Box>
                    <Text fontSize="lg" fontWeight="bold" color="white">
                        {user.name}
                    </Text>
                    <Text fontSize="sm" color="gray.200">
                        {user.email}
                    </Text>
                </Box>
                <Spacer />

                <Button
                    color="red"
                    bg= "white"
                    p={4}
                    size="sm"
                    onClick={logout}
                    _hover={{ 
                        bg: "red.600", 
                        color:'white'
                    }}
                >
                    Logout
                </Button>
            </Flex>
        </Box>
    )
}

export default HeaderPage
