import React, { useEffect, useState } from "react";

import Header from "../components/Header";
import LeftPanel from "../components/LeftPanel";
import ScoreTable from "../components/ScoreTable";
import CommentTable from "../components/CommentTable";
import RightPanel from "../components/RightPanel";
import CommentBox from "../components/Teaching";
import Footer from "../components/Footer";
import type { CommentItem, Score, Week, Soldier } from "../types/interface";

import "../styles/thidua.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, Table, TableCell, TableRow } from "docx";

const API = "http://localhost:3001";

const UNIT_NAMES = ["Đại đội bộ", "Trung đội 1", "Trung đội 2"];
const SINGLE_UNIT_OPTIONS = [...UNIT_NAMES, "Trung đội 3"];

const SCORE_FIELDS = [
  { key: "quanSo", label: "Quân số", excel: "Quân_số", word: "Quân số" },
  { key: "hocTap", label: "Học tập", excel: "Học_tập", word: "Học tập" },
  {
    key: "tacPhong",
    label: "Tác phong",
    excel: "Tác_phong",
    word: "Tác phong",
  },
  { key: "kyLuat", label: "Kỷ luật", excel: "Kỷ_luật", word: "Kỷ luật" },
  { key: "noiVu", label: "Nội vụ", excel: "Nội_vụ", word: "Nội vụ" },
  { key: "tangGia", label: "Tăng gia", excel: "Tăng_gia", word: "Tăng gia" },
  { key: "vkTrangBi", label: "VKTB", excel: "VKTB", word: "VKTB" },
] as const;

type ScoreKey = (typeof SCORE_FIELDS)[number]["key"];
type ScoreValues = Record<ScoreKey, number>;
type CommentValues = { strong: string; weak: string };
type UnitForm = { scores: ScoreValues; comments: CommentValues };

const EMPTY_SCORES = Object.fromEntries(
  SCORE_FIELDS.map((f) => [f.key, 0]),
) as ScoreValues;
const EMPTY_COMMENTS: CommentValues = { strong: "", weak: "" };
const EMPTY_UNIT_FORM: UnitForm = {
  scores: EMPTY_SCORES,
  comments: EMPTY_COMMENTS,
};

const emptyUnitsForm = () =>
  Object.fromEntries(
    UNIT_NAMES.map((unit) => [unit, EMPTY_UNIT_FORM]),
  ) as Record<string, UnitForm>;

const totalOf = (item: Score) =>
  SCORE_FIELDS.reduce((sum, f) => sum + Number(item[f.key] ?? 0), 0);

const hasAnyScore = (scores: ScoreValues) =>
  SCORE_FIELDS.some((f) => Number(scores[f.key]) > 0);

const toLines = (text: string) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const getJson = async <T,>(path: string, errorMessage: string): Promise<T> => {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(errorMessage);
  return res.json();
};

const postJson = async (path: string, body: unknown, errorMessage: string) => {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(errorMessage);
  return res;
};

const getNextId = async (path: "/scores" | "/comments") => {
  const data = await getJson<{ id: number | string }[]>(
    path,
    "Không lấy được dữ liệu",
  );
  return data.reduce((max, item) => Math.max(max, Number(item.id)), 0) + 1;
};

