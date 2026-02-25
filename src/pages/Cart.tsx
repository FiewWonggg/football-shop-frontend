// [Imports] เอา hook/selector จากโปรเจกต์ + action ของ cart + type + Router + ยูทิลรูป
import React from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks'; //ใช้ useAppSelector/useAppDispatch เพื่อดึง/ยิง Redux แบบมี type
import {
    addCartItem,
    decreaseQuantity,
    removeCartItem,
    clearCart
} from '../features/features/cart/cartSlice';
import type { CartItem } from '../types/cart';
import { Link, useNavigate } from 'react-router-dom'; // ✅ นำเข้า useNavigate

// ✅ ใช้ยูทิลเดียวกับ ProductCard/Detail เพื่อแก้ path รูปจากโฟลเดอร์ uploads
import { getImageUrl } from '../utils/getImageUrl';

const Cart: React.FC = () => {
    const navigate = useNavigate(); // ✅ เรียกใช้งาน useNavigate

    // [อ่าน state ตะกร้า + เตรียม dispatch]
    const { items, totalAmount } = useAppSelector(state => state.cart);
    const dispatch = useAppDispatch();

    // [Event: เพิ่มจำนวน +1 ชิ้น] (เรียก addCartItem)
    const handleIncrease = (item: CartItem) => {
        dispatch(addCartItem(item));
    };

    // [Event: ลดจำนวน −1 ชิ้น] (เรียก decreaseQuantity ด้วย id)
    const handleDecrease = (id: string) => {
        dispatch(decreaseQuantity(id));
    };

    // [Event: ลบรายการทิ้งทั้งก้อน]
    const handleRemove = (id: string) => {
        dispatch(removeCartItem(id));
    };

    // [Event: ล้างตะกร้าทั้งหมด] มี confirm กันพลาด
    const handleClearCart = () => {
        if (window.confirm('คุณแน่ใจหรือไม่ที่จะล้างตะกร้าสินค้าทั้งหมด?')) {
            dispatch(clearCart());
        }
    };

    // ✅ [Event: ไปหน้าชำระเงิน พร้อมส่งข้อมูลตะกร้าไปด้วย]
    const handleCheckout = () => {
        if (items.length === 0) {
            alert('ตะกร้าสินค้าว่างเปล่า กรุณาเลือกซื้อสินค้าก่อนครับ');
            return;
        }

        // ใช้ navigate ไปที่ /checkout พร้อมแนบ state (items และ total) ไปด้วย
        navigate('/checkout', {
            state: {
                items: items,
                total: totalAmount
            }
        });
    };

    // [กรณีว่างเปล่า] โชว์ข้อความ + ปุ่มกลับไปเลือกซื้อ
    if (items.length === 0) {
        return (
            <div className="container mx-auto p-8 text-center min-h-[80vh] flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">🛒 ตะกร้าสินค้าของคุณว่างเปล่า</h1>
                <p className="text-lg text-gray-600 mb-6">ยังไม่มีสินค้าที่คุณถูกใจใช่ไหม? ลองไปเลือกดูสินค้าของเราสิ!</p>
                <Link
                    to="/"
                    className="bg-primary-green hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-lg"
                >
                    เลือกซื้อสินค้าทั้งหมด
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 md:p-10 min-h-screen bg-gray-50">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-8 border-b-2 pb-2">ตะกร้าสินค้า</h1>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* รายการสินค้า (ซ้าย) */}
                <div className="lg:w-3/4 space-y-4">
                    {items.map((item: CartItem) => {
                        // ✅ ใช้ getImageUrl เพื่อให้ path จากโฟลเดอร์อัปโหลดแปลงเป็น URL ที่เข้าถึงได้
                        const imageSrc = getImageUrl(item.imageUrl);

                        return (
                            <div
                                key={item._id}
                                className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition duration-300"
                            >
                                {/* รูปและชื่อสินค้า */}
                                <div className="flex items-center gap-4 w-full sm:w-1/2">
                                    <Link to={`/products/${item._id}`} className="shrink-0">
                                        <img
                                            src={imageSrc}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded-md border bg-gray-100"
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).src =
                                                    'https://via.placeholder.com/64x64.png?text=No+Image';
                                            }}
                                        />
                                    </Link>
                                    <div className="flex-1">
                                        <Link to={`/products/${item._id}`}>
                                            <h3 className="text-lg font-semibold text-gray-900 hover:underline">
                                                {item.name}
                                            </h3>
                                        </Link>
                                        <p className="text-sm text-gray-500">รหัสสินค้า: {item._id}</p>
                                    </div>
                                </div>

                                {/* การควบคุมจำนวนและราคา */}
                                <div className="flex items-center gap-6 mt-4 sm:mt-0">
                                    {/* ปุ่มควบคุมจำนวน */}
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <button
                                            onClick={() => handleDecrease(item._id)}
                                            className="p-2 text-xl font-bold text-gray-600 hover:bg-gray-100 rounded-l-lg disabled:opacity-50"
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="w-10 text-center font-medium text-lg border-l border-r border-gray-300 py-1">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => handleIncrease(item)}
                                            className="p-2 text-xl font-bold text-gray-600 hover:bg-gray-100 rounded-r-lg"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* ราคารวมของสินค้านี้ */}
                                    <p className="text-lg font-bold text-primary-green w-24 text-right">
                                        {(item.price * item.quantity).toLocaleString()} ฿
                                    </p>

                                    {/* ปุ่มลบรายการ */}
                                    <button
                                        onClick={() => handleRemove(item._id)}
                                        className="text-red-500 hover:text-red-700 p-2 rounded-full transition"
                                        title="ลบออกจากตะกร้า"
                                    >
                                        <span className="text-xl">🗑️</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    <button
                        onClick={handleClearCart}
                        className="mt-6 px-4 py-2 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition duration-300"
                    >
                        ล้างตะกร้าทั้งหมด
                    </button>
                </div>

                {/* สรุปยอด (ขวา) */}
                <div className="lg:w-1/4">
                    <div className="bg-secondary-white p-6 border border-gray-300 rounded-xl shadow-lg sticky top-24">
                        <h2 className="text-2xl font-bold mb-4 border-b pb-2">สรุปยอด</h2>

                        <div className="flex justify-between text-lg mb-2">
                            <span className="text-gray-600">ราคาสินค้าทั้งหมด:</span>
                            <span className="font-semibold">{totalAmount.toLocaleString()} ฿</span>
                        </div>

                        <div className="flex justify-between text-lg mb-4 border-b pb-4">
                            <span className="text-gray-600">ค่าจัดส่ง:</span>
                            <span className="font-semibold text-gray-500">ฟรี</span>
                        </div>

                        <div className="flex justify-between text-xl font-extrabold text-gray-900">
                            <span>ยอดชำระสุทธิ:</span>
                            <span className="text-primary-green">{totalAmount.toLocaleString()} ฿</span>
                        </div>

                        {/* ✅ เรียกใช้ handleCheckout เมื่อกดปุ่ม */}
                        <button
                            onClick={handleCheckout}
                            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300 shadow-md"
                        >
                            ดำเนินการชำระเงิน
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;