import type { CommentItem } from "../types/interface";

const API = "http://localhost:3001/comments";

/**
 * Lấy nhận xét theo tuần và đơn vị
 */
export const getComment = async (
  weekId: number,
  unit: string,
): Promise<CommentItem | null> => {
  const res = await fetch(
    `${API}?weekId=${weekId}&unit=${encodeURIComponent(unit)}`,
  );

  if (!res.ok) {
    throw new Error("Không lấy được nhận xét");
  }

  const data: CommentItem[] = await res.json();

  return data.length > 0 ? data[0] : null;
};

/**
 * Cập nhật nhận xét
 */
export const updateComment = async (
  comment: CommentItem,
): Promise<CommentItem> => {
  const res = await fetch(`${API}/${comment.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(comment),
  });

  if (!res.ok) {
    throw new Error("Không thể cập nhật nhận xét");
  }

  return res.json();
};

/**
 * Xóa nhận xét
 */
export const deleteComment = async (id: number) => {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Không thể xóa nhận xét");
  }
};