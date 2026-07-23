export interface danhSach {
  id?: number;
  unit: string;
  quanSo: number;
  hocTap: number;
  tacPhong: number;
  kyLuat: number;
  noiVu: number;
  tangGia: number;
  vkTrangBi: number;
}

// ScoreField định nghĩa tên của các trường điểm số
export type ScoreField = keyof Omit<danhSach, 'id' | 'unit'>;