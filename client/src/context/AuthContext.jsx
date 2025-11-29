import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                const parsedUser = JSON.parse(userInfo);
                setUser(parsedUser);
            }
        } catch (error) {
            console.error('Error parsing user info:', error);
            localStorage.removeItem('userInfo');
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
            });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error) {
            throw error.response?.data?.message || 'Login failed';
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/register', {
                name,
                email,
                password,
            });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error) {
            throw error.response?.data?.message || 'Registration failed';
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    const refreshUser = async () => {
        try {
            const token = user?.token;
            if (!token) return;

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const { data } = await axios.get('http://localhost:5000/api/auth/profile', config);
            
            // Update user data with fresh info from server
            const updatedUserInfo = { ...user, ...data };
            setUser(updatedUserInfo);
            localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
            
            return updatedUserInfo;
        } catch (error) {
            console.error('Error refreshing user data:', error);
            // If refresh fails and it's an auth error, logout
            if (error.response?.status === 401) {
                logout();
            }
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout, refreshUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
