import React, { useEffect, useState } from "react";

import Header from "../components/Header";
import LeftPanel from "../components/LeftPanel";
import ScoreTable from "../components/ScoreTable";
import CommentTable from "../components/CommentTable";
import RightPanel from "../components/RightPanel";
import CommentBox from "../components/Teaching";
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWeekDate, setNewWeekDate] = useState<string>("");

  // State cho 3 trung đội
  const unitNames = ["Đại đội bộ", "Trung đội 1", "Trung đội 2"];

  const defaultScoreData = {
    quanSo: 0,
    hocTap: 0,
    tacPhong: 0,
    kyLuat: 0,
    noiVu: 0,
    tangGia: 0,
    vkTrangBi: 0,
  };

  const defaultCommentData = {
    strong: "",
    weak: "",
  };

  const [newScoresData, setNewScoresData] = useState<{
    [key: string]: {
      scores: typeof defaultScoreData;
      comments: typeof defaultCommentData;
    };
  }>({
    "Đại đội bộ": { scores: defaultScoreData, comments: defaultCommentData },
    "Trung đội 1": { scores: defaultScoreData, comments: defaultCommentData },
    "Trung đội 2": { scores: defaultScoreData, comments: defaultCommentData },
  });

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
  };

  const handleViewClick = () => {
    if (!selectedDate) {
      alert("Vui lòng chọn ngày!");
      return;
    }

    // Tìm tuần chứa ngày được chọn
    const selectedWeek = weeks.find((week) => week.date === selectedDate);
    if (selectedWeek) {
      fetchWeekData(selectedWeek);
    } else {
      alert("Không tìm thấy dữ liệu cho ngày này!");
    }
  };
  const getNextScoreId = async () => {
    const res = await fetch("http://localhost:3001/scores");
    const data = await res.json();

    const maxId = data.reduce(
      (max: number, item: any) => Math.max(max, Number(item.id)),
      0,
    );

    return maxId + 1;
  };

  const getNextCommentId = async () => {
    const res = await fetch("http://localhost:3001/comments");
    const data = await res.json();

    const maxId = data.reduce(
      (max: number, item: any) => Math.max(max, Number(item.id)),
      0,
    );

    return maxId + 1;
  };
  const handleAddScore = async () => {
    if (!newWeekDate) {
      alert("Vui lòng chọn ngày tạo!");
      return;
    }

    // Kiểm tra xem có ít nhất 1 trung đội được nhập dữ liệu
    const hasData = unitNames.some((unit) => {
      const unitData = newScoresData[unit];
      return (
        unitData.scores.quanSo > 0 ||
        unitData.scores.hocTap > 0 ||
        unitData.scores.tacPhong > 0 ||
        unitData.scores.kyLuat > 0 ||
        unitData.scores.noiVu > 0 ||
        unitData.scores.tangGia > 0 ||
        unitData.scores.vkTrangBi > 0
      );
    });

    if (!hasData) {
      alert("Vui lòng nhập dữ liệu cho ít nhất 1 trung đội!");
      return;
    }

    try {
      let nextScoreId = await getNextScoreId();
      let nextCommentId = await getNextCommentId();
      let targetWeek = weeks.find((w) => w.date === newWeekDate);

      // Nếu tuần chưa tồn tại, tạo tuần mới
      if (!targetWeek) {
        const maxWeekId = Math.max(
          ...weeks.map((w) => Number(w.id)).filter((id) => !isNaN(id)),
          0,
        );
        // const maxWeekId = Math.max(...weeks.map((w) => w.id), 0);
        const newWeekId = maxWeekId + 1;

        const newWeekToAdd = {
          id: newWeekId,
          date: newWeekDate,
          title: `Thi đua tuần ${newWeekId}`,
        };

        const weekRes = await fetch("http://localhost:3001/weeks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newWeekToAdd),
        });

        if (!weekRes.ok) {
          throw new Error("Không thêm được tuần mới");
        }

        targetWeek = newWeekToAdd as Week;
        setWeeks([...weeks, targetWeek]);
      }

      // Thêm dữ liệu cho 3 trung đội
      for (const unit of unitNames) {
        const unitData = newScoresData[unit];

        // Bỏ qua nếu không có dữ liệu
        if (
          !unitData.scores.quanSo &&
          !unitData.scores.hocTap &&
          !unitData.scores.tacPhong &&
          !unitData.scores.kyLuat &&
          !unitData.scores.noiVu &&
          !unitData.scores.tangGia &&
          !unitData.scores.vkTrangBi
        ) {
          continue;
        }

        // Tạo ID mới cho score
        // const numericIds = scores
        //   .map((s) => {
        //     const id = typeof s.id === "string" ? parseInt(s.id) : s.id;
        //     return isNaN(id) ? 0 : id;
        //   });
        // const maxScoreId = numericIds.length > 0 ? Math.max(...numericIds) : 0;
        // const newScoreId = maxScoreId + 1;
        const scoreToAdd = {
          id: nextScoreId++,
          weekId: Number(targetWeek.id),
          unit,
          ...unitData.scores,
        };

        // const scoreToAdd = {
        //   id: newScoreId,
        //   weekId: targetWeek.id,
        //   unit: unit,
        //   ...unitData.scores,
        // };

        // POST điểm
        const scoreRes = await fetch("http://localhost:3001/scores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(scoreToAdd),
        });

        if (!scoreRes.ok) {
          throw new Error("Không thêm được điểm mới");
        }

        // POST nhận xét nếu có
        if (unitData.comments.strong || unitData.comments.weak) {
          const strongList = unitData.comments.strong
            .split("\n")
            .map((s) => s.trim())
            .filter((s) => s);
          const weakList = unitData.comments.weak
            .split("\n")
            .map((s) => s.trim())
            .filter((s) => s);

          // Tạo ID mới cho comment
          const commentToAdd = {
            id: nextCommentId++,
            weekId: Number(targetWeek.id),
            unit,
            strong: strongList,
            weak: weakList,
          };

          // const commentToAdd = {
          //   id: newCommentId,
          //   weekId: targetWeek.id,
          //   unit: unit,
          //   strong: strongList,
          //   weak: weakList,
          // };

          const commentRes = await fetch("http://localhost:3001/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(commentToAdd),
          });

          if (!commentRes.ok) {
            throw new Error("Không thêm được nhận xét mới");
          }
        }
      }

      // Reset form
      setNewScoresData({
        "Đại đội bộ": {
          scores: defaultScoreData,
          comments: defaultCommentData,
        },
        "Trung đội 1": {
          scores: defaultScoreData,
          comments: defaultCommentData,
        },
        "Trung đội 2": {
          scores: defaultScoreData,
          comments: defaultCommentData,
        },
      });
      setNewWeekDate("");
      setShowAddModal(false);

      // Reload dữ liệu từ tuần mới
      await fetchWeekData(targetWeek);
      alert("Thêm dữ liệu cho 3 trung đội thành công!");
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi thêm dữ liệu!");
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
            <div className="date-picker-container">
              <label htmlFor="date-picker">Chọn ngày:</label>
              <input
                id="date-picker"
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="date-picker"
              />
              <button onClick={handleViewClick} className="view-btn">
                Xem
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="add-btn btn-primary"
              >
                + Thêm
              </button>
            </div>
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
      {/* {currentWeek && (
        <div className="week-title">
          {currentWeek.title} - {currentWeek.date}
        </div>
      )} */}
      <Footer currentWeek={currentWeek} />

      {/* Modal Thêm Điểm */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Thêm Điểm Mới</h2>
              <button
                className="close-btn"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Ngày Tạo *</label>
                <input
                  type="date"
                  value={newWeekDate}
                  onChange={(e) => setNewWeekDate(e.target.value)}
                  className="form-input"
                />
              </div>

              {/* 3 Sections cho 3 trung đội */}
              {unitNames.map((unit) => (
                <div key={unit} className="unit-section">
                  <h3 className="unit-title">{unit}</h3>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Quân Số</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newScoresData[unit].scores.quanSo}
                        onChange={(e) =>
                          setNewScoresData({
                            ...newScoresData,
                            [unit]: {
                              ...newScoresData[unit],
                              scores: {
                                ...newScoresData[unit].scores,
                                quanSo: parseFloat(e.target.value) || 0,
                              },
                            },
                          })
                        }
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Học Tập</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newScoresData[unit].scores.hocTap}
                        onChange={(e) =>
                          setNewScoresData({
                            ...newScoresData,
                            [unit]: {
                              ...newScoresData[unit],
                              scores: {
                                ...newScoresData[unit].scores,
                                hocTap: parseFloat(e.target.value) || 0,
                              },
                            },
                          })
                        }
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Tác Phong</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newScoresData[unit].scores.tacPhong}
                        onChange={(e) =>
                          setNewScoresData({
                            ...newScoresData,
                            [unit]: {
                              ...newScoresData[unit],
                              scores: {
                                ...newScoresData[unit].scores,
                                tacPhong: parseFloat(e.target.value) || 0,
                              },
                            },
                          })
                        }
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Kỷ Luật</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newScoresData[unit].scores.kyLuat}
                        onChange={(e) =>
                          setNewScoresData({
                            ...newScoresData,
                            [unit]: {
                              ...newScoresData[unit],
                              scores: {
                                ...newScoresData[unit].scores,
                                kyLuat: parseFloat(e.target.value) || 0,
                              },
                            },
                          })
                        }
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Nội Vụ</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newScoresData[unit].scores.noiVu}
                        onChange={(e) =>
                          setNewScoresData({
                            ...newScoresData,
                            [unit]: {
                              ...newScoresData[unit],
                              scores: {
                                ...newScoresData[unit].scores,
                                noiVu: parseFloat(e.target.value) || 0,
                              },
                            },
                          })
                        }
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Tăng Gia</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newScoresData[unit].scores.tangGia}
                        onChange={(e) =>
                          setNewScoresData({
                            ...newScoresData,
                            [unit]: {
                              ...newScoresData[unit],
                              scores: {
                                ...newScoresData[unit].scores,
                                tangGia: parseFloat(e.target.value) || 0,
                              },
                            },
                          })
                        }
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>VKTB</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newScoresData[unit].scores.vkTrangBi}
                      onChange={(e) =>
                        setNewScoresData({
                          ...newScoresData,
                          [unit]: {
                            ...newScoresData[unit],
                            scores: {
                              ...newScoresData[unit].scores,
                              vkTrangBi: parseFloat(e.target.value) || 0,
                            },
                          },
                        })
                      }
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Điểm Mạnh (mỗi dòng một điểm)</label>
                    <textarea
                      value={newScoresData[unit].comments.strong}
                      onChange={(e) =>
                        setNewScoresData({
                          ...newScoresData,
                          [unit]: {
                            ...newScoresData[unit],
                            comments: {
                              ...newScoresData[unit].comments,
                              strong: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder="Ví dụ: Duy trì kỷ luật&#10;Huấn luyện tốt"
                      className="form-textarea"
                      rows={2}
                    />
                  </div>

                  <div className="form-group">
                    <label>Điểm Yếu (mỗi dòng một điểm)</label>
                    <textarea
                      value={newScoresData[unit].comments.weak}
                      onChange={(e) =>
                        setNewScoresData({
                          ...newScoresData,
                          [unit]: {
                            ...newScoresData[unit],
                            comments: {
                              ...newScoresData[unit].comments,
                              weak: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder="Ví dụ: Tăng gia chưa tốt&#10;Nội vụ chưa đồng đều"
                      className="form-textarea"
                      rows={2}
                    />
                  </div>

                  <hr style={{ margin: "15px 0", borderColor: "#ddd" }} />
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowAddModal(false)}
              >
                Hủy
              </button>
              <button className="btn-submit" onClick={handleAddScore}>
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThiDua;
