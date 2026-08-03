import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../components/Header";
import SoldierModal from "../components/SoldierModal";
import SoldierTable from "../components/SoldierTable";

import type { Score, CommentItem, Soldier } from "../types/interface";

import {
  getScoreById,
  updateScore,
  deleteScore,
} from "../services/scoreService";

import {
  getComment,
  updateComment,
  deleteComment,
} from "../services/commentService";

import {
  getSoldiers,
  addSoldier,
  updateSoldier,
  deleteSoldier,
} from "../services/soldierService";

import "../styles/detail.css";

const SCORE_FIELDS = [
  { key: "quanSo", label: "Quân số" },
  { key: "hocTap", label: "Học tập" },
  { key: "tacPhong", label: "Tác phong" },
  { key: "kyLuat", label: "Kỷ luật" },
  { key: "noiVu", label: "Nội vụ" },
  { key: "tangGia", label: "Tăng gia" },
  { key: "vkTrangBi", label: "VKTB" },
] as const;

type ScoreKey = (typeof SCORE_FIELDS)[number]["key"];

const totalOf = (s: Score | null) =>
  s ? SCORE_FIELDS.reduce((sum, f) => sum + Number(s[f.key] ?? 0), 0) : 0;

const rankOf = (total: number) => {
  if (total >= 58) return "I";
  if (total >= 52) return "II";
  return "III";
};

