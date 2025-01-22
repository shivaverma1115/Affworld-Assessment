"use client"
import { AppContext } from "@/contextApi/AppProvider";
import { AppContextType } from "@/interface/interFace";
import { useContext } from "react"


const useGlobalContext = () => {
    return useContext(AppContext) as AppContextType
}

export default useGlobalContext;