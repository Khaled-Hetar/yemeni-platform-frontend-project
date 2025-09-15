import React from "react";
import PropTypes from "prop-types";
import { formatDistanceToNowStrict } from "date-fns";
import { ar } from "date-fns/locale"; 

/**
 * دالة مساعدة لتحديد حالة الاتصال للمستخدم.
 * @param {object} user - كائن المستخدم الذي يحتوي على حالة الاتصال.
 * @returns {object} - كائن يحتوي على النص واللون المناسبين.
 */
const getUserStatus = (user) => {
  if (user.status === "online") {
    return {
      text: "متصل الآن",
      color: "text-green-300",
    };
  }

  if (user.last_seen) {
    try {
      const lastSeenDate = new Date(user.last_seen);
      const distance = formatDistanceToNowStrict(lastSeenDate, {
        addSuffix: true,
        locale: ar, 
      });
      return {
        text: `آخر ظهور ${distance}`,
        color: "text-cyan-100",
      };
    } catch (error) {
      console.error("Invalid date format for last_seen:", user.last_seen, error);
      return { text: "غير متصل", color: "text-cyan-100" };
    }
  }

  return {
    text: "غير متصل",
    color: "text-cyan-100",
  };
};

const ChatHeader = ({ otherUser }) => {
  const statusInfo = otherUser ? getUserStatus(otherUser) : null;

  return (
    <header className="flex items-center gap-4 bg-cyan-600 p-4 text-white rounded-t-2xl">
      {otherUser ? (
        <>
          <img
            src={otherUser.avatar_url}
            alt={otherUser.name}
            className="w-14 h-14 rounded-full border-2 border-white object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold">{otherUser.name}</h2>
            <p className={`text-xs transition-colors ${statusInfo.color}`}>
              {statusInfo.text}
            </p>
          </div>
        </>
      ) : (
        <h2 className="text-xl font-semibold">اختر محادثة</h2>
      )}
    </header>
  );
};

ChatHeader.propTypes = {
  otherUser: PropTypes.shape({
    name: PropTypes.string.isRequired,
    avatar_url: PropTypes.string.isRequired,
    status: PropTypes.oneOf(["online", "offline"]),
    last_seen: PropTypes.string,
  }),
};

export default ChatHeader;
