// src/services/dailyService.ts
import { pickForToday } from "../utils/dayOfYear";

const API = "http://localhost:3001";

export interface DailyItem {
  id: number;
  day?: number; // 1..366 (nếu có)
  content: string;
}

const getList = async (
  resource: "questions" | "teachings",
): Promise<DailyItem[]> => {
  const res = await fetch(`${API}/${resource}`);
  if (!res.ok) throw new Error(`Không lấy được dữ liệu ${resource}`);
  return res.json();
};

/** Câu hỏi pháp luật của ngày hôm nay */
export const getQuestionOfToday = async (date?: Date) =>
  pickForToday(await getList("questions"), date);

/** Lời dạy của Bác của ngày hôm nay */
export const getTeachingOfToday = async (date?: Date) =>
  pickForToday(await getList("teachings"), date);
