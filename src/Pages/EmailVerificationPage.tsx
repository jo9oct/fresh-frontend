import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../Store/authStore";
import toast from "react-hot-toast";
import { useLockout } from "../hooks/useLockout";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(Array(6).fill(""));
  const [cooldown, setCooldown] = useState(60);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const navigate = useNavigate();

  const { error, isLoading, verifyEmail, resendVerificationCode } =
    useAuthStore();

  // Use the lockout hook
  const {
    lockoutTime,
    incrementAttempts,
    resetAttempts,
    formatTime,
    isLockedOut,
  } = useLockout("emailVerification", 5, 15 * 60); // 5 attempts, 15 min lockout

  // Countdown for resend button
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleChange = (index: number, value: string) => {
    if (isLockedOut) return; // Prevent typing during lockout

    const newCode = [...code];
    if (value.length > 1) {
      const chars = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = chars[i] || "";
        if (inputRefs.current[i]) inputRefs.current[i]!.value = chars[i] || "";
      }
      setCode(newCode);
      inputRefs.current[Math.min(chars.length, 5)]?.focus();
      return;
    }

    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (isLockedOut) return;

    e.preventDefault();
    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newCode = Array(6).fill("");
    for (let i = 0; i < paste.length; i++) {
      newCode[i] = paste[i];
      if (inputRefs.current[i]) inputRefs.current[i]!.value = paste[i];
    }
    setCode(newCode);
    inputRefs.current[Math.min(paste.length, 5)]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut) return;

    const verificationCode = code.join("");
    try {
      await verifyEmail(verificationCode);
      resetAttempts(); // Reset attempts on success
      navigate("/");
    } catch (err: any) {
      incrementAttempts(); // Increment on failure
    }
  };

  // Auto-submit when all digits are entered
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit") as unknown as React.FormEvent);
    }
  }, [code]);

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-dark text-white">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card p-4 p-md-5 shadow-lg bg-opacity-75 bg-dark text-white"
        style={{
          maxWidth: "500px",
          width: "100%",
          backdropFilter: "blur(10px)",
        }}
      >
        <h2 className="text-center mb-3 text-primary">Verify Your Email</h2>
        <p className="text-center mb-4">
          Enter the 6-digit code sent to your email
        </p>

        {isLockedOut && (
          <p style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>
            Too many failed attempts. Try again in {formatTime(lockoutTime)}.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="d-flex justify-content-between mb-4">
            {code.map((_, index) => (
              <input
                key={index}
                ref={(el) => {
                  if (el) inputRefs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                className="form-control text-center fw-bold fs-4 me-2 code-input"
                style={{ width: "48px", height: "48px" }}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                disabled={isLockedOut}
              />
            ))}
          </div>

          {error && (
            <div className="alert alert-danger text-center">{error}</div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLockedOut || isLoading || code.some((digit) => !digit)}
            className="btn btn-primary w-100 fw-bold mb-2"
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </motion.button>
        </form>

        <div className="text-center mt-3">
          <button
            className="btn btn-link text-info fw-semibold"
            onClick={() => {
              if (cooldown === 0 && !isLockedOut) {
                resendVerificationCode();
                toast.success("Verification code resent!");
                setCooldown(60);
              }
            }}
            disabled={cooldown > 0 || isLockedOut}
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Code"}
          </button>
        </div>
      </motion.div>

      <style>{`
        .code-input {
          border: 1px solid #444;
          background-color: #111;
          color: white;
          transition: all 0.2s ease;
        }
        .code-input:focus {
          border-color: #0fd;
          box-shadow: 0 0 0 0.2rem rgba(0, 255, 255, 1);
        }
      `}</style>
    </div>
  );
};

export default EmailVerificationPage;
