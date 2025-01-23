import { useEffect, useCallback } from "react";
import { signIn, useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaGoogle } from "react-icons/fa";
import { Button } from "@chakra-ui/react";

const LoginWithGoogle = ({ setLoggedIn }: { setLoggedIn: any }) => {
    const { data: session } = useSession();
    
    const handleGoogleLogin = useCallback(async () => {
        try {
            if (!session || !session.user) {
                toast.error("Google login failed");
                return;
            }

            const { email, name } = session.user;

            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}user/login-with-google`, {
                email,
                name,
            });

            if (res.status === 200) {
                const { token, message } = res.data;
                if (typeof window !== "undefined") localStorage.setItem("userToken", token);
                setLoggedIn(true);
                toast.success(message);
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred during Google login");
        }
    }, [session, setLoggedIn]);

    useEffect(() => {
        if (session) {
            handleGoogleLogin();
        }
    }, [session, handleGoogleLogin]);

    return (
        <Button onClick={() => signIn("google")} w={"full"} mt={4}>
            <FaGoogle />
            Sign in with Google
        </Button>
    );
};

export default LoginWithGoogle;
