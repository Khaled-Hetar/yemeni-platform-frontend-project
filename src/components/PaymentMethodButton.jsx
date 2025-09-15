import React from "react";

const PaymentMethodButton = ({
  method,
  icon,
  label,
  activeMethod,
  setActiveMethod,
}) => {
  return (
    <button
      type="button"
      onClick={() => setActiveMethod(method)}
      className={`flex-1 flex items-center justify-center gap-3 p-4 border-2 rounded-lg transition-all duration-200
        ${
          activeMethod === method
            ? "border-sky-500 bg-sky-50 shadow-inner"
            : "border-gray-200 bg-white hover:border-gray-300"
        }`}
    >
      {icon}
      <span className="font-semibold">{label}</span>
    </button>
  );
};

export default PaymentMethodButton;
