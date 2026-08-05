import React from "react";

import type { Soldier } from "../types/interface";
import {
  SCORE_FIELDS,
  totalScore,
  averageScore,
  rankOf,
} from "../constants/scoreFields";
import "../styles/soldier.css";

interface SoldierDetailModalProps {
  soldier: Soldier | null;
  onClose: () => void;
  onEdit: (soldier: Soldier) => void;
  /** Đẩy điểm mạnh / điểm yếu của chiến sĩ lên nhận xét của đơn vị */
  onPushToUnit: (soldier: Soldier, type: "strong" | "weak") => void;
}

const SoldierDetailModal: React.FC<SoldierDetailModalProps> = ({
  soldier,
  onClose,
  onEdit,
  onPushToUnit,
}) => {
  if (!soldier) return null;

  const total = totalScore(soldier);

  const renderList = (type: "strong" | "weak") => {
    const list = soldier[type];
    const title = type === "strong" ? "Điểm mạnh" : "Điểm yếu";

    return (
      <div className="comment-card">
        <div className="comment-card-header">
          <h3 className={`comment-heading ${type}`}>{title}</h3>

          <button
            type="button"
            className="link-btn"
            disabled={list.length === 0}
            onClick={() => onPushToUnit(soldier, type)}
            title={`Đưa ${title.toLowerCase()} này vào nhận xét đơn vị`}
          >
            ⬆ Đưa vào nhận xét đơn vị
          </button>
        </div>

        {list.length > 0 ? (
          <ul>
            {list.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="empty-text">Không có</p>
        )}
      </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{soldier.name}</h2>

          <button type="button" className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="stat-row">
            <span className="score-badge">Tổng {total}</span>
            <span className="score-badge">TB {averageScore(soldier)}</span>
            <span className={`rank-badge rank-${rankOf(total)}`}>
              Xếp loại {rankOf(total)}
            </span>
          </div>

          <div className="score-chips">
            {SCORE_FIELDS.map((field) => (
              <div className="score-chip" key={field.key}>
                <span className="chip-label">{field.label}</span>
                <span className="chip-value">{soldier[field.key]}</span>
              </div>
            ))}
          </div>

          <div className="comment-section">
            {renderList("strong")}
            {renderList("weak")}
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="cancel-btn" onClick={onClose}>
            Đóng
          </button>

          <button
            type="button"
            className="edit-btn"
            onClick={() => onEdit(soldier)}
          >
            ✏️ Sửa
          </button>
        </div>
      </div>
    </div>
  );
};

export default SoldierDetailModal;
