import React, { useEffect, useState } from "react";

import Header from "../components/Header";
import LeftPanel from "../components/LeftPanel";
import ScoreTable from "../components/ScoreTable";
import CommentTable from "../components/CommentTable";
import RightPanel from "../components/RightPanel";
import CommentBox from "../components/CommentBox";
import Footer from "../components/Footer";
import type { CommentItem, Score, Week } from "../types/interface";
import "../styles/thidua.css";

const ThiDua: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [currentWeek, setCurrentWeek] = useState<Week | null>(null);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const fetchWeekData = async (week: Week) => {
    try {
      setLoading(true);
      setCurrentWeek(week);

      // Lấy điểm
      const scoreRes = await fetch(
        `http://localhost:3001/scores?weekId=${week.id}`,
      );

      if (!scoreRes.ok) {
        throw new Error("Không lấy được điểm");
      }

      const scoreData: Score[] = await scoreRes.json();
      setScores(scoreData);

      if (scoreData.length > 0) {
        setSelectedId(scoreData[0].id);
      }

      // Lấy nhận xét
      const commentRes = await fetch(
        `http://localhost:3001/comments?weekId=${week.id}`,
      );

      if (!commentRes.ok) {
        throw new Error("Không lấy được nhận xét");
      }

      const commentData: CommentItem[] = await commentRes.json();
      setComments(commentData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCurrentWeek = async () => {
      try {
        // Lấy danh sách tuần
        const weekRes = await fetch("http://localhost:3001/weeks");

        if (!weekRes.ok) {
          throw new Error("Không lấy được tuần");
        }

        const weekList: Week[] = await weekRes.json();
        setWeeks(weekList);

        if (weekList.length === 0) return;

        // Tuần mới nhất
        const latestWeek = [...weekList].sort((a, b) => b.id - a.id)[0];

        await fetchWeekData(latestWeek);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCurrentWeek();
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDateStr = e.target.value;
    setSelectedDate(selectedDateStr);

    // Tìm tuần chứa ngày được chọn
    const selectedWeek = weeks.find((week) => week.date === selectedDateStr);
    if (selectedWeek) {
      fetchWeekData(selectedWeek);
    }
  };

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
            {currentWeek && (
              <h3 className="week-title">
                {currentWeek.title} - {currentWeek.date}
              </h3>
            )}
            {/* <h3>THEO DÕI THI ĐUA</h3> */}

            <ScoreTable
              scores={scores}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          </div>

          <div className="box">
            {/* <h3>NHẬN XÉT</h3> */}

            <CommentTable comments={comments} />
          </div>
        </section>

        {/* ================= CỘT PHẢI ================= */}

        <aside className="right-panel">
          <RightPanel />
        </aside>
      </main>

      <CommentBox />
      {currentWeek && (
        <div className="week-title">
          {currentWeek.title} - {currentWeek.date}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ThiDua;
