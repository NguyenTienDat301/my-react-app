import React from "react";
import type { Soldier } from "../types/interface";

import { totalPoint, averagePoint, rank } from "../utils/soldierUtils";

interface SoldierTableProps {
  soldiers: Soldier[];
  onEdit: (soldier: Soldier) => void;

  onDelete: (id: number) => void;
}

const SoldierTable: React.FC<SoldierTableProps> = ({
    soldiers,
    // onEdit,
    // onDelete,
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
              <th>QS</th>
              <th>HT</th>
              <th>TP</th>
              <th>KL</th>
              <th>NV</th>
              <th>TG</th>
              <th>VK</th>
              <th>Tổng</th>
              <th>TB</th>
              <th>Xếp loại</th>
            </tr>
          </thead>

          <tbody>
            {soldiers.length === 0 ? (
              <tr>
                <td colSpan={12} style={{ textAlign: "center" }}>
                  Chưa có chiến sĩ
                </td>
              </tr>
            ) : (
              soldiers.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>

                  <td>{item.name}</td>

                  <td>{item.quanSo}</td>

                  <td>{item.hocTap}</td>

                  <td>{item.tacPhong}</td>

                  <td>{item.kyLuat}</td>

                  <td>{item.noiVu}</td>

                  <td>{item.tangGia}</td>

                  <td>{item.vkTrangBi}</td>

                  <td>
                    <strong>{totalPoint(item)}</strong>
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SoldierTable;
