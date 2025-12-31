import React, { useState, useEffect, useRef } from 'react';
import { Analytics } from '@vercel/analytics/react';
import GachaMachine from './components/GachaMachine';
import ResultCard from './components/ResultCard';
import DataUploader from './components/DataUploader'; // Temp component
import AdminDashboard from './components/AdminDashboard';
import CardPreview from './components/CardPreview';
import { supabase } from './lib/supabase';

// Sound
import bgmSound from './assets/sounds/bgm.mp3';

function App() {
  const [stage, setStage] = useState('home'); // 'home', 'result'
  const [drawnVerse, setDrawnVerse] = useState(null);
  const audioRef = useRef(null);

  // Admin Checks
  const [isAdmin] = useState(window.location.search.includes('admin=true'));
  const [isDashboard] = useState(window.location.search.includes('admin=dashboard'));
  const [isPreview] = useState(window.location.search.includes('preview=true'));

  useEffect(() => {
    // Track Visit
    const trackVisit = async () => {
      await supabase.from('analytics_visits').insert([{
        user_agent: navigator.userAgent,
        referrer: document.referrer
      }]);
    };
    trackVisit();

    // Init BGM
    const audio = new Audio(bgmSound);
    audio.loop = true;
    audio.volume = 0.3; // Low volume for BGM
    audioRef.current = audio;

    const playAudio = () => {
      audio.play().catch(() => {
        console.log("Autoplay blocked, waiting for interaction");
      });
    };

    playAudio();

    // Fallback if blocked
    const handleInteraction = () => {
      if (audio.paused) {
        audio.play().catch(e => console.log(e));
      }
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const handleGachaFinish = (verse) => {
    setDrawnVerse(verse);
    setStage('result');
  };

  const handleRestart = () => {
    setStage('home');
    setDrawnVerse(null);
  };

  if (isPreview) return <CardPreview />;
  if (isDashboard) return <AdminDashboard />;

  return (
    <div className="w-full min-h-[100dvh] overflow-hidden">
      {/* Admin Data Tool */}
      {isAdmin && <DataUploader />}

      {stage === 'home' && (
        <div className="animate-fade-in">
          <GachaMachine onFinish={handleGachaFinish} />
        </div>
      )}

      {stage === 'result' && drawnVerse && (
        <div className="animate-fade-in">
          <ResultCard verse={drawnVerse} onRestart={handleRestart} />
        </div>
      )}

      {/* Debug Version Indicator - Hidden */}
      <div className="fixed bottom-1 right-1 text-[10px] text-gray-400 opacity-0 pointer-events-none z-50">
        v1.0.1 (Debug)
      </div>

      {/* Vercel Analytics */}
      <Analytics />
    </div>
  );
}

export default App;
