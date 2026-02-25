import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

import fontSarabun from '../assets/Sarabun-Regular.ttf';

// 👇 2. นำตัวแปรที่ Import มาใส่ใน src
Font.register({
  family: 'Sarabun',
  src: fontSarabun, 
});

// กำหนดสไตล์ของ PDF (เขียนคล้ายๆ CSS flexbox)
const styles = StyleSheet.create({
  page: { 
    padding: 40, 
    fontFamily: 'Sarabun', // เรียกใช้ฟอนต์ที่ลงทะเบียนไว้
    fontSize: 12 
  },
  header: { 
    fontSize: 24, 
    textAlign: 'center', 
    marginBottom: 20, 
    fontWeight: 'bold' 
  },
  shopName: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 8 
  },
  table: { 
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingVertical: 8,
  },
  tableRow: { 
    flexDirection: 'row', 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee', 
    paddingVertical: 8 
  },
  colName: { width: '60%' },
  colQty: { width: '15%', textAlign: 'center' },
  colPrice: { width: '25%', textAlign: 'right' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: '#000',
  },
  totalText: {
    fontSize: 16,
  }
});

// รับข้อมูล order เข้ามาเพื่อวาดลง PDF
const ReceiptPDF = ({ order }: { order: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>ใบเสร็จรับเงิน / E-Receipt</Text>
      <Text style={styles.shopName}>Football Shop</Text>

      <View style={styles.row}>
        <Text>รหัสคำสั่งซื้อ: {order._id}</Text>
        <Text>วันที่: {new Date(order.createdAt).toLocaleDateString('th-TH')}</Text>
      </View>
      <View style={styles.row}>
        <Text>สถานะ: ชำระเงินเรียบร้อยแล้ว</Text>
      </View>

      {/* ตารางสินค้า */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.colName}>รายการสินค้า</Text>
          <Text style={styles.colQty}>จำนวน</Text>
          <Text style={styles.colPrice}>ราคา</Text>
        </View>

        {/* สมมติว่า order.items เป็น Array ถ้าไม่มีก็ใช้อันว่างๆ แทน */}
        {(order.items || []).map((item: any, index: number) => (
          <View style={styles.tableRow} key={index}>
            {/* ปรับให้ตรงกับชื่อฟิลด์สินค้าที่คุณใช้จริง (เช่น item.name) */}
            <Text style={styles.colName}>{item.name || 'สินค้า'}</Text>
            <Text style={styles.colQty}>{item.quantity || 1}</Text>
            <Text style={styles.colPrice}>฿{((item.price || 0) * (item.quantity || 1)).toLocaleString()}</Text>
          </View>
        ))}
      </View>

      {/* ยอดรวม */}
      <View style={styles.totalRow}>
        <Text style={styles.totalText}>
          ยอดรวมทั้งสิ้น: ฿{order.totalAmount.toLocaleString()}
        </Text>
      </View>

    </Page>
  </Document>
);

export default ReceiptPDF;