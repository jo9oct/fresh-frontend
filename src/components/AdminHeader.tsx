import React from "react";
import {useThemeStore} from "../Store/TeamToggle"

const Header: React.FC = () => {

    const { isDark, toggleTheme } = useThemeStore();

  return (
    <header className={`${isDark ? "HeaderToggle" : ""}`}>
    <header
      className={`d-flex p-3 justify-content-between align-items-center gap-5 ${isDark ? "HeaderToggle" : ""}`}
      style={{
        position: "fixed", 
        top: "0", 
        left: "0",
        width: "100%", 
        zIndex: "1000",
        opacity: "90%",
      }}
    >
      <div
        className="all1 d-flex align-items-center gap-2"
        style={{ paddingLeft: "30px" }}
      >
        <i className="fa-solid fa-graduation-cap fs-4"></i>
        <h4>
          <span  style={{color:"#179227"}}>Freshman</span>EXAM
        </h4>
      </div>

      <i
        className={`fa-solid moon fs-4 ${isDark ? "fa-sun" : "fa-moon"}`}
        onClick={toggleTheme}
        style={{ cursor: "pointer", paddingRight: "50px" }}
      ></i>
    </header>
    </header>
  );
};

export default Header;
