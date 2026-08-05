// import "./Header.css";
import { Link } from "react-router-dom";
import "../styles/header.css";

const Header = () => {
  return (
    <header className="header">
      <Link to="/">
        {" "}
        <img src="/img/logo2.png" className="logo" alt="logo" />
      </Link>

      <div className="title">
        <h1>CÁN BỘ, CHIẾN SĨ ĐẠI ĐỘI PK16</h1>

        <h2>
          QUYẾT TÂM THỰC HIỆN THẮNG LỢI PHONG TRÀO THI ĐUA QUYẾT THẮNG NĂM 2026
        </h2>
      </div>
    </header>
  );
};

export default Header;
