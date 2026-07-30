import React from "react";
import "../styles/leftPanel.css";

interface LeftPanelProps {
  title?: string;
  contents?: string[];
}

const LeftPanel: React.FC<LeftPanelProps> = ({
  title = "NỘI DUNG PHONG TRÀO THI ĐUA",
  contents=[],
}) => {
  return (
    <div className="left-panel">
      <div className="left-title">
        {title.split("\n").map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>

      <div className="left-body">
        {contents.length > 0 ? (
          contents.map((item, index) => (
            <div className="left-line" key={index}>
              {item}
            </div>
          ))
        ) : (
          Array.from({ length: 20 }).map((_, index) => (
            <div className="left-line empty" key={index}></div>
          ))
        )}
      </div>

      <div className="left-footer">
        🌺
      </div>
    </div>
  );
};

export default LeftPanel;