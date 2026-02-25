import React, { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReceiptPDF from '../components/ReceiptPDF'; // ไฟล์ที่เราเพิ่งสร้าง

// สร้าง Type สำหรับ Order ให้ TypeScript รู้จัก
interface Order {
    _id: string;
    userId: string;
    items: any[];
    totalAmount: number;
    slipImage: string;
    status: string;
    createdAt: string;
}

const AdminOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    // ดึงข้อมูล Order ทั้งหมดเมื่อโหลดหน้านี้
    const fetchOrders = async () => {
        try {
            // ⚠️ สังเกตตรง URL นี้ให้ดีครับ
            const res = await fetch('https://football-shop-api.onrender.com/api/orders');

            // ถ้า API แจ้ง Error เช่น 404 หรือ 500 ให้หยุดการทำงาน
            if (!res.ok) {
                throw new Error(`Server status: ${res.status}`);
            }

            const data = await res.json();

            // ตรวจสอบว่าข้อมูลที่ได้มาเป็น Array ก่อนนำไป setOrders
            if (Array.isArray(data)) {
                setOrders(data);
            } else {
                console.error('ข้อมูลที่ได้ไม่ใช่ Array:', data);
                setOrders([]); // กันพัง
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            // alert('ไม่สามารถดึงข้อมูลคำสั่งซื้อได้'); // ปิด alert ไว้ก่อนจะได้ไม่รำคาญ
            setOrders([]); // กันพัง
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // ฟังก์ชันสำหรับอัปเดตสถานะ (ยืนยันสลิป หรือ ยกเลิก)
    const handleUpdateStatus = async (orderId: string, newStatus: string) => {
        if (!window.confirm(`คุณแน่ใจหรือไม่ที่จะเปลี่ยนสถานะเป็น ${newStatus}?`)) return;

        try {
            const res = await fetch(`https://football-shop-api.onrender.com/api/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                alert('อัปเดตสถานะสำเร็จ!');
                // รีเฟรชข้อมูลในตารางใหม่
                fetchOrders();
            } else {
                alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (loading) return <div className="text-center p-8 text-xl">กำลังโหลดข้อมูล...</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">จัดการคำสั่งซื้อ (Orders)</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">รหัสออเดอร์</th>
                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">วันที่</th>
                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">ยอดรวม</th>
                            <th className="py-3 px-4 border-b text-center text-sm font-semibold text-gray-600">สลิปโอนเงิน</th>
                            <th className="py-3 px-4 border-b text-center text-sm font-semibold text-gray-600">สถานะ</th>
                            <th className="py-3 px-4 border-b text-center text-sm font-semibold text-gray-600">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-500">ไม่มีรายการสั่งซื้อ</td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 border-b text-sm font-mono">{order._id.substring(0, 8)}...</td>
                                    <td className="py-3 px-4 border-b text-sm">
                                        {new Date(order.createdAt).toLocaleDateString('th-TH')}
                                    </td>
                                    <td className="py-3 px-4 border-b text-sm text-blue-600 font-bold">
                                        ฿{order.totalAmount.toLocaleString()}
                                    </td>
                                    <td className="py-3 px-4 border-b text-center">
                                        {order.slipImage ? (
                                            <a
                                                // สร้าง URL ชี้ไปที่รูปภาพบน Backend (ServeStaticModule ที่เราทำไว้)
                                                href={`https://football-shop-api.onrender.com/${order.slipImage}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:text-blue-700 underline text-sm"
                                            >
                                                ดูสลิป
                                            </a>
                                        ) : (
                                            <span className="text-gray-400 text-sm">-</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 border-b text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 border-b text-center space-x-2">
                                        {order.status === 'PENDING_VERIFICATION' && (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateStatus(order._id, 'COMPLETED')}
                                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition"
                                                >
                                                    ยืนยัน
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(order._id, 'CANCELLED')}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                                                >
                                                    ยกเลิก
                                                </button>
                                            </>
                                        )}

                                        {/* ปุ่มดาวน์โหลด PDF จะโชว์ก็ต่อเมื่อสถานะเป็น COMPLETED เท่านั้น */}
                                        {order.status === 'COMPLETED' && (
                                            <PDFDownloadLink
                                                document={<ReceiptPDF order={order} />}
                                                fileName={`receipt-${order._id}.pdf`}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition inline-block"
                                            >
                                                {({ loading }) => (loading ? 'กำลังสร้าง PDF...' : 'โหลดใบเสร็จ')}
                                            </PDFDownloadLink>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrders;