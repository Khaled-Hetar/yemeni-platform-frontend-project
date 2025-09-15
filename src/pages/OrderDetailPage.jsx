import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import apiClient from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import {
  FiLoader,
  FiAlertTriangle,
  FiSend,
  FiPaperclip,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiCalendar,
  FiUser,
  FiArrowLeft,
  FiPackage,
  FiPlayCircle,
} from "react-icons/fi";

const WelcomeMessage = ({ isSeller, otherPartyName }) => (
  <div className="text-center py-10 px-4 bg-gray-50 rounded-xl border border-dashed">
    <FiPackage className="mx-auto text-4xl text-gray-400 mb-3" />
    <h3 className="font-bold text-lg text-gray-800">
      {isSeller
        ? `طلب جديد من ${otherPartyName}`
        : `لقد بدأت طلباً مع ${otherPartyName}`}
    </h3>
    <p className="text-sm text-gray-500 mt-1">
      {isSeller
        ? "يمكنك بدء المحادثة لتوضيح أي تفاصيل قبل قبول الطلب."
        : "لا تتردد في طرح أي أسئلة أو إرسال الملفات المطلوبة هنا."}
    </p>
  </div>
);

const DateSeparator = ({ date }) => (
  <div className="text-center my-4">
    <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
      {new Date(date).toLocaleDateString("ar-EG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </span>
  </div>
);

const MessageBubble = ({ message, isMe, user, otherParty }) => {
  const sender = isMe
    ? user
    : otherParty || { name: "مستخدم", avatar_url: "https://i.pravatar.cc/150" };
  const bubbleColor = isMe ? "bg-cyan-600 text-white" : "bg-white border";
  const bubblePosition = isMe ? "flex-row-reverse" : "flex-row";
  const bubbleRadius = isMe ? "rounded-br-none" : "rounded-bl-none";

  return (
    <div className={`flex items-end gap-3 ${bubblePosition} animate-fade-in`}>
      <img
        src={sender.avatar_url}
        alt={sender.name}
        className="w-8 h-8 rounded-full self-end"
      />
      <div
        className={`max-w-lg p-3 rounded-xl relative ${bubbleColor} ${bubbleRadius}`}
      >
        <p className="text-sm" style={{ whiteSpace: "pre-wrap" }}>
          {message.text}
        </p>
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

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start">
    <div className="text-gray-400 mt-1">{icon}</div>
    <div className="mr-3">
      <p className="text-gray-500">{label}</p>
      <div className="font-semibold text-gray-800">{value}</div>
    </div>
  </div>
);

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const chatEndRef = useRef(null);

  const fetchOrderDetails = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(
        `/orders/${orderId}?_expand=service&_expand=buyer&_expand=seller`
      );
      setOrder(response.data);
    } catch (err) {
      setError("فشل في جلب تفاصيل الطلب. قد لا يكون لديك صلاحية الوصول.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [orderId, user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }
    fetchOrderDetails();
  }, [user, authLoading, navigate, fetchOrderDetails]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [order?.messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const tempMessage = {
      id: Date.now(),
      userId: user.id,
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    setOrder((prev) => ({
      ...prev,
      messages: [...(prev.messages || []), tempMessage],
    }));
    setNewMessage("");

    try {
      // await apiClient.post('/order-messages', { orderId, message: newMessage });
    } catch (err) {
      alert("فشل إرسال الرسالة");
      setOrder((prev) => ({
        ...prev,
        messages: prev.messages.filter((m) => m.id !== tempMessage.id),
      }));
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    const actionText = {
      in_progress: "قبول وبدء تنفيذ",
      delivered: "تسليم",
      completed: "الموافقة على استلام",
    };
    if (
      !window.confirm(
        `هل أنت متأكد من أنك تريد ${actionText[newStatus] || "تحديث"} الطلب؟`
      )
    )
      return;

    setIsSubmitting(true);
    try {
      const response = await apiClient.patch(`/orders/${orderId}`, {
        status: newStatus,
      });
      setOrder(response.data);
      alert("تم تحديث حالة الطلب بنجاح!");
    } catch (err) {
      alert("فشل في تحديث حالة الطلب.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReportProblem = () => {
    navigate("/dashboard/support/new", {
      state: {
        subject: `مشكلة بخصوص الطلب رقم #${order.id}`,
        initialMessage: `مرحباً فريق الدعم،\nأواجه مشكلة بخصوص الطلب رقم #${order.id} المتعلق بخدمة "${order.service?.title}".\n\n[يرجى وصف المشكلة هنا]`,
      },
    });
  };

  const renderActionButtons = () => {
    if (!order || !user) return null;

    const isBuyer = user.id === order.buyerId;
    const isSeller = user.id === order.sellerId;

    switch (order.status) {
      case "new":
        if (isSeller) {
          return (
            <button
              onClick={() => handleUpdateStatus("in_progress")}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 p-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              <FiPlayCircle />{" "}
              {isSubmitting ? "جاري القبول..." : "قبول وبدء التنفيذ"}
            </button>
          );
        }
        return (
          <p className="text-center text-sm text-gray-500">
            بانتظار قبول البائع للطلب.
          </p>
        );

      case "in_progress":
        if (isSeller) {
          return (
            <button
              onClick={() => handleUpdateStatus("delivered")}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 p-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 transition disabled:opacity-50"
            >
              <FiPackage />{" "}
              {isSubmitting ? "جاري التسليم..." : "تسليم العمل الآن"}
            </button>
          );
        }
        return (
          <p className="text-center text-sm text-gray-500">
            الطلب قيد التنفيذ من قبل البائع.
          </p>
        );

      case "delivered":
        if (isBuyer) {
          return (
            <button
              onClick={() => handleUpdateStatus("completed")}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 p-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              <FiCheckCircle />{" "}
              {isSubmitting ? "جاري الموافقة..." : "موافقة واستلام الطلب"}
            </button>
          );
        }
        return (
          <p className="text-center text-sm text-gray-500">
            بانتظار موافقة المشتري على التسليم.
          </p>
        );

      case "completed":
        return (
          <p className="text-center text-sm text-green-600 font-semibold">
            تم إكمال هذا الطلب بنجاح.
          </p>
        );

      case "cancelled":
        return (
          <p className="text-center text-sm text-red-600 font-semibold">
            تم إلغاء هذا الطلب.
          </p>
        );

      default:
        return (
          <p className="text-center text-sm text-gray-500">
            لا توجد إجراءات متاحة حالياً.
          </p>
        );
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FiLoader className="animate-spin text-cyan-600 text-4xl" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <FiAlertTriangle className="mr-2" /> {error}
      </div>
    );
  }
  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen">
        لم يتم العثور على الطلب.
      </div>
    );
  }

  const isSellerView = user.id === order.sellerId;
  const backLink = isSellerView ? "/dashboard/sales" : "/orders";
  const backLinkText = isSellerView
    ? "العودة إلى المبيعات"
    : "العودة إلى الطلبات";
  const otherParty = isSellerView ? order.buyer : order.seller;

  const renderMessages = () => {
    const messages = order.messages || [];
    if (messages.length === 0) {
      return (
        <WelcomeMessage
          isSeller={isSellerView}
          otherPartyName={otherParty?.name || "الطرف الآخر"}
        />
      );
    }

    const messageElements = [];
    let lastDate = null;

    messages.forEach((msg) => {
      const messageDate = new Date(msg.timestamp).toDateString();
      if (messageDate !== lastDate) {
        messageElements.push(
          <DateSeparator key={messageDate} date={msg.timestamp} />
        );
        lastDate = messageDate;
      }
      messageElements.push(
        <MessageBubble
          key={msg.id}
          message={msg}
          isMe={msg.userId === user.id}
          user={user}
          otherParty={otherParty}
        />
      );
    });

    return messageElements;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-80 flex-shrink-0 bg-white border-l border-gray-200 p-6 flex flex-col">
        <Link
          to={backLink}
          className="flex items-center gap-2 text-sm text-cyan-600 hover:underline mb-6"
        >
          <FiArrowLeft /> {backLinkText}
        </Link>
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          {order.service?.title || "خدمة محذوفة"}
        </h2>
        <p className="text-sm text-gray-500 mb-6">طلب رقم #{order.id}</p>

        <div className="space-y-4 text-sm">
          <InfoRow icon={<FiClock />} label="حالة الطلب" value={order.status} />
          <InfoRow
            icon={<FiDollarSign />}
            label="سعر الطلب"
            value={`$${order.totalAmount?.toFixed(2) || "0.00"}`}
          />
          <InfoRow
            icon={<FiCalendar />}
            label="تاريخ الطلب"
            value={new Date(order.createdAt).toLocaleDateString("ar-EG")}
          />
          {otherParty && (
            <InfoRow
              icon={<FiUser />}
              label={isSellerView ? "المشتري" : "البائع"}
              value={
                <Link
                  to={`/profile/${otherParty.id}`}
                  className="flex items-center gap-2 hover:underline"
                >
                  <img
                    src={otherParty.avatar_url}
                    alt={otherParty.name}
                    className="w-6 h-6 rounded-full"
                  />
                  {otherParty.name}
                </Link>
              }
            />
          )}
        </div>

        <div className="mt-auto space-y-3">
          <h3 className="text-md font-bold text-gray-700">إجراءات الطلب</h3>
          {renderActionButtons()}
          <button
            onClick={handleReportProblem}
            className="w-full text-center p-2 text-sm text-red-600 hover:bg-red-100 rounded-lg transition"
          >
            الإبلاغ عن مشكلة
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col bg-gray-100">
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-4">
            {renderMessages()}
            <div ref={chatEndRef} />
          </div>
        </div>
        <div className="bg-white border-t p-4">
          <form onSubmit={handleSendMessage} className="relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              className="w-full bg-gray-100 border-2 border-transparent rounded-lg py-3 px-5 pr-24 focus:outline-none focus:border-cyan-500 transition-colors"
              disabled={isSubmitting}
            />
            <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center gap-1">
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-cyan-600 transition-colors"
              >
                <FiPaperclip size={20} />
              </button>
              <button
                type="submit"
                disabled={!newMessage.trim() || isSubmitting}
                className="p-2 text-gray-500 enabled:hover:text-cyan-600 disabled:opacity-50 enabled:text-cyan-500 transition-colors"
              >
                <FiSend size={20} />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default OrderDetailPage;
