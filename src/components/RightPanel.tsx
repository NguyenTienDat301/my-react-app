import React from "react";
import type { Score } from "../types/interface";
import "../styles/rightPanel.css";

interface RightPanelProps {
  scores: Score[];
}

const RightPanel: React.FC<RightPanelProps> = ({ scores }) => {

  const ranking = [...scores]
    .map((item) => ({
      ...item,
      total:
        item.quanSo +
        item.hocTap +
        item.tacPhong +
        item.kyLuat +
        item.noiVu +
        item.tangGia +
        item.vkTrangBi,
    }))
    .sort((a, b) => b.total - a.total);


  return (
    <aside className="right-panel">

      {/* HOA ĐẸP */}
      <div className="flower-box">

        <h2>
          NHỮNG BÔNG HOA ĐẸP
        </h2>


        <div className="flower-section">

          <h3>TẬP THỂ:</h3>

          {ranking.slice(0,3).map((item,index)=>(
            <div className="line-item" key={item.id}>
              {index+1}. {item.unit}
            </div>
          ))}

        </div>


        <div className="flower-section">

          <h3>CÁ NHÂN:</h3>

          {ranking.slice(0,3).map((item,index)=>(
            <div className="line-item" key={item.id}>
              {index+1}. {item.name}
            </div>
          ))}

        </div>


      </div>


      {/* CÂU HỎI */}
      <div className="question-box">

        <h2>
          MỖI NGÀY MỘT CÂU HỎI
        </h2>


        <div className="question-content">

          <p>
            1. Quân đội nhân dân Việt Nam thành lập ngày nào?
          </p>


          <div className="answer-line">
          </div>

          <div className="answer-line">
          </div>

          <div className="answer-line">
          </div>


        </div>


      </div>


    </aside>
  );
};


export default RightPanel;