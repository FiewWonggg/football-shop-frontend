import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, NavLink, useNavigate } from 'react-router-dom';
import './index.css';

// ********** นำเข้า Component หลัก **********
import Navbar from './components/Navbar';
import ProductList from './pages/ProductList';
import AdminProducts from './pages/AdminProducts';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import AdminOrders from './pages/AdminOrders';
import Footer from './components/Footer';

// [Placeholder]
const Placeholder = ({ title }: { title: string }) => (
  <div className="p-8 text-center text-gray-500 text-xl font-light">🚧 {title} Page 🚧</div>
);

// --- สร้าง Layout สำหรับฝั่งลูกค้า ---
const CustomerLayout = () => (
  // ใช้ flex flex-col เพื่อให้ Footer โดนดันไปอยู่ล่างสุดเสมอ
  <div className="flex flex-col min-h-screen">
    <Navbar />
    
    {/* พื้นที่แสดงเนื้อหาหลัก ให้มันขยายเต็มพื้นที่ที่เหลือ (flex-grow) */}
    <main className="container mx-auto p-4 flex-grow">
      <Outlet /> {/* Component ลูกจะมาแสดงตรงนี้ */}
    </main>
    
    {/* Footer */}
    <Footer />
    
  </div>
);

// ---------------------------------------------------------
// --- สร้าง Layout สำหรับฝั่งแอดมิน (พนักงาน) ---
// ---------------------------------------------------------
const AdminLayout = () => {
  const navigate = useNavigate(); // 👈 เรียกใช้ useNavigate

  // ฟังก์ชันสำหรับการ Log out
  const handleLogout = () => {
    if (window.confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
      // ลบข้อมูลที่เก็บไว้ในเครื่อง
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_role');

      // (ทางเลือก) ถ้าต้องการล้างข้อมูลตะกร้าใน Redux ด้วย สามารถ dispatch(clearCart()) ตรงนี้ได้เลยครับ

      // พาผู้ใช้กลับไปหน้า Login
      navigate('/login');
    }
  };

  const navLinkStyle = ({ isActive }: { isActive: boolean }) =>
    `block py-2 px-4 rounded-lg transition-colors duration-200 ${isActive
      ? 'bg-blue-600 text-white shadow-md'
      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col shadow-xl z-10">
        <h2 className="text-2xl font-extrabold mb-8 text-center border-b border-gray-700 pb-4">
          Admin Panel
        </h2>

        <nav className="flex-1">
          <ul className="space-y-3">
            <li>
              <NavLink to="/admin" end className={navLinkStyle}>
                <span className="mr-2">📦</span> จัดการสินค้า (Products)
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/orders" className={navLinkStyle}>
                <span className="mr-2">🛒</span> รายการสั่งซื้อ (Orders)
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* ส่วนล่างสุดของ Sidebar */}
        <div className="mt-auto pt-6 border-t border-gray-700 space-y-2">
          <NavLink to="/" className="block py-2 px-4 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
            <span className="mr-2">🔙</span> กลับหน้าร้านค้า
          </NavLink>

          {/* 👇 ปุ่ม Log out ของ Admin */}
          <button
            onClick={handleLogout}
            className="w-full text-left block py-2 px-4 text-red-400 hover:text-white hover:bg-red-600 rounded-lg transition-colors"
          >
            <span className="mr-2">⛔</span> ออกจากระบบ
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* หน้า Login/Register ที่เข้าได้อิสระ ไม่ต้องมี Navbar ก็ได้ */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ---------------------------------
            ฝั่งลูกค้า (Customer Routes) 
        ---------------------------------- */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />

          {/* Checkout ต้องเป็น Customer หรือ Admin ที่ล็อกอินแล้วเท่านั้น */}
          <Route element={<ProtectedRoute allowedRoles={['customer', 'admin']} />}>
            <Route path="/checkout" element={<Checkout />} />
          </Route>
        </Route>

        {/* ---------------------------------
            ฝั่งพนักงาน (Admin Routes) 
        ---------------------------------- */}
        {/* บังคับว่าต้องมี Role เป็น 'admin' เท่านั้น */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            {/* พาธจริงจะเป็น /admin/products */}
            <Route index element={<AdminProducts />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<Placeholder title="404 Not Found" />} />
      </Routes>
    </Router>
  );
};

export default App;