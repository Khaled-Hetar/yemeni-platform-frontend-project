import React from "react";
import PropTypes from "prop-types";

const ForgotPasswordForm = ({ email, setEmail, onSubmit, error, loading }) => (
  <>
    <header className="mb-6 text-center">
      <h2 className="text-2xl font-bold text-cyan-700 mb-2">
        استعادة كلمة المرور
      </h2>
      <p className="text-neutral-600 text-sm">
        أدخل بريدك الإلكتروني المسجّل وسنرسل لك التعليمات.
      </p>
    </header>
    <form className="space-y-5" onSubmit={onSubmit} noValidate>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-neutral-700 mb-1"
        >
          البريد الإلكتروني
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="example@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-400"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm text-center font-semibold">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "جارٍ الإرسال..." : "إرسال التعليمات"}
      </button>
    </form>
  </>
);

ForgotPasswordForm.propTypes = {
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  loading: PropTypes.bool.isRequired,
};

export default ForgotPasswordForm;
