import React, { useEffect, useState } from "react";
import "../styles/teaching.css"
interface Loiday {
  id: number;
  content: string;
}

const Teaching: React.FC = () => {
  const [teaching, setTeaching] = useState("");

  useEffect(() => {
    const fetchTeaching = async () => {
      try {
        const res = await fetch("http://localhost:3001/teachings");
        const data: Loiday[] = await res.json();

        if (data.length > 0) {
          const random =
            data[Math.floor(Math.random() * data.length)];

          setTeaching(random.content);
        }
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

        <p className="bac-text">
          {teaching}
        </p>

      </div>

    </div>
  );
};

export default Teaching;