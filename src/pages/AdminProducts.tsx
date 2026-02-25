import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks'; //เวอร์ชันที่มี type แล้ว ใช้ง่าย/ไม่พลาด
import { fetchProducts, deleteProduct } from '../features/features/product/productSlice'; //โหลดลิสต์สินค้าเข้าสตอร์ ลบสินค้า (ตาม _id)
import type { Product } from '../types/product';
import ProductFormModal from '../components/ProductFormModal'; // โมดัลใช้ทั้ง “สร้าง” และ “แก้ไข”

const AdminProducts: React.FC = () => {
    const dispatch = useAppDispatch();
    // ใช้ Custom Hook เพื่อดึง State
    const { products, status } = useAppSelector((state) => state.products);
// [Component State] เก็บสถานะเปิดโมดัล + สินค้าที่จะถูกแก้ไข
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // // [โหลดสินค้าเมื่อเข้าหน้า] ยิงครั้งเดียวตอน status ยัง 'idle'
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchProducts());
        }
    }, [status, dispatch]);

    // ********** Logic สำหรับการจัดการสินค้า **********

    // [handleEdit] กด "แก้ไข" → เซ็ตสินค้าที่เลือก + เปิดโมดัล
    const handleEdit = (product: Product) => {
        setSelectedProduct(product); // กำหนดสินค้าที่จะแก้ไข
        setIsModalOpen(true); // เปิด Modal
    };

    // [handleCreate] กด "เพิ่มรองเท้าใหม่" → โหมดสร้าง (selected=null) + เปิดโมดัล
    const handleCreate = () => {
        setSelectedProduct(null); // กำหนดเป็น null เพื่อเข้าสู่โหมดสร้าง
        setIsModalOpen(true); // เปิด Modal
    };

    // [handleDelete] กด "ลบ" → ยืนยันก่อน แล้วค่อยยิงลบ
    const handleDelete = (id: string) => {
        if (window.confirm('คุณแน่ใจที่จะลบสินค้านี้หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้')) {
            dispatch(deleteProduct(id));
        }
    };

    // การแสดงผล 

    return (
        <div className="p-4">
            
            <h1 className="text-3xl font-bold mb-6 text-primary-green">
                ⚙️ จัดการสินค้า (Admin)
            </h1>
            <button
                onClick={handleCreate}
                className="bg-primary-green text-white px-4 py-2 rounded-lg hover:bg-green-600 mb-6 transition"
            >
                + เพิ่มรองเท้าใหม่
            </button>

            {/* ตารางแสดงสินค้า */}
            <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อสินค้า</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ราคา</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สต็อก</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {status === 'loading' ? (
                            <tr><td colSpan={4} className="text-center py-4 text-gray-500">กำลังโหลด...</td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan={4} className="text-center py-4 text-gray-500">ยังไม่มีสินค้า</td></tr>
                        ) : (
                            products.map((product: Product) => (
                                <tr key={product._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-green-700">{product.price.toLocaleString()} THB</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{product.countInStock}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="text-indigo-600 hover:text-indigo-900 font-semibold"
                                        >
                                            แก้ไข
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="text-red-600 hover:text-red-900 font-semibold"
                                        >
                                            ลบ
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal สำหรับฟอร์มเพิ่ม/แก้ไขสินค้า */}
            <ProductFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                currentProduct={selectedProduct}
            />
        </div>
    );
};

export default AdminProducts;