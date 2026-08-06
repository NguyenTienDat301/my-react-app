import React from "react";
import type { Week } from "../types/interface";
import "../styles/footer.css";
interface FooterProps {
  currentWeek: Week | null;
}

const Footer: React.FC<FooterProps> = ({ currentWeek }) => {
  const formatDate = (date: string) => {
    const d = new Date(date);

    return `Ngày ${d.getDate()} tháng ${d.getMonth() + 1} năm ${d.getFullYear()}`;
  };
  
  return (
    <footer className="footer">
      <div className="footer-left">
        <p>
          {currentWeek
            ? formatDate(currentWeek.date)
            : "Ngày ...... tháng ...... năm ......"}
        </p>
      </div>

      <div className="signature">
        <strong>T/M TỔ THI ĐUA</strong>
        <br />
        Hưng
        <br />
        {/* <br /> */}
        Lê Văn Hưng
        <br />
        {/* <br /> */}
        (Ký, ghi rõ họ tên)
      </div>
    </footer>
  );
};

export default Footer;
