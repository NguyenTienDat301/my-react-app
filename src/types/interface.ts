export interface Score {
  id: number;
  unit: string;

  quanSo: number;
  hocTap: number;
  tacPhong: number;
  kyLuat: number;
  noiVu: number;
  tangGia: number;
  vkTrangBi: number;
}

export interface CommentItem {
  id: number;
  unit: string;
  strong: string[];
  weak: string[];
}