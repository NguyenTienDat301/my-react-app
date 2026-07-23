// src/types/thiDua.ts

export interface Score {
  id: number;
  unit: string;

  // Nội dung chấm điểm
  quanSo: number;      // Quân số
  hocTap: number;      // Học tập
  tacPhong: number;    // Tác phong
  kyLuat: number;      // Kỷ luật
  noiVu: number;       // Nội vụ vệ sinh
  tangGia: number;     // Tăng gia SX
  vkTrangBi: number;   // VKTB
}

export type ScoreField =
  | "quanSo"
  | "hocTap"
  | "tacPhong"
  | "kyLuat"
  | "noiVu"
  | "tangGia"
  | "vkTrangBi";

export interface StrongRemark {
  id: number;
  content: string;
}

export interface WeakRemark {
  id: number;
  content: string;
}

export interface Flower {
  id: number;
  type: "tapThe" | "caNhan";
  name: string;
}

export interface LawQuestion {
  title: string;
  content: string;
}

export interface BoardInfo {
  slogan: string;
  date: string;
  signer: string;
}