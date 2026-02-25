//คอมโพเนนต์ Modal ฟอร์มสินค้า เอาไว้ สร้างสินค้าใหม่ หรือ แก้ไขสินค้าเดิม
import React, { useState, useEffect } from 'react';
import type { Product } from '../types/product';
import { useAppDispatch } from '../app/hooks';
import { createProduct, updateProduct } from '../features/features/product/productSlice';
import { unwrapResult } from '@reduxjs/toolkit';

// [Props/โหมดการใช้งาน] isOpen, onClose, currentProduct
interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentProduct: Product | null; // หากมีค่า = โหมดแก้ไข, หากเป็น null = โหมดสร้าง
}

// [ค่าเริ่มต้นของฟอร์ม] เฉพาะ field ที่ใช้กรอก (ไม่รวม _id, imageUrl)
const initialFormData: Omit<Product, '_id' | 'imageUrl'> = {
    name: '',
    description: '',
    price: 0,
    countInStock: 0,
    brand: '',
    category: '',
};

// [อัปโหลดรูป] ส่งไฟล์ไป back-end ด้วย fetch(FormData) → ได้ imagePath กลับมา
const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('https://football-shop-api.onrender.com/api/upload/product-image', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'การอัปโหลดรูปภาพล้มเหลว');
    }

    const data = await response.json();
    return data.imagePath as string;
};

