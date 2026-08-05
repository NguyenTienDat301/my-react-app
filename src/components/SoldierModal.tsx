import React, { useEffect, useState } from "react";

import type { Soldier } from "../types/interface";
import {
  SCORE_FIELDS,
  type ScoreKey,
  totalScore,
  rankOf,
  toLines,
} from "../constants/scoreFields";
import "../styles/soldier.css";

type SoldierForm = Omit<Soldier, "id">;

interface SoldierModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (soldier: SoldierForm | Soldier) => void;
  weekId: number;
  unit: string;
  soldier?: Soldier | null;
}

const defaultSoldier = (weekId: number, unit: string): SoldierForm => ({
  weekId,
  unit,
  name: "",
  ...(Object.fromEntries(SCORE_FIELDS.map((f) => [f.key, 10])) as Record<
    ScoreKey,
    number
  >),
  strong: [],
  weak: [],
});

const SoldierModal: React.FC<SoldierModalProps> = ({
  open,
  onClose,
  onSave,
  weekId,
  unit,
  soldier,
}) => {
  const [form, setForm] = useState<SoldierForm>(defaultSoldier(weekId, unit));

  useEffect(() => {
    if (!open) return;

    setForm(
      soldier
        ? { ...soldier, weekId: soldier.weekId, unit: soldier.unit }
        : defaultSoldier(weekId, unit),
    );
  }, [soldier, weekId, unit, open]);

  if (!open) return null;

  const setField = <K extends keyof SoldierForm>(
    key: K,
    value: SoldierForm[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Vui lòng nhập tên chiến sĩ");
      return;
    }

    onSave(soldier ? { ...soldier, ...form } : form);
  };

  const total = totalScore(form);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{soldier ? "Cập nhật chiến sĩ" : "Thêm chiến sĩ"}</h2>

          <button type="button" className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="soldier-name">Họ tên *</label>
              <input
                id="soldier-name"
                className="form-input"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Nhập họ tên chiến sĩ"
                autoFocus
              />
            </div>

            <div className="form-section">
              <div className="form-section-header">
                <h3>Điểm thi đua</h3>
                <span className="score-badge">
                  Tổng {total} · Xếp loại {rankOf(total)}
                </span>
              </div>

              <div className="form-grid">
                {SCORE_FIELDS.map((field) => (
                  <div className="form-group" key={field.key}>
                    <label htmlFor={`soldier-${field.key}`}>
                      {field.label}
                    </label>
                    <input
                      id={`soldier-${field.key}`}
                      type="number"
                      min={0}
                      max={10}
                      step="0.1"
                      className="form-input"
                      value={form[field.key]}
                      onChange={(e) =>
                        setField(field.key, Number(e.target.value))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="soldier-strong">
                Điểm mạnh (mỗi dòng một ý)
              </label>
              <textarea
                id="soldier-strong"
                rows={4}
                className="form-textarea"
                value={form.strong.join("\n")}
                onChange={(e) => setField("strong", toLines(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label htmlFor="soldier-weak">Điểm yếu (mỗi dòng một ý)</label>
              <textarea
                id="soldier-weak"
                rows={4}
                className="form-textarea"
                value={form.weak.join("\n")}
                onChange={(e) => setField("weak", toLines(e.target.value))}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              ❌ Hủy
            </button>

            <button type="submit" className="save-btn">
              💾 Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SoldierModal;
