// [Imports + Selectors/Utils] ของที่ใช้ในหน้านี้
import React, { useEffect, useState } from 'react'; 
import { useParams } from 'react-router-dom'; //useParams() ดึง id จาก URL
import { useSelector } from 'react-redux'; //useSelector() ใช้ร่วมกับ selector ที่ประกาศไว้ใน slice เพื่อดึงค่าจาก store
import { useAppDispatch } from '../app/hooks'; // ✅ ใช้ typed dispatch แบบเดียวกับ ProductCard
import {
    fetchProductById,
    selectProductById,
    selectProductsStatus,
    selectProductsError
} from '../features/features/product/productSlice'; // ✅ ปรับ path ให้ตรงโปรเจกต์
import { addCartItem } from '../features/features/cart/cartSlice'; // ✅ ผูกกับ cartSlice

import { getImageUrl } from '../utils/getImageUrl'; // ✅ ใช้ยูทิลเดียวกับ ProductCard

const ProductDetail: React.FC = () => {
    // [รับพารามิเตอร์ + ตั้ง dispatch] ได้ id เป็น string จากเส้นทาง
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();

    // [ดึงข้อมูลจาก Redux ด้วย selector]
    const product = useSelector((state: any) => selectProductById(state, id));
    const status = useSelector(selectProductsStatus);
    const error = useSelector(selectProductsError);

// [สถานะ qty ในหน้า] จำนวนที่จะเพิ่มลงตะกร้า    
    const [qty, setQty] = useState(1);


    // [โหลดสินค้าเมื่อยังไม่มีใน store] เข้าหน้านี้ครั้งแรกแล้ว product ไม่อยู่ → ไปโหลด
    useEffect(() => {
        if (id && !product) {
            dispatch(fetchProductById(id));
        }
    }, [id, product, dispatch]);

    // [กันเคสต่าง ๆ ก่อนเรนเดอร์หลัก]
    if (!id) {
        return <div className="p-10 text-center text-gray-500">❌ ไม่พบ ID สินค้าใน URL</div>;
    }

    if (status === 'loading' && !product) {
        return <div className="p-10 text-center text-gray-500 animate-pulse">⏳ กำลังโหลดข้อมูลสินค้า...</div>;
    }

    if (status === 'failed' && !product) {
        return <div className="p-10 text-center text-red-600">⚠️ โหลดข้อมูลล้มเหลว: {error || 'ไม่ทราบสาเหตุ'}</div>;
    }

    if (!product) {
        return <div className="p-10 text-center text-gray-500">❌ ไม่พบข้อมูลสินค้าที่ต้องการ (ID: {id})</div>;
    }

    // [คำนวณ URL รูป + สถานะสต็อก]
    const imageSrc = getImageUrl(product.imageUrl);

    const canBuy = product.countInStock > 0;

    // [เพิ่มลงตะกร้า] ยิง addCartItem เท่ากับจำนวนที่เลือก
    const handleAddToCart = () => {
        // เพิ่มลงตะกร้า 1 ชิ้น (ตัว reducer ของมึงจะ +quantity ให้อัตโนมัติถ้าซ้ำ)
        for (let i = 0; i < qty; i++) {
            dispatch(addCartItem(product));
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">รายละเอียดสินค้า</h1>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2">
                {/* รูปสินค้า */}
                <div className="bg-gray-50 flex items-center justify-center">
                    <img
                        src={imageSrc}
                        alt={product.name}
                        className="w-full h-96 object-contain p-6"
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                                'https://via.placeholder.com/800x600.png?text=No+Image';
                        }}
                    />
                </div>

                {/* รายละเอียดสินค้า */}
                <div className="p-8 text-left">
                    <p className="text-xs text-gray-400 mb-2">ID: {product._id}</p>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h2>

                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-gray-600">แบรนด์:</span>
                        <span className="font-medium">{product.brand}</span>
                    </div>

                    <div className="mb-4">
                        <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                            หมวดหมู่: {product.category}
                        </span>
                    </div>

                    <p className="text-2xl text-blue-600 font-semibold mb-4">
                        ราคา: {product.price.toLocaleString()} บาท
                    </p>

                    <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

                    <p className={`text-sm font-medium mb-4 ${canBuy ? 'text-green-600' : 'text-red-500'}`}>
                        {canBuy ? `มีสินค้าในสต็อก ${product.countInStock} ชิ้น` : 'สินค้าหมด'}
                    </p>

                    {/* เลือกจำนวน */}
                    <div className="flex items-center gap-3 mb-4">
                        <label htmlFor="qty" className="text-sm text-gray-600">
                            จำนวน:
                        </label>
                        <select
                            id="qty"
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                            className="border rounded-lg px-3 py-2"
                            disabled={!canBuy}
                        >
                            {Array.from({ length: Math.min(product.countInStock, 10) }, (_, i) => i + 1).map(n => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            disabled={!canBuy}
                            onClick={handleAddToCart}
                            className={`px-6 py-3 rounded-lg font-semibold text-white transition ${canBuy ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                                }`}
                        >
                            🛒 เพิ่มลงตะกร้า
                        </button>

                        <button
                            className="px-5 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50"
                            onClick={() => window.history.back()}
                        >
                            ← กลับ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
