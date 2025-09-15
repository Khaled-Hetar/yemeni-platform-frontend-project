import React, { useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import MessageBubble from "./MessageBubble";
import { FiLoader } from "react-icons/fi";

const MessageList = ({
  messages,
  currentUserId,
  onLoadMore,
  hasMore,
  isLoadingMore,
}) => {
  const listRef = useRef(null);
  const scrollHeightRef = useRef(0);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleScroll = useCallback(() => {
    const list = listRef.current;
    if (list && list.scrollTop === 0 && hasMore && !isLoadingMore) {
      scrollHeightRef.current = list.scrollHeight;
      onLoadMore();
    }
  }, [hasMore, isLoadingMore, onLoadMore]);

  useEffect(() => {
    if (listRef.current && !isLoadingMore) {
      const previousScrollHeight = scrollHeightRef.current;
      const newScrollHeight = listRef.current.scrollHeight;

      if (newScrollHeight > previousScrollHeight) {
        listRef.current.scrollTop = newScrollHeight - previousScrollHeight;
      }
      scrollHeightRef.current = 0;
    }
  }, [isLoadingMore, messages]);

  return (
    <div
      ref={listRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-6 space-y-4 bg-neutral-50"
    >
      {isLoadingMore && (
        <div className="flex justify-center py-4">
          <FiLoader className="animate-spin text-cyan-600" size={24} />
        </div>
      )}

      {messages.length > 0
        ? messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwnMessage={msg.user_id === currentUserId}
            />
          ))
        : !isLoadingMore && (
            <div className="text-center text-gray-500 pt-10">
              <p>لا توجد رسائل في هذه المحادثة بعد. ابدأ الحوار!</p>
            </div>
          )}
    </div>
  );
};

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  onLoadMore: PropTypes.func.isRequired,
  hasMore: PropTypes.bool.isRequired,
  isLoadingMore: PropTypes.bool.isRequired,
};

export default MessageList;
