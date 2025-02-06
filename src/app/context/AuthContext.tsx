// context/AuthContext.tsx
import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

interface AuthContextProps {
    user: any;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
    user: null,
    login: () => { },
    logout: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // ตรวจสอบและแปลง JWT token เป็นข้อมูลผู้ใช้
            axios
                .post('/api/verify-token', { token })
                .then((res) => setUser(res.data.user))
                .catch(() => logout());
        }
    }, []);

    const login = (token: string) => {
        localStorage.setItem('token', token);
        axios
            .post('/api/verify-token', { token })
            .then((res) => setUser(res.data.user))
            .catch(() => logout());
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
