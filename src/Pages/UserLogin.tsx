import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faLock,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../Store/authStore";
import { Spinner } from "react-bootstrap";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";


const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60; // 15 minutes in seconds

const UserLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, user, isAuthenticated } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ emailOrUsername: "", password: "" });

  // Persistent login attempts
  const [loginAttempts, setLoginAttempts] = useState<number>(() => {
    const saved = localStorage.getItem("loginAttempts");
    return saved ? parseInt(saved) : 0;
  });

  // Persistent lockout timer (seconds remaining)
  const [lockoutTime, setLockoutTime] = useState<number>(() => {
    const saved = localStorage.getItem("lockoutTime");
    if (saved) {
      const remaining = Math.max(0, Math.floor((parseInt(saved) - Date.now()) / 1000));
      return remaining;
    }
    return 0;
  });

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated && user) navigate("/");
  }, [isAuthenticated, user, navigate]);

  // Lockout countdown
  useEffect(() => {
    if (lockoutTime <= 0) return;

    const timer = setInterval(() => {
      setLockoutTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          localStorage.removeItem("lockoutTime");
          setLoginAttempts(0);
          localStorage.removeItem("loginAttempts");
          return 0;
        }
        // Update localStorage with end timestamp
        localStorage.setItem("lockoutTime", (Date.now() + prev * 1000).toString());
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [lockoutTime]);

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTime > 0) return;

    try {
      await login(loginData.emailOrUsername, loginData.password);
      setLoginAttempts(0);
      localStorage.removeItem("loginAttempts");
    } catch (err: any) {
      const attempts = loginAttempts + 1;
      setLoginAttempts(attempts);
      localStorage.setItem("loginAttempts", attempts.toString());

      if (attempts >= MAX_ATTEMPTS) {
        const endTimestamp = Date.now() + LOCKOUT_DURATION * 1000;
        setLockoutTime(LOCKOUT_DURATION);
        localStorage.setItem("lockoutTime", endTimestamp.toString());
      }
    }
  };

  return (
    <>
      <style>{`
        .wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: url('/8553.jpg') no-repeat center;
            background-size: cover;
        }

        .form-box {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
          color: #fff;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 1);
          width: 100%;
          max-width: 450px;
        }

        .form-box h1 {
          text-align: center;
          margin-bottom: 30px;
          font-size: 24px;
        }

        .input-group {
          margin-bottom: 25px;
        }

        .input-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          width: 100%;
        }

        .input-box {
          position: relative;
        }

        .input-box input {
          width: 360px;
          height: 45px;
          background: transparent;
          border: 2px solid #fff;
          border-radius: 40px;
          padding: 0 45px 0 40px;
          color: #fff;
          font-size: 16px;
          outline: none;
        }

        .icon {
          position: absolute;
          top: 50%;
          left: 15px;
          transform: translateY(-50%);
          color: #fff;
        }

        .input-box input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }

        .input-box input:focus {
          border-color: #07ee41;
          border-width: 2px;
        }

        .toggle-password {
          position: absolute;
          top: 50%;
          right: 15px;
          transform: translateY(-50%);
          cursor: pointer;
          color: #fff;
        }

        .forgot-password {
          display: block;
          text-align: right;
          font-size: 14px;
          margin: 10px 0 25px;
        }

        .forgot-password a {
          color: #fff;
          text-decoration: none;
          font-weight: 500;
        }

        .forgot-password a:hover {
          text-decoration: underline;
        }

        .btn {
          width: 100%;
          height: 45px;
          background: #07ee41;
          border: none;
          border-radius: 40px;
          font-weight: 700;
          font-size: 16px;
          color: #000;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn:hover {
          background: #05d138;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(7, 238, 65, 0.4);
        }

        .btn:disabled {
          background: #cccccc;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .divider {
          display: flex;
          align-items: center;
          margin: 20px 0;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
        }

        .divider::before, .divider::after {
          content: "";
          flex: 1;
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
          margin: 0 10px;
        }

        .register-link {
          text-align: center;
          margin-top: 25px;
          font-size: 14px;
        }

        .register-link a {
          color: #07ee41;
          text-decoration: none;
          font-weight: 600;
        }

        .register-link a:hover {
          text-decoration: underline;
        }

        .google-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 45px;
          background-color: #fff;
          color: #444;
          border: none;
          border-radius: 40px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .google-btn:hover {
          background-color: #f1f1f1;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .google-icon {
          margin-right: 10px;
          font-size: 18px;
        }
      `}</style>

      {/* Your CSS styles remain the same */}
      {isLoading && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999
        }}>
          <Spinner animation="border" variant="light" role="status" />
        </div>
      )}

      <div className="wrapper">
        <div className="form-box login">
          <form onSubmit={handleLogin}>
            <h1>Login</h1>

            {lockoutTime > 0 && (
              <div className="alert alert-warning text-center">
                Too many failed attempts. Try again in {formatTime(lockoutTime)}
              </div>
            )}

            <div className="input-group">
              <label htmlFor="email" className="input-label">Email or Username</label>
              <div className="input-box">
                <FontAwesomeIcon icon={faEnvelope} className="icon" />
                <input
                  id="email"
                  type="text"
                  placeholder="Enter your email or username"
                  required
                  value={loginData.emailOrUsername}
                  onChange={(e) => setLoginData({ ...loginData, emailOrUsername: e.target.value })}
                  disabled={isLoading || lockoutTime > 0}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password" className="input-label">Password</label>
              <div className="input-box">
                <FontAwesomeIcon icon={faLock} className="icon" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  disabled={isLoading || lockoutTime > 0}
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
            </div>

            <div className="forgot-password">
              <Link to="/user/forgot-password">Forgot Password?</Link>
            </div>

            <button type="submit" className="btn" disabled={isLoading || lockoutTime > 0}>
              {isLoading ? <Spinner animation="border" size="sm" role="status" /> : "Login"}
            </button>

            <div className="divider">or sign in with</div>

            <button type="button" className="google-btn" onClick={() => {
              window.location.href = "http://localhost:5000/api/google/google";
            }} disabled={isLoading || lockoutTime > 0}>
              <FontAwesomeIcon icon={faGoogle} className="google-icon" /> Continue with Google
            </button>

            <div className="register-link">
              <p>Don't have an account? <Link to="/User/Register">Register</Link></p>
            </div>
          </form>
        </div>
      </div>
      
    </>
  );
};

export default UserLogin;
