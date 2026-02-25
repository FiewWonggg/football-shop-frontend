import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store'; 

// ใช้คำสั่งนี้เพื่อหลีกเลี่ยงการพิมพ์ซ้ำ และให้ Type ถูกต้อง
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();