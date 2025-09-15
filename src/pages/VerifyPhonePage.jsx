import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../api/axiosConfig";

const PhoneIcon = () => (
  <svg
    className="w-12 h-12 mx-auto text-cyan-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    ></path>
  </svg>
);
const MessageIcon = () => (
  <svg
    className="w-12 h-12 mx-auto text-cyan-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    ></path>
  </svg>
);

const EnterPhoneStep = ({
  phoneNumber,
  setPhoneNumber,
  onSubmit,
  loading,
  error,
}) => {
  const isPhoneValid = (num) => {
    const cleanedNum = num.replace(/\s/g, "").replace(/^\+/, "");
    return cleanedNum.length >= 9;
  };

  const handlePhoneChange = (e) => {
    const sanitizedValue = e.target.value.replace(/[^+\d\s]/g, "");
    setPhoneNumber(sanitizedValue);
  };

  const canSubmit = isPhoneValid(phoneNumber);

  return (
    <div>
      <PhoneIcon />
      <h2 className="text-2xl font-bold text-center text-gray-800 mt-4 mb-2">
        تأكيد رقم الهاتف
      </h2>
      <p className="text-center text-gray-500 mb-6">
        أدخل رقم هاتفك لاستلام رمز التحقق.
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-lg tracking-widest focus:ring-cyan-500 focus:border-cyan-500"
          placeholder="+967 777 777 ***"
          required
          dir="ltr"
        />
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="w-full bg-cyan-600 text-white py-3 rounded-lg font-semibold hover:bg-cyan-700 disabled:bg-cyan-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "جاري الإرسال..." : "إرسال الرمز"}
        </button>
      </form>
    </div>
  );
};

const EnterOtpStep = ({
  otp,
  setOtp,
  onSubmit,
  loading,
  error,
  phoneNumber,
  onResend,
  canResend,
  resendTimer,
}) => {
  const inputs = Array(6).fill("");

  const handleInputChange = (e, index) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);
    if (val && index < 5) e.target.nextElementSibling?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      e.target.previousElementSibling?.focus();
  };

  return (
    <div>
      <MessageIcon />
      <h2 className="text-2xl font-bold text-center text-gray-800 mt-4 mb-2">
        أدخل رمز التحقق
      </h2>
      <p className="text-center text-gray-500 mb-6">
        تم إرسال الرمز إلى الرقم{" "}
        <span className="font-semibold text-gray-700" dir="ltr">
          {phoneNumber}
        </span>
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex justify-center gap-2" dir="ltr">
          {inputs.map((_, i) => (
            <input
              key={i}
              type="text"
              value={otp[i] || ""}
              onChange={(e) => handleInputChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              maxLength="1"
              className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
              required
            />
          ))}
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-600 text-white py-3 rounded-lg font-semibold hover:bg-cyan-700 disabled:bg-cyan-400 transition-colors"
        >
          {loading ? "جاري التحقق..." : "تأكيد الرمز"}
        </button>
      </form>
      <div className="mt-4 text-center text-sm">
        <button
          onClick={onResend}
          disabled={!canResend}
          className="text-cyan-600 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {canResend
            ? "إعادة إرسال الرمز"
            : `يمكنك إعادة الإرسال بعد ${resendTimer} ثانية`}
        </button>
      </div>
    </div>
  );
};

const VerifyPhonePage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer;
    if (step === 2 && !canResend) {
      timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, canResend]);

  const handlePhoneSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");
      try {
        await apiClient.post("/api/phone/send-otp", { phoneNumber });
        setStep(2);
        setCanResend(false);
        setResendTimer(60);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "فشل إرسال الرمز. يرجى التأكد من الرقم والمحاولة مرة أخرى."
        );
      } finally {
        setLoading(false);
      }
    },
    [phoneNumber]
  );

  const handleOtpSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");
      const otpCode = otp.join("");
      try {
        await apiClient.post("/api/phone/verify-otp", { otp: otpCode });
        alert("تم تأكيد رقم الهاتف بنجاح!");
        navigate("/dashboard");
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "الرمز غير صحيح أو انتهت صلاحيته. يرجى المحاولة مرة أخرى."
        );
      } finally {
        setLoading(false);
      }
    },
    [otp, navigate]
  );

  const handleResend = () => {
    if (canResend) {
      handlePhoneSubmit(new Event("submit"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          {step === 1 ? (
            <EnterPhoneStep
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              onSubmit={handlePhoneSubmit}
              loading={loading}
              error={error}
            />
          ) : (
            <EnterOtpStep
              otp={otp}
              setOtp={setOtp}
              onSubmit={handleOtpSubmit}
              loading={loading}
              error={error}
              phoneNumber={phoneNumber}
              onResend={handleResend}
              canResend={canResend}
              resendTimer={resendTimer}
            />
          )}
        </div>
        <div className="mt-4 text-center">
          <Link
            to="/dashboard"
            className="text-sm text-gray-500 hover:text-cyan-600"
          >
            العودة إلى لوحة التحكم
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyPhonePage;
