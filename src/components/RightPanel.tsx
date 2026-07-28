import React from "react";
import type { Score } from "../types/interface";

interface RightPanelProps {
  scores: Score[];
}

const RightPanel: React.FC<RightPanelProps> = ({ scores }) => {
  // Tính tổng điểm
  const ranking = [...scores]
    .map((item) => ({
      ...item,
      total:
        item.quanSo +
        item.hocTap +
        item.tacPhong +
        item.kyLuat +
        item.noiVu +
        item.tangGia +
        item.vkTrangBi,
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <aside className="right-panel">
      {/* Những bông hoa đẹp */}
      <div className="box">
        <h3>🌸 NHỮNG BÔNG HOA ĐẸP 🌸</h3>

        <div className="flower-section">
          <h4>TẬP THỂ</h4>

          <ul>
            {ranking.length > 0 ? (
              ranking.map((item, index) => (
                <li key={item.id}>
                  {index === 0 && "🥇"}
                  {index === 1 && "🥈"}
                  {index === 2 && "🥉"}
                  {index > 2 && "🌼"}{" "}
                  <strong>{item.unit}</strong> 
                </li>
              ))
            ) : (
              <li>Chưa có dữ liệu</li>
            )}
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

      {/* Thông báo
      <div className="box">
        <h3>📢 THÔNG BÁO</h3>

        <ul className="notice-list">
          <li>✔ Duy trì nghiêm nền nếp chính quy.</li>
          <li>✔ Kiểm tra nội vụ lúc 07:00.</li>
          <li>✔ Tổng vệ sinh chiều thứ Sáu.</li>
          <li>✔ Huấn luyện bắn súng tuần tới.</li>
          <li>✔ Kiểm tra điều lệnh cuối tuần.</li>
        </ul>
      </div> */}
    </aside>
  );
};

export default RightPanel;