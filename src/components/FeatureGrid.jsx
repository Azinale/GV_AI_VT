import React from 'react';

const FeatureGrid = () => {
  return (
    <section className="feature-grid reveal is-visible" aria-label="Các điểm nổi bật">
        <article className="feature-card">
          <span className="tag">Trình duyệt tài liệu</span>
          <h3>Điều khiển thống nhất</h3>
          <p>
            Kéo thả hay chọn tệp từ máy của bạn để phát video, đọc PDF/DOCX với
            tính năng phóng to theo tỷ lệ, hoặc duyệt từng slide PPTX – tất cả
            đều chạy trong một trình xem trực quan.
          </p>
        </article>
        
        <article className="feature-card">
          <span className="tag">Tài nguyên tức thì</span>
          <h3>Kho nội dung Viettel</h3>
          <p>
            Truy cập nhanh câu chuyện đào tạo Viettel, bảng khảo sát Mentimeter
            và sơ đồ tư duy NotebookLM để tăng tương tác với lớp học.
          </p>
        </article>
        
        <article className="feature-card">
          <span className="tag">Tương tác học viên</span>
          <h3>QR khảo sát & Kahoot</h3>
          <p>
            Sử dụng mã QR để thu thập ý kiến trực tiếp hoặc khởi động trò chơi
            Kahoot nhằm củng cố kiến thức theo cách thú vị và giàu kết nối.
          </p>
        </article>
        
        <article className="feature-card">
          <span className="tag">Trợ lý số</span>
          <h3>Giảng viên AI</h3>
          <p>
            Giảng viên AI tích hợp ngay trong phiên cho phép giới thiệu nội dung,
            hướng dẫn hoặc trả lời câu hỏi bằng giọng tiếng Việt tự nhiên.
          </p>
        </article>
    </section>
  );
};

export default FeatureGrid;