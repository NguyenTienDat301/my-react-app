import React, { useEffect, useState } from "react";
import { getDayOfYear } from "../utils/dayOfYear";
import "../styles/teaching.css";

interface Loiday {
  id: number;
  day?: number;
  content: string;
}

const Teaching: React.FC = () => {
  const [teaching, setTeaching] = useState("");

  // Lấy lời dạy theo ngày trong năm (1..366)
  useEffect(() => {
    const fetchTeaching = async () => {
      try {
        const res = await fetch("http://localhost:3001/teachings");
        const data: Loiday[] = await res.json();
        if (data.length === 0) return;

        const day = getDayOfYear();

        const item =
          data.find((x) => x.day === day) ?? data[(day - 1) % data.length];

        setTeaching(item.content);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTeaching();
  }, []);

  return (
    <div className="comment-box">
      <h3>LỜI BÁC HỒ DẠY NGÀY NÀY NĂM XƯA</h3>

      <div className="bac-box">
        <p className="bac-text">{teaching}</p>
      </div>
    </div>
  );
};

export default Teaching;
