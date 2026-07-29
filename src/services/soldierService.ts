import type { Soldier } from "../types/interface";

const API = "http://localhost:3001/soldiers";

/**
 * Lấy toàn bộ chiến sĩ của 1 đại đội theo tuần
 */
export const getSoldiers = async (
  weekId: number,
  unit: string,
): Promise<Soldier[]> => {
  const res = await fetch(
    `${API}?weekId=${weekId}&unit=${encodeURIComponent(unit)}`,
  );

  if (!res.ok) {
    throw new Error("Không lấy được danh sách chiến sĩ");
  }

  return res.json();
};

/**
 * Lấy 1 chiến sĩ
 */
export const getSoldierById = async (
  id: number,
): Promise<Soldier> => {
  const res = await fetch(`${API}/${id}`);

  if (!res.ok) {
    throw new Error("Không tìm thấy chiến sĩ");
  }

  return res.json();
};

/**
 * Thêm chiến sĩ
 */
export const addSoldier = async (
  soldier: Omit<Soldier, "id">,
): Promise<Soldier> => {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(soldier),
  });

  if (!res.ok) {
    throw new Error("Không thể thêm chiến sĩ");
  }

  return res.json();
};

/**
 * Sửa chiến sĩ
 */
export const updateSoldier = async (
  soldier: Soldier,
): Promise<Soldier> => {
  const res = await fetch(`${API}/${soldier.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(soldier),
  });

  if (!res.ok) {
    throw new Error("Không thể cập nhật chiến sĩ");
  }

  return res.json();
};

/**
 * Xóa chiến sĩ
 */
export const deleteSoldier = async (
  id: number,
): Promise<void> => {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Không thể xóa chiến sĩ");
  }
};