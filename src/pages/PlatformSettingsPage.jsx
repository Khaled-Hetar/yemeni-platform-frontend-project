import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import {
  FiSettings,
  FiDollarSign,
  FiUsers,
  FiSave,
  FiTerminal,
} from "react-icons/fi";
import PropTypes from "prop-types";

const ToggleSwitch = ({ label, description, enabled, onToggle }) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className="font-semibold text-gray-800">{label}</p>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={enabled}
      aria-label={`Toggle ${label}`}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

ToggleSwitch.propTypes = {
  label: PropTypes.string.isRequired,
  description: PropTypes.string,
  enabled: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

ToggleSwitch.defaultProps = {
  description: null,
};

const InputField = ({ label, id, type = "text", defaultValue, icon, unit }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        type={type}
        id={id}
        name={id}
        defaultValue={defaultValue}
        className={`w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
          icon ? "pl-10" : "pl-4"
        } ${unit ? "pr-12" : "pr-4"} py-2`}
      />
      {unit && (
        <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
          {unit}
        </span>
      )}
    </div>
  </div>
);

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.node,
  unit: PropTypes.string,
};

InputField.defaultProps = {
  type: "text",
  defaultValue: "",
  icon: null,
  unit: null,
};

const PlatformSettingsPage = () => {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    allowRegistration: true,
    verifyEmail: true,
  });

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AdminLayout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">إعدادات المنصة</h1>
        <p className="text-gray-500 mt-1">
          التحكم في الجوانب الأساسية لعمل المنصة.
        </p>
      </header>

      <div className="space-y-8">
        {/* بطاقة الإعدادات العامة */}
        <SettingsCard title="الإعدادات العامة" icon={<FiSettings />}>
          <InputField
            label="اسم المنصة"
            id="platform-name"
            defaultValue="المنصة اليمنية"
          />
          <InputField
            label="وصف المنصة"
            id="platform-description"
            defaultValue="أكبر منصة للعمل الحر في اليمن."
          />
          <div className="border-t border-gray-200 mt-4 pt-4">
            <ToggleSwitch
              label="وضع الصيانة"
              description="إيقاف الموقع مؤقتاً أمام الزوار لعرض رسالة صيانة."
              enabled={settings.maintenanceMode}
              onToggle={() => handleToggle("maintenanceMode")}
            />
          </div>
        </SettingsCard>

        {/* بطاقة الإعدادات المالية */}
        <SettingsCard title="الإعدادات المالية" icon={<FiDollarSign />}>
          <InputField
            label="عملة المنصة الرئيسية"
            id="platform-currency"
            defaultValue="USD"
          />
          <InputField
            label="عمولة المنصة"
            id="platform-fee"
            type="number"
            defaultValue="15"
            unit="%"
          />
          <InputField
            label="الحد الأدنى للسحب"
            id="min-withdrawal"
            type="number"
            defaultValue="25"
            unit="$"
          />
        </SettingsCard>

        {/* بطاقة التسجيل والدخول */}
        <SettingsCard title="التسجيل والمستخدمون" icon={<FiUsers />}>
          <ToggleSwitch
            label="السماح بالتسجيل الجديد"
            description="السماح للمستخدمين الجدد بإنشاء حسابات."
            enabled={settings.allowRegistration}
            onToggle={() => handleToggle("allowRegistration")}
          />
          <div className="border-t border-gray-200 mt-2 pt-2">
            <ToggleSwitch
              label="تفعيل التحقق من البريد الإلكتروني"
              description="إجبار المستخدمين على تأكيد بريدهم الإلكتروني."
              enabled={settings.verifyEmail}
              onToggle={() => handleToggle("verifyEmail")}
            />
          </div>
        </SettingsCard>

        {/* بطاقة التكامل مع الخدمات */}
        <SettingsCard title="التكامل مع الخدمات" icon={<FiTerminal />}>
          <InputField
            label="مفتاح Stripe API"
            id="stripe-key"
            type="password"
            defaultValue="pk_test_1234567890"
          />
          <InputField
            label="مفتاح Mailgun API"
            id="mailgun-key"
            type="password"
            defaultValue="key-1234567890"
          />
        </SettingsCard>

        {/* زر الحفظ العام */}
        <div className="flex justify-end mt-8">
          <button className="flex items-center justify-center gap-2 px-8 py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 transition-transform transform hover:scale-105">
            <FiSave /> حفظ جميع الإعدادات
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

// مكون فرعي للبطاقة
const SettingsCard = ({ title, icon, children }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200">
    <header className="flex items-center gap-3 p-4 border-b border-gray-100">
      <div className="text-cyan-600">{icon}</div>
      <h2 className="text-lg font-bold text-gray-800">{title}</h2>
    </header>
    <div className="p-6 space-y-4">{children}</div>
  </div>
);

SettingsCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
};

export default PlatformSettingsPage;
