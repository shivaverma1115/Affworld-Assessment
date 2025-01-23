"use client"

import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { ThemeProvider } from "next-themes"
import { ToastContainer } from "react-toastify"
import { SessionProvider } from 'next-auth/react'
import AppProvider from "@/contextApi/AppProvider"
import PrivateRoute from "@/privetRoute/PrivateRoute"
import { usePathname } from "next/navigation"

export default function RootLayout(props: { children: React.ReactNode }) {
    const pathName = usePathname();
    return (
        <>
            <AppProvider>
                <SessionProvider>
                    <ToastContainer autoClose={1000} />
                    <ChakraProvider value={defaultSystem}>
                        <ThemeProvider attribute="class" disableTransitionOnChange>
                            {
                                pathName === "/" || pathName === "/login" || pathName === "/register"
                                    ?
                                    props.children
                                    :
                                    <PrivateRoute>
                                        {props.children}
                                    </PrivateRoute>
                            }
                        </ThemeProvider>
                    </ChakraProvider>
                </SessionProvider>
            </AppProvider>
        </>
    )
}