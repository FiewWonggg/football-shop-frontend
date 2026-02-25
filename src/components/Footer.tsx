import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-16 shadow-inner">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* ส่วนที่ 1: About Us */}
        <div>
          <h3 className="text-xl font-extrabold text-white mb-4 border-b border-gray-700 pb-2 inline-block">
            เกี่ยวกับเรา (About Us)
          </h3>
          <p className="text-sm leading-relaxed text-gray-400">
            FOOTBALL888 ร้านจำหน่ายรองเท้าสตั๊ดและอุปกรณ์ฟุตบอลของแท้ 100% 
            เราคัดสรรสินค้าคุณภาพจากแบรนด์ชั้นนำ เพื่อให้คุณโชว์ฟอร์มได้ดีที่สุดในทุกสนาม 
            พร้อมบริการจัดส่งที่รวดเร็วและปลอดภัย
          </p>
        </div>

        {/* ส่วนที่ 2: Contact Info */}
        <div>
          <h3 className="text-xl font-extrabold text-white mb-4 border-b border-gray-700 pb-2 inline-block">
            ติดต่อเรา (Contact Us)
          </h3>
          <ul className="text-sm space-y-3 text-gray-400">
            <li className="flex items-start">
              <span className="mr-2">📍</span> 
              <span>123 ถนนกรุงเทพ-นนทบุรี แขวงบางซื่อ เขตบางซื่อ<br/>ย่านบางซ่อน กรุงเทพมหานคร 10800</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">📞</span> 
              <span>081-234-5678, 02-987-6543</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">✉️</span> 
              <span>support@football888.com</span>
            </li>
          </ul>
        </div>

        {/* ส่วนที่ 3: Social Media & Links */}
        <div>
          <h3 className="text-xl font-extrabold text-white mb-4 border-b border-gray-700 pb-2 inline-block">
            ติดตามเรา
          </h3>
          <div className="flex flex-col space-y-2 text-sm text-gray-400">
            <a href="#" className="hover:text-primary-green transition flex items-center">
              <span className="mr-2">📘</span> Facebook: Football888 Official
            </a>
            <a href="#" className="hover:text-primary-green transition flex items-center">
              <span className="mr-2">📸</span> Instagram: @football888_shop
            </a>
            <a href="#" className="hover:text-primary-green transition flex items-center">
              <span className="mr-2">💬</span> LINE: @football888
            </a>
          </div>
        </div>

      </div>

      {/* ส่วนล่างสุด Copyright */}
      <div className="text-center text-sm text-gray-500 border-t border-gray-800 mt-10 pt-6">
        &copy; {new Date().getFullYear()} FOOTBALL888. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;