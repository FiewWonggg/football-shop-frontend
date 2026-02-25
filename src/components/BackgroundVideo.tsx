import React from 'react';

type Props = {
    poster?: string;      
    className?: string;   
};

const BackgroundVideo: React.FC<Props> = ({ poster = '/Antonyvideospin.MOV', className = '' }) => {
    return (
        <div className={`absolute inset-0 -z-10 ${className}`}>
            <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster={poster}
                className="w-full h-full object-cover"
                aria-hidden="true"
            >
                {/* เรียงลำดับชนิดไฟล์ที่เบราว์เซอร์ชอบมาก → น้อย */}
                <source src="/bg.webm" type="video/webm" />
                <source src="/bg.mp4" type="video/mp4" />
                <source src="/bg.mov" type="video/quicktime" />
                {/* ถ้าไม่มีไฟล์ที่รองรับ เบราว์เซอร์จะใช้ poster แทน */}
            </video>
            {/* ทำ overlay ให้ตัวหนังสืออ่านง่าย */}
            <div className="absolute inset-0 bg-black/40" />
        </div>
    );
};

export default BackgroundVideo;
