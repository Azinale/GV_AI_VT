import React, { useState } from 'react';

// Import các component con hiện có
import HeroSection from './components/HeroSection';
import ExperienceSection from './components/ExperienceSection';
import FeatureGrid from './components/FeatureGrid';
import ResourceSections from './components/ResourceSections';
import UtilityPanel from './components/UtilityPanel';
import Viewer from './components/Viewer';
import { QrPopup, KahootPopup, VideoPopup } from './components/Popups';

// --- NEW: Import Component Giảng viên AI ---
import HeyGenAvatar from './components/HeyGenAvatar'; 

// ✅ Import ảnh background cho TRANG BÌA
import bgImage from './assets/Background.pptx.jpg';
import pdf5 from './assets/5-Buoc-Hoc-Tap-Cung-Giao-Su-AI.pdf';
import pdf4 from './assets/cauchuyen.pdf';

// --- CONSTANTS ---
const MENTI_URL =
  'https://www.mentimeter.com/app/presentation/alxqjyg6fuwnbo5h46nefkdgyf9hkrhd/edit?source=share-modal';
const KAHOOT_URL =
  'https://play.kahoot.it/v2/lobby?quizId=60676ca2-73a1-4fdf-957c-3be40aace1fb';

export default function App() {
  // --- STATE MANAGEMENT ---
  const [showQr, setShowQr] = useState(false);
  const [showKahoot, setShowKahoot] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [panelVisible, setPanelVisible] = useState(true);
  const [activeFile, setActiveFile] = useState(null);

  // --- HANDLERS ---
  const handleBrowse = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.mp4,.mov,.webm,.pdf,.docx,.pptx';
    input.onchange = (e) => {
      if (e.target.files && e.target.files[0]) {
        setActiveFile(e.target.files[0]);
      }
    };
    input.click();
  };

  const handleOpenPdf = (fileName) => {
    // If it's the bundled 5-step document, open it in Viewer
    if (fileName==='5-Buoc-Hoc-Tap-Cung-Giao-Su-AI.pdf') {
      setActiveFile(pdf5);
      return;
    }
    if(fileName ==='cauchuyen.pdf'){
      setActiveFile(pdf4);
      return;
    }

    // alert(
    //   `Đang mở file mẫu: ${fileName}\n(Lưu ý: Để tính năng này hoạt động, bạn cần có file thực tế trong thư mục public của dự án Vite)`
    // );
    // setActiveFile(`/public/${fileName}`); 
  };

  const scrollToVideos = () => {
    const el = document.querySelector('section[aria-label="Video Đào Tạo"]');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

    return (
    <>
      {/* 1. TRANG BÌA full màn hình, không bị padding của main */}
      <section
        className="fullscreen-cover"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* 2. Phần nội dung còn lại */}
      <main className="app-container">
        <HeroSection 
          onCtaViewer={handleBrowse}
          onCtaQr={() => setShowQr(true)}
          onCtaKahoot={() => setShowKahoot(true)}
        />

        <ExperienceSection />
        <FeatureGrid />

        <ResourceSections 
          onOpenPdf={() => handleOpenPdf('cauchuyen.pdf')}
          onOpenQr={() => setShowQr(true)}
          onOpenKahoot={() => setShowKahoot(true)}
          onOpenVideo={(url) => setVideoUrl(url)}
        />

        <UtilityPanel 
          visible={panelVisible}
          onTogglePanel={() => setPanelVisible(!panelVisible)}
          onBrowse={handleBrowse}
          onOpenPdf1={() => handleOpenPdf('cauchuyen.pdf')}
          onOpenPdf2={() => handleOpenPdf('5-Buoc-Hoc-Tap-Cung-Giao-Su-AI.pdf')}
          onOpenQr={() => setShowQr(true)}
          onOpenKahoot={() => setShowKahoot(true)}
          onScrollToVideos={scrollToVideos}
        />
      </main>

      {/* Viewer & Popups & HeyGen để ngoài main cũng được */}
      <Viewer 
        activeFile={activeFile} 
        onClose={() => setActiveFile(null)}
      />

      <QrPopup 
        open={showQr} 
        onClose={() => setShowQr(false)} 
        mentiUrl={MENTI_URL} 
      />
      
      <KahootPopup 
        open={showKahoot} 
        onClose={() => setShowKahoot(false)} 
        kahootUrl={KAHOOT_URL} 
      />
      
      <VideoPopup 
        open={!!videoUrl} 
        onClose={() => setVideoUrl(null)} 
        videoUrl={videoUrl} 
      />

      <HeyGenAvatar />
    </>
  );
}