const toLines = (text: string) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const UnitDetail: React.FC = () => {
  const { weekId, scoreId: scoreIdParam } = useParams();
  const navigate = useNavigate();

  const [score, setScore] = useState<Score | null>(null);
  const [editScore, setEditScore] = useState<Score | null>(null);

  const [comment, setComment] = useState<CommentItem | null>(null);
  const [editComment, setEditComment] = useState<CommentItem | null>(null);

  const [soldiers, setSoldiers] = useState<Soldier[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const [editingSoldier, setEditingSoldier] = useState<Soldier | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // ================= Load dữ liệu =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!scoreIdParam) {
          setError("Không tìm thấy ID đơn vị");
          return;
        }

        const scoreId = Number(scoreIdParam);

        if (Number.isNaN(scoreId)) {
          setError("ID đơn vị không hợp lệ");
          return;
        }

        setLoading(true);

        const scoreData = await getScoreById(scoreId);
        setScore(scoreData);
        setEditScore(scoreData);

        const commentData = await getComment(scoreData.weekId, scoreData.unit);
        setComment(commentData);
        setEditComment(commentData);

        setSoldiers(await getSoldiers(scoreData.weekId, scoreData.unit));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [scoreIdParam]);

  // ================= Lưu điểm =================
  const handleSave = async () => {
    if (!editScore || !editComment) return;

    try {
      await updateScore(editScore);
      await updateComment(editComment);

      setScore(editScore);
      setComment(editComment);
      setIsEditing(false);

      alert("Cập nhật thành công!");
    } catch (error) {
      console.error(error);
      alert("Không thể cập nhật dữ liệu!");
    }
  };

  const handleCancel = () => {
    setEditScore(score);
    setEditComment(comment);
    setIsEditing(false);
  };

  // ================= Xóa đơn vị =================
  const handleDelete = async () => {
    if (!score) return;
    if (!window.confirm(`Bạn có chắc muốn xóa "${score.unit}" không?`)) return;

    try {
      await deleteScore(score.id);
      if (comment) await deleteComment(comment.id);

      alert("Đã xóa đơn vị!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Xóa thất bại!");
    }
  };

  // ================= Chiến sĩ =================
  const handleAddSoldier = () => {
    setEditingSoldier(null);
    setOpenModal(true);
  };

  const handleEditSoldier = (soldier: Soldier) => {
    setEditingSoldier(soldier);
    setOpenModal(true);
  };

  const handleDeleteSoldier = async (id: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa chiến sĩ này?")) return;

    try {
      await deleteSoldier(id);
      setSoldiers((prev) => prev.filter((item) => item.id !== id));
      alert("Đã xóa chiến sĩ!");
    } catch (error) {
      console.error(error);
      alert("Không thể xóa chiến sĩ!");
    }
  };

  const handleSaveSoldier = async (soldier: Soldier | Omit<Soldier, "id">) => {
    try {
      if ("id" in soldier) {
        const updated = await updateSoldier(soldier);
        setSoldiers((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item)),
        );
      } else {
        const created = await addSoldier(soldier);
        setSoldiers((prev) => [...prev, created]);
      }

      setEditingSoldier(null);
      setOpenModal(false);
    } catch (error) {
      console.error(error);
      alert("Không thể lưu chiến sĩ!");
    }
  };

  if (loading) return <h2 className="detail-state">Đang tải...</h2>;
  if (error) return <h2 className="detail-state detail-error">{error}</h2>;

  const current = isEditing ? editScore : score;
  const total = totalOf(current);
  const average = (total / SCORE_FIELDS.length).toFixed(2);

  return (
    <>
      <Header />

      <div className="detail-page">
        {/* ================= Tiêu đề ================= */}
        <div className="detail-header">
          <div>
            <h1 className="detail-title">CHI TIẾT THI ĐUA</h1>
            <p className="detail-subtitle">
              Tuần {weekId} · <strong>{score?.unit}</strong>
            </p>
          </div>

          <button className="back-btn" onClick={() => navigate("/")}>
            ← Quay lại
          </button>
        </div>

        {/* ================= Tổng quan ================= */}
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-label">Tổng điểm</span>
            <span className="stat-value">{total}</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Trung bình</span>
            <span className="stat-value">{average}</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Xếp loại</span>
            <span className="stat-value">{rankOf(total)}</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Chiến sĩ</span>
            <span className="stat-value">{soldiers.length}</span>
          </div>
        </div>

        {/* ================= Form điểm ================= */}
        <section className="detail-card">
          <div className="card-header">
            <h2>Điểm thành phần</h2>

            <div className="action-group">
              {!isEditing ? (
                <>
                  <button
                    className="edit-btn"
                    onClick={() => setIsEditing(true)}
                  >
                    ✏️ Sửa
                  </button>

                  <button className="delete-btn" onClick={handleDelete}>
                    🗑️ Xóa
                  </button>
                </>
              ) : (
                <>
                  <button className="save-btn" onClick={handleSave}>
                    💾 Lưu
                  </button>

                  <button className="cancel-btn" onClick={handleCancel}>
                    ❌ Hủy
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="form-grid">
            {SCORE_FIELDS.map((field) => (
              <div className="form-group" key={field.key}>
                <label htmlFor={field.key}>{field.label}</label>

                {isEditing ? (
                  <input
                    id={field.key}
                    type="number"
                    step="0.1"
                    className="form-input"
                    value={editScore?.[field.key as ScoreKey] ?? 0}
                    onChange={(e) =>
                      setEditScore({
                        ...editScore!,
                        [field.key]: Number(e.target.value),
                      })
                    }
                  />
                ) : (
                  <div className="form-value">{score?.[field.key]}</div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ================= Nhận xét ================= */}
        <section className="detail-card">
          <div className="card-header">
            <h2>Nhận xét</h2>
          </div>

          <div className="comment-section">
            <div className="comment-card">
              <h3 className="comment-heading strong">Điểm mạnh</h3>

              {isEditing ? (
                <textarea
                  rows={6}
                  className="form-textarea"
                  placeholder="Mỗi dòng một ý"
                  value={editComment?.strong.join("\n") ?? ""}
                  onChange={(e) =>
                    setEditComment({
                      ...editComment!,
                      strong: toLines(e.target.value),
                    })
                  }
                />
              ) : comment?.strong.length ? (
                <ul>
                  {comment.strong.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="empty-text">Chưa có nhận xét</p>
              )}
            </div>

            <div className="comment-card">
              <h3 className="comment-heading weak">Điểm yếu</h3>

              {isEditing ? (
                <textarea
                  rows={6}
                  className="form-textarea"
                  placeholder="Mỗi dòng một ý"
                  value={editComment?.weak.join("\n") ?? ""}
                  onChange={(e) =>
                    setEditComment({
                      ...editComment!,
                      weak: toLines(e.target.value),
                    })
                  }
                />
              ) : comment?.weak.length ? (
                <ul>
                  {comment.weak.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="empty-text">Chưa có nhận xét</p>
              )}
            </div>
          </div>
        </section>

        {/* ================= Danh sách chiến sĩ ================= */}
        <section className="detail-card">
          <div className="card-header">
            <h2>Danh sách chiến sĩ</h2>

            <button className="add-btn" onClick={handleAddSoldier}>
              + Thêm chiến sĩ
            </button>
          </div>

          <SoldierTable
            soldiers={soldiers}
            onEdit={handleEditSoldier}
            onDelete={handleDeleteSoldier}
          />
        </section>

        <SoldierModal
          open={openModal}
          onClose={() => {
            setOpenModal(false);
            setEditingSoldier(null);
          }}
          onSave={handleSaveSoldier}
          soldier={editingSoldier}
          weekId={score?.weekId ?? 0}
          unit={score?.unit ?? ""}
        />
      </div>
    </>
  );
};

export default UnitDetail;
