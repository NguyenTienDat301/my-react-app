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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Điểm
        const scoreRes = await fetch(`http://localhost:3001/scores/${scoreId}`);

        if (!scoreRes.ok) {
          throw new Error("Không lấy được điểm.");
        }

        const scoreData: Score = await scoreRes.json();

        setScore(scoreData);

        // Nhận xét
        const commentRes = await fetch(
          `http://localhost:3001/comments?weekId=${scoreData.weekId}&unit=${encodeURIComponent(scoreData.unit)}`,
        );

        if (!commentRes.ok) {
          throw new Error("Không lấy được nhận xét.");
        }

        const commentData: CommentItem[] = await commentRes.json();

        setComment(Array.isArray(commentData) ? commentData[0] ?? null : null);
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
          <tr>
            <td>Quân số</td>
            <td>{score?.quanSo}</td>
          </tr>

          <tr>
            <td>Học tập</td>
            <td>{score?.hocTap}</td>
          </tr>

          <tr>
            <td>Tác phong</td>
            <td>{score?.tacPhong}</td>
          </tr>

          <tr>
            <td>Kỷ luật</td>
            <td>{score?.kyLuat}</td>
          </tr>

          <tr>
            <td>Nội vụ</td>
            <td>{score?.noiVu}</td>
          </tr>

          <tr>
            <td>Tăng gia</td>
            <td>{score?.tangGia}</td>
          </tr>

          <tr>
            <td>VKTB</td>
            <td>{score?.vkTrangBi}</td>
          </tr>
        </tbody>
      </table>

      <div className="comment-section">
        <div className="comment-card">
          <h3>Điểm mạnh</h3>

          <ul>
            {comment?.strong.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="comment-card">
          <h3>Điểm yếu</h3>

          <ul>
            {comment?.weak.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <button className="back-btn" onClick={() => navigate("/")}>
        Quay lại
      </button>
      </div>
    </>
  );
};

export default UnitDetail;
