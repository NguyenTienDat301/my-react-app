import React, { useEffect, useState } from "react";
import type { Score } from "../types/interface";
import "../styles/rightPanel.css";

interface Question {
  id: number;
  content: string;
}

interface RightPanelProps {
  scores: Score[];
}

const RightPanel: React.FC<RightPanelProps> = ({ scores }) => {
  const [question, setQuestion] = useState<Question | null>(null);

  // Mỗi lần load lại trang thì lấy random 1 câu hỏi
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch("http://localhost:3001/questions");
        if (!res.ok) throw new Error("Không lấy được câu hỏi");

        const data: Question[] = await res.json();
        if (data.length === 0) return;

        setQuestion(data[Math.floor(Math.random() * data.length)]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuestion();
  }, []);

  const ranking = [...scores]
    .map((item) => ({
      ...item,
      total:
        item.quanSo +
        item.hocTap +
        item.tacPhong +
        item.kyLuat +
        item.noiVu +
        item.tangGia +
        item.vkTrangBi,
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <aside className="right-panel">
      {/* HOA ĐẸP */}
      <div className="flower-box">
        <h2>NHỮNG BÔNG HOA ĐẸP</h2>

        <div className="flower-section">
          <h3>TẬP THỂ:</h3>

          {ranking.slice(0, 3).map((item, index) => (
            <div className="line-item" key={item.id}>
              {index + 1}. {item.unit}
            </div>
          ))}
        </div>

        <div className="flower-section">
          <h3>CÁ NHÂN:</h3>

          {ranking.slice(0, 3).map((item, index) => (
            <div className="line-item" key={item.id}>
              {index + 1}. {item.name}
            </div>
          ))}
        </div>
      </div>

      {/* CÂU HỎI */}
      <div className="question-box">
        <h2>MỖI NGÀY MỘT CÂU HỎI</h2>

        <div className="question-content">
          <p>{question ? `1. ${question.content}` : "Đang tải câu hỏi..."}</p>

          <div className="answer-line" />
          <div className="answer-line" />
          <div className="answer-line" />
        </div>
      </div>
    </aside>
  );
};

export default RightPanel;
