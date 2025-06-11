// src/layouts/MainLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SharedNavbar from '../components/SharedNavbar';
import ProfileModal from '../components/ProfileModal';
import { useLayout } from '../contexts/LayoutContext';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

const MainLayout = () => {
    const [showProfileModal, setShowProfileModal] = useState(false);
    const { pageTitle } = useLayout();
    const { user, logout, loading } = useAuth(); // Lấy user và hàm logout từ context

    const getDashboardPath = (role) => {
        switch (role) {
            case 'BGH': return '/bgh';
            case 'GiaoVien': return '/giaovien';
            case 'GiaoVu': return '/giaovu';
            default: return '/';
        }
    };

    if (loading) {
        return <div>Đang tải ứng dụng...</div>; // Hoặc một component Spinner toàn trang
    }

    return (
        <>
            <SharedNavbar
                pageTitle={pageTitle}
                user={user} // Truyền cả object user xuống
                dashboardPath={getDashboardPath(user?.MaVaiTro?.MaVaiTro)}
                onLogout={logout} // Truyền hàm logout từ context
                onProfileClick={() => setShowProfileModal(true)}
            />
            <main>
                <Outlet />
            </main>
            <ProfileModal
                show={showProfileModal}
                onHide={() => setShowProfileModal(false)}
            />
        </>
    );
};

export default MainLayout;