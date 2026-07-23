import React from "react";
import type { Score } from "../types/interface";

interface ScoreTableProps {
  scores: Score[];
  selectedId: number | null;
  setSelectedId: React.Dispatch<React.SetStateAction<number | null>>;
}

const ScoreTable: React.FC<ScoreTableProps> = ({
  scores,
  selectedId,
  setSelectedId,
}) => {
  const totalPoint = (item: Score): number => {
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

  const averagePoint = (item: Score): string => {
    return (totalPoint(item) / 7).toFixed(2);
  };

  const rank = (item: Score): string => {
    const avg = totalPoint(item) / 7;

    if (avg >= 8.5) return "Xuất sắc";
    if (avg >= 8) return "Khá";
    if (avg >= 6.5) return "Đạt";

    return "Yếu";
  };

  return (
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

        </div>

      </div>
    </section>
  );
};

export default ScoreTable;