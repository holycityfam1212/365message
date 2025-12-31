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

    // Generate card image using html2canvas

    const handleDownload = async () => {
        if (!cardRef.current) return;

        try {
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            console.log('[Download] Starting, isMobile:', isMobile);

            await document.fonts.ready;
            await new Promise(resolve => setTimeout(resolve, isMobile ? 800 : 300));

            const scale = isMobile ? 1.5 : 3;

            const canvas = await html2canvas(cardRef.current, {
                scale: scale,
                backgroundColor: '#FDFCF0',
                logging: false,
                useCORS: true,
                allowTaint: true,
            });

            console.log('[Download] Canvas created:', canvas.width, 'x', canvas.height);

            const imageUrl = canvas.toDataURL('image/jpeg', 0.92);

            if (isMobile) {
                // Mobile: Open image in new tab so user can long-press to save
                const newWindow = window.open();
                if (newWindow) {
                    newWindow.document.write(`
                        <html>
                            <head>
                                <title>2026 말씀 카드</title>
                                <style>
                                    body { 
                                        margin: 0; 
                                        display: flex; 
                                        justify-content: center; 
                                        align-items: center; 
                                        min-height: 100vh; 
                                        background: #f5f5f5;
                                    }
                                    img { 
                                        max-width: 100%; 
                                        height: auto; 
                                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                                    }
                                    .guide {
                                        position: fixed;
                                        top: 20px;
                                        left: 50%;
                                        transform: translateX(-50%);
                                        background: rgba(0,0,0,0.8);
                                        color: white;
                                        padding: 12px 24px;
                                        border-radius: 24px;
                                        font-size: 14px;
                                        z-index: 1000;
                                    }
                                </style>
                            </head>
                            <body>
                                <div class="guide">이미지를 길게 눌러서 갤러리에 저장하세요 📥</div>
                                <img src="${imageUrl}" alt="2026 말씀 카드" />
                            </body>
                        </html>
                    `);
                    console.log('[Download] Image opened in new tab');
                } else {
                    alert('팝업이 차단되었습니다. 팝업 허용 후 다시 시도해주세요.');
                }
            } else {
                // Desktop: Direct download
                const link = document.createElement('a');
                link.download = `2026_Gods_Message_${verse.theme}.jpg`;
                link.href = imageUrl;
                link.click();
                console.log('[Download] Download triggered');
            }
        } catch (err) {
            console.error("[Download] Failed:", err);
            alert(`이미지 생성 실패\n${err.message}\n\n스크린샷을 이용해주세요.`);
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

        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        // Mobile: Simplified approach
        if (isMobile) {
            try {
                console.log('[Share] Mobile share attempt');

                await document.fonts.ready;
                await new Promise(resolve => setTimeout(resolve, 800));

                const canvas = await html2canvas(cardRef.current, {
                    scale: 1.5,
                    backgroundColor: '#FDFCF0',
                    logging: false,
                    useCORS: true,
                    allowTaint: true,
                });

                console.log('[Share] Canvas created');

                // Convert to blob
                const blob = await new Promise(resolve => {
                    canvas.toBlob(resolve, 'image/jpeg', 0.92);
                });

                if (!blob) {
                    throw new Error('Blob 생성 실패');
                }

                console.log('[Share] Blob created, size:', blob.size);

                const file = new File([blob], '2026_Gods_Message.jpg', { type: 'image/jpeg' });

                // Try native share
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: '2026 내게 주시는 하나님의 말씀'
                    });
                    console.log('[Share] Success');
                } else {
                    // Fallback: Download instead
                    console.log('[Share] Share API not available, using download');
                    handleDownload();
                }
            } catch (err) {
                console.error('[Share] Failed:', err);
                if (err.name !== 'AbortError') {
                    alert('공유 기능을 사용할 수 없습니다.\n저장 기능을 이용해주세요.');
                }
            }
        } else {
            // Desktop: Use link share
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
            {/* Fixed Background Layer - Full Screen */}
            <div
                className="fixed inset-0 z-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${themeStyle.bgImg})` }}
            />

            {/* Scrollable Content Layer */}
            <div className="relative z-50 w-full min-h-[100dvh] flex flex-col items-center justify-start p-4 sm:p-6 animate-fade-in">

                {/* Spacer */}
                <div className="h-8"></div>

                {/* Capture Container - includes background + card */}
                <div
                    ref={cardRef}
                    className="relative w-full max-w-[340px] aspect-[9/16] flex-shrink-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${themeStyle.bgImg})`,
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)',
                        backdropFilter: 'blur(8px)',
                        filter: 'brightness(1.02) contrast(1.05)',
                    }}
                >
                    {/* Card Area */}
                    <div
                        className="relative flex items-center justify-center w-full h-full"
                        style={{
                            opacity: 0.96,
                            filter: 'brightness(0.98) contrast(0.96)',
                        }}
                    >
                        {/* Card Frame Image - Using img tag for better html2canvas compatibility */}
                        <img
                            src={cardFrame}
                            alt="Card Frame"
                            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                            style={{ zIndex: 1 }}
                        />

                        {/* Subtle theme color overlay for harmony */}
                        <div
                            className="absolute inset-0 pointer-events-none mix-blend-overlay"
                            style={{
                                background: `linear-gradient(135deg, ${themeStyle.color}08, ${themeStyle.color}03)`,
                                zIndex: 2
                            }}
                        />

                        {/* Content Container */}
                        <div className="relative z-20 w-full h-full flex flex-col items-center justify-center px-12 pt-28 pb-20" style={{ zIndex: 3 }}>

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
                                        overflowWrap: 'break-word',
                                        textWrap: 'pretty'
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
                </div>

                {/* Bottom Action Buttons */}
                <div className="flex flex-col gap-3 mt-8 w-full max-w-[340px]">
                    <button
                        onClick={handleDownload}
                        className="w-full py-4 rounded-xl font-bold text-white transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] flex items-center justify-center gap-2"
                        style={{
                            backgroundColor: themeStyle.color,
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
                            backdropFilter: 'blur(8px)'
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        말씀 카드 저장하기
                    </button>

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={handleShare}
                            className="flex-1 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.02] flex items-center justify-center gap-2"
                            style={{
                                color: themeStyle.color,
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255, 255, 255, 0.5)',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)'
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                            </svg>
                            공유하기
                        </button>
                        <button
                            onClick={onRestart}
                            className="flex-1 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.02] flex items-center justify-center gap-2"
                            style={{
                                color: themeStyle.color,
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255, 255, 255, 0.5)',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)'
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                            다시 뽑기
                        </button>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-gray-300 text-xs font-light tracking-wide">
                        Developed by <span className="font-medium text-gray-400">@ppaulcasso</span>
                    </p>
                </div>

            </div>
        </>
    );
};

export default ResultCard;
