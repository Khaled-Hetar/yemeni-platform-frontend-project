import React from "react";
import PropTypes from "prop-types";

/**
 * مكون يغلف حقل الإدخال مع التسمية ورسالة الخطأ.
 * @param {object} props
 * @param {string} props.id - المعرّف الفريد للحقل.
 * @param {string} props.label - نص التسمية الظاهر للمستخدم.
 * @param {string} [props.error] - رسالة الخطأ المراد عرضها.
 * @param {React.ReactNode} props.children - حقل الإدخال الفعلي (input, select, etc.).
 */
const InputField = ({ id, label, error, children }) => (
  <div>
    <label htmlFor={id} className="block mb-2 font-medium text-gray-700">
      {label}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

InputField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default InputField;
