import React, { useState } from "react";
import toast from "react-hot-toast";
import { Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "../Store/authStore.ts";
import { useLockout } from "../hooks/useLockout";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const isLoading = useAuthStore((state) => state.isLoading);

  // Use lockout hook: max 5 attempts, 15 minutes lockout
  const {
    lockoutTime,
    incrementAttempts,
    resetAttempts,
    formatTime,
    isLockedOut,
  } = useLockout("forgotPassword", 5, 15 * 60); // 15 * 60 seconds = 15 minutes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLockedOut) return;

    if (!email) return toast.error("Please enter your email");
    if (!emailRegex.test(email)) return toast.error("Please enter a valid email");

    try {
      await forgotPassword(email);
      setEmail("");
      resetAttempts(); // reset attempts on success
      toast.success("Reset link sent!");
    } catch (err: any) {
      incrementAttempts(); // increment failed attempts
      toast.error(err.response?.data?.message || "Error sending reset email");
    }
  };

  return (
    <>
      <style>{`
        .wrapper { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: url('/8553.jpg') no-repeat center; background-size: cover; }
        .form-box { background: rgba(0, 0, 0, 0.5); border: 1px solid rgba(255, 255, 255, 0.3); backdrop-filter: blur(10px); color: #fff; width: 450px; padding: 40px; border-radius: 12px; box-shadow: 0 0 20px rgba(0, 0, 0, 1); }
        .form-box h1 { text-align: center; margin-bottom: 30px; font-size: 24px; }
        .input-box { position: relative; margin-bottom: 25px; }
        .input-box input { width: 100%; height: 45px; background: transparent; border: 2px solid #fff; border-radius: 40px; padding: 0 45px 0 40px; color: #fff; font-size: 16px; outline: none; }
        .icon { position: absolute; top: 50%; left: 10px; transform: translateY(-50%); color: #fff; }
        .input-box input::placeholder { color: #fff; }
        .input-box input:focus { border-color: green; border-width: 3px; }
        .btn { width: 100%; height: 45px; background: #000; border: none; border-radius: 40px; font-weight: 700; font-size: 18px; color: #fff; cursor: pointer; transition: background 0.3s, box-shadow 0.3s; box-shadow: 0 0 10px rgba(0, 0, 0, 1); }
        .btn:hover { box-shadow: 0 0 20px rgba(7, 238, 65, 1); transition: background 0.5s, box-shadow 0.3s; border: 1px solid rgba(7, 238, 65, 1); }
        .register-Link { text-align: center; margin-top: 20px; }
        .register-Link a { color: #ffffffff; text-decoration: none; font-weight: 700; }
        .register-Link a:hover { text-decoration: underline; }
      `}</style>

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
          <Spinner animation="border" variant="light" role="status" />
        </div>
      )}

      <div className="wrapper">
        <div className="form-box">
          <form onSubmit={handleSubmit}>
            <h1>Forgot Password</h1>

            {isLockedOut && (
              <p style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>
                Too many failed attempts. Try again in {formatTime(lockoutTime)}.
              </p>
            )}

            <div className="input-box">
              <FontAwesomeIcon icon={faEnvelope} className="icon" />
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || isLockedOut}
              />
            </div>

            <button type="submit" className="btn" disabled={isLoading || isLockedOut}>
              {isLoading ? <Spinner animation="border" size="sm" role="status" /> : "Send Reset Link"}
            </button>

            <div className="register-Link">
              <p>
                Remember your password? <a href="/User/Login">Login</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
