// ไว้ประกาศ TypeScript types ของฝั่งตะกร้าเท่านั้น (ไม่มี logic) เพื่อให้ทุกไฟล์ที่เกี่ยวกับ Cart
import type { Product } from '../types/product';
// [Import Product type] ดึงหน้าตาสินค้าต้นฉบับมาใช้ต่อ

// [CartItem] โครงรายการในตะกร้า = Product + quantity
export interface CartItem extends Product {
  quantity: number;
}

// [CartState] โครงสภาพรวมของตะกร้าบน Redux store
export interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number; // ผลรวมราคาทั้งหมด
}