import React from "react";
import PropTypes from "prop-types";
import { useAuth } from "../context/AuthContext";
import {
  FiGrid,
  FiUsers,
  FiDollarSign,
  FiSettings,
  FiLogOut,
  FiMessageSquare,
  FiShield,
} from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import Can from "../components/Can";

const SidebarLink = ({ to, icon, children, end = false }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive ? "bg-gray-900 text-white" : "hover:bg-gray-700"
      }`
    }
  >
    {icon}
    <span>{children}</span>
  </NavLink>
);

SidebarLink.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  end: PropTypes.bool,
};

const AdminLayout = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-gray-300 flex flex-col shadow-lg">
        <div className="p-5 text-2xl font-bold border-b border-gray-700 text-center text-white">
          لوحة التحكم
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <SidebarLink to="/dashboard" icon={<FiGrid />} end={true}>
            نظرة عامة
          </SidebarLink>

          <Can perform="users">
            <SidebarLink to="/dashboard/users" icon={<FiUsers />}>
              إدارة المستخدمين
            </SidebarLink>
          </Can>

          <Can perform="transactions">
            <SidebarLink to="/dashboard/transactions" icon={<FiDollarSign />}>
              الإدارة المالية
            </SidebarLink>
          </Can>

          <Can perform="support">
            <SidebarLink to="/dashboard/support" icon={<FiMessageSquare />}>
              الدعم الفني
            </SidebarLink>
          </Can>

          <Can perform="verifications">
            <SidebarLink to="/dashboard/verifications" icon={<FiShield />}>
              طلبات التحقق
            </SidebarLink>
          </Can>

          <Can perform="platform-settings">
            <SidebarLink
              to="/dashboard/platform-settings"
              icon={<FiSettings />}
            >
              إعدادات المنصة
            </SidebarLink>
          </Can>

          <SidebarLink to="/dashboard/settings" icon={<FiSettings />}>
            الإعدادات
          </SidebarLink>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            <FiLogOut />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminLayout;
