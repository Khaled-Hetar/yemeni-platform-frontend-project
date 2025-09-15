import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import {
  FiLoader,
  FiAlertTriangle,
  FiInbox,
  FiMessageSquare,
  FiInfo,
  FiShoppingCart,
  FiClock,
  FiCheckCircle,
  FiDollarSign,
} from "react-icons/fi";
import PropTypes from "prop-types";

const StatusPill = ({ status }) => {
  const statusConfig = {
    pending: {
      text: "قيد المراجعة",
      color: "bg-yellow-100 text-yellow-800",
      icon: <FiClock />,
    },
    in_progress: {
      text: "قيد التنفيذ",
      color: "bg-blue-100 text-blue-800",
      icon: <FiLoader className="animate-spin" />,
    },
    completed: {
      text: "مكتمل",
      color: "bg-green-100 text-green-800",
      icon: <FiCheckCircle />,
    },
    cancelled: {
      text: "ملغي",
      color: "bg-red-100 text-red-800",
      icon: <FiAlertTriangle />,
    },
  };

  const config = statusConfig[status] || {
    text: status,
    color: "bg-gray-100 text-gray-800",
    icon: <FiInfo />,
  };
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}
    >
      {config.icon}
      {config.text}
    </span>
  );
};

StatusPill.propTypes = {
  status: PropTypes.oneOf(["pending", "in_progress", "completed", "cancelled"])
    .isRequired,
};

// مكون شريط التقدم
const ProgressBar = ({ status }) => {
  const progress =
    { pending: 10, in_progress: 50, completed: 100, cancelled: 100 }[status] ||
    0;
  const color =
    { completed: "bg-green-500", cancelled: "bg-red-500" }[status] ||
    "bg-cyan-600";
  return (
    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
      <div
        className={`${color} h-1.5 rounded-full transition-all duration-500`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

ProgressBar.propTypes = {
  status: PropTypes.oneOf(["pending", "in_progress", "completed", "cancelled"])
    .isRequired,
};

// مكون البطاقة الإحصائية
const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
    <div className="p-3 bg-cyan-100 text-cyan-600 rounded-lg">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node.isRequired,
};

const OrdersPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(
          `/orders?buyerId=${user.id}&_expand=service&_expand=seller`
        );
        setOrders(response.data);
      } catch (err) {
        setError("حدث خطأ أثناء تحميل طلباتك. يرجى المحاولة مرة أخرى.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, authLoading]);

  const filteredOrders = useMemo(() => {
    if (activeTab === "all") return orders;
    return orders.filter((order) => order.status === activeTab);
  }, [orders, activeTab]);

  const stats = useMemo(
    () => ({
      total: orders.length,
      active: orders.filter((o) => o.status === "in_progress").length,
      spent: orders
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0)
        .toFixed(2),
    }),
    [orders]
  );

  const renderContent = () => {
    if (loading || authLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-20">
          <FiLoader className="animate-spin text-cyan-600 text-4xl" />
          <p className="mt-4 text-gray-600">جاري تحميل طلباتك...</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-red-50 rounded-lg">
          <FiAlertTriangle className="text-red-500 text-4xl" />
          <p className="mt-4 text-red-600 font-semibold">{error}</p>
        </div>
      );
    }
    if (!user) {
      return (
        <div className="text-center py-20">
          <p>الرجاء تسجيل الدخول لعرض طلباتك.</p>
        </div>
      );
    }
    if (orders.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed rounded-xl">
          <FiInbox className="text-gray-400 text-5xl" />
          <h3 className="mt-4 text-xl font-semibold text-gray-700">
            لا توجد لديك طلبات بعد
          </h3>
          <p className="mt-2 text-gray-500">عندما تقوم بطلب خدمة، ستظهر هنا.</p>
          <Link
            to="/services"
            className="mt-6 px-6 py-2 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 transition"
          >
            تصفح الخدمات
          </Link>
        </div>
      );
    }
    return (
      <div className="space-y-5">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 transition hover:shadow-lg hover:-translate-y-1"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <Link
                    to={`/services/${order.serviceId}`}
                    className="text-lg font-bold text-gray-800 hover:text-cyan-700 pr-4"
                  >
                    {order.service?.title || "خدمة غير متاحة"}
                  </Link>
                  <StatusPill status={order.status} />
                </div>
                <ProgressBar status={order.status} />
              </div>
              <div className="bg-gray-50 px-5 py-3 border-t grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">البائع</p>
                  <Link
                    to={`/profile/${order.seller?.id}`}
                    className="font-semibold text-gray-700 hover:underline flex items-center gap-2"
                  >
                    <img
                      src={order.seller?.avatar_url}
                      alt={order.seller?.name}
                      className="w-6 h-6 rounded-full"
                    />
                    {order.seller?.name || "غير معروف"}
                  </Link>
                </div>
                <div>
                  <p className="text-gray-500">تاريخ الطلب</p>
                  <p className="font-semibold text-gray-700">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("ar-EG")
                      : "غير محدد"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">المبلغ</p>
                  <p className="font-bold text-lg text-green-600">
                    ${order.totalAmount ? order.totalAmount.toFixed(2) : "0.00"}
                  </p>
                </div>
                <div className="flex items-center justify-end gap-2 col-span-2 sm:col-span-1">
                  <Link
                    to={`/chat/${order.seller?.id}`}
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-cyan-600"
                    title="تواصل مع البائع"
                  >
                    <FiMessageSquare size={18} />
                  </Link>
                  <Link
                    to={`/dashboard/orders/${order.id}`}
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-cyan-600"
                    title="تفاصيل الطلب"
                  >
                    <FiInfo size={18} />
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 text-gray-500">
            لا توجد طلبات تطابق هذه الحالة.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">طلباتي</h1>
          <p className="text-gray-500">
            تتبع كل الخدمات التي قمت بطلبها من هنا.
          </p>
        </header>

        {/* البطاقات الإحصائية */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="إجمالي الطلبات"
            value={stats.total}
            icon={<FiShoppingCart />}
          />
          <StatCard
            title="طلبات نشطة"
            value={stats.active}
            icon={<FiClock />}
          />
          <StatCard
            title="إجمالي المدفوعات"
            value={`$${stats.spent}`}
            icon={<FiDollarSign />}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-6">
          <div className="flex space-x-1">
            {["all", "in_progress", "completed", "cancelled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  activeTab === tab
                    ? "bg-cyan-600 text-white shadow"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {
                  {
                    all: "الكل",
                    in_progress: "قيد التنفيذ",
                    completed: "المكتملة",
                    cancelled: "الملغية",
                  }[tab]
                }
              </button>
            ))}
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default OrdersPage;
