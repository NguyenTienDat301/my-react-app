import React from "react";
import type { Soldier } from "../types/interface";

interface SoldierTableProps {
  soldiers: Soldier[];
  onEdit: (soldier: Soldier) => void;
  onDelete: (id: number) => void;
}

const SoldierTable: React.FC<SoldierTableProps> = ({
  soldiers,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="soldier-section">
      <h2>Danh sách chiến sĩ</h2>

      <div className="table-wrapper">
        <table className="soldier-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Họ và tên</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {soldiers.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: "center" }}>
                  Chưa có chiến sĩ
                </td>
              </tr>
            ) : (
              soldiers.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>

                  <td>{item.name}</td>

                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => onEdit(item)}
                    >
                      ✏️ Sửa
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => onDelete(item.id)}
                      style={{ marginLeft: 8 }}
                    >
                      🗑️ Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SoldierTable;