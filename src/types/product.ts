export interface Product {
    _id: string; // ID จาก MongoDB
    name: string;
    description: string;
    price: number;
    countInStock: number;
    imageUrl: string; 
    brand?: string;     
    category?: string; 
}

//สัญญาโครงข้อมูลสินค้า ของฝั่ง TypeScript (Frontend) บอกให้ทั้งโปรเจกต์รู้ว่า “สินค้า 1 ชิ้นต้องหน้าตาแบบไหน” เวลาเอาไปใช้ใน Redux, หน้า UI, ฟอร์ม ฯลฯ จะได้ พิมพ์ถูก/เช็ค type ได้ และจับบั๊กง่ายขึ้น