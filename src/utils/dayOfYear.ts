// src/utils/dayOfYear.ts

/** Số thứ tự của ngày trong năm: 1..366 */
export const getDayOfYear = (date: Date = new Date()) => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
};

/**
 * Lấy phần tử "của ngày hôm nay" trong danh sách.
 * - Nếu phần tử có trường `day` (1..366) thì ưu tiên khớp theo `day`.
 * - Nếu không có thì lấy theo thứ tự, tự quay vòng khi danh sách ngắn hơn 366.
 */
export const pickForToday = <T extends { day?: number }>(
  list: T[],
  date: Date = new Date(),
): T | null => {
  if (list.length === 0) return null;

  const day = getDayOfYear(date);

  return list.find((item) => item.day === day) ?? list[(day - 1) % list.length];
};

/** Định dạng ngày dd/MM/yyyy */
export const formatDate = (date: Date = new Date()) =>
  date.toLocaleDateString("vi-VN");
