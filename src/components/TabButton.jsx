import React from "react";
import PropTypes from "prop-types";

const TabButton = ({ children, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 sm:px-6 py-3 text-sm sm:text-base font-semibold border-b-2 transition-colors duration-200 
      ${
        isActive
          ? "text-sky-600 border-sky-600"
          : "text-gray-500 border-transparent hover:text-sky-500 hover:border-gray-200"
      }`}
  >
    {children}
  </button>
);

TabButton.propTypes = {
  children: PropTypes.node.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default TabButton;
