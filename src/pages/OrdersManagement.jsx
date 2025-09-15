import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import {
  FiLoader,
  FiAlertTriangle,
  FiEye,
  FiCheck,
  FiX,
  FiTruck,
  FiInbox,
  FiArrowLeft,
} from "react-icons/fi";
import PropTypes from "prop-types";

const StatusBadge = ({ status }) => {
  const statusStyles = useMemo(
    () => ({
      new: { text: "جديد", bg: "bg-blue-100", textColor: "text-blue-800" },
      in_progress: {
        text: "قيد التنفيذ",
        bg: "bg-yellow-100",
        textColor: "text-yellow-800",
      },
      delivered: {
        text: "تم التسليم",
        bg: "bg-purple-100",
        textColor: "text-purple-800",
      },
      completed: {
        text: "مكتمل",
        bg: "bg-green-100",
        textColor: "text-green-800",
      },
      cancelled: { text: "ملغي", bg: "bg-red-100", textColor: "text-red-800" },
    }),
    []
  );


  const style = statusStyles[status] || statusStyles.default;
  return (
    <span
      className={`px-2.5 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1.5 ${style.bg} ${style.textColor}`}
    >
      {style.text}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.oneOf([
    "new",
    "in_progress",
    "delivered",
    "completed",
    "cancelled",
  ]).isRequired,
};

const OrderCard = ({ order, onUpdateStatus }) => {
  const renderActions = () => {
    switch (order.status) {
      case "new":
        return (
          <>
            <button
              onClick={() => onUpdateStatus(order.id, "in_progress")}
              className="flex items-center gap-1 text-xs bg-green-500 text-white px-3 py-1.5 rounded-md hover:bg-green-600 transition"
            >
              <FiCheck /> قبول
            </button>
            <button
              onClick={() => onUpdateStatus(order.id, "cancelled")}
              className="flex items-center gap-1 text-xs bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 transition"
            >
              <FiX /> رفض
            </button>
          </>
        );
      case "in_progress":
        return (
          <button
            onClick={() => onUpdateStatus(order.id, "delivered")}
            className="flex items-center gap-1 text-xs bg-sky-500 text-white px-3 py-1.5 rounded-md hover:bg-sky-600 transition"
          >
            <FiTruck /> تسليم العمل
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
      <div className="p-4 border-b flex justify-between items-start gap-2">
        <div>
          <p className="text-xs text-gray-500">طلب على خدمة:</p>
          <Link
            to={`/services/${order.service?.id}`}
            className="font-bold text-gray-800 hover:text-sky-700 line-clamp-1"
          >
            {order.service?.title || "خدمة محذوفة"}
          </Link>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <div className="p-4 grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <img
            src={order.buyer?.avatar_url}
            alt={order.buyer?.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <p className="text-xs text-gray-500">المشتري</p>
            <p className="font-semibold text-gray-700">
              {order.buyer?.name || "مستخدم محذوف"}
            </p>
          </div>
        </div>
        <div className="text-left">
          <p className="text-xs text-gray-500">السعر الإجمالي</p>
          <p className="font-bold text-lg text-green-600">
            ${order.totalAmount?.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">تاريخ الطلب</p>
          <p className="font-semibold text-gray-700">
            {new Date(order.createdAt).toLocaleDateString("ar-EG")}
          </p>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-2 flex justify-end items-center gap-2 rounded-b-xl">
        {renderActions()}
        <Link
          to={`/orders/${order.id}`}
          className="p-2 text-gray-500 hover:text-sky-600 rounded-full hover:bg-gray-200 transition"
          title="عرض التفاصيل"
        >
          <FiEye />
        </Link>
      </div>
    </div>
  );
};

const OrdersManagement = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [allOrders, setAllOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSellerOrders = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(
        `/orders?sellerId=${user.id}&_expand=buyer&_expand=service`
      );
      setAllOrders(
        response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );
    } catch (err) {
      setError("فشل في تحميل قائمة الطلبات.");
      console.error("Fetch orders error:", err);
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
    fetchSellerOrders();
  }, [user, authLoading, navigate, fetchSellerOrders]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    const originalOrders = [...allOrders];
    setAllOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    try {
      await apiClient.patch(`/orders/${orderId}`, { status: newStatus });
    } catch (error) {
      setAllOrders(originalOrders);
      alert("حدث خطأ أثناء تحديث حالة الطلب.");
      console.error(error);
    }
  };

  const filteredOrders = useMemo(() => {
    if (activeTab === "all") {
      return allOrders;
    }
    return allOrders.filter((order) => order.status === activeTab);
  }, [activeTab, allOrders]);

  const tabs = [
    { key: "all", label: "الكل" },
    { key: "new", label: "الجديدة" },
    { key: "in_progress", label: "قيد التنفيذ" },
    { key: "delivered", label: "تم تسليمها" },
    { key: "completed", label: "المكتملة" },
    { key: "cancelled", label: "الملغية" },
  ];

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <FiLoader className="animate-spin text-sky-600 text-5xl" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-4"
          >
            <FiArrowLeft />
            عودة
          </button>
          <h1 className="text-3xl font-extrabold text-gray-800">
            إدارة الطلبات الواردة
          </h1>
          <p className="text-gray-500 mt-1">
            تتبع وقبول وتسليم جميع الطلبات الواردة لخدماتك.
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-sm p-1.5 flex gap-1 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
                activeTab === tab.key
                  ? "bg-sky-600 text-white shadow"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="flex flex-col items-center justify-center text-center p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
            <FiAlertTriangle className="text-red-500 text-3xl mb-2" />
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        )}

        {filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border mt-8">
            <FiInbox size={56} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">
              لا توجد طلبات تطابق هذه الحالة
            </h2>
            <p className="text-gray-500 mt-2">
              جرب تحديد فلتر آخر أو انتظر وصول طلبات جديدة.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersManagement;
