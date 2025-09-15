import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import {
  FiLoader,
  FiAlertTriangle,
  FiInbox,
  FiDollarSign,
  FiClock,
  FiUser,
  FiArrowRight,
} from "react-icons/fi";
import PropTypes from "prop-types";

const MySalesPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("new");

  const fetchMySales = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(
        `/orders?sellerId=${user.id}&_expand=service&_expand=buyer`
      );
      setSales(response.data);
    } catch (err) {
      setError("حدث خطأ أثناء تحميل مبيعاتك. يرجى المحاولة مرة أخرى.");
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
      fetchMySales();
    }
  }, [user, authLoading, navigate, fetchMySales]);

  // حساب الإحصائيات الخاصة بالبائع
  const stats = useMemo(() => {
    const totalRevenue = sales.reduce(
      (sum, order) =>
        order.status === "completed" ? sum + order.totalAmount : sum,
      0
    );
    const pendingRevenue = sales.reduce(
      (sum, order) =>
        ["new", "in_progress", "delivered"].includes(order.status)
          ? sum + order.totalAmount
          : sum,
      0
    );
    const newOrdersCount = sales.filter(
      (order) => order.status === "new"
    ).length;
    return {
      totalRevenue,
      pendingRevenue,
      newOrdersCount,
    };
  }, [sales]);

  // فلترة المبيعات بناءً على التبويب النشط
  const filteredSales = useMemo(() => {
    if (activeTab === "all") return sales;
    if (activeTab === "active") {
      return sales.filter((order) =>
        ["new", "in_progress", "delivered"].includes(order.status)
      );
    }
    return sales.filter((order) => order.status === activeTab);
  }, [sales, activeTab]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-20">
          <FiLoader className="animate-spin text-purple-600 text-4xl mx-auto" />
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
    if (sales.length === 0) {
      return (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
          <FiInbox className="text-gray-400 text-5xl mx-auto" />
          <h3 className="mt-4 text-xl font-semibold text-gray-700">
            لا توجد لديك مبيعات بعد
          </h3>
          <p className="mt-2 text-gray-500">
            عندما يقوم أحد بشراء خدمتك، ستظهر الطلبات هنا.
          </p>
          <Link
            to="/dashboard/services"
            className="mt-6 inline-block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            إدارة خدماتي
          </Link>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        {filteredSales.length > 0 ? (
          filteredSales.map((order) => (
            <SaleCard key={order.id} order={order} />
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            لا توجد طلبات في هذا القسم.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
          إدارة المبيعات
        </h1>
        <p className="text-gray-500 mb-8">
          تابع طلبات عملائك وأدر أرباحك من هنا.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={<FiDollarSign />}
            title="الأرباح المكتملة"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            color="green"
          />
          <StatCard
            icon={<FiClock />}
            title="الأرباح المعلقة"
            value={`$${stats.pendingRevenue.toFixed(2)}`}
            color="yellow"
          />
          <StatCard
            icon={<FiInbox />}
            title="طلبات جديدة بانتظارك"
            value={stats.newOrdersCount}
            color="purple"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-2 flex flex-wrap gap-2 mb-6">
          {["new", "active", "completed", "cancelled", "all"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-grow px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                activeTab === tab
                  ? "bg-purple-600 text-white shadow"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {
                {
                  new: "جديدة",
                  active: "نشطة",
                  completed: "المكتملة",
                  cancelled: "الملغية",
                  all: "الكل",
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
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-800",
    purple: "bg-purple-50 text-purple-600",
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

const SaleCard = ({ order }) => {
  const statusStyles = {
    new: "border-l-4 border-purple-500",
    in_progress: "border-l-4 border-yellow-500",
    delivered: "border-l-4 border-blue-500",
    completed: "border-l-4 border-green-500",
    cancelled: "border-l-4 border-red-500",
  };

  return (
    <div
      className={`bg-white p-4 sm:p-6 rounded-xl shadow-sm transition hover:shadow-md ${
        statusStyles[order.status] || "border-l-4 border-gray-300"
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-grow">
          <p className="text-sm text-gray-500">طلب على خدمة:</p>
          <Link
            to={`/services/${order.serviceId}`}
            className="text-lg font-bold text-gray-800 hover:text-purple-700"
          >
            {order.service?.title || "خدمة غير متاحة"}
          </Link>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
            <FiUser />
            <span>المشتري:</span>
            <Link
              to={`/profile/${order.buyer?.id}`}
              className="font-semibold hover:underline"
            >
              {order.buyer?.name || "غير معروف"}
            </Link>
          </div>
        </div>
        <div className="flex-shrink-0 flex flex-col items-end gap-3">
          <p className="text-lg font-bold text-green-600">
            ${order.totalAmount.toFixed(2)}
          </p>
          <p className="text-xs text-gray-400">
            تاريخ الطلب: {new Date(order.createdAt).toLocaleDateString("ar-EG")}
          </p>
        </div>
      </div>
      <div className="border-t mt-4 pt-4 flex items-center justify-end">
        <Link
          to={`/orders/${order.id}`}
          className="flex items-center gap-2 text-sm text-white font-semibold bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-900"
        >
          <span>إدارة الطلب</span>
          <FiArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

SaleCard.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    status: PropTypes.oneOf([
      "new",
      "in_progress",
      "delivered",
      "completed",
      "cancelled",
    ]).isRequired,
    serviceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    totalAmount: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
    service: PropTypes.shape({
      title: PropTypes.string,
    }),
    buyer: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
    }),
  }).isRequired,
};


export default MySalesPage;
