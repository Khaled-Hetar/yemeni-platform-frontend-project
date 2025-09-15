import React from "react";
import PropTypes from "prop-types";
import { MdAddCard } from "react-icons/md";
import PaymentMethodCard from "./PaymentMethodCard";
import WalletCard from "./WalletCard";

const PaymentMethodsSection = ({ paymentMethods, walletBalance }) => {
  const handleAddPaymentMethod = () => {
    alert("ميزة إضافة طريقة دفع ستُفعل لاحقاً");
  };

  if (!paymentMethods) {
    return (
      <section className="bg-white border border-gray-200 rounded-2xl shadow p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gray-300 rounded w-1/4"></div>
          <div className="h-10 bg-gray-300 rounded-xl w-40"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(2)].map((_, i) => (
            <div
              key={`loader-pm-${i}`}
              className="h-24 bg-gray-200 rounded-xl"
            ></div>
          ))}
          <div className="h-24 bg-gray-200 rounded-xl"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white border border-gray-200 rounded-2xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neutral-700">طرق الدفع</h2>
        <button
          onClick={handleAddPaymentMethod}
          className="flex items-center gap-2 bg-sky-100 text-sky-700 px-4 py-2 rounded-xl hover:bg-sky-200 transition"
        >
          <MdAddCard /> إضافة طريقة دفع
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paymentMethods.map((method) => (
          <PaymentMethodCard key={method.id} method={method} />
        ))}
        <WalletCard balance={walletBalance} />
      </div>
    </section>
  );
};

PaymentMethodsSection.propTypes = {
  paymentMethods: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ),
  walletBalance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default PaymentMethodsSection;
