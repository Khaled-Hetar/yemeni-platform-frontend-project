import React from "react";
import { FiCheckCircle, FiTrash2 } from "react-icons/fi";
import PropTypes from "prop-types";

const NotificationHeader = ({
  onMarkAllAsRead,
  onDeleteAll,
  hasNotifications,
}) => (
  <header className="flex items-center justify-between mb-8">
    <h1 className="text-3xl font-bold text-sky-700">الإشعارات</h1>
    {hasNotifications && (
      <div className="flex items-center gap-2">
        <button
          onClick={onMarkAllAsRead}
          className="text-xs text-gray-600 hover:text-sky-600 font-semibold flex items-center gap-1"
        >
          <FiCheckCircle /> تمييز الكل كمقروء
        </button>
        <button
          onClick={onDeleteAll}
          className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"
        >
          <FiTrash2 /> حذف الكل
        </button>
      </div>
    )}
  </header>
);

NotificationHeader.propTypes = {
  onMarkAllAsRead: PropTypes.func.isRequired,
  onDeleteAll: PropTypes.func.isRequired,
  hasNotifications: PropTypes.bool.isRequired,
};

export default NotificationHeader;
