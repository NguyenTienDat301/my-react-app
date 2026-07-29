import axios from "axios";
import type { Score } from "../types/interface";

const API = "http://localhost:3001";

export const getScoreById = async (
  id: number
): Promise<Score> => {
  const res = await axios.get(`${API}/scores/${id}`);

  return res.data;
};


export const updateScore = async (
  score: Score
) => {
  const res = await axios.put(
    `${API}/scores/${score.id}`,
    score
  );

  return res.data;
};


export const deleteScore = async (
  id: number
) => {
  return axios.delete(
    `${API}/scores/${id}`
  );
};