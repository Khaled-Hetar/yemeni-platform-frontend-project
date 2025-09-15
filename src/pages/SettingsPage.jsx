import React from "react";
import { Link } from "react-router-dom";
import {
  FiUser,
  FiBell,
  FiLock,
  FiMoon,
  FiGlobe,
  FiCreditCard,
  FiChevronRight,
  FiAlertTriangle,
} from "react-icons/fi";

const SettingsPage = () => {
  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "هل أنت متأكد تماماً؟ سيتم حذف حسابك وجميع بياناتك بشكل نهائي ولا يمكن التراجع عن هذا الإجراء."
      )
    ) {
      alert("سيتم بناء ميزة حذف الحساب لاحقاً.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
      <header className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
          الإعدادات
        </h1>
        <p className="text-gray-500 mt-2">
          إدارة تفضيلات حسابك ومعلوماتك الشخصية
        </p>
      </header>

      {/* قسم إعدادات الحساب */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-600 uppercase tracking-wider mb-3 px-2">
          الحساب
        </h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
          <SettingItem
            to="/settings/profile"
            icon={<FiUser />}
            title="الملف الشخصي"
            description="تحديث معلوماتك الشخصية وبيانات الاتصال"
          />
          <SettingItem
            to="/settings/security"
            icon={<FiLock />}
            title="الأمان"
            description="تغيير كلمة المرور وتأمين حسابك"
          />
          <SettingItem
            to="/settings/payments"
            icon={<FiCreditCard />}
            title="الرصيد والمدفوعات"
            description="عرض سجل المعاملات وإدارة طرق الدفع"
          />
        </div>
      </div>

      {/* قسم تفضيلات التطبيق */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-600 uppercase tracking-wider mb-3 px-2">
          التفضيلات
        </h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
          <SettingItem
            to="/settings/notifications"
            icon={<FiBell />}
            title="الإشعارات"
            description="إدارة إعدادات التنبيهات التي تصلك"
          />
          <SettingItem
            to="/settings/language"
            icon={<FiGlobe />}
            title="اللغة والمنطقة"
            description="تغيير لغة الواجهة والمنطقة الزمنية"
          />
          <SettingItem
            to="/settings/theme"
            icon={<FiMoon />}
            title="المظهر"
            description="التبديل بين الوضع الفاتح والداكن"
          />
        </div>
      </div>

      {/* منطقة الخطر */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-5">
        <h3 className="text-lg font-bold text-red-800 mb-2 flex items-center gap-2">
          <FiAlertTriangle /> منطقة الخطر
        </h3>
        <div className="sm:flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-red-700">حذف الحساب نهائياً</h4>
            <p className="text-sm text-red-600 mt-1">
              سيتم حذف جميع بياناتك بشكل نهائي. لا يمكن التراجع عن هذا الإجراء.
            </p>
          </div>
          <button
            onClick={handleDeleteAccount}
            className="mt-3 sm:mt-0 w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-lg transition-transform transform hover:scale-105"
          >
            حذف الحساب
          </button>
        </div>
      </div>
    </div>
  );
};

const SettingItem = ({ to, icon, title, description }) => (
  <Link
    to={to}
    className="flex items-center justify-between gap-4 p-4 hover:bg-gray-50 transition duration-150 group"
  >
    <div className="flex items-center gap-4">
      <div className="p-3 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-colors">
        {React.cloneElement(icon, { size: 22 })}
      </div>
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
    <FiChevronRight
      size={20}
      className="text-gray-400 group-hover:text-gray-600 transition-colors"
    />
  </Link>
);

export default SettingsPage;
