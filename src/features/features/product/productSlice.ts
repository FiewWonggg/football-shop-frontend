import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store'; 
import type { Product } from '../../../types/product';
import axios from 'axios';

const API_URL = '/api/products';

//  [State Type + initialState] โครง state สำหรับ products
interface ProductState {
    products: Product[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ProductState = {
    products: [],
    status: 'idle',
    error: null,
};

// ---------------------------------------------
// ********** ASYNC THUNKS (CRUD OPERATIONS) **********
// ---------------------------------------------

// ** Type ที่ส่งเข้า Thunk (Payload) **
// Omit<_id> เพราะ _id จะถูกสร้างโดย MongoDB/Backend
type ProductPayload = Omit<Product, '_id'>;

// ********** 3. A. Thunk สำหรับ READ (ดึงสินค้าทั้งหมด) **********
export const fetchProducts = createAsyncThunk<Product[], void>(
    'products/fetchProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get<Product[]>(API_URL);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage =
                    (error.response?.data as { message?: string })?.message || error.message;
                return rejectWithValue(errorMessage);
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);

// [READ one] ดึงสินค้าทีละชิ้นตาม id
export const fetchProductById = createAsyncThunk<Product, string>(
    'products/fetchProductById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get<Product>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage =
                    (error.response?.data as { message?: string })?.message || error.message;
                return rejectWithValue(errorMessage);
            }
            return rejectWithValue('Failed to fetch product by id');
        }
    }
);

// [CREATE] สร้างสินค้าใหม่ สำเร็จแล้ว reducer จะ push ของใหม่เข้าลิสต์ให้เอง
export const createProduct = createAsyncThunk<Product, ProductPayload>(
    'products/createProduct',
    async (newProductData, { rejectWithValue }) => {
        try {
            const response = await axios.post<Product>(API_URL, newProductData);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage =
                    (error.response?.data as { message?: string })?.message || error.message;
                return rejectWithValue(errorMessage);
            }
            return rejectWithValue('Failed to create product');
        }
    }
);

// Thunk [UPDATE] อัปเดตสินค้า สำเร็จแล้ว reducer จะ replace ตัวเก่าตาม _id
export const updateProduct = createAsyncThunk<Product, Product>(
    'products/updateProduct',
    async (updatedProduct, { rejectWithValue }) => {
        try {
            const response = await axios.put<Product>(
                `${API_URL}/${updatedProduct._id}`,
                updatedProduct
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage =
                    (error.response?.data as { message?: string })?.message || error.message;
                return rejectWithValue(errorMessage);
            }
            return rejectWithValue('Failed to update product');
        }
    }
);

// Thunk [DELETE] ลบสินค้า
export const deleteProduct = createAsyncThunk<string, string>(
    'products/deleteProduct',
    async (productId, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/${productId}`);
            return productId;
        } catch (error) {
            return rejectWithValue('Failed to delete product');
        }
    }
);


// Slice SLICE + EXTRA REDUCERS (อัปเดต state ตามผลของ thunks)

export const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        // Reducer สำหรับตั้งค่าสถานะ (ถ้าต้องการใช้แบบ synchronous) - ตอนนี้ยังไม่ใช้
    },
    extraReducers: (builder) => {
        builder
             // [READ all]
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(
                fetchProducts.fulfilled,
                (state, action: PayloadAction<Product[]>) => {
                    state.status = 'succeeded';
                    state.products = action.payload;
                    state.error = null;
                }
            )
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // [READ one]
            .addCase(fetchProductById.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(
                fetchProductById.fulfilled,
                (state, action: PayloadAction<Product>) => {
                    state.status = 'succeeded';
                    state.error = null;
                    const idx = state.products.findIndex(
                        (p) => p._id === action.payload._id
                    );
                    if (idx >= 0) {
                        state.products[idx] = action.payload; // อัปเดตตัวเดิม
                    } else {
                        state.products.push(action.payload); // เพิ่มใหม่ถ้ายังไม่มี
                    }
                }
            )
            .addCase(fetchProductById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // ********** CREATE **********
            .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
                state.products.push(action.payload);
            })

            // ********** UPDATE **********
            .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
                const index = state.products.findIndex(
                    (p) => p._id === action.payload._id
                );
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })

            // ********** DELETE **********
            .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
                state.products = state.products.filter((p) => p._id !== action.payload);
            });
    },
});

// SELECTORS (ดึงข้อมูลจาก store ไปใช้ที่หน้า)

export const selectAllProducts = (state: RootState) => state.products.products;
export const selectProductsStatus = (state: RootState) => state.products.status;
export const selectProductsError = (state: RootState) => state.products.error;

// ✅ Selector หา product ทีละตัว
export const selectProductById = (state: RootState, id: string | undefined) =>
    id ? state.products.products.find((p) => p._id === id) : undefined;

export default productSlice.reducer;
