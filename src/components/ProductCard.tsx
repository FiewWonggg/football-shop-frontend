// [Imports] ดึงของที่ใช้: Link (เปลี่ยนหน้า), types, hook, และ action เพิ่มตะกร้า
import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // ✅ นำเข้า useNavigate สำหรับเปลี่ยนหน้า
import type { Product } from '../types/product'; 
import { useAppDispatch } from '../app/hooks'; 
import { addCartItem } from '../features/features/cart/cartSlice'; 

// ✅ ใช้ getImageUrl ที่เราทำไว้ใน utils อย่างเดียวพอครับ (มันตั้งค่า URL Render ไว้แล้ว)
import { getImageUrl } from '../utils/getImageUrl'; 

//// [Props] ระบุว่า ProductCard จะได้รับ prop ชื่อ product
interface ProductCardProps {
    product: Product;
}

// [Component] การ์ดสินค้า
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate(); // เรียกใช้งาน useNavigate

    // [Event] กดปุ่ม "เพิ่มลงตะกร้า" 
    const handleAddToCart = () => {
        // 1. เช็ค Token ว่าผู้ใช้ล็อกอินหรือยัง
        const token = localStorage.getItem('access_token');
        
        // 2. ถ้ายังไม่ล็อกอิน ให้แจ้งเตือนและเด้งไปหน้า Login
        if (!token) {
            alert('กรุณาเข้าสู่ระบบก่อนเลือกซื้อสินค้านะครับ ⚽');
            navigate('/login');
            return; // หยุดการทำงาน ไม่ให้เพิ่มสินค้าลงตะกร้า
        }

        // 3. ถ้าล็อกอินแล้ว เพิ่มสินค้าลงตะกร้าได้ตามปกติเลย
        dispatch(addCartItem(product));
        alert('เพิ่มสินค้าลงตะกร้าแล้วครับ!');
    };
    
    // [Image URL] ดึงรูปผ่านฟังก์ชัน getImageUrl ที่ import มา
    const imageUrl = getImageUrl(product.imageUrl);

    return (
        // การ์ดสินค้า
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">

            {/* รูปภาพสินค้า */}
            <Link to={`/products/${product._id}`}>
                <div className="h-48 w-full overflow-hidden bg-gray-200 flex justify-center items-center">
                    <img
                        src={imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        onError={(e) => {
                            // ดักไว้ถ้ารูปเสีย ให้โชว์รูป placeholder แทน
                            (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/400x300.png?text=No+Image';
                        }}
                    />
                </div>
            </Link>

            <div className="p-4">
                {/* ชื่อสินค้า */}
                <h3 className="text-lg font-semibold text-gray-800 truncate" title={product.name}>
                    {product.name}
                </h3>

                {/* แบรนด์และหมวดหมู่ */}
                <p className="text-sm text-gray-500 mt-1">
                    {product.brand} | {product.category}
                </p>

                {/* ราคา */}
                <div className="flex items-baseline justify-between mt-3">
                    <span className="text-2xl font-bold text-primary-green">
                        {product.price.toLocaleString()}
                    </span>
                    <span className="text-base font-semibold text-gray-600">
                        THB
                    </span>
                </div>

                {/* ปุ่มเพิ่มลงตะกร้า */}
                <button
                    onClick={handleAddToCart}
                    className="mt-4 w-full bg-primary-green text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition duration-150"
                >
                    เพิ่มลงตะกร้า
                </button>
            </div>
        </div>
    );
};

export default ProductCard;