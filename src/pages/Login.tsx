import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://football-shop-api.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // บันทึก Token และ Role ลง LocalStorage เพื่อให้ ProtectedRoute ดึงไปเช็ค
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user_role', data.role);

        // แยกเส้นทางหลังล็อคอิน
        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(data.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (err) {
      setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-xl w-full max-w-md">
        <h3 className="text-2xl font-bold text-center text-gray-800">เข้าสู่ระบบ</h3>
        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        
        <form onSubmit={handleLogin} className="mt-4">
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">อีเมล</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">รหัสผ่าน</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>
          <div className="flex items-baseline justify-between mt-6">
            <button className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 w-full">
              เข้าสู่ระบบ
            </button>
          </div>
          <p className="mt-4 text-sm text-center text-gray-600">
            ยังไม่มีบัญชี? <Link to="/register" className="text-blue-600 hover:underline">สมัครสมาชิก</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;