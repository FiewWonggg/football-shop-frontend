import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // เพิ่ม useNavigate สำหรับสลับหน้า
import { useAppSelector, useAppDispatch } from '../app/hooks'; // เพิ่ม useAppDispatch
import { clearCart } from '../features/features/cart/cartSlice'; // นำเข้า action ล้างตะกร้า (เช็ค path ให้ตรงกับของคุณนะครับ)

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // ดึง totalQuantity จาก Cart Slice [อ่าน state] — ดึงจำนวนสินค้าในตะกร้า
    const { totalQuantity } = useAppSelector(state => state.cart); 

    // เช็คสถานะการล็อกอินและสิทธิ์ (Role) จาก LocalStorage
    const token = localStorage.getItem('access_token');
    const userRole = localStorage.getItem('user_role');
    const isAuthenticated = !!token;

    // ฟังก์ชันสำหรับ Log out
    const handleLogout = () => {
        if (window.confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
            // 1. ลบ Token ออกจากเครื่อง
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_role');
            
            // 2. ล้างข้อมูลตะกร้าสินค้ากันข้อมูลค้าง
            dispatch(clearCart());
            
            // 3. เตะกลับไปหน้า Login
            navigate('/login');
        }
    };

    // [เมนูหน้า] — แสดง "หน้าแรก" และ "จัดการสินค้า" เฉพาะเมื่อเป็นแอดมินเท่านั้น
    const navItems = userRole === 'admin' 
        ? [
            { name: 'หน้าแรก', path: '/' },
            { name: 'จัดการสินค้า', path: '/admin' }
          ] 
        : []; 
    // ถ้าไม่ใช่ admin จะได้ Array ว่างๆ

    return (
        // Navbar หลัก: ใช้ sticky top-0 และ z-index เพื่อให้ NavBar คงที่
        <nav className="bg-primary-green p-4 shadow-xl sticky top-0 z-20">
            <div className="container mx-auto flex justify-between items-center">
                {/* โลโก้/ชื่อร้าน */}
                <Link to="/" className="text-secondary-white text-2xl font-extrabold tracking-wider">
                    FOOTBALL888
                </Link>

                {/* เมนูหลัก */}
                <div className="flex items-center space-x-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className="text-secondary-white hover:text-green-200 transition duration-150 ease-in-out font-medium text-lg"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* กลุ่มเครื่องมือด้านขวา (ตะกร้า + Auth) */}
                <div className="flex items-center space-x-6">
                    {/* ปุ่มตะกร้า (Cart Icon/Link) */}
                    <Link
                        to="/cart"
                        className="relative text-secondary-white hover:text-green-200 transition p-2 rounded-full hover:bg-green-600"
                    >
                        <span className="text-xl">🛒</span>
                        
                        {/* ตัวเลขในตะกร้า (Cart Counter Badge) */}
                        {totalQuantity > 0 && ( // แสดงเมื่อมีสินค้าในตะกร้าเท่านั้น
                            <span className="absolute top-0 right-0 bg-red-600 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2 font-bold shadow-md">
                                {totalQuantity}
                            </span>
                        )}
                    </Link>

                    {/* เส้นคั่น */}
                    <div className="h-6 border-l border-green-700"></div>

                    {/* ปุ่มเข้าสู่ระบบ / ออกจากระบบ */}
                    {isAuthenticated ? (
                        <button 
                            onClick={handleLogout}
                            className="text-secondary-white hover:text-red-600 font-medium transition text-lg"
                        >
                            ออกจากระบบ
                        </button>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="text-secondary-white hover:text-green-200 font-medium transition text-lg">
                                เข้าสู่ระบบ
                            </Link>
                            <Link to="/register" className="bg-white text-primary-green px-4 py-2 rounded-lg font-bold hover:bg-green-100 transition shadow-md">
                                สมัครสมาชิก
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

// [export] — ส่งคอมโพเนนต์ออกไปใช้
export default Navbar;