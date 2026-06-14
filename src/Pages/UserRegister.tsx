import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faEnvelope,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link } from "react-router-dom";
import PasswordStrengthMeter from "../components/passwordStrengthMeter";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../Store/authStore";
import { Spinner } from "react-bootstrap";

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60; // 15 minutes

const UserRegister: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, isLoading, error } = useAuthStore();

  const [registerData, setRegisterData] = useState({ username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // Persistent registration attempts
  const [regAttempts, setRegAttempts] = useState<number>(() => {
    const saved = localStorage.getItem("regAttempts");
    return saved ? parseInt(saved) : 0;
  });

  // Persistent lockout timer
  const [lockoutTime, setLockoutTime] = useState<number>(() => {
    const saved = localStorage.getItem("regLockoutTime");
    if (saved) {
      const remaining = Math.max(0, Math.floor((parseInt(saved) - Date.now()) / 1000));
      return remaining;
    }
    return 0;
  });

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // Lockout countdown
  useEffect(() => {
    if (lockoutTime <= 0) return;

    const timer = setInterval(() => {
      setLockoutTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          localStorage.removeItem("regLockoutTime");
          setRegAttempts(0);
          localStorage.removeItem("regAttempts");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [lockoutTime]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const validateInputs = () => {
    const { username, email, password } = registerData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!username.trim() || !email.trim() || !password.trim()) {
      toast.error("All fields are required.");
      return false;
    }

    if (!emailRegex.test(email)) {
      toast.error("Invalid email format.");
      return false;
    }

    if (username.length < 4) {
      toast.error("Username must be at least 4 characters.");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return false;
    }

    if (!agreed) {
      toast.error("You must agree to the terms and conditions.");
      return false;
    }

    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTime > 0) return; // prevent registration during lockout
    if (!validateInputs()) return;

    try {
      await signUp(registerData.username, registerData.email, registerData.password, "user");
      toast.success("Verification email sent! Please check your inbox.");
      setRegisterData({ username: "", email: "", password: "" });
      setAgreed(false);
      setRegAttempts(0);
      localStorage.removeItem("regAttempts");
      navigate("/user/verify-email");
    } catch {
      // Increment failed attempts
      const attempts = regAttempts + 1;
      setRegAttempts(attempts);
      localStorage.setItem("regAttempts", attempts.toString());

      if (attempts >= MAX_ATTEMPTS) {
        const endTimestamp = Date.now() + LOCKOUT_DURATION * 1000;
        setLockoutTime(LOCKOUT_DURATION);
        localStorage.setItem("regLockoutTime", endTimestamp.toString());
        toast.error(`Too many failed attempts. Try again in ${formatTime(LOCKOUT_DURATION)}`);
      }
    }
  };

  return (
    <div className="register-container">
      <style>
              {`/* General Reset for Registration */
              .register-container {
                background: url('/8553.jpg') no-repeat center center fixed;
                background-size: cover;
              }

              @media (max-width: 500px) {
                .register-container .form-box {
                  width: 90%;
                  padding: 30px 20px;
                }
              }

              /* Full-screen Centering and Background */
              .register-container {
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: url('/8553.jpg') no-repeat center;
                background-size: cover;
              }

              /* Card / Form Box */
              .register-container .form-box {
                background: rgba(0, 0, 0, 0.5);
                border: 1px solid rgba(255, 255, 255, 0.3);
                backdrop-filter: blur(10px);
                color: #fff;
                padding: 40px;
                border-radius: 13px;
                width: 450px;
                max-width: 470px; 
                box-shadow: 0 0 20px rgba(0, 0, 0, 1);
              }

              /* Title */
              .register-container .form-box h1 {
                text-align: center;
                margin-bottom: 30px;
                font-size: 28px;
                color: #fff;
              }

              /* Input box container */
              .register-container .input-box {
                position: relative;
                margin: 25px 0;
              }

              /* Input fields */
              .register-container .input-box input {
                width: 100%;
                height: 45px;
                background: transparent;
                border: 3px solid #fff;
                border-radius: 40px;
                padding: 0 45px 0 40px;
                color: #fff;
                font-size: 16px;
                outline: none;
              }

              .register-container .input-box input::placeholder {
                color: #fff;
              }

              /* Input focus */
              .register-container .input-box input:focus {
                border: 3px solid green;
              }

              /* Icon inside input */
              .register-container .icon {
                position: absolute;
                left: 15px;
                top: 50%;
                transform: translateY(-50%);
                color: #fff;
              }

              .register-container .toggle-password {
                position: absolute;
                right: 15px;
                top: 50%;
                transform: translateY(-50%);
                color: #fff;
                cursor: pointer;
              }

              /* Password Strength Meter */
              .register-container .strength-meter-container {
                margin: 10px 0 20px;
              }

              /* Terms and checkbox */
              .register-container .remember-forgot {
                font-size: 14px;
                margin-bottom: 20px;
                color: #fff;
                text-align: left;
              }

              /* Submit button */
              .register-container .btn {
                width: 100%;
                height: 45px;
                background: #000;
                border: none;
                border-radius: 40px;
                font-weight: 700;
                font-size: 18px;
                color: #fff;
                cursor: pointer;
                transition: background 0.3s, box-shadow 0.3s;
                box-shadow: 0 0 10px rgba(0, 0, 0, 1);
              }

              .register-container .btn:hover {
                box-shadow: 0 0 20px rgba(7, 238, 65, 1);
                transition: background 0.5s, box-shadow 0.3s;
                border: 1px solid rgba(7, 238, 65, 1);
              }

              /* Link to login */
              .register-container .register-link {
                text-align: center;
                font-size: 14px;
                margin-top: 20px;
              }

              .register-container .register-link a {
                color: #fff;
                font-weight: 600;
                text-decoration: none;
              }

              .register-container .register-link a:hover {
                text-decoration: underline;
              }
`}
      </style>
      {isLoading && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 9999
        }}>
          <Spinner animation="border" variant="light" role="status" />
        </div>
      )}

      <form className="form-box" onSubmit={handleRegister}>
        <h1>Create an Account</h1>

        {lockoutTime > 0 && (
          <div className="alert alert-warning text-center">
            Too many failed attempts. Try again in {formatTime(lockoutTime)}
          </div>
        )}

        <div className="input-box">
          <input
            type="text"
            placeholder="Username"
            value={registerData.username}
            onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
            disabled={isLoading || lockoutTime > 0}
          />
          <FontAwesomeIcon icon={faUser} className="icon" />
        </div>

        <div className="input-box">
          <input
            type="email"
            placeholder="Email"
            value={registerData.email}
            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
            disabled={isLoading || lockoutTime > 0}
          />
          <FontAwesomeIcon icon={faEnvelope} className="icon" />
        </div>

        <div className="input-box">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={registerData.password}
            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
            disabled={isLoading || lockoutTime > 0}
          />
          <FontAwesomeIcon icon={faLock} className="icon" />
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            onClick={() => setShowPassword(!showPassword)}
            className="toggle-password"
            title={showPassword ? "Hide password" : "Show password"}
          />
        </div>

        <PasswordStrengthMeter password={registerData.password} />

        <div className="remember-forgot">
          <label>
            <input
              type="checkbox"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
              disabled={isLoading || lockoutTime > 0}
            />{" "}
            I agree to the terms and conditions
          </label>
        </div>

        <button type="submit" className="btn" disabled={isLoading || lockoutTime > 0}>
          {isLoading ? <Spinner size="sm" /> : "Register"}
        </button>

        <div className="register-link">
          Already have an account? <Link to="/User/Login">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default UserRegister;
