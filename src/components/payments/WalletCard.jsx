import React from "react";
import PropTypes from "prop-types";
import { FaWallet } from "react-icons/fa";

const WalletCard = ({ balance }) => {
  if (balance === null || balance === undefined) {
    return (
      <div className="flex items-center gap-4 p-4 rounded-xl shadow-md bg-gradient-to-r from-neutral-700 to-neutral-500 text-white animate-pulse">
        <div className="text-3xl">
          <FaWallet />
        </div>
        <div>
          <div className="text-sm font-semibold">المحفظة</div>
          <div className="h-4 bg-neutral-400 rounded w-24 mt-1"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl shadow-md bg-gradient-to-r from-neutral-700 to-neutral-500 text-white">
      <div className="text-3xl">
        <FaWallet />
      </div>
      <div>
        <div className="text-sm font-semibold">المحفظة</div>
        <div className="text-xs">الرصيد: ${Number(balance).toFixed(2)}</div>
      </div>
    </div>
  );
};

WalletCard.propTypes = {
  balance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default WalletCard;
