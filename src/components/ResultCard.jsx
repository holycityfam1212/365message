import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { supabase } from '../lib/supabase';

// Assets
import paperBg from '../assets/paper_bg.png';

const THEME_STYLES = {
    'blessing': { color: '#F59E0B', bg: 'bg-orange-50', label: '축복과 형통' },
    'comfort': { color: '#10B981', bg: 'bg-green-50', label: '위로와 평안' },
    'strength': { color: '#3B82F6', bg: 'bg-blue-50', label: '능력과 용기' },
    'wisdom': { color: '#8B5CF6', bg: 'bg-purple-50', label: '지혜와 인도' },
    'hope': { color: '#06B6D4', bg: 'bg-cyan-50', label: '소망과 미래' },
    'love': { color: '#EC4899', bg: 'bg-pink-50', label: '사랑과 섬김' },
    'faith': { color: '#6366F1', bg: 'bg-indigo-50', label: '믿음과 헌신' },
    'joy': { color: '#F59E0B', bg: 'bg-amber-50', label: '감사와 기쁨' },
    // Fallback
    'default': { color: '#9CA3AF', bg: 'bg-gray-50', label: '나의 말씀' }
};

const ResultCard = ({ verse, onRestart }) => {
    const cardRef = useRef(null);

    // Derived state instead of useEffect sync
    const themeStyle = (verse && verse.theme && THEME_STYLES[verse.theme])
        ? THEME_STYLES[verse.theme]
        : THEME_STYLES['default'];

    const handleDownload = async () => {
        if (cardRef.current) {
            try {
                const canvas = await html2canvas(cardRef.current, {
                    scale: 3, // Higher quality
                    backgroundColor: null,
                    logging: false,
                    useCORS: true,
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
        const url = window.location.href;

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

        const shareData = {
            title: '2026 내게 주시는 하나님의 말씀',
            text: `[${verse.reference}] ${verse.text}\n\n말씀 카드 확인하기:`,
            url: url
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Share canceled or failed:', err);
            }
        } else {
            // Fallback
            navigator.clipboard.writeText(url).then(() => {
                alert("링크가 복사되었습니다! 친구들과 말씀을 나누어보세요.");
            });
        }
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-[100dvh] w-full bg-gradient-to-br from-slate-800/60 via-purple-800/30 to-pink-800/30 backdrop-blur-md p-4 sm:p-6 animate-fade-in fixed inset-0 z-50 overflow-y-auto">

            {/* Action Buttons Top */}
            <div className="w-full max-w-[340px] flex justify-end mb-4">
                <button
                    onClick={onRestart}
                    className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-110 shadow-lg"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Card Area to capture */}
            <div
                ref={cardRef}
                className="relative flex items-center justify-center w-[340px] h-[540px] flex-shrink-0 shadow-2xl hover:shadow-3xl overflow-hidden transition-all duration-300"
                style={{
                    backgroundImage: 'url(/card-background.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="relative z-20 px-8 py-10 text-center flex flex-col items-center justify-center h-full w-full">

                    {/* Theme Badge */}
                    <div className="mb-4">
                        <h3 className="text-xs font-extrabold uppercase tracking-wider" style={{ color: themeStyle.color }}>
                            {themeStyle.label}
                        </h3>
                    </div>

                    {/* Main Verse */}
                    <div className="mb-4 w-full px-4">
                        <p className="text-xl font-semibold break-keep whitespace-pre-wrap leading-relaxed drop-shadow-sm" style={{ letterSpacing: '-0.08em', color: '#2D2D2D' }}>
                            {verse.text}
                        </p>
                    </div>

                    {/* Reference */}
                    <div>
                        <p className="text-base font-extrabold" style={{ color: themeStyle.color }}>
                            {verse.reference}
                        </p>
                    </div>

                    {/* Decorative corners */}
                    <div className="absolute top-5 left-5 w-8 h-8 border-t-2 border-l-2 rounded-tl-lg opacity-20" style={{ borderColor: themeStyle.color }}></div>
                    <div className="absolute top-5 right-5 w-8 h-8 border-t-2 border-r-2 rounded-tr-lg opacity-20" style={{ borderColor: themeStyle.color }}></div>
                    <div className="absolute bottom-5 left-5 w-8 h-8 border-b-2 border-l-2 rounded-bl-lg opacity-20" style={{ borderColor: themeStyle.color }}></div>
                    <div className="absolute bottom-5 right-5 w-8 h-8 border-b-2 border-r-2 rounded-br-lg opacity-20" style={{ borderColor: themeStyle.color }}></div>
                </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="flex flex-col gap-3 mt-6 w-full max-w-[340px]">
                <button
                    onClick={handleDownload}
                    className="w-full bg-gradient-to-r from-purple-400 to-pink-400 text-white py-4 rounded-2xl shadow-lg font-bold hover:shadow-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    말씀 카드 저장하기
                </button>

                <div className="flex gap-3 w-full">
                    <button
                        onClick={handleShare}
                        className="flex-1 bg-amber-300 hover:bg-amber-400 text-gray-800 py-4 rounded-2xl shadow-lg font-bold transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                        </svg>
                        공유하기
                    </button>
                    <button
                        onClick={onRestart}
                        className="flex-[0.4] bg-white/80 hover:bg-white/90 text-gray-600 py-4 rounded-2xl shadow-lg font-bold transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center border border-gray-200/50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="mt-6 text-center">
                <p className="text-white/50 text-xs mb-2">하루 한 번, 뽑은 말씀대로 살아보기</p>
                <p className="text-white/30 text-xs font-light">
                    Developed by <span className="font-medium text-white/40">@ppaulcasso</span>
                </p>
            </div>

        </div>
    );
};

export default ResultCard;
