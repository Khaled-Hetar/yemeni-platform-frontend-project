import React, { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import apiClient from "../api/axiosConfig";

const OtpInputForm = ({ otp, setOtp, onSubmit, error, loading, email }) => {
  const inputs = Array(6).fill("");

  const handleInputChange = (e, index) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);

    if (val && index < 5) {
      e.target.nextElementSibling?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      e.target.previousElementSibling?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim().slice(0, 6);
    if (/^\d{6}$/.test(pasteData)) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);
      const lastInput = e.target.parentElement.children[5];
      if (lastInput) {
        lastInput.focus();
      }
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
        أدخل رمز التحقق
      </h2>
      <p className="text-center text-gray-500 mb-6">
        تم إرسال رمز مكون من 6 أرقام إلى
        <span className="font-semibold text-gray-700">{email}</span>
      </p>
      <div className="flex justify-center gap-2 mb-6" dir="ltr">
        {inputs.map((_, i) => (
          <input
            key={i}
            type="text"
            value={otp[i] || ""}
            onChange={(e) => handleInputChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={i === 0 ? handlePaste : undefined}
            maxLength="1"
            className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 transition"
            required
          />
        ))}
      </div>
      {error && (
        <p className="text-red-500 text-sm text-center mb-4">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-cyan-600 text-white py-2.5 rounded-lg hover:bg-cyan-700 disabled:bg-cyan-400 transition-colors font-semibold"
      >
        {loading ? "جاري التحقق..." : "التحقق من الرمز"}
      </button>
    </form>
  );
};

const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      console.error("No email provided to OTP page. Redirecting.");
      navigate("/");
    }
  }, [email, navigate]);

  const handleOtpSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      const otpCode = otp.join("");

      if (otpCode.length !== 6) {
        setError("يجب أن يتكون الرمز من 6 أرقام.");
        return;
      }

      setLoading(true);
      try {
        await apiClient.post("/verify-otp", { email, otp: otpCode });

        navigate("/reset-password", { state: { email, otp: otpCode } });
      } catch (apiError) {
        setError(
          apiError.response?.data?.message || "الرمز غير صحيح أو انتهت صلاحيته."
        );
      } finally {
        setLoading(false);
      }
    },
    [email, otp, navigate]
  );

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <OtpInputForm
          otp={otp}
          setOtp={setOtp}
          onSubmit={handleOtpSubmit}
          error={error}
          loading={loading}
          email={email}
        />
        <div className="mt-6 text-center">
          <Link
            to="/forgot-password"
            className="text-sm text-cyan-600 hover:underline"
          >
            لم تستلم الرمز؟ أعد الإرسال
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
