import React, { useEffect, useState } from "react";

import Header from "../components/Header";
import LeftPanel from "../components/LeftPanel";
import ScoreTable from "../components/ScoreTable";
import CommentTable from "../components/CommentTable";
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
        const res = await fetch("http://localhost:3001/scores");

        if (!res.ok) {
          throw new Error("Không lấy được dữ liệu");
        }

        const data: Score[] = await res.json();

        setScores(data);

        if (data.length > 0) {
          setSelectedId(data[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  if (loading) {
    return <h2 className="loading">Đang tải dữ liệu...</h2>;
  }

  return (
    <div className="page">

      <Header />

      <main className="main">

        {/* ================= CỘT TRÁI ================= */}

        <aside className="left-panel">

          <LeftPanel />

        </aside>

        {/* ================= CỘT GIỮA ================= */}

        <section className="center-panel">

          <div className="box">

            {/* <h3>THEO DÕI THI ĐUA</h3> */}

            <ScoreTable
              scores={scores}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />

          </div>

          <div className="box">

            {/* <h3>NHẬN XÉT</h3> */}

            <CommentTable scores={scores} />

          </div>

        </section>

        {/* ================= CỘT PHẢI ================= */}

        <aside className="right-panel">

          <RightPanel />

        </aside>

      </main>

      <CommentBox />

      <Footer />

    </div>
  );
};

export default ThiDua;