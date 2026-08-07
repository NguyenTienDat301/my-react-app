import React from "react";
import "../styles/leftPanel.css";

interface LeftPanelProps {
  title?: string;
}

const LeftPanel: React.FC<LeftPanelProps> = () => {
  return (
    <div className="left-panel">
      {/* Tiêu đề */}
      <div className="left-title">
        <div className="title-top">NỘI DUNG</div>
        <div className="title-bottom">PHONG TRÀO THI ĐUA 2026</div>
      </div>

      {/* Nội dung */}
      <div className="left-body">
        <p>
          <strong>1. Chủ đề:</strong> “Đoàn kết, kỷ cương, đột phá, sáng tạo,
          Quyết thắng”.
        </p>

        <p>
          <strong>2. Tư tưởng chỉ đạo:</strong> “Tăng cường đoàn kết, giữ vững
          kỷ cương, quyết tâm đột phá, đổi mới sáng tạo, thực hiện tốt
          <strong> "2 kiên định, 2 đẩy mạnh, 2 ngăn ngừa"</strong> và phương
          châm <strong>"5 vững"</strong>, hoàn thành xuất sắc nhiệm vụ”.
        </p>

        <p>
          <strong>3. Nội dung, chỉ tiêu:</strong>
        </p>

        <div className="left-indent">
          <p>
            a) Thi đua xây dựng cơ quan, đơn vị VMTD “Mẫu mực, tiêu biểu”, hoàn
            thành xuất sắc nhiệm vụ.
          </p>

          <p>
            b) Thi đua thực hiện tốt “các đột phá” theo Nghị quyết Đại hội Đảng
            bộ Trung đoàn lần thứ XXIII.
          </p>

          <p>
            c) Hưởng ứng, triển khai thực hiện có hiệu quả các phong trào thi
            đua yêu nước do Trung ương phát động.
          </p>
        </div>

        <p>
          <strong>
            4. Thời gian thực hiện phong trào thi đua Quyết thắng năm 2026:
          </strong>
        </p>

        <div className="left-indent">
          <p>Từ ngày 01/01/2026 đến ngày 31/12/2026.</p>
        </div>
      </div>

      <div className="left-footer">🌺</div>
    </div>
  );
};

export default LeftPanel;