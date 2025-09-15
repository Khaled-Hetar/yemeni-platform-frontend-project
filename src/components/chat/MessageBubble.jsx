import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { format, isToday, isThisYear } from "date-fns";
import { ar } from "date-fns/locale";
import { FiCheck, FiCheckCircle, FiAlertCircle, FiClock } from "react-icons/fi";

const formatMessageTime = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isToday(date)) {
      return format(date, "p", { locale: ar });
    }
    if (isThisYear(date)) {
      return format(date, "d MMM", { locale: ar });
    }
    return format(date, "d/M/yyyy", { locale: ar });
  } catch (error) {
    console.error(error);
    return "";
  }
};
const MessageStatusIcon = ({ status }) => {
  switch (status) {
    case "sending":
      return (
        <FiClock
          size={14}
          className="text-current opacity-70"
          title="جاري الإرسال..."
        />
      );
    case "sent":
      return (
        <FiCheck
          size={14}
          className="text-current opacity-70"
          title="تم الإرسال"
        />
      );
    case "delivered":
      return (
        <FiCheckCircle
          size={14}
          className="text-current opacity-70"
          title="تمت القراءة"
        />
      );
    case "failed":
      return (
        <FiAlertCircle size={14} className="text-red-400" title="فشل الإرسال" />
      );
    default:
      return null;
  }
};

MessageStatusIcon.propTypes = {
  status: PropTypes.oneOf(["sending", "sent", "delivered", "read", "failed"]),
};
const MessageBubble = ({ message, isOwnMessage }) => {
  const bubbleClasses = useMemo(
    () =>
      isOwnMessage
        ? "bg-cyan-600 text-white rounded-br-none"
        : "bg-white text-neutral-900 rounded-bl-none border",
    [isOwnMessage]
  );

  const formattedTime = useMemo(
    () => formatMessageTime(message.created_at),
    [message.created_at]
  );

  return (
    <div
      className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"}`}
    >
      <div
        className={`rounded-xl px-3 py-2 shadow-sm max-w-[80%] sm:max-w-[70%] ${bubbleClasses}`}
      >
        <p
          className="text-md"
          style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
        >
          {message.body}
        </p>

        <div className="flex items-center justify-end gap-2 mt-1.5">
          <p className="text-xs opacity-70">{formattedTime}</p>
          {isOwnMessage && <MessageStatusIcon status={message.status} />}
        </div>
      </div>
    </div>
  );
};

MessageBubble.propTypes = {
  message: PropTypes.shape({
    body: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    status: PropTypes.oneOf(["sending", "sent", "delivered", "read", "failed"]),
  }).isRequired,
  isOwnMessage: PropTypes.bool.isRequired,
};

export default React.memo(MessageBubble);
