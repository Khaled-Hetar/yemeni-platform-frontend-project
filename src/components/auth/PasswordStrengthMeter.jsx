import React, { useMemo } from "react";
import PropTypes from "prop-types";

const PasswordStrengthMeter = ({ password }) => {
  const calculatePasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/\d/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return Math.min(score, 5);
  };

  const strength = useMemo(
    () => calculatePasswordStrength(password),
    [password]
  );

  const strengthInfo = useMemo(() => {
    switch (strength) {
      case 1:
        return { width: "20%", color: "bg-red-500", text: "ضعيفة" };
      case 2:
        return { width: "40%", color: "bg-yellow-500", text: "متوسطة" };
      case 3:
        return { width: "60%", color: "bg-blue-500", text: "جيدة" };
      case 4:
        return { width: "80%", color: "bg-sky-500", text: "قوية" };
      case 5:
        return { width: "100%", color: "bg-green-500", text: "قوية جداً" };
      default:
        return { width: "0%", color: "bg-gray-200", text: "" };
    }
  }, [strength]);

  if (!password) {
    return (
      <div className="space-y-1 mt-2 h-6">
        {" "}
        <div className="w-full bg-gray-200 rounded-full h-2"></div>
      </div>
    );
  }

  return (
    <div className="space-y-1 mt-2 h-6" aria-live="polite">
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${strengthInfo.color}`}
          style={{ width: strengthInfo.width }}
          role="progressbar"
          aria-valuenow={strength}
          aria-valuemin="0"
          aria-valuemax="5"
          aria-valuetext={`قوة كلمة المرور: ${strengthInfo.text || "فارغة"}`}
        ></div>
      </div>
      <p className="text-xs text-right text-gray-500">{strengthInfo.text}</p>
    </div>
  );
};

PasswordStrengthMeter.propTypes = {
  password: PropTypes.string.isRequired,
};

export default PasswordStrengthMeter;
