import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import PropTypes from "prop-types";

const SettingsLayout = ({ title, description, children }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <button
        onClick={() => navigate("/settings")}
        className="flex items-center gap-2 text-sm text-cyan-600 hover:underline mb-6"
      >
        <FiArrowRight /> العودة إلى الإعدادات الرئيسية
      </button>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <header className="border-b border-gray-200 pb-5 mb-8">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <p className="text-gray-500 mt-1">{description}</p>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
};

SettingsLayout.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default SettingsLayout;
