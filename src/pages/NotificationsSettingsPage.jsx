import React, { useState, useEffect } from "react";
import SettingsLayout from "../components/SettingsLayout";
import {
  FiMail,
  FiBriefcase,
  FiDollarSign,
  FiInfo,
  FiCheck,
  FiX,
} from "react-icons/fi";
import PropTypes from "prop-types";

const ToggleSwitch = ({
  icon,
  label,
  description,
  enabled,
  onToggle,
  hasChanged,
}) => (
  <div className="flex items-center justify-between py-5">
    <div className="flex items-center gap-4">
      <div className="bg-cyan-100 text-cyan-700 p-3 rounded-full">{icon}</div>
      <div>
        <div className="flex items-center gap-2">
          <p className="font-semibold text-gray-800">{label}</p>
          {hasChanged && (
            <div
              className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"
              title="تغيير غير محفوظ"
            ></div>
          )}
        </div>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
    <button
      onClick={onToggle}
      type="button"
      className={`relative inline-flex items-center h-7 w-14 rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 ${
        enabled ? "bg-cyan-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-flex items-center justify-center w-6 h-6 transform bg-white rounded-full transition-transform duration-300 ease-in-out ${
          enabled ? "translate-x-8" : "translate-x-1"
        }`}
      >
        {enabled ? (
          <FiCheck className="h-4 w-4 text-cyan-600" />
        ) : (
          <FiX className="h-4 w-4 text-gray-400" />
        )}
      </span>
    </button>
  </div>
);

ToggleSwitch.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string.isRequired,
  description: PropTypes.string,
  enabled: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  hasChanged: PropTypes.bool,
};

const NotificationsSettingsPage = () => {
  const [originalSettings, setOriginalSettings] = useState({
    newMessages: true,
    projectProposals: true,
    paymentUpdates: true,
    systemUpdates: false,
  });

  const [currentSettings, setCurrentSettings] = useState(originalSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setHasChanges(
      JSON.stringify(originalSettings) !== JSON.stringify(currentSettings)
    );
  }, [currentSettings, originalSettings]);

  const handleToggle = (key) => {
    setCurrentSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    console.log("Saving changes:", currentSettings);
    // await apiClient.patch('/user/settings/notifications', currentSettings);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setOriginalSettings(currentSettings);
    setIsSaving(false);
    alert("تم حفظ التغييرات بنجاح!");
  };

  const handleResetChanges = () => {
    setCurrentSettings(originalSettings);
  };

  const notificationItems = [
    {
      key: "newMessages",
      label: "رسائل جديدة",
      description: "عندما تتلقى رسالة جديدة من مستخدم آخر.",
      icon: <FiMail />,
    },
    {
      key: "projectProposals",
      label: "عروض على المشاريع",
      description: "عندما يقدم مستقل عرضاً على مشروع نشرته.",
      icon: <FiBriefcase />,
    },
    {
      key: "paymentUpdates",
      label: "تحديثات الدفع",
      description: "عند إتمام عملية دفع أو سحب أو إيداع.",
      icon: <FiDollarSign />,
    },
    {
      key: "systemUpdates",
      label: "تحديثات النظام والنصائح",
      description: "تلقي إشعارات حول الميزات الجديدة والنصائح.",
      icon: <FiInfo />,
    },
  ];

  return (
    <SettingsLayout
      title="تفضيلات الإشعارات"
      description="اختر التنبيهات التي ترغب في تلقيها عبر البريد الإلكتروني وداخل المنصة."
    >
      <div className="divide-y divide-gray-200">
        {notificationItems.map((item) => (
          <ToggleSwitch
            key={item.key}
            icon={item.icon}
            label={item.label}
            description={item.description}
            enabled={currentSettings[item.key]}
            onToggle={() => handleToggle(item.key)}
            hasChanged={
              originalSettings[item.key] !== currentSettings[item.key]
            }
          />
        ))}
      </div>

      {/* أزرار الحفظ وإعادة التعيين */}
      {hasChanges && (
        <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row justify-end gap-3 animate-fade-in">
          <button
            onClick={handleResetChanges}
            disabled={isSaving}
            className="px-6 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            إعادة التعيين
          </button>
          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="px-6 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 disabled:bg-cyan-400"
          >
            {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
        </div>
      )}
    </SettingsLayout>
  );
};

export default NotificationsSettingsPage;
