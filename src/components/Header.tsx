import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useThemeStore } from "../Store/TeamToggle";
import { useTermStore } from "../Store/SearchStore";
import { useAuthStore } from "../Store/authStore";
import ProfileModal from "../Pages/ProfileEditor"; // <-- import your modal here

const Header: React.FC = () => {

  const { isDark, toggleTheme } = useThemeStore(); 
  // Access theme state and function to toggle between dark/light mode

  const { isAuthenticated, user } = useAuthStore(); 
  // Access authentication state and current user info

  const [change, setChange] = useState(false); 
  // State to track menu toggle (e.g., hamburger menu open/close)

  const [showProfileModal, setShowProfileModal] = useState(false); 
  // State to control visibility of the profile modal

  const toggleMenu = () => setChange(!change); 
  // Function to toggle the menu open/close state

  const navigate = useNavigate(); 
  // React Router hook for programmatic navigation

  const setTerm = useTermStore((state) => state.setTerm); 
  // Access function from Zustand store to set the Terms & Conditions state


  return (
    <>
      <header className={`${isDark ? "HeaderToggle" : ""}`}>
        <header
          className={`borderChangeHome d-flex flex-row justify-content-around align-items-center p-3 position-fixed w-100 top-0 z-1 ${
            isDark ? "HeaderToggle" : ""
          }`}
        >
          <div className="all1 d-flex align-items-center gap-2 ">
            <img src="/pro.png" alt="" width={"25px"}/>
            <h4 onClick={() => navigate("/")} className="text-decoration-none">
              <span style={{color:"#22CA39"}}>Freshman</span>EXAM
            </h4>
          </div>

          {/* Navigation Menu */}
          <nav className={`all2 ${change ? "" : "hide"}`}>
            <a href="/" className="text-decoration-none">
              Home
            </a>
            <a href="/courses" className="text-decoration-none">
              Course
            </a>
            <a href="/blog" className="text-decoration-none">
              Blog
            </a>
            <a href="/about" className="text-decoration-none">
              About
            </a>
            <a href="/contact" className="text-decoration-none">
              Contact
            </a>
            <div className="s1">
              {!isAuthenticated || user?.role !== "user" && (
                <Link
                  to="/User/Login"
                  className="loginD rounded-2 px-4 py-1 btn text-decoration-none text-start"
                >
                  Login
                </Link>
              )}
              <div className="search">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search ..."
                  onChange={(e) => setTerm(e.target.value)}
                />
              </div>
            </div>
          </nav>

          {/* Search Box & Auth Buttons */}
          <div className="all3 d-flex gap-4 align-items-center">
            {!isAuthenticated || user?.role !== "user" ? (
              <Link
                to="/User/Login"
                className="loginD rounded-2 px-3 py-1 btn text-decoration-none shadow"
                style={{ border: "1px solid var(--grean-color)" }}
              >
                Login
              </Link>
            ) : (
              // Open modal on click instead of Link navigation
              <div
                className="profile p-0 rounded-circle d-flex justify-content-center align-items-center text-dark text-decoration-none"
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#28a745",
                  cursor: "pointer",
                }}
                onClick={() => setShowProfileModal(true)}
                title="Edit Profile"
              >
                <p className="text-white fs-5 m-0">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </p>
              </div>
            )}
            <div className="search searchD">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="search"
                className="form-control"
                placeholder="Search ..."
                onChange={(e) => setTerm(e.target.value)}
              />
            </div>
            <i
              className={`fa-solid moon fs-4 ${isDark ? "fa-sun" : "fa-moon"}`}
              onClick={toggleTheme}
              style={{ cursor: "pointer" }}
            ></i>
          </div>

          {/* Icon Menu for Small Screens */}
          <div className="icon-hide">
            <i
              className={`fa-solid moon fs-4 ${isDark ? "fa-sun" : "fa-moon"}`}
              style={{ cursor: "pointer" }}
              onClick={toggleTheme}
            ></i>

            {isAuthenticated && user?.role === "user" ? (
              <div
                className="profile p-0 rounded-circle d-flex justify-content-center align-items-center text-dark text-decoration-none"
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#28a745",
                  cursor: "pointer",
                }}
                onClick={() => setShowProfileModal(true)}
                title="Edit Profile"
              >
                <p className="text-white fs-5 m-0">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </p>
              </div>
            ) : null}

            <i
              className={`menu fa-solid ${change ? "fa-x" : "fa-bars"}`}
              onClick={toggleMenu}
            ></i>
          </div>
        </header>
      </header>

      {/* Profile Modal */}
      <ProfileModal show={showProfileModal} onHide={() => setShowProfileModal(false)} />

    </>
  );
};

export default Header;
