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
    const [cardImageUrl, setCardImageUrl] = useState(null);
    const [isGeneratingImage, setIsGeneratingImage] = useState(true);

    // Derived state
    const themeStyle = (verse && verse.theme && THEME_STYLES[verse.theme])
        ? THEME_STYLES[verse.theme]
        : THEME_STYLES['default'];

    // Auto-generate card image on mount
    useEffect(() => {
        const generateImage = async () => {
            if (!cardRef.current) return;

            setIsGeneratingImage(true);
            try {
                // Wait for fonts and images to be ready
                await document.fonts.ready;
                await new Promise(resolve => setTimeout(resolve, 500));

                // Use scale 3 for better performance while maintaining quality (340px × 3 = 1020px)
                const canvas = await html2canvas(cardRef.current, {
                    scale: 3,
                    backgroundColor: null,
                    logging: false,
                    useCORS: true,
                    allowTaint: true,
                    scrollY: -window.scrollY,
                    scrollX: -window.scrollX,
                    windowWidth: document.documentElement.scrollWidth,
                    windowHeight: document.documentElement.scrollHeight,
                });

                // Convert to PNG
                const imageUrl = canvas.toDataURL('image/png', 1.0);
                setCardImageUrl(imageUrl);
            } catch (err) {
                console.error("Failed to generate card image", err);
            } finally {
                setIsGeneratingImage(false);
            }
        };

        generateImage();
    }, [verse]);



    return (
        <>
            {/* Fixed Background Layer */}
            <div
                className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${themeStyle.bgImg})`,
                    width: '100%',
                    minHeight: '100%',
                    backgroundSize: 'cover',
                    backgroundAttachment: 'fixed'
                }}
            />

            {/* Scrollable Content Layer */}
            <div className="relative z-50 w-full min-h-[100dvh] flex flex-col items-center justify-start p-4 sm:p-6 animate-fade-in">

                {/* Spacer */}
                <div className="h-8"></div>

                {/* Card Display - Hidden during generation, used only for html2canvas */}
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
                        position: cardImageUrl ? 'absolute' : 'relative',
                        visibility: cardImageUrl ? 'hidden' : 'visible',
                        zIndex: cardImageUrl ? -1 : 'auto'
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

                {/* Generated Card Image Display */}
                {cardImageUrl && (
                    <div className="w-full max-w-[340px] flex flex-col items-center">
                        <img
                            src={cardImageUrl}
                            alt="말씀 카드"
                            className="w-full h-auto rounded-xl shadow-2xl"
                            style={{
                                maxWidth: '340px',
                                userSelect: 'auto',
                                WebkitUserSelect: 'auto'
                            }}
                        />
                    </div>
                )}

                {/* Loading State */}
                {isGeneratingImage && (
                    <div className="w-full max-w-[340px] aspect-[9/16] flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-xl">
                        <svg className="animate-spin w-12 h-12 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{ color: themeStyle.color }}>
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-sm font-medium" style={{ color: themeStyle.color }}>카드 생성 중...</p>
                    </div>
                )}

                {/* Instructions and Restart Button */}
                <div className="flex flex-col gap-4 mt-8 w-full max-w-[340px] items-center">
                    {/* Instruction Text */}
                    {!isGeneratingImage && cardImageUrl && (
                        <div className="text-center px-4 py-3 bg-white/70 backdrop-blur-sm rounded-full border border-white/50 shadow-sm">
                            <p className="text-sm font-medium" style={{ color: themeStyle.color }}>
                                📱 카드를 꾹 눌러 저장하세요
                            </p>
                        </div>
                    )}

                    {/* Restart Button */}
                    <button
                        onClick={onRestart}
                        className="py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.02] flex items-center justify-center gap-2"
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

                <div className="mt-6 text-center" style={{ userSelect: 'none' }}>
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
