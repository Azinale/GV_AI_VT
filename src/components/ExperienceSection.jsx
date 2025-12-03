import React from 'react';

const ExperienceSection = () => {
  return (
    <section className="experience reveal is-visible" aria-label="Lộ trình triển khai">
      <div className="experience__header">
        <h2>Lộ trình trải nghiệm lớp học thông minh</h2>
        <p>
          Quy trình được thiết kế xoay quanh ba khoảnh khắc chính: chuẩn bị tài
          liệu, tổ chức lớp học tương tác và tổng kết kết quả để cải tiến
          chương trình.
        </p>
      </div>
      <ul className="timeline">
        <li className="timeline__item" data-step="Bước 01">
          <div className="timeline__content">
            <h4>Chuẩn bị tài liệu đa phương tiện</h4>
            <p>
              Định dạng lại nội dung giảng dạy dưới dạng video, slide, tài liệu
              văn bản và câu hỏi khảo sát để sẵn sàng kích hoạt.
            </p>
          </div>
        </li>
        <li className="timeline__item" data-step="Bước 02">
          <div className="timeline__content">
            <h4>Triển khai lớp học tương tác</h4>
            <p>
              Trình chiếu đồng bộ, chia sẻ QR khảo sát, kích hoạt Kahoot và để
              Giảng viên AI dẫn dắt nhằm duy trì sự chú ý.
            </p>
          </div>
        </li>
        <li className="timeline__item" data-step="Bước 03">
          <div className="timeline__content">
            <h4>Tổng kết và tối ưu</h4>
            <p>
              Phân tích phản hồi thu được, cập nhật nội dung và tiếp tục cải tiến
              chất lượng đào tạo dựa trên dữ liệu trực tiếp.
            </p>
          </div>
        </li>
      </ul>
    </section>
  );
};

export default ExperienceSection;