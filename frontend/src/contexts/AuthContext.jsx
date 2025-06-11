import { createContext, useState, useContext, useEffect, useCallback } from 'react'; // BƯỚC 1: Import thêm useCallback
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN, USER_ROLE } from '../constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem(ACCESS_TOKEN));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // BƯỚC 2: Bọc hàm logout trong useCallback
    // Dependency array [] rỗng vì hàm này không phụ thuộc vào state hay props nào
    const logout = useCallback(() => {
        localStorage.clear();
        setToken(null);
        setUser(null);
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            // Nếu không có token, không cần làm gì cả, chỉ dừng loading
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                // Đặt header trước khi gọi API
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const res = await api.get('/api/taikhoan/me/');
                setUser(res.data);
            } catch (error) {
                console.error("Token không hợp lệ hoặc đã hết hạn. Đang đăng xuất.");
                logout(); // Gọi hàm logout đã được ổn định
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [token, logout]); // BƯỚC 3: Thêm logout vào dependency array

    // BƯỚC 4: Bọc hàm login trong useCallback
    // Dependency array [] rỗng vì nó chỉ gọi các hàm set state
    const login = useCallback((userData, accessToken, refreshToken) => {
        localStorage.setItem(ACCESS_TOKEN, accessToken);
        localStorage.setItem(REFRESH_TOKEN, refreshToken);
        if (userData?.MaVaiTro?.MaVaiTro) {
            localStorage.setItem(USER_ROLE, userData.MaVaiTro.MaVaiTro);
        }
        setToken(accessToken);
        setUser(userData);
    }, []);

    const value = {
        user,
        token,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {/* Chỉ render children khi không còn loading để tránh các lỗi truy cập user=null */}
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};