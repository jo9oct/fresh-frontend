import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

interface PasswordProps {
  password: string;
}

const PasswordCriteria: React.FC<PasswordProps> = ({ password }) => {
  const criteria = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains number", met: /\d/.test(password) },
    {
      label: "Contains special character",
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];

  return (
    <div className="mt-3">
      <h6>Password Criteria</h6>
      <ul className="list-unstyled mb-2">
        {criteria.map((criterion, index) => (
          <li
            key={index}
            className={`d-flex align-items-center mx-4 mb--2 font-size-sm 
              text-${criterion.met ? "success" : "Good"}`}
          >
            <FontAwesomeIcon
              icon={criterion.met ? faCheck : faXmark}
              className="me-2"
            />
            {criterion.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

const PasswordStrengthMeter: React.FC<PasswordProps> = ({ password }) => {
  const getStrength = (pass: string): number => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[a-z]/.test(pass)) strength++;
    if (/\d/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return strength;
  };

  const getStrengthLabel = (s: number): string => {
    if (s === 0) return "Very Weak";
    if (s === 1) return "Weak";
    if (s === 2) return "Fair";
    if (s === 3) return "Good";
    return "Strong";
  };

  const getStrengthColor = (s: number): string => {
    if (s <= 1) return "danger";
    if (s === 2) return "warning";
    if (s === 3) return "info";
    return "success";
  };

  const strength = getStrength(password);
  const strengthLabel = getStrengthLabel(strength);
  const strengthColor = getStrengthColor(strength);
  const strengthPercent = (strength / 4) * 100;

  return (
    <div className="mt-2">
      {/* Strength label + bar side-by-side */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <small className="text-white">Password Strength</small>
        <small className={`text-${strengthColor} fw-bold`}>
          {strengthLabel}
        </small>
      </div>

      {/* Bootstrap Progress Bar */}
      <div className="progress" style={{ height: "6px" }}>
        <div
          className={`progress-bar bg-${strengthColor}`}
          role="progressbar"
          style={{ width: `${strengthPercent}%` }}
        />
      </div>

      {/* Password Criteria Below */}
      <PasswordCriteria password={password} />
    </div>
  );
};

export default PasswordStrengthMeter;
