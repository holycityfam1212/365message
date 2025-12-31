import React from 'react';
import { verses } from '../data/verses';
import cardFrame from '../assets/card_frame.png';

const THEME_STYLES = {
    'love': { color: '#881337', label: '사랑과 섬김' },
    'wisdom': { color: '#4C1D95', label: '지혜와 인도' },
    'faith': { color: '#4338CA', label: '믿음과 헌신' },
    'blessing': { color: '#78350F', label: '축복과 형통' },
    'joy': { color: '#78350F', label: '감사와 기쁨' },
    'hope': { color: '#134E4A', label: '소망과 미래' },
    'strength': { color: '#0F766E', label: '능력과 용기' },
    'comfort': { color: '#1E3A8A', label: '위로와 평안' },
    'default': { color: '#1F2937', label: '나의 말씀' }
};

const CardPreview = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8">
                    전체 말씀 카드 프리뷰 ({verses.length}개)
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {verses.map((verse) => {
                        const themeStyle = THEME_STYLES[verse.theme] || THEME_STYLES['default'];

                        return (
                            <div key={verse.id} className="flex flex-col items-center">
                                {/* Card Number */}
                                <div className="text-sm text-gray-500 mb-2">
                                    #{verse.id} - {verse.theme}
                                </div>

                                {/* Card */}
                                <div
                                    className="relative flex items-center justify-center w-full max-w-[200px] aspect-[9/16]"
                                    style={{
                                        opacity: 0.96,
                                        filter: 'brightness(0.98) contrast(0.96)',
                                        boxShadow: '0 0 30px -10px rgba(0,0,0,0.1)',
                                    }}
                                >
                                    {/* Card Frame Image */}
                                    <img
                                        src={cardFrame}
                                        alt="Card Frame"
                                        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                                        style={{ zIndex: 1 }}
                                    />

                                    {/* Content Container */}
                                    <div className="relative z-20 w-full h-full flex flex-col items-center justify-center px-6 pt-16 pb-12" style={{ zIndex: 3 }}>
                                        {/* Theme Badge */}
                                        <div className="mb-3">
                                            <h3 className="text-[6px] font-bold uppercase tracking-wide opacity-90" style={{ color: themeStyle.color, letterSpacing: '0.1em' }}>
                                                {themeStyle.label}
                                            </h3>
                                        </div>

                                        {/* Main Verse */}
                                        <div className="mb-3 w-full">
                                            <p
                                                className="font-medium break-keep whitespace-pre-wrap text-center text-[9px]"
                                                style={{
                                                    fontFamily: "'Noto Serif KR', serif",
                                                    letterSpacing: '-0.08em',
                                                    lineHeight: 1.4,
                                                    color: themeStyle.color,
                                                    wordBreak: 'keep-all',
                                                    overflowWrap: 'break-word',
                                                    textWrap: 'pretty'
                                                }}
                                            >
                                                {verse.text}
                                            </p>
                                        </div>

                                        {/* Reference */}
                                        <div>
                                            <p className="text-[7px] font-bold tracking-wide" style={{ color: themeStyle.color, opacity: 0.85 }}>
                                                {verse.reference}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CardPreview;