const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, currentProduct }) => {
    const dispatch = useAppDispatch();

    // [Component State] เก็บฟอร์ม/ไฟล์/สถานะส่ง/ข้อความ error
    const [formData, setFormData] = useState<Omit<Product, '_id' | 'imageUrl'>>(initialFormData);
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // State สำหรับไฟล์รูปภาพ
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ***[useEffect เปิด Modal] เติมค่าเดิมตอนแก้ไข หรือ reset ตอนสร้าง **********
    useEffect(() => {
        if (isOpen) {
            setError(null);
            setSelectedFile(null);

            if (currentProduct) {
                // โหมดแก้ไข: โหลดข้อมูลสินค้าปัจจุบันเข้าฟอร์ม
                const { _id, imageUrl, ...rest } = currentProduct;
                // ตั้งค่าฟอร์มด้วย rest (name, description, price, countInStock, brand, category)
                setFormData(rest);
            } else {
                // โหมดสร้าง: ใช้ข้อมูลเริ่มต้น
                setFormData(initialFormData);
            }
        }
    }, [isOpen, currentProduct]);

    // [handleChange] อัปเดตค่าฟอร์มตามชื่อช่องกรอก + แปลงตัวเลข
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        // จัดการ Type ของค่าให้ถูกต้อง
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'number' || name === 'price' || name === 'countInStock' ? parseFloat(value) : value,
        }));
    };

    // [handleFileChange] ผู้ใช้เลือก/ยกเลิกไฟล์
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
            setError(null);
        } else {
            setSelectedFile(null);
        }
    };

    // [handleSubmit] สเต็ปหลัก: อัปโหลดรูป (ถ้ามี) → รวม payload → dispatch (create/update)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            let finalImagePath: string | undefined;

            // // 1) รูปภาพ: ถ้าเลือกไฟล์ใหม่ → อัปโหลด, ถ้าแก้ไขแต่ไม่เลือกใหม่ → ใช้รูปเดิม, ถ้าสร้างไม่มีไฟล์ → error
            if (selectedFile) {
                // อัปโหลดไฟล์ใหม่
                finalImagePath = await uploadImage(selectedFile);
            } else if (currentProduct) {
                // โหมดแก้ไข: ถ้าไม่มีไฟล์ใหม่ ให้ใช้ imageUrl เดิม
                finalImagePath = currentProduct.imageUrl;
            } else {
                // โหมดสร้าง: และไม่มีไฟล์ถูกเลือก (บังคับให้ต้องมีรูปภาพ)
                throw new Error('กรุณาเพิ่มรูปภาพสินค้า');
            }

            // // 2) รวม payload ฟอร์ม + path รูป
            const productPayload = {
                ...formData,
                imageUrl: finalImagePath, // ใช้ finalImagePath เป็น imageUrl ใน Payload
            } as Product; // Cast เป็น Product Type

             // 3) dispatch thunk: แยกตามโหมดแก้ไข/สร้าง
            let resultAction;
            if (currentProduct) {
                // โหมดแก้ไข: ส่ง Product ทั้งหมดไป
                resultAction = await dispatch(updateProduct({ ...productPayload, _id: currentProduct._id }));
            } else {
                // โหมดสร้าง: ส่ง ProductPayload (ไม่มี _id) ไป
                resultAction = await dispatch(createProduct(productPayload));
            }

            unwrapResult(resultAction as any);
            onClose(); // ปิด Modal เมื่อสำเร็จ
        } catch (err) {
            console.error('Submit Error:', err);
            setError((err as Error).message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        } finally {
            setIsSubmitting(false);
        }
    };
     // [Render Modal] โครง UI: backdrop + กล่อง + ฟอร์ม + preview รูป + error + ปุ่ม
    if (!isOpen) return null;

    // ********** 5. โครงสร้าง Modal (JSX) **********
    const title = currentProduct ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่';
    const hasExistingImage = !!currentProduct?.imageUrl && !selectedFile;
    const isCreateMode = !currentProduct;

    return (
        // Backdrop
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
            {/* Modal Content */}
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">{title}</h3>

                <form onSubmit={handleSubmit}>

                    {/* 1. Name */}
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">ชื่อสินค้า</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* 2. Price */}
                    <div className="mb-4">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">ราคา</label>
                        <input
                            type="number"
                            name="price"
                            id="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            min="0.01"
                            step="0.01"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* 3. Count In Stock */}
                    <div className="mb-4">
                        <label htmlFor="countInStock" className="block text-sm font-medium text-gray-700">จำนวนในสต็อก</label>
                        <input
                            type="number"
                            name="countInStock"
                            id="countInStock"
                            value={formData.countInStock}
                            onChange={handleChange}
                            required
                            min="0"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* 4. Brand */}
                    <div className="mb-4">
                        <label htmlFor="brand" className="block text-sm font-medium text-gray-700">แบรนด์</label>
                        <input
                            type="text"
                            name="brand"
                            id="brand"
                            value={formData.brand || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* 5. Category */}
                    <div className="mb-4">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">หมวดหมู่</label>
                        <input
                            type="text"
                            name="category"
                            id="category"
                            value={formData.category || ''}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* 6. Description */}
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">คำอธิบาย</label>
                        <textarea
                            name="description"
                            id="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* 7. Image Upload Field */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700">รูปภาพสินค้า</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            // บังคับ Required เฉพาะโหมดสร้าง และยังไม่มีรูปภาพเดิม
                            required={isCreateMode && !hasExistingImage}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />

                        {(hasExistingImage || selectedFile) && (
                            <div className="mt-3">
                                <p className="text-xs text-gray-500 mb-2">
                                    {selectedFile ? `ไฟล์ใหม่ที่เลือก: ${selectedFile.name}` : 'รูปภาพปัจจุบัน'}
                                </p>
                                {hasExistingImage && !selectedFile && (
                                    <img
                                        src={`https://football-shop-api.onrender.com//${currentProduct!.imageUrl}`}
                                        alt="Product Preview"
                                        className="w-24 h-24 object-cover rounded-md border"
                                    />
                                )}
                            </div>
                        )}

                    </div>

                    {/* แสดง Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}


                    {/* ปุ่ม Submit และ Close */}
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                            disabled={isSubmitting}
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'กำลังบันทึก...' : currentProduct ? 'บันทึกการแก้ไข' : 'สร้างสินค้า'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductFormModal;