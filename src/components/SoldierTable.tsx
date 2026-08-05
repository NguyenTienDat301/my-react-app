import React from "react";

import type { Soldier } from "../types/interface";
import {
  SCORE_FIELDS,
  totalScore,
  averageScore,
  rankOf,
} from "../constants/scoreFields";
import "../styles/soldier.css";

interface SoldierTableProps {
  soldiers: Soldier[];
  onEdit: (soldier: Soldier) => void;
  onDelete: (id: number) => void;
  /** Click vào tên chiến sĩ để xem chi tiết mạnh/yếu */
  onSelect?: (soldier: Soldier) => void;
}

const SoldierTable: React.FC<SoldierTableProps> = ({
  soldiers,
  onEdit,
  onDelete,
  onSelect,
}) => {
  if (soldiers.length === 0) {
    return <p className="empty-text soldier-empty">Chưa có chiến sĩ nào</p>;
  }

  return (
    <div className="soldier-table-wrap">
      <table className="soldier-table">
        <thead>
          <tr>
            <th>TT</th>
            <th className="col-name">HỌ TÊN</th>

            {SCORE_FIELDS.map((field) => (
              <th key={field.key} title={field.label}>
                {field.short}
              </th>
            ))}

            <th>TỔNG</th>
            <th>TB</th>
            <th>XL</th>
            <th>LỖI</th>
            <th className="col-action">THAO TÁC</th>
          </tr>
        </thead>

        <tbody>
          {soldiers.map((item, index) => {
            const total = totalScore(item);

            return (
              <tr key={item.id}>
                <td>{index + 1}</td>

                <td
                  className="col-name soldier-link"
                  onClick={() => onSelect?.(item)}
                  title={`Xem chi tiết ${item.name}`}
                >
                  {item.name}
                </td>

                {SCORE_FIELDS.map((field) => (
                  <td key={field.key}>{item[field.key]}</td>
                ))}

                <td className="cell-total">{total}</td>
                <td>{averageScore(item)}</td>
                <td>
                  <span className={`rank-badge rank-${rankOf(total)}`}>
                    {rankOf(total)}
                  </span>
                </td>

                <td>
                  {item.weak.length > 0 ? (
                    <span className="error-badge">{item.weak.length}</span>
                  ) : (
                    "-"
                  )}
                </td>

                <td className="col-action">
                  <button
                    type="button"
                    className="icon-btn edit"
                    title="Sửa"
                    onClick={() => onEdit(item)}
                  >
                    ✏️
                  </button>

                  <button
                    type="button"
                    className="icon-btn delete"
                    title="Xóa"
                    onClick={() => onDelete(item.id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SoldierTable;
