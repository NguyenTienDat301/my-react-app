import React, { useEffect, useState } from "react";
import type { Score } from "../types/interface";





const ThiDua: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    fetch("http://localhost:3001/scores")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Lỗi");
        }

        return res.json();
      })
      .then((data: Score[]) => {
        setScores(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const [selectedId, setSelectedId] = useState<number>(1);

  const totalPoint = (item: Score) => {
    return (
      item.quanSo +
      item.hocTap +
      item.tacPhong +
      item.kyLuat +
      item.noiVu +
      item.tangGia +
      item.vkTrangBi
    );
  };

  const averagePoint = (item: Score) => {
    return (totalPoint(item) / 7).toFixed(2);
  };

  const rank = (item: Score) => {
    const total = totalPoint(item);

    if (total >= 58) return "Xuất sắc";

    if (total >= 52) return "Khá";

    if (total >= 45) return "Đạt";

    return "Yếu";
  };

  if (loading) {
    return <h2>Đang tải dữ liệu...</h2>;
  }

  if (error) {
    return <h2>Không lấy được dữ liệu.</h2>;
  }

  return (
    <div className="page">
      {/* HEADER */}

      <header className="header">
        <div className="logo">⭐</div>

        <div className="title">
          <h2>CÁN BỘ, CHIẾN SĨ ĐẠI ĐỘI PK16</h2>

          <h1>
            QUYẾT TÂM THỰC HIỆN THẮNG LỢI PHONG TRÀO THI ĐUA QUYẾT THẮNG NĂM
            2026
          </h1>
        </div>
      </header>

      <div className="main">
        {" "}
        {/* ================= LEFT PANEL ================= */}
        <div className="left-panel">
          <div className="box">
            <h3>NỘI DUNG PHONG TRÀO THI ĐUA</h3>

            <ol className="rule-list">
              <li>Chấp hành nghiêm điều lệnh, điều lệ Quân đội.</li>

              <li>Duy trì nghiêm nền nếp chính quy, lễ tiết tác phong.</li>

              <li>Không có cán bộ, chiến sĩ vi phạm kỷ luật.</li>

              <li>Hoàn thành tốt nhiệm vụ huấn luyện và SSCĐ.</li>

              <li>Thực hiện tốt công tác nội vụ vệ sinh.</li>

              <li>Quản lý tốt VKTB, bảo đảm an toàn tuyệt đối.</li>

              <li>Tăng gia sản xuất, xây dựng doanh trại xanh - sạch - đẹp.</li>

              <li>Đoàn kết nội bộ, giúp đỡ đồng chí đồng đội.</li>
            </ol>
          </div>

          <div className="box">
            <h3>MỖI NGÀY MỘT CÂU HỎI PHÁP LUẬT</h3>

            <p>
              <strong>Câu hỏi:</strong>
            </p>

            <p>
              Theo Luật Nghĩa vụ quân sự, công dân đủ bao nhiêu tuổi phải đăng
              ký NVQS?
            </p>

            <hr />

            <p>
              <strong>Đáp án:</strong>
            </p>

            <p>
              Công dân nam đủ 17 tuổi phải đăng ký nghĩa vụ quân sự lần đầu.
            </p>
          </div>
        </div>
        {/* ================= CENTER ================= */}
        <div className="center-panel">
          <div className="box">
            <h3>THEO DÕI THI ĐUA</h3>

            <table className="score-table">
              <thead>
                <tr>
                  <th>TT</th>

                  <th>Đơn vị</th>

                  <th>QS</th>

                  <th>HT</th>

                  <th>TP</th>

                  <th>KL</th>

                  <th>NVVS</th>

                  <th>TGSX</th>

                  <th>VKTB</th>

                  <th>Tổng</th>

                  <th>TB</th>

                  <th>Xếp loại</th>
                </tr>
              </thead>

              <tbody>
                {scores.map((item: Score, index: number) => (
                  <tr
                    key={item.id}
                    className={selectedId === item.id ? "active-row" : ""}
                    onClick={() => setSelectedId(item.id)}
                  >
                    <td>{index + 1}</td>

                    <td>{item.unit}</td>

                    <td>{item.quanSo}</td>

                    <td>{item.hocTap}</td>

                    <td>{item.tacPhong}</td>

                    <td>{item.kyLuat}</td>

                    <td>{item.noiVu}</td>

                    <td>{item.tangGia}</td>

                    <td>{item.vkTrangBi}</td>

                    <td>
                      <strong>{totalPoint(item).toFixed(1)}</strong>
                    </td>

                    <td>{averagePoint(item)}</td>

                    <td>
                      <span
                        className={
                          rank(item) === "Xuất sắc"
                            ? "badge-success"
                            : rank(item) === "Khá"
                              ? "badge-warning"
                              : "badge-danger"
                        }
                      >
                        {rank(item)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* ================= RIGHT PANEL ================= */}

          <div className="right-panel">
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

            <div className="box">
              <h3>📢 THÔNG BÁO</h3>

              <ul className="notice-list">
                <li>✔ Duy trì nghiêm nền nếp chính quy.</li>

                <li>✔ Kiểm tra nội vụ vào 07h00 sáng.</li>

                <li>✔ Tổng vệ sinh chiều thứ Sáu.</li>

                <li>✔ Huấn luyện bắn súng tuần tới.</li>

                <li>✔ Kiểm tra điều lệnh cuối tuần.</li>
              </ul>
            </div>
          </div>

          {/* ================= END 3 CỘT ================= */}
        </div>
        {/* ================= NHẬN XÉT ================= */}
        <div className="comment-box">
          <h3>NHẬN XÉT TRONG TUẦN</h3>

          <textarea rows={6} placeholder="Nhập nhận xét..." />
        </div>
        {/* ================= FOOTER ================= */}
        <div className="footer">
          <div>Ngày ...... tháng ...... năm 2026</div>

          <div className="signature">
            <strong>ĐẠI ĐỘI TRƯỞNG</strong>
            <br />
            <br />
            <br />
            (Ký, ghi rõ họ tên)
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThiDua;
