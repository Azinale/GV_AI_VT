import React from 'react';

const ResourceSections = ({ onOpenPdf, onOpenQr, onOpenKahoot, onOpenVideo }) => {
  return (
    <div className="resources-wrapper">
      <section className="resource-gallery reveal is-visible" aria-label="Trung tâm tài liệu">
        <h2 style={{gridColumn: '1/-1', fontSize: '2rem', fontWeight: 700, color: 'var(--viettel-red)', marginBottom: 24}}>Trung tâm tài liệu</h2>
        
        <article className="resource-card">
            <h5>Câu chuyện đào tạo Viettel</h5>
            <p>
                Bản tường thuật về hành trình nâng cao năng lực đào tạo nội bộ, định
                hình chương trình phát triển giảng viên và các tiêu chí đánh giá.
            </p>
            <button className="btn" onClick={onOpenPdf}>
                Xem bài viết chuyên sâu
            </button>
        </article>
        <article className="resource-card">
            <h5>Khảo sát Mentimeter</h5>
            <p>
                Thu thập ý kiến tức thời từ học viên để điều chỉnh tốc độ bài giảng
                và ghi nhận các chủ đề cần nhấn mạnh.
            </p>
            <button className="btn" onClick={onOpenQr}>
                Quét mã tại lớp
            </button>
        </article>
        <article className="resource-card">
            <h5>Kahoot thử thách</h5>
            <p>
                Kích hoạt trò chơi trắc nghiệm đầy hứng khởi, củng cố kiến thức và
                tăng tinh thần đồng đội.
            </p>
            <button className="btn" onClick={onOpenKahoot}>
                Mở mã Kahoot
            </button>
        </article>
      </section>

      <section className="heygen-note reveal is-visible" aria-label="Ghi chú Giảng viên AI">
        <h3>Giảng viên AI luôn sẵn sàng hỗ trợ</h3>
        <p>
        Giảng viên AI được ghim ở góc trái dưới màn hình. Khi avatar mở rộng,
        bạn có thể chọn chế độ toàn màn hình, nghe thuyết minh hoặc giải đáp
        thắc mắc theo kịch bản đã thiết lập.
        </p>
      </section>

      <section className="resource-gallery reveal is-visible" aria-label="Video Đào Tạo">
        <h2 style={{gridColumn: '1/-1', fontSize: '2rem', fontWeight: 700, color: 'var(--viettel-red)', marginBottom: 24}}>
          Video Đào Tạo
        </h2>

        {[
        {
            title: 'Video tổng quan',
            desc: 'Giới thiệu tổng quan về chương trình đào tạo.',
            url: 'https://youtu.be/7EDKTDjsmpo',
        },
        {
            title: 'Giai đoạn 1989-2000',
            desc: 'Video lịch sử giai đoạn khởi nghiệp 1989-2000',
            url: 'https://youtu.be/pXeNdbs1hMQ',
        }, 
        {
            title: 'Giai ddoanj 1989-2000: Podcast',
            desc: 'Video podcast giai đoạn khởi nghiệp',
            url: 'https://youtu.be/j8A57nXiBds',
        },
        {
            title: 'Bùng nổ viễn thông',
            desc: 'Video podcast giai đoạn bùng nổ viễn thông',
            url: 'https://youtu.be/D1vE8g3oDvE',
        },
       {
            title: 'Bùng nổ viễn thông: Podcast',
            desc: 'Video lịch sử giai đoạn bùng nổ viễn thông',
            url: 'https://youtu.be/lA3OqvLtKrQ',
        },
       {
            title: 'Công nghiệp toàn cầu: Lịch sử',
            desc: 'Video lịch sử giai đoạn công nghiệp hoá và toàn cầu hoá',
            url: 'https://youtu.be/BK-5cAsJ-nw',
        },
       {
            title: 'Công nghiệp toàn cầu: Podcast',
            desc: 'Video podcast giai đoạn công nghiệp hoá và toàn cầu hoá',
            url: 'https://youtu.be/t7zmVWDe7mw',
        },
       {
            title: 'Giai đoạn 2020-nay: Lịch sử',
            desc: 'Video lịch sử giai đoạn từ 2020 đến nay',
            url: 'https://youtu.be/696MrbDgPWA',
        },{
            title: 'Giai đoạn 2020-nay: Podcast',
            desc: 'Video podcast giai đoạn từ 2020 đến nay',
            url: 'https://youtu.be/xgLjZZpMb4s',
        },
        ].map((v) => (
        <article className="resource-card" key={v.url}>
            <h5>{v.title}</h5>
            <p>{v.desc}</p>
            <button className="btn" onClick={() => onOpenVideo(v.url)}>
            Xem video
            </button>
        </article>
        ))}
      </section>
    </div>
  );
};

export default ResourceSections;