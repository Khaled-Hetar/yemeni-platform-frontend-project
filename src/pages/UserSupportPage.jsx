import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import apiClient from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import {
  FiLoader,
  FiAlertTriangle,
  FiSend,
  FiPaperclip,
  FiPlus,
  FiArrowRight,
  FiMessageSquare,
  FiClock,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";

// --- المكون الرئيسي للصفحة ---
const UserSupportPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserTickets = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/supportTickets?userId=${user.id}`);
      setTickets(
        response.data.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        )
      );
    } catch (err) {
      setError("فشل في جلب تذاكر الدعم.");
      console.error(err);
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
    fetchUserTickets();
  }, [user, authLoading, navigate, fetchUserTickets]);

  useEffect(() => {
    if (ticketId && tickets.length > 0) {
      const foundTicket = tickets.find((t) => String(t.id) === ticketId);
      setActiveTicket(foundTicket);
    } else if (ticketId === "new") {
      setActiveTicket({ isNew: true, ...location.state });
    } else {
      setActiveTicket(null);
    }
  }, [ticketId, tickets, location.state]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* --- الشريط الجانبي لقائمة التذاكر --- */}
      <aside className="w-96 flex-shrink-0 bg-white border-l border-gray-200 p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">الدعم الفني</h2>

          {ticketId === "new" ? (
            <Link
              to="/support"
              className="p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
              title="إلغاء"
            >
              <FiX size={20} />
            </Link>
          ) : (
            <Link
              to="/support/new"
              className="p-2 rounded-full bg-cyan-600 text-white hover:bg-cyan-700"
              title="فتح تذكرة جديدة"
            >
              <FiPlus size={20} />
            </Link>
          )}
        </div>

        {loading && (
          <div className="text-center py-10">
            <FiLoader className="animate-spin mx-auto" />
          </div>
        )}
        {error && <div className="text-center py-10 text-red-500">{error}</div>}

        <nav className="space-y-2 overflow-y-auto">
          {tickets.map((ticket) => (
            <TicketListItem
              key={ticket.id}
              ticket={ticket}
              isActive={ticket.id === activeTicket?.id}
            />
          ))}
        </nav>
      </aside>

      {/* --- منطقة المحادثة أو إنشاء تذكرة جديدة --- */}
      <main className="flex-1 flex flex-col">
        {ticketId === "new" ? (
          <NewTicketForm
            prefill={location.state}
            onTicketCreated={fetchUserTickets}
          />
        ) : activeTicket ? (
          <ChatWindow ticket={activeTicket} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <FiMessageSquare size={48} />
            <h3 className="mt-4 text-xl font-semibold">حدد تذكرة لعرضها</h3>
            <p>أو قم بإنشاء تذكرة دعم جديدة.</p>
          </div>
        )}
      </main>
    </div>
  );
};

const TicketListItem = ({ ticket, isActive }) => {
  const statusInfo = {
    new: { icon: <FiMessageSquare />, text: "جديدة", color: "text-blue-500" },
    in_progress: {
      icon: <FiClock />,
      text: "قيد المعالجة",
      color: "text-yellow-500",
    },
    closed: { icon: <FiCheckCircle />, text: "مغلقة", color: "text-gray-500" },
  }[ticket.status];

  return (
    <Link
      to={`/support/${ticket.id}`}
      className={`block p-4 rounded-xl transition ${
        isActive ? "bg-cyan-50" : "hover:bg-gray-100"
      }`}
    >
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-gray-800">{ticket.subject}</h4>
        <div
          className={`flex items-center gap-1 text-xs font-semibold ${statusInfo.color}`}
        >
          {statusInfo.icon} {statusInfo.text}
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-1 truncate">
        {ticket.messages?.[ticket.messages.length - 1]?.text ||
          "لا توجد رسائل بعد"}
      </p>
      <p className="text-xs text-gray-400 mt-2 text-left">
        آخر تحديث: {new Date(ticket.updatedAt).toLocaleDateString("ar-EG")}
      </p>
    </Link>
  );
};

// نافذة المحادثة لتذكرة موجودة
const ChatWindow = ({ ticket }) => {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <header className="bg-white border-b p-4 flex items-center gap-4">
        <FiArrowRight
          onClick={() => window.history.back()}
          className="cursor-pointer text-gray-500 hover:text-gray-800"
        />
        <h3 className="font-bold text-lg">{ticket.subject}</h3>
      </header>
      <div className="flex-1 p-6 overflow-y-auto bg-gray-100">
        <div className="space-y-6">
          {(ticket.messages || []).map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isMe={msg.userId === user.id}
            />
          ))}
        </div>
      </div>
      <footer className="bg-white border-t p-4">
        {ticket.status !== "closed" ? (
          <form onSubmit={handleSendMessage} className="relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="اكتب رسالتك..."
              className="w-full bg-gray-100 rounded-lg py-3 px-5 pr-24 focus:outline-none"
            />
            <div className="absolute top-1/2 right-3 -translate-y-1/2 flex gap-1">
              <button type="button" className="p-2 text-gray-500">
                <FiPaperclip />
              </button>
              <button type="submit" className="p-2 text-cyan-600">
                <FiSend />
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center text-sm text-gray-500 p-3 bg-gray-100 rounded-lg">
            تم إغلاق هذه التذكرة. لا يمكنك إرسال رسائل جديدة.
          </div>
        )}
      </footer>
    </>
  );
};

const NewTicketForm = ({ prefill, onTicketCreated }) => {
  const navigate = useNavigate();
  const [subject, setSubject] = useState(prefill?.subject || "");
  const [message, setMessage] = useState(prefill?.initialMessage || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setIsSubmitting(true);
    try {
      const response = await apiClient.post("/supportTickets", {
        subject,
        message,
      });
      onTicketCreated();
      navigate(`/support/${response.data.id}`);
    } catch (err) {
      alert("فشل في إنشاء التذكرة.");
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <h3 className="text-2xl font-bold mb-6">فتح تذكرة دعم جديدة</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="subject" className="block font-semibold mb-1">
            الموضوع
          </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="message" className="block font-semibold mb-1">
            اشرح مشكلتك بالتفصيل
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="8"
            className="w-full p-2 border rounded-md"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-cyan-600 text-white rounded-lg disabled:opacity-50"
        >
          {isSubmitting ? "جاري الإرسال..." : "إرسال التذكرة"}
        </button>
      </form>
    </div>
  );
};

const MessageBubble = ({ message, isMe }) => {
  const senderName = isMe ? "أنا" : "فريق الدعم";
  return (
    <div className={`flex items-end gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
      <div
        className={`max-w-lg p-3 rounded-xl ${
          isMe
            ? "bg-cyan-600 text-white rounded-br-none"
            : "bg-white border rounded-bl-none"
        }`}
      >
        <p className="font-bold text-sm mb-1">{senderName}</p>
        <p>{message.text}</p>
        <p
          className={`text-xs mt-1 ${
            isMe ? "text-cyan-200" : "text-gray-400"
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
};

export default UserSupportPage;
