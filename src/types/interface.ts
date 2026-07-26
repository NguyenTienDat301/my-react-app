export interface Score {
  id: number;
  weekId: number;
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
  weekId: number;
  unit: string;

  strong: string[];
  weak: string[];
}
export interface Week {
  id: number;
  date: string;
  title: string;
}