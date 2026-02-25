import React, { useEffect, useMemo, useState } from 'react';  //เอา hook React (useEffect/useMemo/useState) มาใช้ควบคุมชีวิตคอมโพเนนต์/แคชผลฟิลเตอร์
import { useAppSelector, useAppDispatch } from '../app/hooks';  // เวอร์ชันที่มี type แล้วของ Redux hooks
import { fetchProducts } from '../features/features/product/productSlice'; //thunk ที่ไปดึงสินค้าจากแบ็กเอนด์
import ProductCard from '../components/ProductCard'; //การ์ดแสดงสินค้า 1 ชิ้น
import type { Product } from '../types/product'; 

// มี กล่องค้นหา (SearchBar) เพื่อฟิลเตอร์สินค้าในฝั่งหน้าเว็บ (ไม่ยิง API) ดึง products/status/error จาก slice state.products
import SearchBar from '../components/SearchBar';

// [Component] ประกาศหน้า ProductList
const ProductList: React.FC = () => {
    const dispatch = useAppDispatch();
    const { products, status, error } = useAppSelector((state) => state.products);

    const [keyword, setKeyword] = useState('');

    //  [โหลดสินค้าครั้งแรก] ถ้า status ยัง 'idle' ค่อยยิง fetchProducts() กันยิงซ้ำ: จะโหลดเฉพาะตอนสถานะเริ่มต้น idle
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchProducts());
        }
    }, [status, dispatch]);

     // [ฟิลเตอร์รายการ] ใช้ useMemo แคชผลตาม products + keyword
    const filteredProducts = useMemo(() => {
        const k = keyword.trim().toLowerCase();
        if (!k) return products;
        return products.filter((p) =>
            (p.name ?? '').toLowerCase().includes(k) ||
            (p.brand ?? '').toLowerCase().includes(k) ||
            (p.category ?? '').toLowerCase().includes(k)
        );
    }, [products, keyword]);

    // ********** การแสดงผลตามสถานะ ****ถ้า กำลังโหลด → ข้อความกลางจอ  ถ้า ล้มเหลว → แจ้ง error นอกนั้นไปเรนเดอร์หน้าปกติ
    if (status === 'loading') {
        return <div className="text-center p-10 text-primary-green">กำลังโหลดสินค้า...</div>;
    }

    if (status === 'failed') {
        return <div className="text-center p-10 text-red-600">เกิดข้อผิดพลาดในการโหลด: {error}</div>;
    }

    //วาง <video> เต็มจอไว้ ด้านหลัง (-z-10) แล้วทับด้วย เลเยอร์ดำโปร่ง
    return (
        <div className="relative min-h-screen">
            {/* 🔥 วิดีโอพื้นหลัง */}
            <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full object-cover -z-10"
                // ถ้ามีไฟล์อื่นด้วย ใส่ <source> เพิ่มได้; ตอนนี้ใช้ .MOV ตามที่มึงมี
                src="/Antonyvideospin.MOV"
            />
            {/* ชั้นทับให้ตัวหนังสืออ่านง่าย */}
            <div className="absolute inset-0 -z-10 bg-black/40" />

            {/* เนื้อหา */}
            <div className="relative z-10 p-4 max-w-7xl mx-auto text-white">
                <h1 className="text-3xl font-bold mb-4 border-b-2 border-white/60 pb-2">
                    🛒 รองเท้าฟุตบอลทั้งหมด
                </h1>

                {/* ✅ แถบค้นหา */}
                <div className="mb-4">
                    <SearchBar
                        placeholder="ค้นหา: ชื่อสินค้า / แบรนด์ / หมวดหมู่…"
                        defaultValue=""
                        delay={300}
                        onSearch={setKeyword}
                    />
                </div>

                {/* ✅ สรุปผลค้นหา */}
                <div className="mb-4 text-sm text-white/90">
                    {keyword
                        ? <>พบ {filteredProducts.length} รายการ สำหรับคำว่า “{keyword}”</>
                        : <>พบทั้งหมด {products.length} รายการ</>}
                </div>

                {/* ✅ แสดงผลลัพธ์ / กรณีไม่เจอ */}
                {filteredProducts.length === 0 ? (
                    <div className="p-10 text-center text-white bg-black/30 rounded-xl border border-white/20">
                        ไม่พบสินค้าตามคำค้น “{keyword}”
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product: Product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductList;
