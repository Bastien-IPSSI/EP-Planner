import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export const useUser = () => {
    return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);


    useEffect(() => {
        fetch("http://localhost:8000/api/me", { credentials: "include" })
            .then((res) => res.json())
            .then((data) => {
                if (data.mail) {
                    setUser(data);
                }
            })
            .catch(() => console.log("Non connecté"))
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        await fetch("http://localhost:8000/api/logout", {
            method: "POST",
            credentials: "include",
        });
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
