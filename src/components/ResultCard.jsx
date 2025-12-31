import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { supabase } from '../lib/supabase';

// Assets
import bg1 from '../assets/theme_bgs/bg_1.png'; // Pale Pink -> Love
import bg2 from '../assets/theme_bgs/bg_2.png'; // Lavender -> Wisdom/Faith
import bg3 from '../assets/theme_bgs/bg_3.png'; // Warm Yellow -> Blessing/Joy
import bg4 from '../assets/theme_bgs/bg_4.png'; // Soft Mint -> Hope/Strength
import bg5 from '../assets/theme_bgs/bg_5.png'; // Dusty Blue -> Comfort/Default
import cardFrame from '../assets/card_frame.png';

const THEME_STYLES = {
    // 0: Pinkish -> Love (Deep Rose Text)
    'love': { color: '#881337', bg: 'bg-pink-50', label: '사랑과 섬김', bgImg: bg1 },

    // 1: Purple/Lavender -> Wisdom, Faith (Deep Violet Text)
    'wisdom': { color: '#4C1D95', bg: 'bg-purple-50', label: '지혜와 인도', bgImg: bg2 },
    'faith': { color: '#4338CA', bg: 'bg-indigo-50', label: '믿음과 헌신', bgImg: bg2 },

    // 2: Yellow/Cream -> Blessing, Joy (Deep Brown/Amber Text)
    'blessing': { color: '#78350F', bg: 'bg-orange-50', label: '축복과 형통', bgImg: bg3 },
    'joy': { color: '#78350F', bg: 'bg-amber-50', label: '감사와 기쁨', bgImg: bg3 },

    // 3: Green/Mint -> Hope, Strength (Deep Teal Text)
    'hope': { color: '#134E4A', bg: 'bg-cyan-50', label: '소망과 미래', bgImg: bg4 },
    'strength': { color: '#0F766E', bg: 'bg-blue-50', label: '능력과 용기', bgImg: bg4 },

    // 4: Blue -> Comfort (Deep Navy/Slate Text)
    'comfort': { color: '#1E3A8A', bg: 'bg-green-50', label: '위로와 평안', bgImg: bg5 },

    // Fallback
    'default': { color: '#1F2937', bg: 'bg-gray-50', label: '나의 말씀', bgImg: bg5 }
};

