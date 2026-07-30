import React from "react";
import type { Score } from "../types/interface";
import "../styles/scoreTable.css";
interface ScoreTableProps {
  scores: Score[];

  selectedId: number | null;

  setSelectedId: React.Dispatch<React.SetStateAction<number | null>>;

  onEdit: (score: Score) => void;

  onDelete: (id: number) => void;
}

const ScoreTable: React.FC<ScoreTableProps> = ({ scores }) => {
  const total = (s: Score) =>
    s.quanSo +
    s.hocTap +
    s.tacPhong +
    s.kyLuat +
    s.noiVu +
    s.tangGia +
    s.vkTrangBi;

  const average = (s: Score) => (total(s) / 7).toFixed(2);

  const rank = (s: Score) => {
    const t = total(s);

    if (t >= 58) return "I";
    if (t >= 52) return "II";
    return "III";
  };

  return (
    <div className="score-board">
      <h2 className="score-title">THEO DÕI THI ĐUA</h2>

      <table className="military-table">
        <thead>
          <tr>
            <th rowSpan={2}>TT</th>

            <th rowSpan={2}>ĐƠN VỊ</th>

            <th colSpan={7}>NỘI DUNG</th>

            <th rowSpan={2}>TỔNG</th>

            <th rowSpan={2}>TB</th>

            <th rowSpan={2}>XL</th>
          </tr>

          <tr>
            <th>QS</th>
            <th>HT</th>
            <th>TP</th>
            <th>KL</th>
            <th>NV</th>
            <th>TG</th>
            <th>VKTB</th>
          </tr>
        </thead>

        <tbody>
          {scores.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>

              <td className="unit-name">{item.unit}</td>

              <td>{item.quanSo}</td>

              <td>{item.hocTap}</td>

              <td>{item.tacPhong}</td>

              <td>{item.kyLuat}</td>

              <td>{item.noiVu}</td>

              <td>{item.tangGia}</td>

              <td>{item.vkTrangBi}</td>

              <td>{total(item)}</td>

              <td>{average(item)}</td>

              <td>{rank(item)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreTable;
