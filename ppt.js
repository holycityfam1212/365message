import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Flame, Users, Calendar, MessageCircle, Mic, Target, Zap, Award, Map, Dumbbell, Infinity, Briefcase, Rocket, Sparkles, HelpCircle, Lightbulb, CheckSquare, UserCircle } from 'lucide-react';

const Presentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 'cover',
      layout: 'center',
      content: (
        <div className="text-center space-y-6 animate-fade-in-up">
          <div className="flex justify-center mb-4">
            <span className="text-8xl filter drop-shadow-lg">🔥</span>
          </div>
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600 mb-4">
            글로벌미아들
          </h1>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white leading-relaxed">
            2025 겨울방학<br/>콘텐츠 챌린지 OT
          </h2>
          <p className="text-xl text-gray-500 mt-8">
            숭실대 글로벌미디어학부 | Facilitator 김바울
          </p>
        </div>
      )
    },
    {
      id: 'index',
      layout: 'split',
      title: "오늘의 순서 (Agenda)",
      content: (
        <div className="space-y-8">
          <div className="flex items-center p-6 bg-white rounded-xl shadow-md border-l-8 border-orange-500 hover:scale-105 transition-transform">
            <div className="bg-orange-100 p-4 rounded-full mr-6">
              <Flame size={32} className="text-orange-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">1. Why Now?</h3>
              <p className="text-gray-600">왜 지금, 우리가 움직여야 하는가</p>
            </div>
          </div>
          
          <div className="flex items-center p-6 bg-white rounded-xl shadow-md border-l-8 border-yellow-400 hover:scale-105 transition-transform">
            <div className="bg-yellow-100 p-4 rounded-full mr-6">
              <Users size={32} className="text-yellow-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">2. Our Mindset</h3>
              <p className="text-gray-600">수동적인 팔로워가 아닌, 능동적인 플레이어</p>
            </div>
          </div>

          <div className="flex items-center p-6 bg-white rounded-xl shadow-md border-l-8 border-blue-500 hover:scale-105 transition-transform">
             <div className="bg-blue-100 p-4 rounded-full mr-6">
              <Target size={32} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">3. Action Plan</h3>
              <p className="text-gray-600">8주 로드맵 & 이번 주 미션</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'era_change',
      layout: 'center',
      content: (
        <div className="text-center max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-gray-800 leading-tight">
            "평생 직장은 사라졌습니다.<br/>
            이제는 <span className="text-orange-600">개인의 시대</span>입니다."
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mt-12">
            
            {/* Old Era */}
            <div className="bg-gray-100 p-8 rounded-2xl w-full md:w-1/3 opacity-60 grayscale filter">
              <div className="flex justify-center mb-4">
                <Briefcase size={48} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Consumer</h3>
              <p className="text-lg">단순 소비자 / 회사원</p>
              <p className="text-sm mt-4 text-gray-500 leading-relaxed">
                "시키는 일만 잘하면<br/>안정적이었던 시대"
              </p>
            </div>

            <ChevronRight size={48} className="text-orange-500 hidden md:block" />

            {/* New Era */}
            <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-10 rounded-2xl w-full md:w-1/3 shadow-2xl transform scale-105">
              <div className="flex justify-center mb-4">
                <Rocket size={48} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Solopreneur</h3>
              <p className="text-lg font-semibold">1인 기업가 / 생산자</p>
              <p className="text-sm mt-4 opacity-90 leading-relaxed">
                "나만의 콘텐츠로<br/>스스로 가치를 증명하는 시대"
              </p>
            </div>
          </div>
          <p className="mt-16 text-2xl font-medium text-gray-700 leading-relaxed">
            이제 콘텐츠는 선택이 아닌 <span className="text-red-600 font-bold underline decoration-2 decoration-red-300 underline-offset-4">생존 도구</span>입니다.<br/>
            우리는 이 흐름에 올라타기 위해 모였습니다.
          </p>
        </div>
      )
    },
    {
      id: 'mindset',
      layout: 'standard',
      title: "💡 우리의 태도 (Mindset)",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 h-full">
           <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 shadow-lg">
             <div className="flex items-center gap-3 mb-6">
                <div className="bg-gray-200 p-3 rounded-full">
                  <Users size={24} className="text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">NOT a Class</h3>
             </div>
             <p className="text-xl text-gray-600 leading-loose">
               여기는 제가 가르치고,<br/>
               여러분이 배우는 수업이 아닙니다.<br/>
               <span className="font-bold text-gray-800">누군가 떠먹여 주길 바란다면<br/>얻어갈 수 있는 게 없습니다.</span>
             </p>
           </div>

           <div className="bg-white border-2 border-orange-200 rounded-2xl p-8 shadow-xl">
             <div className="flex items-center gap-3 mb-6">
                <div className="bg-orange-100 p-3 rounded-full">
                  <Sparkles size={24} className="text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">BUT a Crew</h3>
             </div>
             <ul className="space-y-4 text-lg text-gray-700">
               <li className="flex items-start gap-3">
                 <span className="text-orange-500 font-bold">✅</span>
                 <span>우리 모두가 <span className="font-bold bg-orange-100 px-1">적극적인 플레이어</span>입니다.</span>
               </li>
               <li className="flex items-start gap-3">
                 <span className="text-orange-500 font-bold">✅</span>
                 <span>좋은 아이디어나 질문이 있다면<br/>언제든 먼저 던져주세요.</span>
               </li>
               <li className="flex items-start gap-3">
                 <span className="text-orange-500 font-bold">✅</span>
                 <span>주체적으로 판을 만드는 크루를<br/>지향합니다.</span>
               </li>
             </ul>
           </div>
        </div>
      )
    },
    {
      id: 'members_stats',
      layout: 'standard',
      title: "함께할 멤버들 (Crew)",
      content: (
        <div className="grid grid-cols-2 gap-8 mt-4">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-500 mb-4 flex items-center gap-2">
               <Award size={20} /> 주요 관심 분야
            </h3>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full font-bold">YouTube/영상</span>
              <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-bold">AI 아트/기술</span>
              <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-bold">UX/UI 디자인</span>
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-bold">블로그/글쓰기</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
             <h3 className="text-xl font-bold text-gray-500 mb-4 flex items-center gap-2">
               <Target size={20} /> 기대되는 시너지
            </h3>
            <ul className="space-y-3 text-lg">
              <li className="flex items-center gap-2">
                ✅ <span className="font-bold">수익 창출</span>을 목표로 하는 실전파
              </li>
              <li className="flex items-center gap-2">
                ✅ <span className="font-bold">AI & Tech</span>를 접목하는 혁신파
              </li>
              <li className="flex items-center gap-2">
                ✅ <span className="font-bold">나만의 브랜드</span>를 쌓아가는 기록파
              </li>
            </ul>
          </div>

          <div className="col-span-2 bg-gray-50 p-6 rounded-xl border border-gray-200 text-center">
            <p className="text-xl text-gray-700 leading-relaxed">
              "혼자 하면 금방 지치지만,<br/> 
              <span className="font-bold text-orange-600">서로 자극을 주고받는 환경</span>에 있으면<br/>
              우리는 무조건 성장합니다."
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'ice_breaking',
      layout: 'center',
      content: (
        <div className="text-center">
          <div className="inline-block p-6 rounded-full bg-blue-100 mb-8 animate-bounce">
            <Mic size={48} className="text-blue-600" />
          </div>
          <h2 className="text-4xl font-bold mb-6 text-gray-800">Ice Breaking</h2>
          <div className="bg-white p-10 rounded-2xl shadow-xl max-w-2xl mx-auto border-2 border-blue-500">
            <h3 className="text-2xl font-bold mb-8 text-gray-600">자기소개 미션</h3>
            <p className="text-3xl font-black mb-4">"이름 + 목표 한 문장"</p>
            <div className="text-left bg-gray-100 p-6 rounded-lg mt-8">
              <p className="text-gray-500 text-sm mb-2">Example</p>
              <p className="text-xl leading-relaxed">
                "안녕하세요 <span className="font-bold text-blue-600">김바울</span>입니다.<br/>
                저는 이번 방학에 <span className="font-bold text-red-500">뉴스레터와 브랜딩 영상</span>을<br/>
                꾸준히 발행하는 게 목표입니다!"
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'rules',
      layout: 'standard',
      title: "🔥 우리의 약속 (Rules)",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 h-full">
          {/* Rule 1 */}
          <div className="bg-white border-2 border-red-500 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow relative overflow-hidden flex flex-col items-center text-center">
            <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 rounded-bl-lg font-bold text-sm">Essential</div>
            <div className="mb-4 mt-2">
              <Calendar size={48} className="text-red-500" />
            </div>
            <h3 className="text-xl font-bold mb-3 leading-tight">매주 1회 업로드</h3>
            <ul className="space-y-3 text-gray-700 text-sm w-full text-left">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold shrink-0">⏰</span> 
                <span>매주 <span className="font-bold underline text-red-600">일요일 자정</span> 마감</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold shrink-0">📄</span> 
                <span>노션 페이지에 자유롭게 기록</span>
              </li>
              <li className="text-xs text-gray-500 mt-2 bg-gray-100 p-2 rounded-lg leading-snug">
                * 과정, 실패 기록 무엇이든 OK!
              </li>
            </ul>
          </div>

          {/* Rule 2 */}
          <div className="bg-white border-2 border-blue-500 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow relative overflow-hidden flex flex-col items-center text-center">
            <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-lg font-bold text-sm">Growth</div>
            <div className="mb-4 mt-2">
              <MessageCircle size={48} className="text-blue-500" />
            </div>
            <h3 className="text-xl font-bold mb-3 leading-tight">찐 피드백</h3>
            <ul className="space-y-3 text-gray-700 text-sm w-full text-left">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">💬</span> 
                <span>매주 <span className="font-bold underline text-blue-600">최소 2명 이상</span> 댓글</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">🚫</span> 
                <span>영혼 없는 칭찬보다<br/>성장을 돕는 솔직한 의견</span>
              </li>
              <li className="text-xs text-gray-500 mt-2 bg-gray-100 p-2 rounded-lg leading-snug">
                "이 부분은 이렇게 고쳐보세요!"
              </li>
            </ul>
          </div>

          {/* Rule 3 - Bonus */}
          <div className="bg-white border-2 border-yellow-400 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow relative overflow-hidden flex flex-col items-center text-center">
            <div className="absolute top-0 right-0 bg-yellow-400 text-white px-3 py-1 rounded-bl-lg font-bold text-sm">Bonus</div>
            <div className="mb-4 mt-2">
              <Lightbulb size={48} className="text-yellow-500" />
            </div>
            <h3 className="text-xl font-bold mb-3 leading-tight">소통 & 자율 성장</h3>
            <ul className="space-y-3 text-gray-700 text-sm w-full text-left">
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 font-bold shrink-0">📢</span> 
                <span><span className="font-bold">꿀팁 공유:</span> 단톡방에<br/>AI 툴, 레퍼런스 공유 환영!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 font-bold shrink-0">🎲</span> 
                <span><span className="font-bold">자율 과제:</span> 가끔 던져드리는<br/>선택형 미션 (필수 아님)</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'roadmap',
      layout: 'standard',
      title: "📅 8주 로드맵 (Roadmap)",
      content: (
        <div className="bg-white p-8 rounded-2xl shadow-md mt-4">
          <div className="flex flex-col md:flex-row justify-between items-stretch gap-6">
            
            {/* Phase 1: January */}
            <div className="flex-1 bg-orange-50 border border-orange-200 rounded-xl p-6 hover:shadow-lg transition-all transform hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-500 text-white p-2 rounded-lg">
                  <Map size={24} />
                </div>
                <h4 className="text-xl font-bold text-gray-800">1월: 방향성 탐색</h4>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="font-semibold text-orange-700">Focus: Exploration</li>
                <li className="text-sm">🔹 나에게 맞는 주제 찾아보기</li>
                <li className="text-sm">🔹 다양한 포맷 시도해보기</li>
                <li className="text-sm bg-white p-2 rounded border border-orange-100 mt-2 leading-relaxed">
                  "실패해도 괜찮습니다.<br/>이것저것 건드려보는 시기"
                </li>
              </ul>
            </div>

            {/* Phase 2: February */}
            <div className="flex-1 bg-red-50 border border-red-200 rounded-xl p-6 hover:shadow-lg transition-all transform hover:-translate-y-1">
               <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-600 text-white p-2 rounded-lg">
                  <Dumbbell size={24} />
                </div>
                <h4 className="text-xl font-bold text-gray-800">2월: 콘텐츠 근육</h4>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="font-semibold text-red-700">Focus: Consistency</li>
                <li className="text-sm">🔹 정해진 요일에 무조건 업로드</li>
                <li className="text-sm">🔹 퀄리티보다 '완성'에 집중</li>
                <li className="text-sm bg-white p-2 rounded border border-red-100 mt-2 leading-relaxed">
                  "숨 쉬듯이 업로드하는<br/>습관 만들기"
                </li>
              </ul>
            </div>

             {/* Phase 3: Future */}
            <div className="flex-1 bg-blue-50 border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all transform hover:-translate-y-1 opacity-90">
               <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-600 text-white p-2 rounded-lg">
                  <Infinity size={24} />
                </div>
                <h4 className="text-xl font-bold text-gray-800">3월~: 지속 가능성</h4>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="font-semibold text-blue-700">Focus: Sustainability</li>
                <li className="text-sm">🔹 개강 후에도 멈추지 않음</li>
                <li className="text-sm">🔹 만들어진 근육으로 유지</li>
                <li className="text-sm bg-white p-2 rounded border border-blue-100 mt-2 leading-relaxed">
                  "결국 끝까지 남는 사람이<br/>브랜드가 됩니다"
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'mission_now',
      layout: 'center',
      content: (
        <div className="text-center w-full max-w-4xl">
          <div className="inline-block p-6 rounded-full bg-orange-100 mb-8">
            <CheckSquare size={48} className="text-orange-600" />
          </div>
          <h2 className="text-4xl font-bold mb-4 text-gray-800">이번 주 미션</h2>
          <p className="text-2xl text-gray-500 mb-12 italic">"나는 어떤 크리에이터가 될 것인가?"</p>
          
          <div className="bg-white p-10 rounded-3xl shadow-2xl border-2 border-orange-500 text-left space-y-8 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 opacity-10">
               <UserCircle size={200} className="text-orange-600" />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold flex items-center gap-3 mb-6">
                 <span className="bg-orange-500 text-white px-3 py-1 rounded-lg text-lg">Mission</span>
                 노션 프로필 & 운영 계획 작성
              </h3>
              
              <ul className="space-y-6 text-xl text-gray-700">
                <li className="flex items-start gap-4">
                  <span className="text-orange-500 font-bold shrink-0">1.</span>
                  <span><span className="font-bold underline underline-offset-4 decoration-orange-300">노션 프로필 섹션</span>을 정성껏 채워주세요.</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-orange-500 font-bold shrink-0">2.</span>
                  <span><span className="font-bold underline underline-offset-4 decoration-orange-300">채널 운영 계획</span>(주제, 타겟, 목표)을 구체화해보세요.</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-orange-500 font-bold shrink-0">3.</span>
                  <span>나의 콘텐츠를 보는 사람에게<br/> <span className="font-bold bg-yellow-100">어떤 가치</span>를 줄 것인지 고민하는 시간입니다.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'outro',
      layout: 'center',
      content: (
        <div className="text-center space-y-8 animate-fade-in">
          <div className="flex justify-center">
            <HelpCircle size={64} className="text-orange-500 animate-bounce" />
          </div>
          <h2 className="text-5xl font-extrabold text-gray-800">Q & A</h2>
          <p className="text-2xl text-gray-600 leading-relaxed">
            운영 방식이나 활동에 대해<br/>
            궁금한 점, 혹은 제안하고 싶은 아이디어가 있나요?
          </p>
          <div className="w-24 h-1 bg-orange-500 mx-auto my-8"></div>
          <p className="text-xl font-medium text-gray-500">
            글로벌미아들 2025 Winter<br/>
            Create Your Brand. Together.
          </p>
          <button 
            onClick={() => setCurrentSlide(0)}
            className="mt-12 px-6 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition"
          >
            처음으로 돌아가기
          </button>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(currentSlide + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const current = slides[currentSlide];

  return (
    <div className="w-full h-screen bg-gray-50 text-gray-900 overflow-hidden flex flex-col font-sans select-none">
      
      {/* Slide Content Area */}
      <div className="flex-1 relative flex items-center justify-center p-8 md:p-16">
        
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        {/* Slide Render */}
        <div className="z-10 w-full max-w-6xl h-full flex flex-col justify-center">
          {current.title && (
            <h2 className="text-4xl font-extrabold text-gray-800 mb-8 border-b-4 border-orange-500 inline-block pb-2 w-max leading-tight">
              {current.title}
            </h2>
          )}
          
          <div className={`w-full h-full flex ${current.layout === 'center' ? 'items-center justify-center' : 'items-start'}`}>
            {current.content}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="h-16 bg-white border-t border-gray-200 flex items-center justify-between px-6 z-20 shadow-md">
        <div className="text-gray-400 font-bold text-sm">
          {currentSlide + 1} / {slides.length}
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`p-2 rounded-full transition ${currentSlide === 0 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className={`p-2 rounded-full transition ${currentSlide === slides.length - 1 ? 'text-gray-300' : 'text-orange-600 hover:bg-orange-50'}`}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Presentation;