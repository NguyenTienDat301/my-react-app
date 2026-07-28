import React, { useEffect, useState } from "react";

interface Question {
  id: number;
  content: string;
}

const LeftPanel: React.FC = () => {
  const [question, setQuestion] = useState("");

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch("http://localhost:3001/questions");
        const data: Question[] = await res.json();

        if (data.length > 0) {
          const random =
            data[Math.floor(Math.random() * data.length)];

          setQuestion(random.content);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchQuestion();
  }, []);

  return (
    <aside className="left-panel">
      {/* Nội dung phong trào */}
      <div className="box">
        <h3>NỘI DUNG PHONG TRÀO THI ĐUA</h3>

        <ol className="rule-list">
          <li>Chấp hành nghiêm điều lệnh, điều lệ Quân đội.</li>
          <li>Duy trì nghiêm nền nếp chính quy.</li>
          <li>Không có cán bộ, chiến sĩ vi phạm kỷ luật.</li>
          <li>Hoàn thành tốt nhiệm vụ huấn luyện và SSCĐ.</li>
          <li>Thực hiện tốt công tác nội vụ vệ sinh.</li>
          <li>Quản lý tốt vũ khí trang bị kỹ thuật.</li>
          <li>Tăng gia sản xuất, xây dựng doanh trại xanh - sạch - đẹp.</li>
          <li>Đoàn kết nội bộ, giúp đỡ đồng chí đồng đội.</li>
        </ol>
      </div>

      {/* Câu hỏi pháp luật */}
      <div className="box">
        <h3>MỖI NGÀY MỘT CÂU HỎI PHÁP LUẬT</h3>

        <p>
          <strong>Câu hỏi:</strong>
        </p>

        <p>{question}</p>
      </div>
    </aside>
  );
};

export default LeftPanel;