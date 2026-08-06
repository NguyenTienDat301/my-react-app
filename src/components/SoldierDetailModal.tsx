import React from "react";

import type { Soldier } from "../types/interface";
import "../styles/soldier.css";

interface SoldierDetailModalProps {
  soldier: Soldier | null;
  onClose: () => void;
  onEdit: (soldier: Soldier) => void;
  onPushToUnit: (soldier: Soldier, type: "weak") => void;
}

const SoldierDetailModal: React.FC<SoldierDetailModalProps> = ({
  soldier,
  onClose,
  onEdit,
  onPushToUnit,
}) => {
  if (!soldier) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal soldier-detail-modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{soldier.name}</h2>
            <p className="modal-subtitle">{soldier.unit}</p>
          </div>
          <button className="close-btn" type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-summary">
            <div className="detail-card weak">
              <div className="detail-card-header">
                <h3 className="detail-card-title">Hạn chế</h3>
                <button
                  type="button"
                  className="link-btn"
                  disabled={soldier.weak.length === 0}
                  onClick={() => onPushToUnit(soldier, "weak")}
                  title="Đưa hạn chế này vào nhận xét đơn vị"
                >
                  ⬆ Đưa vào nhận xét đơn vị
                </button>
              </div>

              {soldier.weak.length > 0 ? (
                <ul className="detail-bullet">
                  {soldier.weak.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="empty-text">Không có hạn chế</p>
              )}
            </div>

            <div className="detail-note-card">
              <div className="detail-card-header">
                <h3 className="detail-card-title">Ghi chú</h3>
              </div>
              <p className="detail-note">
                {soldier.note?.trim() || "Không có ghi chú"}
              </p>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" type="button" onClick={onClose}>
            Đóng
          </button>
          <button className="save-btn" type="button" onClick={() => onEdit(soldier)}>
            Sửa
          </button>
        </div>
      </div>
    </div>
  );
};

export default SoldierDetailModal;


