import React from 'react';
import { FolderOpen, QrCode, MessageCircle, MonitorPlay, FileText, MousePointer2 } from 'lucide-react';

const HeroSection = ({ onCtaViewer, onCtaQr, onCtaKahoot }) => {
  return (
    <header className="hero reveal is-visible" aria-labelledby="hero-title">
      <div className="hero__content glass-panel">
        <span className="hero__kicker">Viettel Academy</span>
        <h1 id="hero-title">Ứng trí tuệ nhân tạo trong hoạt động giảng dạy</h1>
        <p className="hero__description">
          Hệ trải nghiệm giúp giảng viên Viettel khai thác nội dung đào tạo đa
          phương tiện, kết hợp trình diễn slide, tài liệu DOCX/PDF và video,
          cùng Giảng viên AI tương tác thời gian thực.
        </p>
        <div className="hero__actions">
          <button className="btn btn--primary" onClick={onCtaViewer}>
            <FolderOpen size={18} style={{marginRight: '8px'}}/>
            Bắt đầu xem tài liệu
          </button>
          <button className="chip" onClick={onCtaQr}>
            <QrCode size={16} style={{marginRight: '6px'}}/>
            Quét QR khảo sát
          </button>
          <button className="chip" onClick={onCtaKahoot}>
            <MessageCircle size={16} style={{marginRight: '6px'}}/>
            Tham gia Kahoot
          </button>
        </div>
      </div>

      <div className="hero__media">
        <div className="hero__card">
          <div className="hero__card-header">
            <span className="hero__pill">Trải nghiệm giảng dạy số</span>
            
          </div>
          <h2>Không gian trình chiếu linh hoạt</h2>
          <MonitorPlay size={24} style={{color: '#fff'}} />
          <p>
            Tùy biến tệp bài giảng, quản lý trình chiếu và chia sẻ trải nghiệm
            cho học viên ngay trong một giao diện duy nhất. Mọi tài liệu đều
            được xử lý trực tiếp trên trình duyệt.
          </p>
          <div className="stat-cluster">
            <div className="stat">
              <strong>4+ định dạng</strong>
              <div className="stat-icon">
                <FileText size={20} />
              </div>
              <div>
                
                <span>Video · PDF · DOCX · PPTX</span>
              </div>
            </div>
            <div className="stat">
              <strong>Thao tác tức thì</strong>
              <div className="stat-icon">
                <MousePointer2 size={20} />
              </div>
              <div>
                
                <span>Phóng to, chuyển trang, mở rộng QR</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;