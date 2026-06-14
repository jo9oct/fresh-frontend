
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "react-bootstrap";
import {useAuthStore} from "../Store/authStore.ts"

const SuperAdminLogin: React.FC = () => {

  const {login} = useAuthStore()

  const [showPassword, setShowPassword] = useState(false); // toggle password visibility
  const [isLoading, setIsLoading] = useState(false); // loading state while logging in
  const [loginData, setLoginData] = useState({
    Username: "", // store username input
    password: "", // store password input
  });
  
  // handle form submission for login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent default form submit
    setIsLoading(true); // start loading
    await login(loginData.Username, loginData.password); // call login function from store
    setIsLoading(false); // stop loading
  };
  

  return (
    <>
    <style>
      {
        `
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
        max-width: 420px;
      }

      .form-box h1 {
        text-align: center;
        margin-bottom: 30px;
        font-size: 24px;
      }

      .input-box {
        position: relative;
        margin-bottom: 25px;
      }

      .input-box input {
        width: 100%;
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

      .toggle-password {
        position: absolute;
        top: 50%;
        right: 15px;
        transform: translateY(-50%);
        cursor: pointer;
        color: #fff;
      }

      .input-box input::placeholder {
        color: #ccc;
      }

      .input-box input:focus {
        border-color: green;
        border-width: 3px;
      }

      .remember-forgot a {
        font-size: 14px;
        margin-bottom: 20px;
        color: #fff;
        text-decoration: none;
        font-weight: 700;
        display: block;
        text-align: right;
      }

      .remember-forgot a:hover {
        text-decoration: underline;
      }

      .btn {
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

      .btn:hover {
        box-shadow: 0 0 20px rgba(7, 238, 65, 1);
        transition: background 0.5s, box-shadow 0.3s;
        border: 1px solid rgba(7, 238, 65, 1);
      }

      .register-Link {
        text-align: center;
        margin-top: 20px;
      }

      .register-Link a {
        color: #fff;
        text-decoration: none;
        font-weight: 700;
      }

      .register-Link a:hover {
        text-decoration: underline;
      }
        `
      }
    </style>

      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <Spinner animation="border" variant="light" />
        </div>
      )}

      <div className="wrapper">
        <div className="form-box login">
          <form onSubmit={handleLogin}>
            <h1>SuperAdmin Login</h1>

            <div className="input-box">
              <FontAwesomeIcon icon={faEnvelope} className="icon" />
              <input
                type="text"
                placeholder="Username"
                required
                value={loginData.Username}
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    Username: e.target.value,
                  })
                }
                disabled={isLoading}
              />
            </div>

            <div className="input-box">
              <FontAwesomeIcon icon={faLock} className="icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                disabled={isLoading}
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            <div className="remember-forgot">
              <a href="/superAdmin/forgetPassword">Forgot Password?</a>
            </div>
            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Access Dashboard"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SuperAdminLogin;
