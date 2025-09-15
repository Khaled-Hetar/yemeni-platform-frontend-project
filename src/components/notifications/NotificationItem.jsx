import React from "react";
import PropTypes from "prop-types";
import {
  FiBell,
  FiMessageSquare,
  FiFileText,
  FiStar,
  FiClipboard,
} from "react-icons/fi";

const NotificationIcon = ({ type }) => {
  const iconMap = {
    new_proposal: <FiFileText className="text-blue-500" />,
    new_order: <FiClipboard className="text-green-500" />,
    new_message: <FiMessageSquare className="text-purple-500" />,
    new_review: <FiStar className="text-yellow-500" />,
    default: <FiBell className="text-gray-500" />,
  };
  return (
    <div className="p-3 bg-gray-100 rounded-full">
      {iconMap[type] || iconMap.default}
    </div>
  );
};

NotificationIcon.propTypes = {
  type: PropTypes.string,
};

const NotificationItem = ({ notification, onClick }) => {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={`w-full flex items-start gap-4 p-4 transition text-left 
          ${
            notification.read_at
              ? "bg-white hover:bg-gray-50"
              : "bg-sky-50 hover:bg-sky-100"
          }`}
      >
        <NotificationIcon type={notification.data.type} />
        <div className="flex-grow">
          <p className="text-sm text-gray-800">{notification.data.message}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(notification.created_at).toLocaleString("ar-EG", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </p>
        </div>
        {!notification.read_at && (
          <div
            className="w-2.5 h-2.5 bg-sky-500 rounded-full self-center flex-shrink-0"
            aria-label="إشعار غير مقروء"
          ></div>
        )}
      </button>
    </li>
  );
};

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    read_at: PropTypes.string,
    created_at: PropTypes.string.isRequired,
    data: PropTypes.shape({
      type: PropTypes.string,
      message: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default NotificationItem;
