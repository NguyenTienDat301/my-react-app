import type { Soldier } from "../types/interface";

const API = "http://localhost:3001/soldiers";
const MASTER_API = "http://localhost:3001/masterSoldiers";

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

  const data: Soldier[] = await res.json();

  // If there are per-week soldiers, return them.
  if (data && data.length > 0) return data;

  // Otherwise, fall back to masterSoldiers for this unit and synthesize default per-week entries.
  const mres = await fetch(`${MASTER_API}?unit=${encodeURIComponent(unit)}`);
  if (!mres.ok) return [];

  const masters: Array<{ id: number; unit: string; name: string }> = await mres.json();

  // Map master entries into Soldier objects with a negative id (indicates not persisted for this week).
  return masters.map((m, idx) => ({
    id: -(m.id),
    weekId,
    unit: m.unit,
    name: m.name,
    quanSo: 10,
    hocTap: 10,
    tacPhong: 10,
    kyLuat: 10,
    noiVu: 10,
    tangGia: 10,
    vkTrangBi: 10,
    strong: [],
    weak: [],
    note: "",
  }));
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