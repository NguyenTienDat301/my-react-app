import React, { useEffect, useState } from "react";
import "../styles/thidua.css";
import type { Score } from "../types/interface";

const ThiDua: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("http://localhost:3001/scores");

        if (!res.ok) {
          throw new Error("Không lấy được dữ liệu");
        }

        const data: Score[] = await res.json();

        setScores(data);

        if (data.length > 0) {
          setSelectedId(data[0].id);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
    const avg = totalPoint(item) / 7;

    if (avg >= 8.5) return "Xuất sắc";

    if (avg >= 8) return "Khá";

    if (avg >= 6.5) return "Đạt";

    return "Yếu";
  };

  if (loading) {
    return <h2>Đang tải dữ liệu...</h2>;
  }

  return (
    <div className="page">
      {/* ================= HEADER ================= */}

      <header className="header">
        <div className="logo">⭐</div>

        <div className="title">
          <h2>CÁN BỘ, CHIẾN SĨ ĐẠI ĐỘI PK16</h2>

          <h1>
            QUYẾT TÂM THỰC HIỆN THẮNG LỢI
            <br />
            PHONG TRÀO THI ĐUA QUYẾT THẮNG
            <br />
            NĂM 2026
          </h1>
        </div>
      </header>

      {/* ================= MAIN ================= */}

      <div className="main">
        {/* ================= LEFT ================= */}

        <aside className="left-panel">
          <div className="box">
            <h3>NỘI DUNG PHONG TRÀO THI ĐUA</h3>

            <ol className="rule-list">
              <li>Chấp hành nghiêm điều lệnh Quân đội.</li>

              <li>Duy trì nền nếp chính quy.</li>

              <li>Không có quân nhân vi phạm kỷ luật.</li>

              <li>Hoàn thành tốt nhiệm vụ huấn luyện.</li>

              <li>Nội vụ vệ sinh sạch đẹp.</li>

              <li>Bảo quản tốt vũ khí trang bị.</li>

              <li>Đẩy mạnh tăng gia sản xuất.</li>

              <li>Xây dựng đơn vị vững mạnh toàn diện.</li>
            </ol>
          </div>

          <div className="box">
            <h3>MỖI NGÀY MỘT CÂU HỎI</h3>

            <p>
              <strong>Câu hỏi</strong>
            </p>

            <p>
              Theo Luật Nghĩa vụ quân sự, công dân nam đủ bao nhiêu tuổi phải
              đăng ký nghĩa vụ quân sự lần đầu?
            </p>

            <hr />

            <p>
              <strong>Đáp án</strong>
            </p>

            <p>Đủ 17 tuổi.</p>
          </div>
        </aside>
        {/* ================= CENTER ================= */}

        <section className="center-panel">
          <div className="box">
            <h3>THEO DÕI THI ĐUA</h3>

            <div className="table-wrapper">
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
                  {scores.map((item, index) => (
                    <tr
                      key={item.id}
                      className={selectedId === item.id ? "active-row" : ""}
                      onClick={() => setSelectedId(item.id)}
                    >
                      <td>{index + 1}</td>

                      <td>{item.unit}</td>

                      <td>{item.quanSo.toFixed(1)}</td>

                      <td>{item.hocTap.toFixed(1)}</td>

                      <td>{item.tacPhong.toFixed(1)}</td>

                      <td>{item.kyLuat.toFixed(1)}</td>

                      <td>{item.noiVu.toFixed(1)}</td>

                      <td>{item.tangGia.toFixed(1)}</td>

                      <td>{item.vkTrangBi.toFixed(1)}</td>

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
                                : rank(item) === "Đạt"
                                  ? "badge-info"
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
              <div className="leader-board">
                <h3>🏆 ĐƠN VỊ DẪN ĐẦU 🏆</h3>

                {scores.length > 0 && (
                  <div className="leader-card">
                    <h2>
                      {
                        [...scores].sort(
                          (a, b) => totalPoint(b) - totalPoint(a),
                        )[0].unit
                      }
                    </h2>

                    <p>
                      Tổng điểm:
                      <strong>
                        {totalPoint(
                          [...scores].sort(
                            (a, b) => totalPoint(b) - totalPoint(a),
                          )[0],
                        ).toFixed(1)}
                      </strong>
                    </p>

                    <p>
                      Điểm TB:
                      <strong>
                        {averagePoint(
                          [...scores].sort(
                            (a, b) => totalPoint(b) - totalPoint(a),
                          )[0],
                        )}
                      </strong>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        {/* ================= RIGHT ================= */}

        <aside className="right-panel">
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

              <li>✔ Kiểm tra nội vụ lúc 07:00.</li>

              <li>✔ Tổng vệ sinh chiều thứ Sáu.</li>

              <li>✔ Huấn luyện bắn súng tuần tới.</li>

              <li>✔ Kiểm tra điều lệnh cuối tuần.</li>
            </ul>
          </div>
        </aside>
      </div>

      {/* ================= NHẬN XÉT ================= */}

      <div className="comment-box">
        <h3>NHẬN XÉT TRONG TUẦN</h3>

        <textarea rows={6} placeholder="Nhập nhận xét..." />
      </div>
      <div className="summary">

  <div className="summary-item">

    <h2>{scores.length}</h2>

    <span>Tổng đơn vị</span>

  </div>

  <div className="summary-item">

    <h2>
      {scores.filter(x => rank(x) === "Xuất sắc").length}
    </h2>

    <span>Xuất sắc</span>

  </div>

  <div className="summary-item">

    <h2>
      {scores.filter(x => rank(x) === "Khá").length}
    </h2>

    <span>Khá</span>

  </div>

  <div className="summary-item">

    <h2>
      {scores.filter(x => rank(x) === "Đạt").length}
    </h2>

    <span>Đạt</span>

  </div>

</div>

      {/* ================= FOOTER ================= */}

      <footer className="footer">
        <div>Ngày ...... tháng ...... năm 2026</div>

        <div className="signature">
          <strong>ĐẠI ĐỘI TRƯỞNG</strong>
          <br />
          <br />
          <br />
          (Ký, ghi rõ họ tên)
        </div>
      </footer>
    </div>
  );
};


export default ThiDua;
