"use client";
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { AppContextType, IUser } from "@/interface/interFace";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export const AppContext = createContext<AppContextType | undefined>(undefined);
const AppProvider = ({ children }: { children: React.ReactNode }) => {

  const [user, setUser] = useState<IUser>();
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  let token = '';
  if (typeof window !== "undefined") {
    token = localStorage.getItem("userToken");
  }

  const header = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    if (token) {
      axios
        .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}user/get-user`, { token }, header)
        .then((res) => {
          console.log(res)
          if (res.data.data) {
            const userinfo = res.data.data;
            setUser(userinfo);
            setLoading(false);

            if (token) {
              const decodedToken: any = jwtDecode(token);
              const expirationTime = decodedToken.exp * 1000;
              const currentTime = Date.now();
              const timeUntilExpiration = expirationTime - currentTime;
              setTimeout(() => {
                if (timeUntilExpiration <= 0) {
                  logout();
                }
              }, timeUntilExpiration);
            }
          }
        })
        .catch((e) => {
          setLoading(false);
          console.log(e);
        });
    } else {
      setLoading(false);
    }
  }, [token, header, logout]);

  function logout() {
    if (typeof window !== "undefined") localStorage.removeItem("userToken");
    setLoading(false);
    setLoggedIn(false);
    setUser(undefined);
    signOut()
    router.replace("/login");
  };

  const contextValue: AppContextType = {
    user,
    setUser,
    setLoggedIn,
    setLoading,
    loading,
    loggedIn,
    logout,
    header,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppProvider;

