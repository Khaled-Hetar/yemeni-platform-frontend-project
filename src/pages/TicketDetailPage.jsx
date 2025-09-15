import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../api/axiosConfig";
import AdminLayout from "../components/AdminLayout";
import { useAuth } from "../context/AuthContext";
import {
  FiLoader,
  FiAlertTriangle,
  FiSend,
  FiArrowRight,
  FiInfo,
  FiClock,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiArchive,
} from "react-icons/fi";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import PropTypes from "prop-types";

const statusConfig = {
  new: {
    text: "جديدة",
    styles: "bg-blue-100 text-blue-800",
    icon: <FiInfo />,
  },
  in_progress: {
    text: "قيد المعالجة",
    styles: "bg-yellow-100 text-yellow-800",
    icon: <FiLoader className="animate-spin" />,
  },
  completed: {
    text: "مكتملة",
    styles: "bg-green-100 text-green-800",
    icon: <FiCheckCircle />,
  },
  cancelled: {
    text: "ملغاة",
    styles: "bg-red-100 text-red-800",
    icon: <FiXCircle />,
  },
  default: {
    text: "مغلقة",
    styles: "bg-gray-200 text-gray-700",
    icon: <FiArchive />,
  },
};

const StatusBadge = ({ status }) => {
  const currentStatus = statusConfig[status] || statusConfig.default;
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${currentStatus.styles}`}
    >
      {currentStatus.icon}
      {currentStatus.text}
    </div>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

const MessageBubble = ({ message, author, isAdminReply }) => (
  <div
    className={`flex items-start gap-4 ${
      isAdminReply ? "flex-row-reverse" : ""
    }`}
  >
    <img
      src={author.avatar_url}
      alt={author.name}
      className="w-11 h-11 rounded-full border-2 border-white shadow-md"
    />
    <div
      className={`p-4 rounded-xl w-full shadow-md ${
        isAdminReply
          ? "bg-cyan-600 text-white rounded-tr-none"
          : "bg-gray-100 text-gray-800 rounded-tl-none"
      }`}
    >
      <p
        className={`font-bold ${
          isAdminReply ? "text-cyan-100" : "text-gray-900"
        }`}
      >
        {author.name}
      </p>
      <p className="mt-1">{message.text}</p>
      {message.timestamp && (
        <p
          className={`text-xs text-left mt-2 ${
            isAdminReply ? "text-cyan-200" : "text-gray-400"
          }`}
        >
          {format(new Date(message.timestamp), "d MMMM yyyy, hh:mm a", {
            locale: ar,
          })}
        </p>
      )}
    </div>
  </div>
);

MessageBubble.propTypes = {
  message: PropTypes.object.isRequired,
  author: PropTypes.object.isRequired,
  isAdminReply: PropTypes.bool.isRequired,
};

const TicketDetailPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { user: adminUser } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReply, setNewReply] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTicketDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/supportTickets/${ticketId}`);
      setTicket(response.data);
    } catch (err) {
      setError("فشل في جلب تفاصيل التذكرة.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchTicketDetails();
  }, [fetchTicketDetails]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!newReply.trim() || !ticket) return;
    setIsSubmitting(true);
    try {
      const replyMessage = {
        userId: adminUser.id,
        text: newReply,
        timestamp: new Date().toISOString(),
      };
      setTicket((prevTicket) => ({
        ...prevTicket,
        messages: [...prevTicket.messages, replyMessage],
      }));
      setNewReply("");

      await apiClient.post("/ticketReplies", {
        ticketId: ticket.id,
        userId: adminUser.id,
        message: newReply,
      });
      fetchTicketDetails();
    } catch (err) {
      alert("فشل في إرسال الرد.");
      console.error(err);
      fetchTicketDetails();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !ticket)
    return (
      <AdminLayout>
        <div className="flex justify-center p-10">
          <FiLoader className="animate-spin text-3xl text-cyan-600" />
        </div>
      </AdminLayout>
    );
  if (error)
    return (
      <AdminLayout>
        <div className="text-center p-10 text-red-500 flex flex-col items-center gap-2">
          <FiAlertTriangle size={24} /> {error}
        </div>
      </AdminLayout>
    );
  if (!ticket?.user)
    return (
      <AdminLayout>
        <div>لم يتم العثور على التذكرة أو بيانات المستخدم.</div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-cyan-600 hover:underline mb-6"
      >
        <FiArrowRight /> العودة إلى قائمة التذاكر
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
              {/* عرض الرسالة الأولى */}
              {ticket.messages?.[0] && (
                <MessageBubble
                  message={ticket.messages[0]}
                  author={ticket.user}
                  isAdminReply={false}
                />
              )}

              {ticket.messages?.slice(1).map((reply) => {
                const isAdminReply = reply.userId === adminUser.id;
                const author = isAdminReply ? adminUser : ticket.user;
                return (
                  <MessageBubble
                    key={reply.id || reply.timestamp}
                    message={reply}
                    author={author}
                    isAdminReply={isAdminReply}
                  />
                );
              })}
            </div>

            <hr className="my-6 border-gray-200" />

            <form
              onSubmit={handleReplySubmit}
              className="flex items-start gap-4"
            >
              <img
                src={adminUser.avatar_url}
                alt={adminUser.name}
                className="w-11 h-11 rounded-full"
              />
              <div className="flex-grow">
                <textarea
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  rows="4"
                  className="w-full p-3 border-gray-200 border bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                  placeholder="اكتب ردك هنا..."
                  disabled={isSubmitting}
                ></textarea>
                <button
                  type="submit"
                  disabled={isSubmitting || !newReply.trim()}
                  className="mt-3 flex items-center justify-center gap-2 px-5 py-2.5 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <FiSend /> {isSubmitting ? "جاري الإرسال..." : "إرسال الرد"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-3">
              تفاصيل التذكرة
            </h3>

            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">
                الموضوع
              </p>
              <p className="text-lg font-bold text-gray-900">
                {ticket.subject}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-500 mb-2">الحالة</p>
              <StatusBadge status={ticket.status} />
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">
                تاريخ الإنشاء
              </p>
              <div className="flex items-center gap-2 text-gray-700">
                <FiCalendar />
                <span>
                  {format(new Date(ticket.createdAt), "d MMMM yyyy", {
                    locale: ar,
                  })}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">
                آخر تحديث
              </p>
              <div className="flex items-center gap-2 text-gray-700">
                <FiClock />
                <span>
                  {format(new Date(ticket.updatedAt), "d MMMM yyyy", {
                    locale: ar,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default TicketDetailPage;
