import React from "react";
import { useNavigate } from "react-router-dom";
import type { Score } from "../types/interface";
import "../styles/scoreTable.css";

interface ScoreTableProps {
  scores: Score[];

  selectedId: number | null;

  setSelectedId: React.Dispatch<React.SetStateAction<number | null>>;

  onEdit: (score: Score) => void;

  onDelete: (id: number) => void;
}

const ScoreTable: React.FC<ScoreTableProps> = ({
  scores,
  selectedId,
  setSelectedId,
}) => {
  const navigate = useNavigate();

  const total = (s: Score) =>
    s.quanSo +
    s.hocTap +
    s.tacPhong +
    s.kyLuat +
    s.noiVu +
    s.tangGia +
    s.vkTrangBi;

  const totalFormatted = (s: Score) => total(s).toFixed(1);

  const averageValue = (s: Score) => total(s) / 7;
  const average = (s: Score) => averageValue(s).toFixed(2);

  // Build ranking map by average (highest -> I, next -> II, ...)
  const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  const ranked = [...scores]
    .map((s) => ({ id: s.id, avg: averageValue(s) }))
    .sort((a, b) => b.avg - a.avg);

  const rankMap = new Map<number, string>();
  ranked.forEach((r, idx) => rankMap.set(r.id, roman[idx] || String(idx + 1)));

  const handleSelect = (item: Score) => {
    setSelectedId(item.id);
    navigate(`/weeks/${item.weekId}/unit/${item.id}`);
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
            <tr
              key={item.id}
              className={item.id === selectedId ? "selected-row" : ""}
            >
              <td>{index + 1}</td>

              <td
                className="unit-name unit-link"
                onClick={() => handleSelect(item)}
                title={`Xem chi tiết ${item.unit}`}
              >
                {item.unit}
              </td>

              <td>{item.quanSo}</td>

              <td>{item.hocTap}</td>

              <td>{item.tacPhong}</td>

              <td>{item.kyLuat}</td>

              <td>{item.noiVu}</td>

              <td>{item.tangGia}</td>

              <td>{item.vkTrangBi}</td>

              <td>{totalFormatted(item)}</td>

              <td>{average(item)}</td>

              <td>{rankMap.get(item.id) ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreTable;