const ThiDua: React.FC = () => {
 
  const [soldiers, setSoldiers] = useState<Soldier[]>([]);
  const [showToolbar, setShowToolbar] = useState(false);
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [currentWeek, setCurrentWeek] = useState<Week | null>(null);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWeekDate, setNewWeekDate] = useState("");
  const [showAddSingleModal, setShowAddSingleModal] = useState(false);
  const [singleUnit, setSingleUnit] = useState(UNIT_NAMES[0]);
  const [singleScore, setSingleScore] = useState<ScoreValues>(EMPTY_SCORES);
  const [singleComment, setSingleComment] =
    useState<CommentValues>(EMPTY_COMMENTS);
  const [newScoresData, setNewScoresData] = useState(emptyUnitsForm);

  const exportExcel = () => {
    const data = scores.map((item) => ({
      Đơn_vị: item.unit,
      ...Object.fromEntries(SCORE_FIELDS.map((f) => [f.excel, item[f.key]])),
      Tổng: totalOf(item),
    }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), "Thi Dua");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer]), `ThiDua_${currentWeek?.date}.xlsx`);
  };

  const exportWord = async () => {
    const row = (cells: string[]) =>
      new TableRow({
        children: cells.map(
          (text) => new TableCell({ children: [new Paragraph(text)] }),
        ),
      });

    const table = new Table({
      rows: [
        row(["Đơn vị", ...SCORE_FIELDS.map((f) => f.word)]),
        ...scores.map((item) =>
          row([item.unit, ...SCORE_FIELDS.map((f) => String(item[f.key]))]),
        ),
      ],
    });

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: `BẢNG THI ĐUA ${currentWeek?.title}`,
              heading: "Heading1",
            }),
            table,
          ],
        },
      ],
    });

    saveAs(await Packer.toBlob(doc), `ThiDua_${currentWeek?.date}.docx`);
  };

  const fetchWeekData = async (week: Week) => {
    try {
      setLoading(true);
      setCurrentWeek(week);

      const scoreData = await getJson<Score[]>(
        `/scores?weekId=${week.id}`,
        "Không lấy được điểm",
      );
      setScores(scoreData);
      if (scoreData.length > 0) setSelectedId(scoreData[0].id);

      const commentData = await getJson<CommentItem[]>(
        `/comments?weekId=${week.id}`,
        "Không lấy được nhận xét",
      );

      setComments(commentData);

      const soldierData = await getJson<Soldier[]>(
        `/soldiers?weekId=${week.id}`,
        "Không lấy được chiến sĩ",
      );

      setSoldiers(soldierData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCurrentWeek = async () => {
      try {
        const weekList = await getJson<Week[]>("/weeks", "Không lấy được tuần");
        setWeeks(weekList);
        if (weekList.length === 0) return;

        const latestWeek = [...weekList].sort((a, b) => b.id - a.id)[0];
        await fetchWeekData(latestWeek);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCurrentWeek();
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSelectedDate(e.target.value);

  const handleViewClick = () => {
    if (!selectedDate) {
      alert("Vui lòng chọn ngày!");
      return;
    }

    const selectedWeek = weeks.find((week) => week.date === selectedDate);
    if (selectedWeek) fetchWeekData(selectedWeek);
    else alert("Không tìm thấy dữ liệu cho ngày này!");
  };

  const updateUnitScore = (unit: string, key: ScoreKey, value: number) =>
    setNewScoresData((prev) => ({
      ...prev,
      [unit]: {
        ...prev[unit],
        scores: { ...prev[unit].scores, [key]: value },
      },
    }));

  const updateUnitComment = (
    unit: string,
    key: keyof CommentValues,
    value: string,
  ) =>
    setNewScoresData((prev) => ({
      ...prev,
      [unit]: {
        ...prev[unit],
        comments: { ...prev[unit].comments, [key]: value },
      },
    }));

  const handleAddScore = async () => {
    if (!newWeekDate) {
      alert("Vui lòng chọn ngày tạo!");
      return;
    }

    if (!UNIT_NAMES.some((unit) => hasAnyScore(newScoresData[unit].scores))) {
      alert("Vui lòng nhập dữ liệu cho ít nhất 1 trung đội!");
      return;
    }

    try {
      let nextScoreId = await getNextId("/scores");
      let nextCommentId = await getNextId("/comments");
      let targetWeek = weeks.find((w) => w.date === newWeekDate);

      // Nếu tuần chưa tồn tại, tạo tuần mới
      if (!targetWeek) {
        const newWeekId =
          Math.max(
            ...weeks.map((w) => Number(w.id)).filter((id) => !isNaN(id)),
            0,
          ) + 1;

        const newWeekToAdd = {
          id: newWeekId,
          date: newWeekDate,
          title: `Thi đua tuần ${newWeekId}`,
        };

        await postJson("/weeks", newWeekToAdd, "Không thêm được tuần mới");
        targetWeek = newWeekToAdd as Week;
        setWeeks([...weeks, targetWeek]);
      }

      const weekId = Number(targetWeek.id);

      for (const unit of UNIT_NAMES) {
        const { scores: unitScores, comments: unitComments } =
          newScoresData[unit];
        if (!hasAnyScore(unitScores)) continue;

        await postJson(
          "/scores",
          { id: nextScoreId++, weekId, unit, ...unitScores },
          "Không thêm được điểm mới",
        );

        if (unitComments.strong || unitComments.weak) {
          await postJson(
            "/comments",
            {
              id: nextCommentId++,
              weekId,
              unit,
              strong: toLines(unitComments.strong),
              weak: toLines(unitComments.weak),
            },
            "Không thêm được nhận xét mới",
          );
        }
      }

      setNewScoresData(emptyUnitsForm());
      setNewWeekDate("");
      setShowAddModal(false);

      await fetchWeekData(targetWeek);
      alert("Thêm dữ liệu cho 3 trung đội thành công!");
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi thêm dữ liệu!");
    }
  };

  const handleAddSingleUnit = async () => {
    try {
      if (!currentWeek) {
        alert("Chưa chọn tuần.");
        return;
      }

      const weekId = Number(currentWeek.id);

      await postJson(
        "/scores",
        {
          id: await getNextId("/scores"),
          weekId,
          unit: singleUnit,
          ...singleScore,
        },
        "Không thêm được điểm",
      );

      await postJson(
        "/comments",
        {
          id: await getNextId("/comments"),
          weekId,
          unit: singleUnit,
          strong: toLines(singleComment.strong),
          weak: toLines(singleComment.weak),
        },
        "Không thêm được nhận xét",
      );

      alert("Đã thêm đơn vị.");
      setSingleScore(EMPTY_SCORES);
      setSingleComment(EMPTY_COMMENTS);
      setSingleUnit(UNIT_NAMES[0]);
      setShowAddSingleModal(false);

      fetchWeekData(currentWeek);
    } catch (err) {
      console.log(err);
    }
  };

  const handlePrint = () => window.print();

  const handleEdit = (score: Score) => {
    console.log("Edit:", score);
    // sau này mở modal sửa
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;
    setScores((prev) => prev.filter((item) => item.id !== id));
  };

  if (loading) {
    return <h2 className="loading">Đang tải dữ liệu...</h2>;
  }

  const previewComments: CommentItem[] = comments.map((comment) => {
    const weakSoldiers = soldiers
      .filter((s) => s.unit === comment.unit && s.weak.length > 0)
      .slice(0, 2);

    const weakEntries = weakSoldiers.map((soldier) =>
      `${soldier.name}: ${soldier.weak[0].trim()}`,
    );

    const fallbackWeak = comment.weak[0] ? [comment.weak[0]] : [];

    return {
      ...comment,
      strong: comment.strong.slice(0, 2),
      weak: weakEntries.length > 0 ? weakEntries : fallbackWeak,
    };
  });

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
            <button
              className="setting-btn"
              onClick={() => setShowToolbar(!showToolbar)}
            >
              ⚙
            </button>

            {showToolbar && (
              <div className="toolbar">
                {/* Hàng trên */}
                <div className="toolbar-top">
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
                    className="btn-primary"
                  >
                    ➕ Thêm toàn bộ
                  </button>

                  <button
                    onClick={() => setShowAddSingleModal(true)}
                    className="btn-success"
                  >
                    ➕ Thêm đơn vị
                  </button>
                </div>

                {/* Hàng dưới */}
                <div className="toolbar-bottom">
                  <button className="print-btn" onClick={handlePrint}>
                    🖨 In
                  </button>

                  <button className="word-btn" onClick={exportWord}>
                    📄 Word
                  </button>

                  <button className="excel-btn" onClick={exportExcel}>
                    📊 Excel
                  </button>
                </div>
              </div>
            )}

            <ScoreTable
              scores={scores}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>

          <div className="box">
            <CommentTable comments={previewComments} />
          </div>
        </section>

        {/* ================= CỘT PHẢI ================= */}
        <aside className="right-panel">
          <RightPanel scores={scores} />
        </aside>
      </main>

      <CommentBox />

      <Footer currentWeek={currentWeek} />

      {/* ================= Modal Thêm Điểm ================= */}
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

              {UNIT_NAMES.map((unit) => (
                <div key={unit} className="unit-section">
                  <h3 className="unit-title">{unit}</h3>

                  <div className="form-row">
                    {SCORE_FIELDS.map((field) => (
                      <div key={field.key} className="form-group">
                        <label>{field.label}</label>
                        <input
                          type="number"
                          step="0.1"
                          value={newScoresData[unit].scores[field.key]}
                          onChange={(e) =>
                            updateUnitScore(
                              unit,
                              field.key,
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className="form-input"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="form-group">
                    <label>Điểm Mạnh (mỗi dòng một điểm)</label>
                    <textarea
                      value={newScoresData[unit].comments.strong}
                      onChange={(e) =>
                        updateUnitComment(unit, "strong", e.target.value)
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
                        updateUnitComment(unit, "weak", e.target.value)
                      }
                      placeholder="Ví dụ: Tăng gia chưa tốt&#10;Nội vụ chưa đồng đều"
                      className="form-textarea"
                      rows={2}
                    />
                  </div>
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

      {/* ================= Modal Thêm 1 Đơn Vị ================= */}
      {showAddSingleModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowAddSingleModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Thêm Đơn Vị</h2>
              <button
                className="close-btn"
                onClick={() => setShowAddSingleModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Đơn vị</label>
                <select
                  className="form-input"
                  value={singleUnit}
                  onChange={(e) => setSingleUnit(e.target.value)}
                >
                  {SINGLE_UNIT_OPTIONS.map((unit) => (
                    <option key={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                {SCORE_FIELDS.map((field) => (
                  <div key={field.key} className="form-group">
                    <label>{field.label}</label>
                    <input
                      type="number"
                      className="form-input"
                      value={singleScore[field.key]}
                      onChange={(e) =>
                        setSingleScore({
                          ...singleScore,
                          [field.key]: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label>Điểm mạnh</label>
                <textarea
                  rows={3}
                  className="form-textarea"
                  value={singleComment.strong}
                  onChange={(e) =>
                    setSingleComment({
                      ...singleComment,
                      strong: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Điểm yếu</label>
                <textarea
                  rows={3}
                  className="form-textarea"
                  value={singleComment.weak}
                  onChange={(e) =>
                    setSingleComment({ ...singleComment, weak: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowAddSingleModal(false)}
              >
                Hủy
              </button>

              <button className="btn-submit" onClick={handleAddSingleUnit}>
                Thêm đơn vị
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThiDua;
