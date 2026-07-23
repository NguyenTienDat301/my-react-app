import React from "react";

const LeftPanel: React.FC = () => {
  return (
    <aside className="left-panel">
      {/* Nội dung phong trào */}
      <div className="box">
        <h3>NỘI DUNG PHONG TRÀO THI ĐUA</h3>

        <ol className="rule-list">
          <li>Chấp hành nghiêm điều lệnh, điều lệ Quân đội.</li>

          <li>Duy trì nghiêm nền nếp chính quy.</li>

          <li>Không có cán bộ, chiến sĩ vi phạm kỷ luật.</li>

          <li>Hoàn thành tốt nhiệm vụ huấn luyện và SSCĐ.</li>

          <li>Thực hiện tốt công tác nội vụ vệ sinh.</li>

          <li>Quản lý tốt vũ khí trang bị kỹ thuật.</li>

          <li>Tăng gia sản xuất, xây dựng doanh trại xanh - sạch - đẹp.</li>

          <li>Đoàn kết nội bộ, giúp đỡ đồng chí đồng đội.</li>
        </ol>
      </div>

      {/* Câu hỏi pháp luật */}
      <div className="box">
        <h3>MỖI NGÀY MỘT CÂU HỎI PHÁP LUẬT</h3>

        <p>
          <strong>Câu hỏi:</strong>
        </p>

        <p>
          Theo Luật Nghĩa vụ quân sự, công dân đủ bao nhiêu tuổi phải đăng ký
          nghĩa vụ quân sự lần đầu?
        </p>

        <hr />

        <p>
          <strong>Đáp án:</strong>
        </p>

        <p>
          Công dân nam đủ <strong>17 tuổi</strong> phải đăng ký nghĩa vụ quân
          sự lần đầu.
        </p>
      </div>
    </aside>
  );
};

export default LeftPanel;