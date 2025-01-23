"use client";
import React from "react";
import { useRouter } from "next/navigation";
import useGlobalContext from "@/hook/use-context";


const AdminRoute = ({ children }) => {
  const { user, logout } = useGlobalContext();
  const router = useRouter();

  if (user?.email) {
    return <>{children}</>;
  }

  if (!user) {
    router.replace("/login");
    return <h1>
      ...Loding
    </h1>;
  }


  router.replace("/login");
  if (logout) {
    logout()
  }
  return null;
};

export default AdminRoute;