const ResultCard = ({ verse, onRestart }) => {
    const cardRef = useRef(null);

    // Derived state
    const themeStyle = (verse && verse.theme && THEME_STYLES[verse.theme])
        ? THEME_STYLES[verse.theme]
        : THEME_STYLES['default'];

    const handleDownload = async () => {
        if (cardRef.current) {
            try {
                const canvas = await html2canvas(cardRef.current, {
                    scale: 5, // Higher quality for sharp images
                    backgroundColor: null,
                    logging: false,
                    useCORS: true,
                    pixelRatio: window.devicePixelRatio,
                });
                const link = document.createElement('a');
                link.download = `2026_Gods_Message_${verse.theme}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            } catch (err) {
                console.error("Failed to capture image", err);
                alert("이미지 저장에 실패했습니다.");
            }
        }
    };

    const handleShare = async () => {
        // Track Share
        try {
            await supabase.from('analytics_actions').insert([{
                action_type: 'SHARE',
                verse_id: verse.id,
                theme: verse.theme
            }]);
        } catch (err) {
            console.error("Tracking Failed", err);
        }

        if (!cardRef.current) return;

        try {
            const canvas = await html2canvas(cardRef.current, {
                scale: 5,
                backgroundColor: null,
                logging: false,
                useCORS: true,
                pixelRatio: window.devicePixelRatio,
            });

            canvas.toBlob(async (blob) => {
                if (!blob) return;

                const file = new File([blob], `2026_Gods_Message_${verse.theme}.png`, { type: 'image/png' });
                const shareData = {
                    files: [file],
                    title: '2026 내게 주시는 하나님의 말씀',
                };

                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share(shareData);
                    } catch (err) {
                        if (err.name !== 'AbortError') {
                            console.log('Error sharing file:', err);
                            shareLink(); // Fallback
                        }
                    }
                } else {
                    shareLink(); // Fallback
                }
            }, 'image/png');

        } catch (err) {
            console.error("Share generation failed", err);
            shareLink();
        }
    };

    const shareLink = async () => {
        const url = window.location.href;
        const shareData = {
            title: '2026 내게 주시는 하나님의 말씀',
            text: `[${verse.reference}] ${verse.text}\n\n말씀 카드 확인하기:`,
            url: url
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Link share canceled or failed:', err);
            }
        } else {
            navigator.clipboard.writeText(url).then(() => {
                alert("링크가 복사되었습니다! 친구들과 말씀을 나누어보세요.");
            });
        }
    };

    return (
        <>
            {/* Fixed Background Layer */}
            <div
                className="fixed inset-0 z-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${themeStyle.bgImg})` }}
            />

            {/* Scrollable Content Layer */}
            <div className="relative z-50 w-full min-h-[100dvh] flex flex-col items-center justify-start p-4 sm:p-6 animate-fade-in">

                {/* Spacer */}
                <div className="h-8"></div>

                {/* Card Area to capture */}
                <div
                    ref={cardRef}
                    className="relative flex items-center justify-center w-full max-w-[340px] aspect-[9/16] flex-shrink-0 bg-contain bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url(${cardFrame})`,
                        opacity: 0.96,
                        filter: 'brightness(0.98) contrast(0.96)',
                        boxShadow: '0 0 60px -15px rgba(0,0,0,0.08)',
                        border: '0.5px solid rgba(255,255,255,0.08)'
                    }}
                >
                    {/* Subtle theme color overlay for harmony */}
                    <div
                        className="absolute inset-0 pointer-events-none mix-blend-overlay"
                        style={{
                            background: `linear-gradient(135deg, ${themeStyle.color}08, ${themeStyle.color}03)`
                        }}
                    />

                    {/* Content Container */}
                    <div className="relative z-20 w-full h-full flex flex-col items-center justify-center px-12 pt-28 pb-20">

                        {/* Theme Badge */}
                        <div className="mb-6">
                            <h3 className="text-[11px] font-bold uppercase tracking-wide opacity-90" style={{ color: themeStyle.color, letterSpacing: '0.1em' }}>
                                {themeStyle.label}
                            </h3>
                        </div>

                        {/* Main Verse */}
                        <div className="mb-6 w-full">
                            <p
                                className="font-medium break-keep whitespace-pre-wrap text-center"
                                style={{
                                    fontFamily: "'Noto Serif KR', serif",
                                    letterSpacing: '-0.08em',
                                    lineHeight: 1.5,
                                    color: themeStyle.color,
                                    wordBreak: 'keep-all',
                                    overflowWrap: 'break-word'
                                }}
                            >
                                {verse.text}
                            </p>
                        </div>

                        {/* Reference */}
                        <div>
                            <p className="text-sm font-bold tracking-wide" style={{ color: themeStyle.color, opacity: 0.85 }}>
                                {verse.reference}
                            </p>
                        </div>

                    </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="flex flex-col gap-3 mt-8 w-full max-w-[340px]">
                    <button
                        onClick={handleDownload}
                        className="w-full py-4 rounded-xl shadow-md font-bold text-white transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                        style={{ backgroundColor: themeStyle.color }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        말씀 카드 저장하기
                    </button>

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={handleShare}
                            className="flex-1 py-4 rounded-xl shadow-sm font-semibold transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 bg-white/60 backdrop-blur-sm border border-white/40 hover:bg-white/80"
                            style={{ color: themeStyle.color }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                            </svg>
                            공유하기
                        </button>
                        <button
                            onClick={onRestart}
                            className="flex-1 py-4 rounded-xl shadow-sm font-semibold transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 bg-white/60 backdrop-blur-sm border border-white/40 hover:bg-white/80"
                            style={{ color: themeStyle.color }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                            다시 뽑기
                        </button>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-xs mb-2">하루 한 번, 뽑은 말씀대로 살아보기</p>
                    <p className="text-gray-400 text-xs font-light">
                        Developed by <span className="font-medium text-gray-500">@ppaulcasso</span>
                    </p>
                </div>

            </div>
        </>
    );
};

export default ResultCard;
