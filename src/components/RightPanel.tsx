import React from "react";

const RightPanel: React.FC = () => {
  return (
    <aside className="right-panel">
      {/* Những bông hoa đẹp */}
      <div className="box">
        <h3>🌸 NHỮNG BÔNG HOA ĐẸP 🌸</h3>

        <div className="flower-section">
          <h4>TẬP THỂ</h4>

          <ul>
            <li>🌼 Đại đội bộ</li>
            <li>🌼 Trung đội 1</li>
            <li>🌼 Trung đội 2</li>
          </ul>
        </div>

        <div className="flower-section">
          <h4>CÁ NHÂN</h4>

          <ul>
            <li>⭐ Nguyễn Văn A</li>
            <li>⭐ Trần Văn B</li>
            <li>⭐ Lê Văn C</li>
            <li>⭐ Phạm Văn D</li>
            <li>⭐ Hoàng Văn E</li>
          </ul>
        </div>
      </div>

      {/* Thông báo */}
      <div className="box">
        <h3>📢 THÔNG BÁO</h3>

        <ul className="notice-list">
          <li>✔ Duy trì nghiêm nền nếp chính quy.</li>
          <li>✔ Kiểm tra nội vụ lúc 07:00.</li>
          <li>✔ Tổng vệ sinh chiều thứ Sáu.</li>
          <li>✔ Huấn luyện bắn súng tuần tới.</li>
          <li>✔ Kiểm tra điều lệnh cuối tuần.</li>
        </ul>
      </div>

      {/* Đơn vị dẫn đầu */}
      <div className="box">
        <h3>🏆 ĐƠN VỊ DẪN ĐẦU</h3>

        <div className="leader-card">
          <h2>Trung đội 1</h2>

          <p>Hoàn thành xuất sắc nhiệm vụ tuần.</p>
        </div>
      </div>
    </aside>
  );
};

export default RightPanel;