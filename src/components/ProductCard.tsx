// [Imports] ดึงของที่ใช้: Link (เปลี่ยนหน้า), types, hook, และ action เพิ่มตะกร้าimport React from 'react';

import { Link } from 'react-router-dom'; 
import type { Product } from '../types/product'; //type ของสินค้า (ให้ TypeScript คุมให้ถูก)
import { useAppDispatch } from '../app/hooks'; //เอาไว้ยิง action ไป Redux
import { addCartItem } from '../features/features/cart/cartSlice'; //action ที่ตะกร้าใช้เพื่อเพิ่มสินค้า

//// [Props] ระบุว่า ProductCard จะได้รับ prop ชื่อ product ที่เป็นชนิด Product /กันพลาดเรื่องชนิดข้อมูล
interface ProductCardProps {
    product: Product;
}

// [Helper] getImageUrl: แปลง path รูปให้กลายเป็น URL ที่เปิดได้จริง
const getImageUrl = (path: string | undefined): string => {
    // ถ้าไม่มี Path หรือเป็นค่าว่าง ให้ใช้ Placeholder
    if (!path) {
        return 'https://via.placeholder.com/400x300.png?text=No+Image';
    }
    
    // ตรวจสอบว่า Path มี http/https อยู่แล้วหรือไม่ (อาจเป็นรูปภายนอก)
    if (path.startsWith('http') || path.startsWith('https')) {
        return path;
    }

    // **เพื่อความง่ายและปลอดภัยที่สุด เราจะใช้ Base URL ของ Backend ที่เรารู้**
    // NestJS รันที่พอร์ต 3000
    return `/api/products/${path}`;
};

// [Component] การ์ดสินค้า
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const dispatch = useAppDispatch();

     // [Event] กดปุ่ม "เพิ่มลงตะกร้า" → ยิง action ไปที่ cartSlice
    const handleAddToCart = () => {
        dispatch(addCartItem(product));
    };
    
     // [Image URL] ใช้ฟังก์ชันช่วย เพื่อให้ได้ URL ที่ถูกต้องก่อนส่งให้ <img>*
    const imageUrl = getImageUrl(product.imageUrl);

    return (
        // การ์ดสินค้า
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">

            {/* รูปภาพสินค้า */}
            <Link to={`/products/${product._id}`}>
                <div className="h-48 w-full overflow-hidden bg-gray-200 flex justify-center items-center">
                    <img
                        // *** ใช้ imageUrl ที่ผ่านการประมวลผลแล้ว ***
                        src={imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
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
