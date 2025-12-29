import React, { useState, useEffect, useRef } from 'react';
import GachaMachine from './components/GachaMachine';
import ResultCard from './components/ResultCard';
import DataUploader from './components/DataUploader'; // Temp component
import AdminDashboard from './components/AdminDashboard';
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

  if (isDashboard) return <AdminDashboard />;

  return (
    <div className="w-full min-h-screen bg-message-ivory overflow-hidden">
      {/* Admin Data Tool */}
      {isAdmin && <DataUploader />}

      {stage === 'home' && (
        <GachaMachine onFinish={handleGachaFinish} />
      )}

      {stage === 'result' && drawnVerse && (
        <ResultCard verse={drawnVerse} onRestart={handleRestart} />
      )}
    </div>
  );
}

export default App;
