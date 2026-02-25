import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, CartState } from '../../../types/cart';
import type { Product } from '../../../types/product';

// [initialState] โครงสตรักเจอร์หลักของตะกร้า 
const initialState: CartState = {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
}; //เริ่มด้วยตะกร้าว่าง ๆ ไม่มีสินค้า ยอดชิ้น = 0 ยอดเงิน = 0

// [calculateTotals] ฟังก์ชันรวมชิ้น/รวมเงินใหม่ทุกครั้งที่แก้ตะกร้า
const calculateTotals = (items: CartItem[]): { totalQuantity: number, totalAmount: number } => {
    const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
    const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    return { totalQuantity, totalAmount };
};

// [createSlice] ประกาศ slice ชื่อ 'cart'
export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // เพิ่มสินค้า / เพิ่มจำนวน
        addCartItem: (state, action: PayloadAction<Product>) => {
            const newProduct = action.payload;
            const existingItem = state.items.find(item => item._id === newProduct._id);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                state.items.push({
                    ...newProduct,
                    quantity: 1,
                } as CartItem);
            }

            const { totalQuantity, totalAmount } = calculateTotals(state.items);
            state.totalQuantity = totalQuantity;
            state.totalAmount = totalAmount;
        },

        // Reducer 2) ลบรายการทั้งชิ้น
        removeCartItem: (state, action: PayloadAction<string>) => {
            const idToRemove = action.payload;
            state.items = state.items.filter(item => item._id !== idToRemove);

            const { totalQuantity, totalAmount } = calculateTotals(state.items);
            state.totalQuantity = totalQuantity;
            state.totalAmount = totalAmount;
        },

        //Reducer 3) ลดจำนวนทีละ 1 (เหลือ 0 ก็ลบทิ้ง)
        decreaseQuantity: (state, action: PayloadAction<string>) => {
            const idToDecrease = action.payload;
            const existingItem = state.items.find(item => item._id === idToDecrease);

            if (existingItem) {
                existingItem.quantity--;
                if (existingItem.quantity === 0) {
                    state.items = state.items.filter(item => item._id !== idToDecrease);
                }
            }

            const { totalQuantity, totalAmount } = calculateTotals(state.items);
            state.totalQuantity = totalQuantity;
            state.totalAmount = totalAmount;
        },

       //Reducer 4) ล้างตะกร้าทั้งหมด
        clearCart: (state) => {
            state.items = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
        },
    },
});

export const { addCartItem, removeCartItem, decreaseQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;

//ส่ง action creators ออกไปให้หน้า UI ใช้
//ส่ง reducer ออกไปให้ configureStore รวม