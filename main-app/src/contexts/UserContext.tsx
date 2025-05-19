import { dummyUser } from "@/dummyData";
import { User } from "@/models/DB/User.model";
import { createContext, useContext, useState, ReactNode } from "react";

type UserContextType = {
    user: User | null;
    setUser: (user: User) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(dummyUser);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used within UserProvider");
    return ctx;
};
