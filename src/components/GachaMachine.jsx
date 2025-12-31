import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getRandomVerse } from '../data/verses';
import { supabase } from '../lib/supabase';

// Assets
import machineImg from '../assets/gacha_machine.png';
import handleImg from '../assets/handle.png';
import coinImg from '../assets/coin.png';
import capsuleImg from '../assets/capsule.png';
import logoImg from '../assets/logo.png';
import gachaBg from '../assets/gacha_bg.png';

// Sounds
import coinSound from '../assets/sounds/coin.mp3';
import crankSound from '../assets/sounds/crank.mp3';
import dropSound from '../assets/sounds/drop.mp3';
import openSound from '../assets/sounds/open.mp3';

const GachaMachine = ({ onFinish }) => {
    // 리렌더링 없는 상태 관리를 위해 useRef 사용
    const isDraggingRef = useRef(false);

    const [hasCoin, setHasCoin] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);
    const [capsuleDropped, setCapsuleDropped] = useState(false);

    const coinRef = useRef(null);
    const dropZoneRef = useRef(null);
    const dragStartPosRef = useRef({ offsetX: 0, offsetY: 0, startLeft: 0, startTop: 0 });

    // Audio Helpers
    const playSound = (src, volume = 0.5) => {
        try {
            const audio = new Audio(src);
            audio.volume = volume;
            audio.play().catch(e => console.log("Audio play failed", e));
        } catch (e) {
            console.error(e);
        }
    };

    const handleSpin = () => {
        if (isSpinning) return;
        setIsSpinning(true);

        // 핸들이 돌아가는 기계음
        playSound(crankSound, 0.5);

        // Stop spinning after 1.5s and drop capsule
        setTimeout(() => {
            setIsSpinning(false);
            setCapsuleDropped(true);

            // 캡슐이 떨어지는 소리
            playSound(dropSound, 0.6);
        }, 1500);
    };

    const handleDragStart = useCallback((e) => {
        if (hasCoin || isSpinning || capsuleDropped) return;

        // 중요: 드래그 시작 시 리렌더링을 유발하지 않음
        isDraggingRef.current = true;

        // 터치 이벤트 스크롤 방지
        if (e.cancelable) e.preventDefault();

        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

        const rect = coinRef.current.getBoundingClientRect();

        dragStartPosRef.current = {
            offsetX: clientX - rect.left,
            offsetY: clientY - rect.top,
            startLeft: rect.left,
            startTop: rect.top
        };

        if (coinRef.current) {
            // 드래그 중에는 애니메이션(transition)을 꺼야 즉각적으로 따라옵니다.
            coinRef.current.style.transition = 'none';

            coinRef.current.style.willChange = 'transform';
            coinRef.current.style.position = 'fixed';
            coinRef.current.style.left = `${rect.left}px`;
            coinRef.current.style.top = `${rect.top}px`;
            coinRef.current.style.bottom = 'auto';
            // GPU 가속 활성화 및 초기화
            coinRef.current.style.transform = 'translate3d(0, 0, 0) scale(1.05)';
            coinRef.current.style.zIndex = '100';
            coinRef.current.style.cursor = 'grabbing';
        }
    }, [hasCoin, isSpinning, capsuleDropped]);

    const handleDragMove = useCallback((e) => {
        if (!isDraggingRef.current) return;

        if (e.cancelable) e.preventDefault();

        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

        if (coinRef.current) {
            // requestAnimationFrame을 사용하여 프레임 드랍 방지 (선택적 최적화)
            // 여기서는 직접 할당이 반응성이 더 좋을 수 있음
            const deltaX = clientX - dragStartPosRef.current.offsetX - dragStartPosRef.current.startLeft;
            const deltaY = clientY - dragStartPosRef.current.offsetY - dragStartPosRef.current.startTop;

            // translate3d로 하드웨어 가속 강제
            coinRef.current.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(1.05)`;
        }
    }, []);

    const handleDragEnd = useCallback((e) => {
        if (!isDraggingRef.current) return;
        isDraggingRef.current = false;

        const clientX = e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientX;
        const clientY = e.type === 'touchend' ? e.changedTouches[0].clientY : e.clientY;

        const dropRect = dropZoneRef.current.getBoundingClientRect();

        if (
            clientX >= dropRect.left &&
            clientX <= dropRect.right &&
            clientY >= dropRect.top &&
            clientY <= dropRect.bottom
        ) {
            // Success Drop
            setHasCoin(true);
            playSound(coinSound, 0.6);

            if (coinRef.current) {
                coinRef.current.style.transition = 'all 0.5s ease-out';
                coinRef.current.style.opacity = '0';
                coinRef.current.style.transform = 'translate3d(-50%, -50%, 0) scale(0.5)';
                coinRef.current.style.willChange = 'auto';
                coinRef.current.style.cursor = 'grab';
            }

            setTimeout(() => {
                handleSpin();
            }, 800);
        } else {
            // Revert Coin
            if (coinRef.current) {
                // 드래그가 끝나고 제자리로 돌아갈 때만 다시 애니메이션을 켭니다.
                coinRef.current.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

                coinRef.current.style.position = 'absolute';
                coinRef.current.style.left = '50%';
                coinRef.current.style.top = 'auto';
                coinRef.current.style.bottom = '-80px';
                coinRef.current.style.transform = 'translate3d(-50%, 0, 0) scale(1)';
                coinRef.current.style.zIndex = '30';
                coinRef.current.style.willChange = 'auto';
                coinRef.current.style.cursor = 'grab';
            }
        }
    }, []);

    // Attach global listeners
    useEffect(() => {
        // 비수동적(non-passive) 리스너로 설정하여 preventDefault() 호출 가능하게 함
        const options = { passive: false };

        window.addEventListener('mousemove', handleDragMove, options);
        window.addEventListener('mouseup', handleDragEnd);
        window.addEventListener('touchmove', handleDragMove, options);
        window.addEventListener('touchend', handleDragEnd);

        return () => {
            window.removeEventListener('mousemove', handleDragMove);
            window.removeEventListener('mouseup', handleDragEnd);
            window.removeEventListener('touchmove', handleDragMove);
            window.removeEventListener('touchend', handleDragEnd);
        };
    }, [handleDragMove, handleDragEnd]);

    // Pick a random verse
    const drawVerse = () => {
        return getRandomVerse();
    };

    // handleSpin moved up.

    const handleCapsuleClick = async () => {
        if (!capsuleDropped) return;

        // 캡슐이 열리며 말씀이 등장하는 소리
        playSound(openSound, 0.6);

        // Open result
        const verse = drawVerse();

        // 말씀 뽑기 추적 (Analytics)
        try {
            await supabase.from('analytics_actions').insert([{
                action_type: 'DRAW',
                verse_id: verse.id,
                theme: verse.theme
            }]);
        } catch (err) {
            console.error("Analytics tracking failed:", err);
        }

        onFinish(verse);
    };

    return (
        <>
            {/* Fixed Background Layer */}
            <div
                className="fixed inset-0 z-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${gachaBg})` }}
            />

            {/* Scrollable Content Layer */}
            <div className="w-full min-h-[100dvh] flex flex-col items-center justify-between py-8 relative overflow-hidden z-10">

                {/* Floating Decorations */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Stars */}
                    <div className="absolute top-[10%] left-[15%] w-3 h-3 bg-yellow-200/40 rounded-full blur-sm animate-sparkle" />
                    <div className="absolute top-[25%] right-[20%] w-2 h-2 bg-pink-300/30 rounded-full blur-sm animate-sparkle" style={{ animationDelay: '1s' }} />
                    <div className="absolute bottom-[20%] left-[30%] w-2.5 h-2.5 bg-purple-300/35 rounded-full blur-sm animate-sparkle" style={{ animationDelay: '2s' }} />

                    {/* Sparkles */}
                    <div className="absolute top-[40%] left-[25%] w-4 h-4 bg-purple-300/20 rounded-full blur-md animate-float" style={{ animationDelay: '0.5s' }} />
                    <div className="absolute top-[60%] right-[30%] w-3 h-3 bg-pink-200/25 rounded-full blur-md animate-float" style={{ animationDelay: '1.5s' }} />

                    {/* Orbs */}
                    <div className="absolute bottom-[30%] right-[15%] w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/10 rounded-full blur-3xl animate-float" />
                    <div className="absolute top-[15%] left-[10%] w-24 h-24 bg-gradient-to-br from-pink-200/15 to-purple-100/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
                </div>

                {/* Header / Logo Area */}
                <div className="text-center z-10 transition-all duration-700 flex-shrink-0"
                    style={{
                        opacity: isSpinning || capsuleDropped ? 0 : 1,
                        transform: isSpinning || capsuleDropped ? 'translateY(-10px)' : 'translateY(0)'
                    }}>
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-3 tracking-tight">
                        2026
                    </h1>
                    <p className="text-xl text-gray-600 font-semibold mb-1">내게 주시는 하나님의 말씀</p>
                    <p className="text-sm text-gray-400 mt-2 font-light">말씀대로 살아내는 한 해</p>
                    <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full shadow-sm border border-purple-100/50">
                        <span className="w-2 h-2 bg-purple-300 rounded-full animate-pulse"></span>
                        <p className="text-xs text-gray-500 font medium">동전을 드래그해서 넣어보세요</p>
                    </div>
                </div>

                {/* Logo */}
                <div className="absolute top-6 right-6 z-10 opacity-70 hover:opacity-100 transition-opacity">
                    <img src={logoImg} alt="Today's Message Logo" className="w-12 h-auto drop-shadow-sm" />
                </div>

                {/* Machine Container - Width constrained */}
                <div className="relative w-[320px] flex flex-col items-center flex-shrink-0 mt-4 mb-28">

                    {/* Drop Zone (Full Machine Area, Invisible) */}
                    <div
                        ref={dropZoneRef}
                        className="absolute inset-0 z-20"
                    >
                    </div>

                    {/* Machine Body Image */}
                    <div className="relative">
                        <img
                            src={machineImg}
                            alt="Gacha Machine"
                            className={`w-full h-auto block relative z-10 transition-all duration-300 drop-shadow-2xl ${isSpinning ? 'animate-shake' : ''}`}
                        />
                        {/* Subtle glow effect when ready */}
                        {!hasCoin && !isSpinning && !capsuleDropped && (
                            <div className="absolute inset-0 -z-10 blur-2xl bg-gradient-to-b from-purple-200/20 via-pink-200/20 to-transparent rounded-full opacity-60"></div>
                        )}
                    </div>

                    {/* Handle - Positioned relative to the image container */}
                    <div className="absolute left-[48%] top-[62%] -translate-x-1/2 -translate-y-1/2 w-[110px] h-[110px] z-20 pointer-events-none">
                        <img
                            src={handleImg}
                            alt="Handle"
                            className={`w-full h-full object-contain transition-transform duration-[1500ms] ease-in-out origin-center drop-shadow-lg ${isSpinning ? 'rotate-[720deg]' : ''}`}
                        />
                    </div>

                    {/* Coin Button (Draggable) */}
                    {!hasCoin && !isSpinning && !capsuleDropped && (
                        <div
                            ref={coinRef}
                            className="absolute z-30 cursor-grab active:cursor-grabbing hover:scale-110 hover:-translate-y-1 transition-all duration-200"
                            style={{ bottom: '-80px', left: '50%', transform: 'translateX(-50%)', touchAction: 'none' }}
                            onMouseDown={handleDragStart}
                            onTouchStart={handleDragStart}
                        >
                            <div className="relative">
                                <img src={coinImg} alt="Coin" className="w-20 h-20 drop-shadow-xl relative z-10" draggable="false" />
                                <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/30 to-amber-200/30 rounded-full blur-md"></div>
                            </div>
                        </div>
                    )}

                    {/* Dropped Capsule */}
                    {capsuleDropped && (
                        <div
                            className="absolute bottom-[2%] left-1/2 -translate-x-1/2 z-30 cursor-pointer animate-drop group"
                            onClick={handleCapsuleClick}
                        >
                            <div className="relative">
                                <img src={capsuleImg} alt="Capsule" className="w-24 h-24 drop-shadow-2xl group-hover:scale-110 transition-all duration-300" />
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-lg group-hover:blur-xl transition-all"></div>
                            </div>
                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-purple-300 to-pink-300 text-white rounded-full text-xs font-semibold whitespace-nowrap animate-bounce shadow-md">
                                클릭해서 열어보세요 ✨
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Text */}
                <div className="text-center z-10 flex-shrink-0">
                    <p className="text-gray-300 text-xs font-light tracking-wide">
                        Developed by <span className="font-medium text-gray-400">@ppaulcasso</span>
                    </p>
                </div>

            </div>
        </>
    );
};

export default GachaMachine;
