export interface IUser {
    name: string;
    email: string;
    password: string;
}

interface HeaderType {
    headers: {
        "Content-Type": string;
        Authorization: string;
    };
}

export interface AppContextType {
    header?: HeaderType;
    logout?: () => void;
    setScrollDirection?: React.Dispatch<React.SetStateAction<string>> | undefined;
    user?: IUser;
    setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
    loggedIn: boolean;
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface Task {
    id: string;
    name: string;
    description: string;
    status: "Pending" | "Completed" | "Done";
};