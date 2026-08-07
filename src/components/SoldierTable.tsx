import React from "react";
import type { Soldier } from "../types/interface";
import "../styles/soldier.css";

interface SoldierTableProps {
  soldiers: Soldier[];
  onEdit: (soldier: Soldier) => void;
  onDelete: (id: number) => void;
  onSelect?: (soldier: Soldier) => void;
  // when true, render Hạn chế and Ghi chú columns (used by UnitDetail)
  showExtras?: boolean;
}

const SoldierTable: React.FC<SoldierTableProps> = ({
  soldiers,
  onEdit,
  onDelete,
  onSelect,
  showExtras = false,
}) => {
  if (soldiers.length === 0) {
    return (
      <p className="empty-text soldier-empty">
        Chưa có chiến sĩ nào
      </p>
    );
  }

  return (
    <div className="soldier-table-wrap">
      <table className="soldier-table">
        <thead>
          <tr>
            <th style={{ width: 60 }}>TT</th>
            <th>Họ và tên</th>
            {showExtras && <th>Hạn chế</th>}
            {showExtras && <th>Ghi chú</th>}
            <th style={{ width: 120 }}>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {soldiers.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>

              <td
                className="soldier-link"
                onClick={() => onSelect?.(item)}
                title="Xem chi tiết"
              >
                {item.name}
              </td>

              {showExtras && (
                <td className="col-weak">
                  {item.weak.length === 0 ? (
                    <span className="empty-text">—</span>
                  ) : (
                    <>
                      <ul className="weak-list">
                        {item.weak.slice(0, 2).map((weak, i) => (
                          <li key={i}>{weak}</li>
                        ))}
                      </ul>

                      {item.weak.length > 2 && (
                        <div className="more-text">
                          +{item.weak.length - 2} hạn chế...
                        </div>
                      )}
                    </>
                  )}
                </td>
              )}

              {showExtras && (
                <td className="col-note">
                  {item.note?.trim() ? item.note : "—"}
                </td>
              )}

              <td className="col-action">
                <button
                  type="button"
                  className="icon-btn edit"
                  onClick={() => onEdit(item)}
                  title="Sửa"
                >
                  ✏️
                </button>

                <button
                  type="button"
                  className="icon-btn delete"
                  onClick={() => onDelete(item.id)}
                  title="Xóa"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SoldierTable;