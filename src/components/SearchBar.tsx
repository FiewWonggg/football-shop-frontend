//เป็นคอมโพเนนต์ แถบค้นหา ที่พิมพ์คำแล้ว “ดีบาวน์” (หน่วงเวลา) ก่อนยิง onSearch(keyword) กลับไปให้พาเรนต์
// [Imports] เอา React hooks + type ของพร็อพที่จะใช้
import React, { useEffect, useMemo, useRef, useState } from 'react';

// [Props Type] กำหนดหน้าตาพร็อพที่คอมโพเนนต์นี้รับ
type SearchBarProps = {
    placeholder?: string;
    defaultValue?: string;
    delay?: number;                 // หน่วงเวลา debounce (ms)
    onSearch: (keyword: string) => void; // ยิงกลับไปให้หน้า parent
};

// [Component] ประกาศคอมโพเนนต์ + ตั้งค่า default ให้พร็อพบางตัว
const SearchBar: React.FC<SearchBarProps> = ({
    placeholder = 'ค้นหาชื่อสินค้า, แบรนด์ หรือหมวดหมู่…',
    defaultValue = '',
    delay = 300,
    onSearch,
}) => {
    // [State + Ref] เก็บค่าคำค้น + reference ช่อง input
    const [q, setQ] = useState(defaultValue);
    const inputRef = useRef<HTMLInputElement>(null);

    // โฟกัสด้วยคีย์ลัด Ctrl/⌘ + K
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const isMac = navigator.platform.toUpperCase().includes('MAC');
            const trigger = (isMac && e.metaKey && e.key.toLowerCase() === 'k') ||
                (!isMac && e.ctrlKey && e.key.toLowerCase() === 'k');
            if (trigger) {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    // [Debounce Effect] หน่วงเวลาตาม delay แล้วค่อยยิง onSearch
    useEffect(() => {
        const t = setTimeout(() => {
            onSearch(q.trim());
        }, delay);
        return () => clearTimeout(t);
    }, [q, delay, onSearch]);

    // [Submit Handler] กด Enter หรือปุ่ม "ค้นหา" → ยิง onSearch ทันที
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(q.trim());
    };

    // [Clear Button] เคลียร์ข้อความ + โฟกัสกลับที่ช่อง
    const clear = () => {
        setQ('');
        onSearch('');
        inputRef.current?.focus();
    };

    // [Render] โครงฟอร์ม + ไอคอน + ปุ่มล้าง + ปุ่มค้นหา
    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="relative group">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    {/* ไอคอนแว่นขยาย */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="7" strokeWidth="2"></circle>
                        <path d="M20 20l-3.5-3.5" strokeWidth="2"></path>
                    </svg>
                </span>

                <input
                    ref={inputRef}
                    type="text"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-24 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-white text-black placeholder-gray-500 caret-black"
                    aria-label="ค้นหาสินค้า"
                />


                {/* ปุ่มเคลียร์ */}
                {q && (
                    <button
                        type="button"
                        onClick={clear}
                        className="absolute right-20 inset-y-0 my-1 px-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                        aria-label="ล้างคำค้นหา"
                        title="ล้าง"
                    >
                        ✕
                    </button>
                )}

                {/* ปุ่มค้นหา */}
                <button
                    type="submit"
                    className="absolute right-2 inset-y-0 my-1 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                    aria-label="ค้นหา"
                    title="ค้นหา"
                >
                    ค้นหา
                </button>
            </div>
        </form>
    );
};

export default SearchBar;
