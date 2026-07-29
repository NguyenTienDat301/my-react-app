import type { Soldier } from "../types/interface";

/**
 * Tổng điểm
 */
export const totalPoint = (soldier: Soldier): number => {
  return (
    soldier.quanSo +
    soldier.hocTap +
    soldier.tacPhong +
    soldier.kyLuat +
    soldier.noiVu +
    soldier.tangGia +
    soldier.vkTrangBi
  );
};

/**
 * Điểm trung bình
 */
export const averagePoint = (soldier: Soldier): string => {
  return (totalPoint(soldier) / 7).toFixed(2);
};

/**
 * Xếp loại
 */
export const rank = (soldier: Soldier): string => {
  const total = totalPoint(soldier);

  if (total >= 58) return "Xuất sắc";

  if (total >= 52) return "Khá";

  return "Trung bình";
};

/**
 * Top chiến sĩ xuất sắc
 */
export const excellentSoldiers = (
  soldiers: Soldier[],
): Soldier[] => {
  return soldiers.filter((item) => rank(item) === "Xuất sắc");
};

/**
 * Sắp xếp theo tổng điểm giảm dần
 */
export const sortByPoint = (
  soldiers: Soldier[],
): Soldier[] => {
  return [...soldiers].sort(
    (a, b) => totalPoint(b) - totalPoint(a),
  );
};