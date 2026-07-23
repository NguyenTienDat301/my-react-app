import React, { useEffect, useState } from "react";

import Header from "../components/Header";
import LeftPanel from "../components/LeftPanel";
import ScoreTable from "../components/ScoreTable";
import RightPanel from "../components/RightPanel";
import CommentBox from "../components/CommentBox";
import Footer from "../components/Footer";

import "../styles/thidua.css";

import type { Score } from "../types/interface";

const ThiDua: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch("http://localhost:3001/scores");

        if (!response.ok) {
          throw new Error("Không lấy được dữ liệu");
        }

        const data: Score[] = await response.json();

        setScores(data);

        if (data.length > 0) {
          setSelectedId(data[0].id);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  if (loading) {
    return <h2>Đang tải dữ liệu...</h2>;
  }

  return (
    <div className="page">
      <Header />

      <div className="main">
        <LeftPanel />

        <ScoreTable
          scores={scores}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />

        <RightPanel />
      </div>

      <CommentBox />

      <Footer />
    </div>
  );
};

export default ThiDua;