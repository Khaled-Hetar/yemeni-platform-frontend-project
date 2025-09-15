import React, { useState } from "react";
import SettingsLayout from "../components/SettingsLayout";
import { FiSun, FiMoon, FiMonitor } from "react-icons/fi";
import PropTypes from "prop-types";

const ThemeOption = ({ icon, label, description, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
      isActive
        ? "border-cyan-500 bg-cyan-50"
        : "border-gray-300 hover:border-gray-400"
    }`}
  >
    <div className="flex items-center gap-4">
      {icon}
      <div>
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  </button>
);

ThemeOption.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

const ThemeSettingsPage = () => {
  const [activeTheme, setActiveTheme] = useState("light");

  return (
    <SettingsLayout
      title="المظهر"
      description="اختر المظهر المفضل لديك لواجهة المنصة."
    >
      <div className="space-y-4">
        <ThemeOption
          icon={<FiSun size={24} className="text-yellow-500" />}
          label="فاتح"
          description="الوضع الكلاسيكي والمشرق."
          isActive={activeTheme === "light"}
          onClick={() => setActiveTheme("light")}
        />
        <ThemeOption
          icon={<FiMoon size={24} className="text-indigo-500" />}
          label="داكن"
          description="مريح للعين في الإضاءة المنخفضة."
          isActive={activeTheme === "dark"}
          onClick={() => setActiveTheme("dark")}
        />
        <ThemeOption
          icon={<FiMonitor size={24} className="text-gray-500" />}
          label="تلقائي"
          description="يتزامن مع إعدادات مظهر نظامك."
          isActive={activeTheme === "system"}
          onClick={() => setActiveTheme("system")}
        />
      </div>
    </SettingsLayout>
  );
};

export default ThemeSettingsPage;
