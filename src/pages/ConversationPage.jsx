import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/axiosConfig";
import { FiLoader, FiSend, FiSearch, FiMessageSquare } from "react-icons/fi";
import PropTypes from "prop-types";

const ConversationPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { conversationId } = useParams();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- جلب قائمة المحادثات ---
  const fetchConversations = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/conversations?userId=${user.id}`);
      setConversations(response.data);
    } catch (err) {
      setError("فشل في تحميل المحادثات.");
      console.error("Fetch conversations error:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }
    fetchConversations();
  }, [user, authLoading, navigate, fetchConversations]);

  // --- جلب رسائل المحادثة النشطة ---
  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId) {
        setActiveConversation(null);
        setMessages([]);
        return;
      }
      try {
        const response = await apiClient.get(
          `/conversations/${conversationId}`
        );
        setActiveConversation(response.data);
        setMessages(response.data.messages || []);
      } catch (err) {
        console.error("Fetch messages error:", err);
        navigate("/conversation");
      }
    };
    fetchMessages();
  }, [conversationId, navigate]);

  const handleSendMessage = async (text) => {
    if (!text.trim() || !activeConversation) return;

    const newMessage = {
      id: Date.now(),
      userId: user.id,
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);

    try {
      await apiClient.patch(`/conversations/${activeConversation.id}`, {
        messages: [...messages, newMessage],
        lastMessage: text,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Send message error:", error);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FiLoader className="animate-spin text-sky-600 text-4xl" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* --- الشريط الجانبي: قائمة المحادثات --- */}
      <ConversationSidebar
        conversations={conversations}
        activeConversationId={conversationId}
        loading={loading}
        error={error}
      />

      {/* --- المنطقة الرئيسية: عرض المحادثة --- */}
      <main className="flex-1 flex flex-col">
        {conversationId && activeConversation ? (
          <ChatWindow
            conversation={activeConversation}
            messages={messages}
            currentUser={user}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <WelcomeScreen />
        )}
      </main>
    </div>
  );
};

const ConversationSidebar = ({
  conversations,
  activeConversationId,
  loading,
  error,
}) => (
  <aside className="w-full md:w-80 lg:w-96 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
    <header className="p-4 border-b">
      <h1 className="text-xl font-bold text-gray-800">صندوق الوارد</h1>
      <div className="relative mt-2">
        <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="البحث في المحادثات..."
          className="w-full bg-gray-100 border-transparent rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>
    </header>
    <div className="flex-1 overflow-y-auto">
      {loading && (
        <div className="p-4 text-center text-gray-500">جاري التحميل...</div>
      )}
      {error && <div className="p-4 text-center text-red-500">{error}</div>}
      {!loading &&
        !error &&
        conversations.map((convo) => (
          <ConversationItem
            key={convo.id}
            conversation={convo}
            isActive={convo.id.toString() === activeConversationId}
          />
        ))}
    </div>
  </aside>
);

ConversationSidebar.propTypes = {
  conversations: PropTypes.arrayOf(PropTypes.object).isRequired, // الأكثر دقة: مصفوفة من الكائنات
  activeConversationId: PropTypes.string, // قد يكون غير موجود في البداية
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

const ConversationItem = ({ conversation, isActive }) => (
  <Link
    to={`/conversation/${conversation.id}`}
    className={`flex items-center gap-3 p-3 border-b border-gray-100 transition-colors ${
      isActive ? "bg-sky-50" : "hover:bg-gray-50"
    }`}
  >
    <img
      src={conversation.participant.avatar_url}
      alt={conversation.participant.name}
      className="w-12 h-12 rounded-full object-cover"
    />
    <div className="flex-1 overflow-hidden">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-gray-800 truncate">
          {conversation.participant.name}
        </p>
        <p className="text-xs text-gray-400 flex-shrink-0">
          {new Date(conversation.updatedAt).toLocaleTimeString("ar-EG", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
      <p
        className={`text-sm truncate ${
          isActive ? "text-gray-600" : "text-gray-500"
        }`}
      >
        {conversation.lastMessage}
      </p>
    </div>
  </Link>
);

ConversationItem.propTypes = {
  conversation: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
};

const ChatWindow = ({ conversation, messages, currentUser, onSendMessage }) => {
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendMessage(text);
    setText("");
  };

  return (
    <>
      <header className="flex items-center gap-3 p-3 border-b bg-white shadow-sm">
        <img
          src={conversation.participant.avatar_url}
          alt={conversation.participant.name}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-bold text-gray-800">
            {conversation.participant.name}
          </p>
          <p className="text-xs text-green-500">متصل الآن</p>
        </div>
      </header>
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-6">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isMe={msg.userId === currentUser.id}
              otherParty={conversation.participant}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <footer className="bg-white border-t p-4">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="اكتب رسالتك هنا..."
            className="w-full bg-gray-100 border-2 border-transparent rounded-lg py-3 px-5 pr-12 focus:outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            className="absolute top-1/2 right-3 -translate-y-1/2 p-2 text-gray-500 hover:text-sky-600"
            title="إرسال"
          >
            <FiSend size={20} />
          </button>
        </form>
      </footer>
    </>
  );
};

const MessageBubble = ({ message, isMe, otherParty }) => (
  <div className={`flex items-end gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
    <img
      src={isMe ? "https://via.placeholder.com/150" : otherParty.avatar_url}
      alt="avatar"
      className="w-8 h-8 rounded-full"
    />
    <div
      className={`max-w-lg p-3 rounded-xl ${
        isMe
          ? "bg-sky-600 text-white rounded-br-none"
          : "bg-white border rounded-bl-none"
      }`}
    >
      <p>{message.text}</p>
      <p
        className={`text-xs mt-1 ${
          isMe ? "text-sky-200" : "text-gray-400"
        } text-left`}
      >
        {new Date(message.timestamp).toLocaleTimeString("ar-EG", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  </div>
);

const WelcomeScreen = () => (
  <div className="flex flex-col items-center justify-center h-full text-center bg-gray-50">
    <FiMessageSquare className="text-gray-300 text-7xl mb-4" />
    <h2 className="text-2xl font-bold text-gray-700">صندوق الوارد الخاص بك</h2>
    <p className="text-gray-500 mt-2">
      حدد محادثة من القائمة على اليسار لبدء الدردشة.
    </p>
  </div>
);

export default ConversationPage;
