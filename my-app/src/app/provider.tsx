"use client"

import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { ThemeProvider } from "next-themes"
import { ToastContainer } from "react-toastify"

export default function RootLayout(props: { children: React.ReactNode }) {
    return (
        <>
            <ToastContainer />
            <ChakraProvider value={defaultSystem}>
                <ThemeProvider attribute="class" disableTransitionOnChange>
                    {props.children}
                </ThemeProvider>
            </ChakraProvider>
        </>
    )
}