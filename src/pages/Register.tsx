import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // ค่าเริ่มต้นเป็นลูกค้า
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // ยิง API ไปที่ NestJS Backend
      const response = await fetch('https://football-shop-api.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }), 
      });

      const data = await response.json();

      if (response.ok) {
        alert('สมัครสมาชิกสำเร็จ! กรุณาล็อคอิน');
        navigate('/login'); // สำเร็จแล้วเด้งไปหน้า Login
      } else {
        setError(data.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
      }
    } catch (err) {
      setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-xl w-full max-w-md">
        <h3 className="text-2xl font-bold text-center text-gray-800">สมัครสมาชิก</h3>
        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        
        <form onSubmit={handleRegister} className="mt-4">
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
          {/* ซ่อนหรือลบส่วนนี้ออกได้ในโหมด Production เพื่อไม่ให้คนนอกสมัครเป็น Admin */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">เลือกสิทธิ์ (สำหรับทดสอบ)</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="customer">ลูกค้า (Customer)</option>
              <option value="admin">พนักงาน (Admin)</option>
            </select>
          </div>
          <div className="flex items-baseline justify-between mt-6">
            <button className="px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 w-full">
              สมัครสมาชิก
            </button>
          </div>
          <p className="mt-4 text-sm text-center text-gray-600">
            มีบัญชีอยู่แล้ว? <Link to="/login" className="text-blue-600 hover:underline">เข้าสู่ระบบ</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;