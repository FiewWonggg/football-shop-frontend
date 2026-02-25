import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
    allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const token = localStorage.getItem('access_token');
    const userRole = localStorage.getItem('user_role');
    const isAuthenticated = !!token; // ถ้ามี token แปลว่าล็อคอินแล้ว

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />; // ยังไม่ล็อกอิน เด้งไปหน้า Login
    }

    if (!allowedRoles.includes(userRole || '')) {
        return <Navigate to="/" replace />; // ล็อกอินแล้วแต่ Role ไม่ผ่าน เด้งกลับหน้าแรก
    }

    // ถ้าสิทธิ์ผ่าน ให้แสดงผล Component ลูกที่อยู่ข้างใน (ผ่าน Outlet)
    return <Outlet />;
};

export default ProtectedRoute;