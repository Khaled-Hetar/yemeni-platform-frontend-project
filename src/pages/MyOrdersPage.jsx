import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import {
  FiLoader,
  FiAlertTriangle,
  FiInbox,
  FiShoppingCart,
  FiDollarSign,
  FiClock,
  FiInfo,
  FiMessageSquare,
} from "react-icons/fi";
import PropTypes from "prop-types";

const MyOrdersPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const fetchMyOrders = useCallback(async () => {
    if (!user) return;

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
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
    } else {
      fetchMyOrders();
    }
  }, [user, authLoading, navigate, fetchMyOrders]);

  const stats = useMemo(() => {
    const totalSpent = orders.reduce(
      (sum, order) =>
        order.status === "completed" ? sum + order.totalAmount : sum,
      0
    );
    const activeOrders = orders.filter((order) =>
      ["new", "in_progress", "delivered"].includes(order.status)
    ).length;
    return {
      totalOrders: orders.length,
      totalSpent,
      activeOrders,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (activeTab === "all") return orders;
    return orders.filter((order) => order.status === activeTab);
  }, [orders, activeTab]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-20">
          <FiLoader className="animate-spin text-cyan-600 text-4xl mx-auto" />
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center py-20 text-red-500">
          <FiAlertTriangle size={32} className="mx-auto mb-2" />
          {error}
        </div>
      );
    }
    if (orders.length === 0) {
      return (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
          <FiInbox className="text-gray-400 text-5xl mx-auto" />
          <h3 className="mt-4 text-xl font-semibold text-gray-700">
            لا توجد لديك طلبات بعد
          </h3>
          <p className="mt-2 text-gray-500">عندما تقوم بطلب خدمة، ستظهر هنا.</p>
          <Link
            to="/services"
            className="mt-6 inline-block px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
          >
            تصفح الخدمات
          </Link>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">طلباتي</h1>
        <p className="text-gray-500 mb-8">
          تتبع كل الخدمات التي قمت بطلبها من هنا.
        </p>

        {/* بطاقات الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={<FiShoppingCart />}
            title="إجمالي الطلبات"
            value={stats.totalOrders}
            color="cyan"
          />
          <StatCard
            icon={<FiDollarSign />}
            title="إجمالي المنفق"
            value={`$${stats.totalSpent.toFixed(2)}`}
            color="green"
          />
          <StatCard
            icon={<FiClock />}
            title="طلبات نشطة"
            value={stats.activeOrders}
            color="yellow"
          />
        </div>

        {/* ألسنة التبويب */}
        <div className="bg-white rounded-xl shadow-sm p-2 flex gap-2 mb-6">
          {[
            "all",
            "new",
            "in_progress",
            "delivered",
            "completed",
            "cancelled",
          ].map((tab) => (
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
                  new: "جديدة",
                  in_progress: "قيد التنفيذ",
                  delivered: "تم تسليمها",
                  completed: "المكتملة",
                  cancelled: "الملغية",
                }[tab]
              }
            </button>
          ))}
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => {
  const colors = {
    cyan: "bg-cyan-50 text-cyan-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-800",
  };
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-full ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};
StatCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.oneOf(["green", "yellow", "purple"]),
};

const OrderCard = ({ order }) => (
  <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 transition hover:shadow-md hover:border-cyan-200">
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <img
        src={order.service?.main_image_url || "https://via.placeholder.com/150"}
        alt={order.service?.title}
        className="w-full sm:w-24 h-24 object-cover rounded-lg flex-shrink-0 bg-gray-100"
      />
      <div className="flex-grow">
        <Link
          to={`/services/${order.serviceId}`}
          className="text-lg font-bold text-gray-800 hover:text-cyan-700"
        >
          {order.service?.title || "خدمة غير متاحة"}
        </Link>
        <p className="text-sm text-gray-500 mt-1">
          البائع:{" "}
          <Link
            to={`/profile/${order.seller?.id}`}
            className="font-semibold hover:underline"
          >
            {order.seller?.name || "غير معروف"}
          </Link>
        </p>
        <p className="text-lg font-bold text-green-600 mt-2">
          ${order.totalAmount.toFixed(2)}
        </p>
      </div>
      <div className="flex-shrink-0 flex flex-col items-end gap-2">
        <p className="text-xs text-gray-400">
          تاريخ الطلب: {new Date(order.createdAt).toLocaleDateString("ar-EG")}
        </p>
      </div>
    </div>
    <div className="border-t mt-4 pt-4 flex items-center justify-end gap-3">
      <Link
        to={`/chat/${order.seller?.id}`}
        className="flex items-center gap-2 text-sm text-cyan-600 font-semibold hover:underline"
      >
        <FiMessageSquare size={16} /> تواصل مع البائع
      </Link>
      <Link
        to={`/orders/${order.id}`}
        className="flex items-center gap-2 text-sm text-white font-semibold bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-900"
      >
        <FiInfo size={16} /> تفاصيل الطلب
      </Link>
    </div>
  </div>
);

OrderCard.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    serviceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    totalAmount: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
    service: PropTypes.shape({
      main_image_url: PropTypes.string,
      title: PropTypes.string,
    }),
    seller: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
    }),
  }).isRequired,
};

export default MyOrdersPage;
