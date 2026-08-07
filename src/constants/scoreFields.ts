// src/constants/scoreFields.ts
// Dùng chung cho ScoreTable, UnitDetail, SoldierTable, SoldierModal

export const SCORE_FIELDS = [
  { key: "quanSo", label: "Quân số", short: "QS" },
  { key: "hocTap", label: "Học tập", short: "HT" },
  { key: "tacPhong", label: "Tác phong", short: "TP" },
  { key: "kyLuat", label: "Kỷ luật", short: "KL" },
  { key: "noiVu", label: "Nội vụ", short: "NV" },
  { key: "tangGia", label: "Tăng gia", short: "TG" },
  { key: "vkTrangBi", label: "VKTB", short: "VKTB" },
] as const;

export type ScoreKey = (typeof SCORE_FIELDS)[number]["key"];

export type ScoreValues = Record<ScoreKey, number>;

export const totalScore = (item: ScoreValues) =>
  SCORE_FIELDS.reduce((sum, f) => sum + Number(item[f.key] ?? 0), 0);

export const averageScore = (item: ScoreValues) =>
  (totalScore(item) / SCORE_FIELDS.length).toFixed(1);

export const rankOf = (total: number) => {
  if (total >= 58) return "I";
  if (total >= 52) return "II";
  return "III";
};

export const toLines = (text: string) =>
  text
    .split("\n")
    .map((line) => line.replace(/\r$/, ""))
    .filter((line) => line.trim() !== "");
