import React from "react";
import PropTypes from "prop-types";
import { FaPaypal, FaCreditCard } from "react-icons/fa";

const PaymentMethodCard = ({ method }) => {
  if (!method) {
    return (
      <div className="flex items-center gap-4 p-4 rounded-xl shadow-md bg-gradient-to-r from-cyan-600 to-cyan-300 text-white animate-pulse">
        <div className="w-8 h-8 bg-cyan-400 rounded"></div>
        <div>
          <div className="h-4 bg-cyan-400 rounded w-20 mb-2"></div>
          <div className="h-3 bg-cyan-400 rounded w-28"></div>
        </div>
      </div>
    );
  }

  const isPaypal = method.type.toLowerCase() === "paypal";
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl shadow-md bg-gradient-to-r from-cyan-600 to-cyan-300 text-white">
      <div className="text-3xl">
        {isPaypal ? <FaPaypal /> : <FaCreditCard />}
      </div>
      <div>
        <div className="text-sm font-semibold">{method.type}</div>
        <div className="text-xs">{method.masked_details}</div>
      </div>
    </div>
  );
};

PaymentMethodCard.propTypes = {
  method: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    masked_details: PropTypes.string.isRequired,
  }),
};

export default PaymentMethodCard;
