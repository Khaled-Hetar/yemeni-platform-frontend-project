import React from "react";
import NotificationItem from "./NotificationItem";
import PropTypes from "prop-types";

const NotificationList = ({ notifications, onNotificationClick }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
    <ul className="divide-y divide-gray-100">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClick={() => onNotificationClick(notification)}
        />
      ))}
    </ul>
  </div>
);

NotificationList.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,

    })
  ).isRequired,
  onNotificationClick: PropTypes.func.isRequired,
};
export default NotificationList;
