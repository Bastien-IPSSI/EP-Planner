import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            await fetch('http://localhost:8000/api/logout', {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        } finally {
            setUser(null);
            localStorage.removeItem('user');
        }
    };

    return (
        <UserContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('error');
    }
    return context;
};
