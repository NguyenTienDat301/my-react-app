import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../components/Header";
import type { Score, CommentItem } from "../types/interface";

import "../styles/detail.css";

const UnitDetail: React.FC = () => {
  const { weekId, scoreId } = useParams();
  const navigate = useNavigate();

  const [score, setScore] = useState<Score | null>(null);
  const [comment, setComment] = useState<CommentItem | null>(null);

  const [editScore, setEditScore] = useState<Score | null>(null);
  const [editComment, setEditComment] = useState<CommentItem | null>(null);

  const [isEditing, setIsEditing] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const scoreRes = await fetch(`http://localhost:3001/scores/${scoreId}`);

        if (!scoreRes.ok) {
          throw new Error("Không lấy được điểm.");
        }

        const scoreData: Score = await scoreRes.json();

        setScore(scoreData);
        setEditScore(scoreData);

        const commentRes = await fetch(
          `http://localhost:3001/comments?weekId=${scoreData.weekId}&unit=${encodeURIComponent(
            scoreData.unit,
          )}`,
        );

        if (!commentRes.ok) {
          throw new Error("Không lấy được nhận xét.");
        }

        const commentData: CommentItem[] = await commentRes.json();

        const cmt =
          Array.isArray(commentData) && commentData.length > 0
            ? commentData[0]
            : null;

        setComment(cmt);
        setEditComment(cmt);
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
  }, [scoreId]);

  const handleSave = async () => {
    if (!editScore || !editComment) return;

    try {
      await fetch(`http://localhost:3001/scores/${editScore.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editScore),
      });

      await fetch(`http://localhost:3001/comments/${editComment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editComment),
      });

      setScore(editScore);
      setComment(editComment);

      setIsEditing(false);

      alert("Cập nhật thành công!");
    } catch {
      alert("Không thể cập nhật dữ liệu!");
    }
  };

  if (loading) {
    return <h2 className="loading">Đang tải...</h2>;
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

        <div className="comment-section">
          <div className="comment-card">
            <h3>Điểm mạnh</h3>

            {isEditing ? (
              <textarea
                rows={6}
                style={{ width: "100%" }}
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
                style={{ width: "100%" }}
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

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            marginTop: 20,
          }}
        >
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

          <button className="back-btn" onClick={() => navigate("/")}>
            Quay lại
          </button>
        </div>
      </div>
    </>
  );
};

export default UnitDetail;
