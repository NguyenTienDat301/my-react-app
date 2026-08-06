import React, { useState } from "react";
import type { Soldier } from "../types/interface";
import "../styles/soldier.css";

interface SoldierModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (soldier: Soldier | Omit<Soldier, "id">) => void | Promise<void>;
  soldier: Soldier | null;
  weekId: number;
  unit: string;
}

const emptySoldier: Omit<Soldier, "id"> = {
  weekId: 0,
  unit: "",
  name: "",

  quanSo: 10,
  hocTap: 10,
  tacPhong: 10,
  kyLuat: 10,
  noiVu: 10,
  tangGia: 10,
  vkTrangBi: 10,

  strong: [],
  weak: [],
  note: "",
};

const toLines = (text: string) => text.split("\n");

const normalizeLines = (lines: string[]) =>
  lines.map((line) => line.trim()).filter(Boolean);

const SoldierModal: React.FC<SoldierModalProps> = ({
  open,
  onClose,
  onSave,
  soldier,
  weekId,
  unit,
}) => {
  const [form, setForm] = useState<Omit<Soldier, "id">>(() =>
    soldier
      ? {
          ...soldier,
        }
      : {
          ...emptySoldier,
          weekId,
          unit,
        },
  );

  if (!open) return null;

  const handleSave = async () => {
    if (!form.name.trim()) {
      alert("Nhập tên chiến sĩ");
      return;
    }

    const normalizedForm = {
      ...form,
      weekId: form.weekId || weekId,
      unit: form.unit || unit,
      weak: normalizeLines(form.weak),
    };

    if (soldier) {
      await onSave({
        ...soldier,
        ...normalizedForm,
      });
    } else {
      await onSave(normalizedForm);
    }

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        <div className="modal-header">
          <h2>{soldier ? "Sửa chiến sĩ" : "Thêm chiến sĩ"}</h2>

          <button
            className="close-btn"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="modal-body">

          <div className="form-group">
            <label>Họ tên</label>

            <input
              className="form-input"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Điểm yếu (mỗi dòng một lỗi)</label>

            <textarea
              rows={8}
              className="form-textarea"
              value={form.weak.join("\n")}
              onChange={(e) =>
                setForm({
                  ...form,
                  weak: toLines(e.target.value),
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Ghi chú</label>

            <textarea
              rows={4}
              className="form-textarea"
              value={form.note}
              onChange={(e) =>
                setForm({
                  ...form,
                  note: e.target.value,
                })
              }
            />
          </div>

        </div>

        <div className="modal-actions">

          <button
            className="cancel-btn"
            onClick={onClose}
          >
            Hủy
          </button>

          <button
            className="save-btn"
            onClick={handleSave}
          >
            Lưu
          </button>

        </div>

      </div>
    </div>
  );
};

export default SoldierModal;