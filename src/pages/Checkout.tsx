import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react'; // ตัวสร้าง QR Code
import { useNavigate, useLocation } from 'react-router-dom';

const Checkout: React.FC = () => {
    const [promptpayPayload, setPromptpayPayload] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // ดึงข้อมูลที่ส่งมาจากหน้า Cart (ถ้าไม่มีให้เป็นค่าว่าง)
    const cartItems = location.state?.items || [];
    const totalAmount = location.state?.total || 0;

    // ดักจับ: ถ้าลูกค้าแอบพิมพ์ URL /checkout เข้ามาตรงๆ โดยไม่ได้ผ่านตะกร้า ให้เด้งกลับไปหน้าแรก
    useEffect(() => {
        if (cartItems.length === 0 || totalAmount === 0) {
            alert('ไม่พบข้อมูลคำสั่งซื้อ กรุณาทำรายการใหม่ครับ');
            navigate('/cart');
        }
    }, [cartItems, totalAmount, navigate]);

    // ดึง Payload ของ PromptPay จาก Backend ทันทีที่เข้าหน้านี้
    useEffect(() => {
        if (totalAmount > 0) {
            const fetchPromptPay = async () => {
                try {
                    const res = await fetch(`https://football-shop-api.onrender.com/api/orders/promptpay?amount=${totalAmount}`);
                    const data = await res.json();
                    setPromptpayPayload(data.payload);
                } catch (err) {
                    console.error('Failed to fetch PromptPay:', err);
                }
            };
            fetchPromptPay();
        }
    }, [totalAmount]);

    // ฟังก์ชันเมื่อกดปุ่ม "ยืนยันการสั่งซื้อ"
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            alert('กรุณาอัปโหลดสลิปโอนเงิน');
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. อัปโหลดรูปสลิปไปที่ Backend ก่อน
            const formData = new FormData();
            // ⚠️ คำว่า 'slip' ต้องตรงกับ FileInterceptor('slip') ใน backend นะครับ
            formData.append('slip', file);

            const uploadRes = await fetch('https://football-shop-api.onrender.com/api/upload/payment-slip', {
                method: 'POST',
                body: formData,
            });

            // ดักจับ: ถ้า API อัปโหลดแจ้ง Error กลับมา
            if (!uploadRes.ok) {
                const errorText = await uploadRes.text();
                console.error('Upload Error:', errorText);
                alert(`อัปโหลดสลิปไม่สำเร็จ (Status: ${uploadRes.status})`);
                setIsSubmitting(false);
                return; // หยุดการทำงาน ไม่ต้องไปสร้างออเดอร์
            }

            const uploadData = await uploadRes.json();
            console.log('ข้อมูลที่ได้หลังอัปโหลด:', uploadData); // 👈 พิมพ์ดูค่าใน Console

            // ดึงชื่อไฟล์ (รองรับทั้ง key ที่ชื่อ filename และ imagePath เผื่อไว้)
            const slipImageFilename = uploadData.filename || uploadData.imagePath;

            if (!slipImageFilename) {
                alert('ไม่พบชื่อไฟล์สลิปจากเซิร์ฟเวอร์ กรุณากด F12 ดู Console');
                setIsSubmitting(false);
                return;
            }

            // 2. ส่งข้อมูล Order ทั้งหมดไปบันทึก
            const orderData = {
                userId: '60d5f9b5b9b5f9b5b9b5f9b5', // ตัวอย่าง Mock ID
                items: cartItems,
                totalAmount,
                slipImage: slipImageFilename, // 👈 ถ้าจุดนี้มีค่า Database จะไม่ Error แล้วครับ
            };

            const orderRes = await fetch('https://football-shop-api.onrender.com/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            if (orderRes.ok) {
                alert('สั่งซื้อสำเร็จ! รอพนักงานตรวจสอบสลิป');
                navigate('/'); // กลับหน้าแรก
            } else {
                const errData = await orderRes.json();
                alert('บันทึกออเดอร์ไม่สำเร็จ: ' + errData.message);
            }
        } catch (err) {
            console.error(err);
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            <h2 className="text-2xl font-bold mb-6 border-b pb-4">ชำระเงิน (Checkout)</h2>

            <div className="flex flex-col md:flex-row gap-8">
                {/* ส่วนแสดง QR Code และยอดเงิน */}
                <div className="flex-1 text-center bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">สแกนเพื่อชำระเงิน</h3>
                    <div className="bg-white p-4 inline-block rounded-xl shadow-sm mb-4">
                        {promptpayPayload ? (
                            <QRCodeSVG value={promptpayPayload} size={200} />
                        ) : (
                            <p>กำลังโหลด QR Code...</p>
                        )}
                    </div>
                    <p className="text-gray-600">ยอดชำระทั้งหมด</p>
                    <p className="text-3xl font-bold text-blue-600 border-b-2 border-blue-200 pb-2 inline-block min-w-[150px]">
                        ฿{totalAmount.toLocaleString()}
                    </p>
                </div>

                {/* ส่วนฟอร์มอัปโหลดสลิป */}
                <div className="flex-1">
                    <form onSubmit={handleSubmit} className="flex flex-col h-full justify-between">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">แจ้งหลักฐานการโอนเงิน</h3>
                            <label className="block mb-2 text-sm font-medium text-gray-700">แนบสลิป (รูปภาพ)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border p-2 rounded-lg"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full mt-8 py-3 rounded-lg text-white font-bold text-lg ${isSubmitting ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600 shadow-lg transition-transform hover:-translate-y-1'}`}
                        >
                            {isSubmitting ? 'กำลังดำเนินการ...' : 'ยืนยันการชำระเงิน'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Checkout;