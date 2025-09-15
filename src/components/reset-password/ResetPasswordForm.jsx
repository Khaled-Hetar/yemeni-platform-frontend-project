import React from "react";
import PropTypes from "prop-types";

const FormField = ({ id, label, value, onChange, error }) => (
  <div>
    <label htmlFor={id} className="block mb-1 font-medium text-neutral-700">
      {label}
    </label>
    <input
      type="password"
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      required
      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
        error
          ? "border-red-500 ring-red-200"
          : "border-gray-300 focus:border-cyan-500 focus:ring-cyan-200"
      }`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

FormField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

const ResetPasswordForm = ({
  formData,
  setFormData,
  onSubmit,
  error,
  loading,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-cyan-700 mb-6 text-center">
        تعيين كلمة مرور جديدة
      </h2>
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <FormField
          id="password"
          label="كلمة المرور الجديدة"
          value={formData.password}
          onChange={handleChange}
          error={error?.password}
        />
        <FormField
          id="confirmPassword"
          label="تأكيد كلمة المرور"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={error?.confirmPassword}
        />

        {error && typeof error === "string" && (
          <p className="text-red-600 text-sm font-semibold text-center">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition duration-200 disabled:opacity-60"
        >
          {loading ? "جارٍ التحديث..." : "تحديث كلمة المرور"}
        </button>
      </form>
    </>
  );
};

ResetPasswordForm.propTypes = {
  formData: PropTypes.shape({
    password: PropTypes.string.isRequired,
    confirmPassword: PropTypes.string.isRequired,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  loading: PropTypes.bool.isRequired,
};

export default ResetPasswordForm;
