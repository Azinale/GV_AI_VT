import React from 'react';

const QR_API_BASE = 'https://api.qrserver.com/v1/create-qr-code/?size=420x420&data=';

export const QrPopup = ({ open, onClose, mentiUrl }) => {
  return (
    <div id="qrPopup" className={open ? 'show' : ''} onClick={onClose}>
      <div id="qrBox" onClick={e => e.stopPropagation()}>
        <div style={{display:'flex', flexDirection:'column', gap: 10}}>
            <strong>QR Khảo sát Mentimeter</strong>
            <span style={{fontSize: 14, color: 'var(--text-secondary)'}}>Nhấn vào mã để mở Mentimeter trong tab mới.</span>
        </div>
        <img src={`${QR_API_BASE}${encodeURIComponent(mentiUrl)}`} alt="QR" onClick={() => window.open(mentiUrl, '_blank')}/>
        <button onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
};

export const KahootPopup = ({ open, onClose, kahootUrl }) => {
  return (
    <div id="kahootPopup" style={{display: open ? 'flex' : 'none'}} onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
         <strong>QR Kahoot</strong>
         <span style={{fontSize: 14, color: 'var(--text-secondary)'}}>Nhấn vào mã để mở Kahoot trong tab mới.</span>
         <img src={`${QR_API_BASE}${encodeURIComponent(kahootUrl)}`} alt="QR" onClick={() => window.open(kahootUrl, '_blank')}/>
         <button onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
};

export const VideoPopup = ({ open, onClose, videoUrl }) => {
    if (!open || !videoUrl) return null;
    const getVideoId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };
    const videoId = getVideoId(videoUrl);
    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : videoUrl;
    return (
        <div id="kahootPopup" style={{display: 'flex'}} onClick={onClose}>
            <div className="modal-card video-modal" onClick={e => e.stopPropagation()}>
                <strong>Xem Video</strong>
                <div className="video-container">
                    <iframe width="100%" height="100%" src={embedUrl} title="YouTube" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>
                <button onClick={onClose}>Đóng</button>
            </div>
        </div>
    );
};