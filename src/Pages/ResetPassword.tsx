import React, { useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faLock } from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "react-bootstrap";
import { useAuthStore } from "../Store/authStore.ts";
import { useNavigate } from "react-router-dom";

const ResetPassword: React.FC = () => { 
  const { token } = useParams(); // Get the password reset token from URL params
  const navigate = useNavigate(); // For navigation after successful reset
  
  // Local state for form inputs and visibility toggles
  const [newPassword, setNewPassword] = useState(""); 
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false); // toggle visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // toggle visibility
  
  // Auth store actions & state
  const resetPassword = useAuthStore((state) => state.resetPassword); // function to reset password
  const isLoading = useAuthStore((state) => state.isLoading); // loading state for async call
  
  // Handler for submitting the reset form
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
  
    // Validation checks
    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }
  
    if (!newPassword || !confirmPassword) {
      toast.error("Both fields are required");
      return;
    }
  
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
  
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
  
    // Call the resetPassword function from store
    const success = await resetPassword(token, newPassword, confirmPassword);
  
    if (success) {
      toast.success("Password reset successful! Redirecting...");
      setNewPassword(""); // Clear form fields
      setConfirmPassword("");
      navigate("/User/Login"); // Redirect user to login page
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
          left: 10px;
          transform: translateY(-50%);
          color: #fff;
        }

        .input-box input::placeholder {
          color: gray;
        }

        .input-box input:focus {
          border-color: green;
          border-width: 3px;
        }

        .toggle-password {
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translateY(-50%);
          cursor: pointer;
          color: #fff;
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

        .back-link {
          text-align: center;
          margin-top: 20px;
          color: #fff;
        }

        .back-link a {
          color: #fff;
          text-decoration: underline;
        }
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
          <form onSubmit={handleReset}>
            <h1>Reset Password</h1>

            <div className="input-box">
              <FontAwesomeIcon icon={faLock} className="icon" />
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <FontAwesomeIcon
                icon={showNewPassword ? faEyeSlash : faEye}
                className="toggle-password"
                onClick={() => setShowNewPassword(!showNewPassword)}
              />
            </div>

            <div className="input-box">
              <FontAwesomeIcon icon={faLock} className="icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEyeSlash : faEye}
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>

            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
