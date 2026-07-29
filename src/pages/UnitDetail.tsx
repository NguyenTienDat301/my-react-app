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

const UnitDetail: React.FC = () => {
const { weekId, scoreId: scoreIdParam } = useParams();
  const navigate = useNavigate();

  // ======================
  // Đại đội
  // ======================

  const [score, setScore] = useState<Score | null>(null);

  const [editScore, setEditScore] = useState<Score | null>(null);

  // ======================
  // Nhận xét
  // ======================

  const [comment, setComment] = useState<CommentItem | null>(null);

  const [editComment, setEditComment] = useState<CommentItem | null>(null);

  // ======================
  // Danh sách chiến sĩ
  // ======================

  const [soldiers, setSoldiers] = useState<Soldier[]>([]);

  // ======================
  // Modal
  // ======================

  const [openModal, setOpenModal] = useState(false);

  const [editingSoldier, setEditingSoldier] = useState<Soldier | null>(null);

  // ======================
  // Trạng thái
  // ======================

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  // ======================
  // Load dữ liệu
  // ======================

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

        // lấy điểm đại đội bằng service
        const scoreData = await getScoreById(scoreId);

        setScore(scoreData);

        setEditScore(scoreData);

        // lấy nhận xét bằng service
        const commentData = await getComment(scoreData.weekId, scoreData.unit);

        setComment(commentData);

        setEditComment(commentData);

        // lấy chiến sĩ bằng service
        const soldierData = await getSoldiers(scoreData.weekId, scoreData.unit);

        setSoldiers(soldierData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Có lỗi xảy ra.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [scoreIdParam]);
  // ======================
  // Lưu điểm đại đội
  // ======================

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

  // ======================
  // Xóa đại đội
  // ======================

  const handleDelete = async () => {
    if (!score) return;

    if (!window.confirm(`Bạn có chắc muốn xóa "${score.unit}" không?`)) {
      return;
    }

    try {
      await deleteScore(score.id);

      if (comment) {
        await deleteComment(comment.id);
      }

      alert("Đã xóa đơn vị!");

      navigate("/");
    } catch (error) {
      console.error(error);

      alert("Xóa thất bại!");
    }
  };

  // ======================
  // Thêm chiến sĩ
  // ======================

  const handleAddSoldier = () => {
    setEditingSoldier(null);

    setOpenModal(true);
  };

  // ======================
  // Sửa chiến sĩ
  // ======================

  const handleEditSoldier = (soldier: Soldier) => {
    setEditingSoldier(soldier);

    setOpenModal(true);
  };

  // ======================
  // Xóa chiến sĩ
  // ======================

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

  // ======================
  // Lưu chiến sĩ
  // ======================

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
  if (loading) {
    return <h2>Đang tải...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }
  return (
    <>
      <Header />

      <div className="detail-page">
        <h1>CHI TIẾT THI ĐUA</h1>

        <h3>
          Tuần {weekId} - {score?.unit}
        </h3>

        {/* ================= Điểm đại đội ================= */}

        <table className="detail-table">
          <tbody>
            {[
              { label: "Quân số", key: "quanSo" },
              { label: "Học tập", key: "hocTap" },
              { label: "Tác phong", key: "tacPhong" },
              { label: "Kỷ luật", key: "kyLuat" },
              { label: "Nội vụ", key: "noiVu" },
              { label: "Tăng gia", key: "tangGia" },
              { label: "VKTB", key: "vkTrangBi" },
            ].map((item) => (
              <tr key={item.key}>
                <td>{item.label}</td>

                <td>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.1"
                      value={editScore?.[item.key as keyof Score] as number}
                      onChange={(e) =>
                        setEditScore({
                          ...editScore!,
                          [item.key]: Number(e.target.value),
                        })
                      }
                    />
                  ) : (
                    score?.[item.key as keyof Score]
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ================= Nhận xét ================= */}

        <div className="comment-section">
          <div className="comment-card">
            <h3>Điểm mạnh</h3>

            {isEditing ? (
              <textarea
                rows={6}
                value={editComment?.strong.join("\n") ?? ""}
                onChange={(e) =>
                  setEditComment({
                    ...editComment!,
                    strong: e.target.value
                      .split("\n")
                      .filter((x) => x.trim() !== ""),
                  })
                }
              />
            ) : (
              <ul>
                {comment?.strong.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="comment-card">
            <h3>Điểm yếu</h3>

            {isEditing ? (
              <textarea
                rows={6}
                value={editComment?.weak.join("\n") ?? ""}
                onChange={(e) =>
                  setEditComment({
                    ...editComment!,
                    weak: e.target.value
                      .split("\n")
                      .filter((x) => x.trim() !== ""),
                  })
                }
              />
            ) : (
              <ul>
                {comment?.weak.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ================= Button ================= */}

        <div className="action-group">
          {!isEditing ? (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              ✏️ Sửa
            </button>
          ) : (
            <>
              <button className="save-btn" onClick={handleSave}>
                💾 Lưu
              </button>

              <button
                className="cancel-btn"
                onClick={() => {
                  setEditScore(score);
                  setEditComment(comment);
                  setIsEditing(false);
                }}
              >
                ❌ Hủy
              </button>
            </>
          )}

          <button className="delete-btn" onClick={handleDelete}>
            🗑️ Xóa
          </button>

          <button className="back-btn" onClick={() => navigate("/")}>
            Quay lại
          </button>
        </div>

        {/* ================= Danh sách chiến sĩ ================= */}

        <div className="soldier-header">
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
