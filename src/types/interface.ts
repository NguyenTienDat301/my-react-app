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
export interface Comment {
  id: number;
  unit: string;
  strengths: string[];
  weaknesses: string[];
}