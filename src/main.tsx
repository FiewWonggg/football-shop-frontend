import React from 'react';
import ReactDOM from 'react-dom/client';
// Import CSS หลักเป็นบรรทัดแรกสุด
import './index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from './app/store.ts';
import axios from 'axios';

// [หา root element ใน index.html]
const rootElement = document.getElementById('root');

// ✅ บังคับให้ Axios ทุกตัวในโปรเจกต์ ยิงไปที่ Render เสมอ
axios.defaults.baseURL = 'https://football-shop-api.onrender.com';

// [สร้าง React Root แล้ว render แอป]
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      {/* Provider: ห่อหุ้ม App ด้วย Redux Store */}
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
} else {
  console.error("Failed to find the root element.");
}
