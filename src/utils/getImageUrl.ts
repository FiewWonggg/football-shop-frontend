// src/utils/getImageUrl.ts
export const getImageUrl = (path?: string): string => {
  if (!path) return 'https://via.placeholder.com/400x300.png?text=No+Image';

  const clean = path.replace(/\\/g, '/'); // กัน \ ของวินโดวส์

  // ถ้าเป็น URL เต็มอยู่แล้ว
  if (/^https?:\/\//i.test(clean)) return clean;

  // กันกรณีมี/ไม่มีสแลชต้นทางให้เหลือแบบเดียว
  const base = 'https://football-shop-api.onrender.com'.replace(/\/+$/, '');
  const rel = clean.replace(/^\/+/, '');

  return `${base}/${rel}`;
};
