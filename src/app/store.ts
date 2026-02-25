// src/app/store.ts ห้องเครื่อง Redux” ของโปรเจกต์ฝั่งเว็บ หน้าที่หลักๆ 
// -ประกอบ reducers ทั้งระบบ (สินค้ากับตะกร้า) แล้วสร้าง Redux Store กลางให้ทั้งแอปใช้ร่วมกัน
// -ส่งออก (export) ชนิดข้อมูล TypeScript 2 ตัว (RootState, AppDispatch) เพื่อให้ hooks ฝั่งเรา (useAppSelector, useAppDispatch) ใช้แบบ type-safe


import { configureStore } from '@reduxjs/toolkit';  // การ ดึงฟังก์ชันสร้าง Redux store แบบสูตรสำเร็จ จาก Redux Toolkit (RTK) มาใช้แทนที่จะประกอบเองหลายขั้นตอน
import productReducer from '../features/features/product/productSlice'; // ตรวจสอบชื่อ reducer
import cartReducer from '../features/features/cart/cartSlice'; // เพิ่ม cartReducer


//สร้าง Store กลาง และรวมทุก reducer เข้าไป
export const store = configureStore({
    reducer: {
        products: productReducer,
        cart: cartReducer,
    },
});

// ********** เพิ่ม Type Exports ตรงนี้ **********
// กำหนด Type ของ RootState จาก Store โดยอัตโนมัติ “หน้าตารวมของ state ทั้งระบบ” ที่ได้จาก store จริงๆ
export type RootState = ReturnType<typeof store.getState>;
// กำหนด Type ของ AppDispatch จาก Store AppDispatch = ชนิดของ dispatch ตัวจริงจาก store dispatch = คำสั่ง “ส่งแอ็กชันเข้าไปใน Redux store”
export type AppDispatch = typeof store.dispatch;


//store = โกดัง, action = ใบคำสั่ง, reducer = คนจัดของ, dispatch = การยื่นใบคำสั่งเข้าโกดัง
//ยื่นใบ (dispatch) ปุ๊บ คนจัดของ(reducer)ก็จัด state ใหม่ให้ แล้วหน้าจอรีเฟรชข้อมูลให้เรา