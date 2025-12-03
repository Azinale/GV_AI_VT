import React, { useState, useEffect, useRef } from 'react';
import { FolderOpen, BookOpen, ChevronUp, ChevronDown, Link as LinkIcon } from 'lucide-react';

const UtilityPanel = ({
  visible,
  onTogglePanel,
  onBrowse,
  onOpenPdf1,
  onOpenPdf2,
  onOpenQr,
  onOpenKahoot,
  onScrollToVideos,
}) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const submenuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (submenuRef.current && !submenuRef.current.contains(e.target)) {
        setSubmenuOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return (
    <>
      <div
        className="utility-panel"
        style={{ display: visible ? 'flex' : 'none' }}
        id="utilityPanel"
        aria-label="Lối tắt tài liệu"
      >
        <button className="btn btn--primary" onClick={onBrowse}>
          <FolderOpen size={16} style={{marginRight: 8}}/> Trình duyệt tệp
        </button>
        <div style={{ position: 'relative' }} ref={submenuRef}>
          <button className="btn" onClick={() => setSubmenuOpen(!submenuOpen)} style={{width: '100%', justifyContent: 'space-between'}}>
            <span style={{display: 'flex', alignItems:'center', gap: 8}}><BookOpen size={16}/> Tài liệu lớp</span>
            {submenuOpen ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
          </button>
          
          {submenuOpen && (
            <div className="submenu" style={{display: 'flex'}}>
                <button className="btn" onClick={onOpenPdf1}>
                📄 Câu chuyện đào tạo
                </button>
                <button className="btn" onClick={() => { if (onOpenPdf2) onOpenPdf2(); }}>
                📘 Tài liệu 5 Bước
                </button>
                <button className="btn" onClick={onOpenQr}>
                📱 QR Mentimeter
                </button>
                <a
                className="btn"
                href="https://notebooklm.google.com/notebook/7ec70b3b-cedf-4ace-882b-1b2cf6f70b03"
                target="_blank"
                rel="noopener noreferrer"
                >
                <LinkIcon size={14} style={{marginRight: 6}}/> Mindmap đào tạo
                </a>
                <button className="btn" onClick={onScrollToVideos}>
                🎥 Video đào tạo
                </button>
                <button className="btn" onClick={onOpenKahoot}>
                🧩 QR Kahoot
                </button>
            </div>
          )}
        </div>
      </div>

      <button
        className="btn btn--toggle-panel"
        onClick={onTogglePanel}
      >
        {visible ? '▼ Ẩn bảng tùy chọn' : '▲ Hiện bảng tùy chọn'}
      </button>
    </>
  );
};

export default UtilityPanel;