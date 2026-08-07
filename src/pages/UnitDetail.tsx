import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import SoldierModal from "../components/SoldierModal";
import SoldierTable from "../components/SoldierTable";
import SoldierDetailModal from "../components/SoldierDetailModal";

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

const API = "http://localhost:3001";

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
  s
    ? SCORE_FIELDS.reduce((sum, field) => sum + Number(s[field.key] ?? 0), 0)
    : 0;

const rankOf = (total: number) => {
  if (total >= 58) return "I";
  if (total >= 52) return "II";
  return "III";
};

// Preserve user input (spaces/newlines) while editing; normalize on save without stripping intended spaces
const toLines = (text: string) =>
  text.split("\n").map((line) => line.replace(/\r$/, ""));

const normalizeLines = (lines?: string[]) =>
  (lines ?? [])
    .map((line) => line?.replace(/\r$/, ""))
    .filter((line): line is string => line !== undefined && line !== null)
    .filter((line) => line.trim() !== "");

const UnitDetail: React.FC = () => {
  const location = useLocation();
  const { weekId, scoreId: scoreIdParam } = useParams();
  const navigate = useNavigate();

  const [score, setScore] = useState<Score | null>(null);
  const [editScore, setEditScore] = useState<Score | null>(null);

  const [comment, setComment] = useState<CommentItem | null>(null);
  const [editComment, setEditComment] = useState<CommentItem | null>(null);

  const [soldiers, setSoldiers] = useState<Soldier[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const [editingSoldier, setEditingSoldier] = useState<Soldier | null>(null);

  const [viewingSoldier, setViewingSoldier] = useState<Soldier | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [weekRank, setWeekRank] = useState<string>("");

  // ================= LOAD DỮ LIỆU =================

  const fetchData = useCallback(async () => {
    try {
      if (!scoreIdParam) {
        setError("Không tìm thấy đơn vị");
        return;
      }

      const scoreId = Number(scoreIdParam);

      if (Number.isNaN(scoreId)) {
        setError("ID không hợp lệ");
        return;
      }

      setLoading(true);

      const scoreData = await getScoreById(scoreId);

      setScore(scoreData);
      setEditScore(scoreData);

      const commentData = await getComment(scoreData.weekId, scoreData.unit);

      setComment(commentData);
      setEditComment(commentData);

      const soldierData = await getSoldiers(scoreData.weekId, scoreData.unit);

      setSoldiers(soldierData);
      // fetch all scores for the week to compute ranking
      try {
        const res = await fetch(`${API}/scores?weekId=${scoreData.weekId}`);
        if (res.ok) {
          const scores: Score[] = await res.json();
          const roman = [
            "I",
            "II",
            "III",
            "IV",
            "V",
            "VI",
            "VII",
            "VIII",
            "IX",
            "X",
          ];
          const ranked = [...scores]
            .map((s) => ({
              id: s.id,
              avg:
                SCORE_FIELDS.reduce(
                  (sum, f) => sum + Number(s[f.key] ?? 0),
                  0,
                ) / SCORE_FIELDS.length,
            }))
            .sort((a, b) => b.avg - a.avg);

          const rankMap = new Map<number, string>();
          ranked.forEach((r, idx) =>
            rankMap.set(r.id, roman[idx] || String(idx + 1)),
          );

          setWeekRank(rankMap.get(scoreData.id) ?? "");
        }
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }, [scoreIdParam]);

  useEffect(() => {
    // fetch initial data (async) — allowed to set state from result
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();

    const onSoldiersUpdated = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail) return;
      const wk = Number(detail.weekId);
      const unit = detail.unit as string;

      if (Number(weekId) === wk && score?.unit === unit) {
        fetchData();
      }
    };

    window.addEventListener(
      "soldiersUpdated",
      onSoldiersUpdated as EventListener,
    );

    return () => {
      window.removeEventListener(
        "soldiersUpdated",
        onSoldiersUpdated as EventListener,
      );
    };
  }, [fetchData, score?.unit, weekId]);
  // ================= LƯU ĐIỂM =================

  const handleSave = async () => {
    if (!editScore || !editComment) return;

    // Keep existing saved 'strong' (shared) — only normalize weak on save
    const normalizedComment = {
      ...editComment,
      strong: comment?.strong ?? normalizeLines(editComment.strong),
      weak: normalizeLines(editComment.weak),
    };

    try {
      await updateScore(editScore);

      // If there is an existing comment record (has id) -> update; otherwise create
      if (normalizedComment.id && normalizedComment.id > 0) {
        await updateComment(normalizedComment);
        setComment(normalizedComment);
        setEditComment(normalizedComment);
      } else {
        // create new comment
        const { addComment } = await import("../services/commentService");
        const created = await addComment({
          weekId: normalizedComment.weekId,
          unit: normalizedComment.unit,
          strong: normalizeLines(normalizedComment.strong),
          weak: normalizeLines(normalizedComment.weak),
        });
        setComment(created);
        setEditComment(created);
      }

      setScore(editScore);
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

  // ================= XÓA ĐƠN VỊ =================

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

  // ================= CHIẾN SĨ =================

  const handleAddSoldier = () => {
    setEditingSoldier(null);
    setOpenModal(true);
  };

  const handleEditSoldier = (soldier: Soldier) => {
    setEditingSoldier(soldier);
    setOpenModal(true);
  };

  /**
   * Lưu trực tiếp trên bảng
   */
  // const handleSaveRow = async (soldier: Soldier) => {
  //   try {
  //     const updated = await updateSoldier(soldier);

  //     setSoldiers((prev) =>
  //       prev.map((item) => (item.id === updated.id ? updated : item)),
  //     );

  //     alert("Đã lưu chiến sĩ!");
  //   } catch (error) {
  //     console.error(error);
  //     alert("Không thể lưu chiến sĩ!");
  //   }
  // };

  /**
   * Lưu từ popup
   */
  const handleSaveSoldier = async (soldier: Soldier | Omit<Soldier, "id">) => {
    try {
      // If soldier has a positive id it's a persisted per-week soldier -> update
      if ("id" in soldier && soldier.id > 0) {
        const updated = await updateSoldier(soldier as Soldier);

        setSoldiers((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item)),
        );
      } else {
        // Negative ids come from masterSoldiers fallback; when saving, create a new per-week soldier
        const toCreate: Omit<Soldier, "id"> = {
          weekId: score?.weekId ?? (soldier as Soldier).weekId,
          unit: score?.unit ?? (soldier as Soldier).unit,
          name: soldier.name,
          quanSo: soldier.quanSo ?? 10,
          hocTap: soldier.hocTap ?? 10,
          tacPhong: soldier.tacPhong ?? 10,
          kyLuat: soldier.kyLuat ?? 10,
          noiVu: soldier.noiVu ?? 10,
          tangGia: soldier.tangGia ?? 10,
          vkTrangBi: soldier.vkTrangBi ?? 10,
          strong: soldier.strong ?? [],
          weak: soldier.weak ?? [],
          note: soldier.note ?? "",
        };

        const created = await addSoldier(toCreate);

        setSoldiers((prev) => [
          ...prev.filter(
            (s) => !(s.name === created.name && s.unit === created.unit),
          ),
          created,
        ]);
      }

      setEditingSoldier(null);
      setOpenModal(false);
    } catch (error) {
      console.error(error);
      alert("Không thể lưu chiến sĩ!");
    }
  };

  const handleDeleteSoldier = async (id: number) => {
    // If id is negative it is a master-fallback entry; instruct user to delete from master list instead.
    if (id <= 0) {
      alert(
        "Đây là chiến sĩ mặc định từ danh sách chính. Để xóa vĩnh viễn, hãy dùng chức năng quản lý chiến sĩ.",
      );
      return;
    }

    if (!window.confirm("Bạn có chắc muốn xóa chiến sĩ này?")) {
      return;
    }

    try {
      await deleteSoldier(id);

      setSoldiers((prev) => prev.filter((item) => item.id !== id));

      alert("Đã xóa chiến sĩ!");
    } catch (error) {
      console.error(error);
      alert("Không thể xóa chiến sĩ!");
    }
  };

  // ================= ĐẨY NHẬN XÉT =================

  const handlePushToUnit = async (
    soldier: Soldier,
    type: "strong" | "weak",
  ) => {
    if (!comment) return;

    const newLines =
      type === "strong"
        ? soldier.strong.filter((line) => !comment.strong.includes(line))
        : soldier.weak
            .map((line) => `${soldier.name}: ${line}`)
            .filter((line) => !comment.weak.includes(line));
    if (newLines.length === 0) {
      alert("Các ý này đã có trong nhận xét.");
      return;
    }

    const updated = {
      ...comment,
      [type]: [...comment[type], ...newLines],
    };

    try {
      await updateComment(updated);

      setComment(updated);
      setEditComment(updated);

      alert("Đã cập nhật nhận xét!");
    } catch (error) {
      console.error(error);
      alert("Không thể cập nhật nhận xét!");
    }
  };

  if (loading) {
    return <h2 className="detail-state">Đang tải...</h2>;
  }

  if (error) {
    return <h2 className="detail-state detail-error">{error}</h2>;
  }

  const current = isEditing ? editScore : score;

  const total = totalOf(current);

  const average = (total / SCORE_FIELDS.length).toFixed(1);
  return (
    <>
      <Header />

      <div className="detail-page">
        {/* ================= TIÊU ĐỀ ================= */}

        <div className="detail-header">
          <div>
            <h1 className="detail-title">CHI TIẾT THI ĐUA</h1>

            <p className="detail-subtitle">
              Tuần {weekId} · <strong>{score?.unit}</strong>
            </p>
          </div>

        <button
  className="back-btn"
  onClick={() =>
    navigate("/", {
      state: {
        selectedWeekId: location.state?.selectedWeekId,
      },
    })
  }
>
  ← Quay lại
</button>
        </div>

        {/* ================= THỐNG KÊ ================= */}

        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-label">Tổng điểm</span>

            <span className="stat-value">{Number(total).toFixed(1)}</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Trung bình</span>

            <span className="stat-value">{average}</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Xếp loại</span>

            <span className="stat-value">{weekRank || rankOf(total)}</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Chiến sĩ</span>

            <span className="stat-value">{soldiers.length}</span>
          </div>
        </div>

        {/* ================= ĐIỂM THI ĐUA ================= */}

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
              <div key={field.key} className="form-group">
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
                  <div className="form-value">
                    {Number(score?.[field.key] ?? 0).toFixed(1)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
        {/* ================= NHẬN XÉT ================= */}

        <section className="detail-card">
          <div className="card-header">
            <h2>Nhận xét</h2>
          </div>

          <div className="comment-section">
            <div className="comment-card">
              <h3 className="comment-heading strong">Điểm mạnh</h3>

              {comment?.strong.length ? (
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

        {/* ================= DANH SÁCH CHIẾN SĨ ================= */}

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
            onSelect={setViewingSoldier}
            showExtras={true}
          />
        </section>

        <SoldierDetailModal
          soldier={viewingSoldier}
          onClose={() => setViewingSoldier(null)}
          onEdit={(soldier) => {
            setViewingSoldier(null);
            handleEditSoldier(soldier);
          }}
          onPushToUnit={handlePushToUnit}
        />

        <SoldierModal
          key={`${openModal}-${score?.weekId ?? 0}-${score?.unit ?? ""}-${editingSoldier?.id ?? "new"}`}
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
