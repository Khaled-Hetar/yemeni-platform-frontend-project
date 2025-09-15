import React from "react";
import { useAuth } from "../context/AuthContext";
import { FiLoader, FiAlertTriangle, FiPlusCircle } from "react-icons/fi";
import Can from "../components/Can";
import AdminLayout from "../components/AdminLayout";
import {
  FiUsers,
  FiDollarSign,
  FiCheckSquare,
  FiSettings,
  FiHelpCircle,
  FiShield,
} from "react-icons/fi";

const AdminStatCard = ({ icon, title, value, color }) => (
  <div
    className={`bg-white p-6 rounded-lg shadow-md flex items-center gap-4 border-l-4 ${color}`}
  >
    <div className="text-3xl">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = React.useState({
    users: 0,
    transactions: 0,
    services: 0,
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      setLoading(true);
      try {
        const [usersRes, transactionsRes, servicesRes] = await Promise.all([
          apiClient.get("/users").catch(() => ({ data: [] })),
          apiClient.get("/transactions").catch(() => ({ data: [] })),
          apiClient.get("/services").catch(() => ({ data: [] })),
        ]);

        setStats({
          users: usersRes.data?.length || 0,
          transactions: transactionsRes.data?.length || 0,
          services: servicesRes.data?.length || 0,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 text-center">جاري تحميل الإحصائيات...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h2 className="text-3xl font-bold text-gray-800">
        أهلاً بك، {user?.name || "أيها المدير"}!
      </h2>
      <p className="mt-2 text-gray-600 mb-8">
        دورك الحالي:{" "}
        <span className="font-semibold text-cyan-700">{user?.role}</span>.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* عرض كل البطاقات مباشرة دون مكون <Can> */}
        <AdminStatCard
          icon={<FiUsers />}
          title="إدارة المستخدمين"
          value={stats.users}
          color="border-blue-500"
        />
        <AdminStatCard
          icon={<FiDollarSign />}
          title="إدارة المعاملات"
          value={stats.transactions}
          color="border-green-500"
        />
        <AdminStatCard
          icon={<FiCheckSquare />}
          title="إجمالي الخدمات"
          value={stats.services}
          color="border-purple-500"
        />
        <AdminStatCard
          icon={<FiSettings />}
          title="إعدادات المنصة"
          value="تعديل"
          color="border-gray-500"
        />
        <AdminStatCard
          icon={<FiHelpCircle />}
          title="الدعم الفني"
          value="مراجعة"
          color="border-amber-500"
        />
        <AdminStatCard
          icon={<FiShield />}
          title="توثيق الهويات"
          value="مراجعة"
          color="border-red-500"
        />
      </div>
    </AdminLayout>
  );
};

// 2. كود لوحة تحكم البائع (SellerDashboard) - يبقى كما هو
import { useState, useEffect, useCallback, useMemo } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import apiClient from "../api/axiosConfig";
import {
  FaCog,
  FaClipboardList,
  FaLayerGroup,
  FaEnvelope,
  FaBell,
  FaPlusCircle,
  FaStar,
  FaEye,
  FaRegCalendarAlt,
} from "react-icons/fa";

import { MdSpaceDashboard } from "react-icons/md";
import { FiExternalLink } from "react-icons/fi";
import { FaMoneyBillWave } from "react-icons/fa";

const SidebarItem = ({ icon, label, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors duration-200 
      ${
        isActive
          ? "bg-sky-100 text-sky-700 font-bold"
          : "text-neutral-600 hover:bg-gray-100 hover:text-neutral-800"
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

const SellerStatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
    <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-neutral-500 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = useMemo(
    () => ({
      new: { text: "جديد", bg: "bg-blue-100", textColor: "text-blue-800" },
      in_progress: {
        text: "قيد التنفيذ",
        bg: "bg-yellow-100",
        textColor: "text-yellow-800",
      },
      completed: {
        text: "مكتمل",
        bg: "bg-green-100",
        textColor: "text-green-800",
      },
      default: { text: status, bg: "bg-gray-200", textColor: "text-gray-700" },
    }),
    [status]
  );
  const style = styles[status] || styles.default;
  return (
    <span
      className={`px-2 py-1 text-xs font-bold rounded-full ${style.bg} ${style.textColor}`}
    >
      {style.text}
    </span>
  );
};

const RecentOrderCard = ({ order }) => {
  if (!order) return null;

  return (
    <div className="bg-gray-50/70 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-white transition-all duration-200 border border-transparent hover:border-gray-200">
      {/* صورة الخدمة */}
      <Link to={`/services/${order.service?.id}`} className="flex-shrink-0">
        <img
          src={
            order.service?.main_image_url || "https://via.placeholder.com/150"
          }
          alt={order.service?.title}
          className="w-full sm:w-20 h-20 object-cover rounded-md"
        />
      </Link>

      <div className="flex-grow">
        {/* رابط الخدمة */}
        <Link
          to={`/services/${order.service?.id}`}
          className="font-bold text-gray-800 hover:text-sky-700 line-clamp-1"
        >
          {order.service?.title || "خدمة محذوفة"}
        </Link>

        {/* رابط المشتري */}
        <Link
          to={`/profile/${order.buyer?.id}`}
          className="flex items-center gap-2 mt-1 text-sm text-gray-600 hover:text-gray-900"
        >
          <img
            src={order.buyer?.avatar_url}
            alt={order.buyer?.name}
            className="w-5 h-5 rounded-full object-cover"
          />
          <span>{order.buyer?.name || "مستخدم محذوف"}</span>
        </Link>

        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
          <FaRegCalendarAlt />
          <span>{new Date(order.createdAt).toLocaleDateString("ar-EG")}</span>
        </div>
      </div>

      <div className="flex-shrink-0 flex flex-col sm:items-end gap-2 text-sm w-full sm:w-auto">
        <p className="font-bold text-green-600">
          ${order.totalAmount?.toFixed(2)}
        </p>
        <StatusBadge status={order.status} />
      </div>

      {/* رابط تفاصيل الطلب */}
      <Link
        to={`/orders/${order.id}`}
        className="p-2 text-gray-500 hover:text-sky-600 rounded-full hover:bg-gray-200 transition"
        title="عرض التفاصيل"
      >
        <FiExternalLink />
      </Link>
    </div>
  );
};

const SellerDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    orders: 0,
    services: 0,
    revenue: 0,
    rating: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSellerData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const [ordersRes, servicesRes, reviewsRes] = await Promise.all([
        apiClient.get(
          `/orders?sellerId=${user.id}&_expand=buyer&_expand=service&_sort=createdAt&_order=desc`
        ),
        apiClient.get(`/services?userId=${user.id}`),
        apiClient.get(`/reviews?service.userId=${user.id}`),
      ]);

      const ordersData = ordersRes.data || [];
      const servicesData = servicesRes.data || [];
      const reviewsData = reviewsRes.data || [];

      const totalRevenue = ordersData
        .filter((o) => o.status === "completed")
        .reduce((sum, o) => sum + o.totalAmount, 0);
      const averageRating =
        reviewsData.length > 0
          ? reviewsData.reduce((sum, r) => sum + r.rating, 0) /
            reviewsData.length
          : 0;

      setStats({
        orders: ordersData.length,
        services: servicesData.length,
        revenue: totalRevenue.toFixed(2),
        rating: averageRating,
      });
      setRecentOrders(ordersData.slice(0, 3));
    } catch (err) {
      setError("فشل في تحميل بيانات لوحة التحكم.");
      console.error("SellerDashboard fetch error:", err);
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
    fetchSellerData();
  }, [user, authLoading, navigate, fetchSellerData]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FiLoader className="animate-spin text-sky-600 text-4xl" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-sky-700">لوحة تحكم البائع</h1>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          <SidebarItem
            icon={<MdSpaceDashboard />}
            label="نظرة عامة"
            to="/dashboard"
          />
          <SidebarItem
            icon={<FaClipboardList />}
            label="إدارة الطلبات"
            to="/orders-management"
          />
          <SidebarItem
            icon={<FaLayerGroup />}
            label="إدارة خدماتي"
            to="/service-management"
          />
          <SidebarItem
            icon={<FaMoneyBillWave />}
            label="الرصيد والأرباح"
            to="/earnings"
          />
          <SidebarItem
            icon={<FaEnvelope />}
            label="صندوق الوارد"
            to="/conversation"
          />
          <SidebarItem
            icon={<FaBell />}
            label="الإشعارات"
            to="/notifications"
          />
        </nav>
        <div className="mt-auto p-4 border-t border-gray-200">
          <SidebarItem icon={<FaCog />} label="الإعدادات" to="/settings" />
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-neutral-800">
              مرحباً {user?.name} 👋
            </h2>
            <p className="text-sm text-neutral-500">هنا ملخص لنشاطك اليوم.</p>
          </div>
          <Link
            to="/add-service"
            className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-xl hover:bg-cyan-700 transition shadow-sm"
          >
            <FaPlusCircle /> أضف خدمة
          </Link>
        </header>

        {error ? (
          <div className="flex flex-col items-center justify-center text-center p-4 bg-red-50 border border-red-200 rounded-lg">
            <FiAlertTriangle className="text-red-500 text-3xl mb-2" />
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <SellerStatCard
                title="إجمالي الأرباح"
                value={`$${stats.revenue}`}
                icon={<FaStar />}
                color="green"
              />
              <SellerStatCard
                title="إجمالي الطلبات"
                value={stats.orders}
                icon={<FaClipboardList />}
                color="sky"
              />
              <SellerStatCard
                title="إجمالي الخدمات"
                value={stats.services}
                icon={<FaLayerGroup />}
                color="indigo"
              />
              <SellerStatCard
                title="متوسط التقييم"
                value={
                  stats.rating > 0 ? `${stats.rating.toFixed(1)} / 5` : "جديد"
                }
                icon={<FaStar />}
                color="amber"
              />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-neutral-800">
                  الطلبات الحديثة
                </h3>
                <Link
                  to="/orders-management"
                  className="text-sm font-semibold text-sky-600 hover:underline"
                >
                  عرض الكل
                </Link>
              </div>
              {recentOrders.length > 0 ? (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <RecentOrderCard key={order.id} order={order} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-sm text-neutral-500">
                  لا توجد طلبات جديدة حالياً.
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

// 3. كود لوحة تحكم المشتري (BuyerDashboard)
import { FiBriefcase, FiFileText, FiArrowRight } from "react-icons/fi";

const BuyerStatCard = ({ icon, title, value, color, to }) => (
  <Link
    to={to}
    className={`block bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-${color}-500 transition-all duration-300`}
  >
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </Link>
);

const SummaryListCard = ({
  title,
  items,
  renderItem,
  viewAllLink,
  emptyMessage,
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-full flex flex-col">
    <h2 className="text-xl font-semibold text-neutral-700 mb-4">{title}</h2>
    <div className="space-y-4 flex-grow">
      {items.length > 0 ? (
        items.map(renderItem)
      ) : (
        <p className="text-gray-500 text-center py-8">{emptyMessage}</p>
      )}
    </div>
    <div className="mt-4 text-center">
      <Link
        to={viewAllLink}
        className="text-sm font-semibold text-cyan-600 hover:underline flex items-center justify-center gap-1"
      >
        <span>عرض الكل</span>
        <FiArrowRight size={14} />
      </Link>
    </div>
  </div>
);

const BuyerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = React.useState({
    projects: 0,
    orders: 0,
    balance: 0,
  });
  const [recentProjects, setRecentProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchBuyerData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const [projectsRes, ordersRes, transactionsRes] = await Promise.all([
          apiClient.get(`/projects?userId=${user.id}&_sort=id&_order=desc`),
          apiClient.get(
            `/orders?userId=${user.id}&_sort=id&_order=desc&_expand=service`
          ),
          apiClient.get(`/transactions?userId=${user.id}`),
        ]);
        const balance = transactionsRes.data.reduce(
          (acc, tx) =>
            tx.type === "deposit" ? acc + tx.amount : acc - tx.amount,
          0
        );
        setStats({
          projects: projectsRes.data.length,
          orders: ordersRes.data.length,
          balance: balance.toFixed(2),
        });
        setRecentProjects(projectsRes.data.slice(0, 3));
      } catch (err) {
        console.error("فشل في جلب بيانات لوحة التحكم:", err);
        setError("حدث خطأ أثناء تحميل بياناتك.");
      } finally {
        setLoading(false);
      }
    };
    fetchBuyerData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <FiLoader className="animate-spin text-cyan-600 text-5xl" />
        <p className="mt-4 text-gray-600">جاري تجهيز لوحة التحكم...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <FiAlertTriangle className="text-red-500 text-5xl" />
        <p className="mt-4 text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">لوحة التحكم</h1>
            <p className="text-neutral-500 mt-1">
              مرحباً بعودتك، {user?.name || "مستخدم"}!
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/projects/new"
              className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-xl hover:bg-cyan-700 transition shadow-sm"
            >
              <FiPlusCircle /> انشر مشروعاً
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <BuyerStatCard
            icon={<FiDollarSign size={22} />}
            title="رصيد المحفظة"
            value={`$${stats.balance}`}
            color="green"
            to="/payments"
          />
          <BuyerStatCard
            icon={<FiBriefcase size={22} />}
            title="المشاريع المنشورة"
            value={stats.projects}
            color="indigo"
            to="/project-management"
          />
          <BuyerStatCard
            icon={<FiFileText size={22} />}
            title="الطلبات"
            value={stats.orders}
            color="sky"
            to="/my-orders"
          />
        </div>
        <SummaryListCard
          title="آخر مشاريعك المنشورة"
          items={recentProjects}
          viewAllLink="/project-management"
          emptyMessage="لم تقم بنشر أي مشاريع بعد."
          renderItem={(project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="block p-3 rounded-lg hover:bg-gray-50 transition"
            >
              <p className="font-semibold text-neutral-800 truncate">
                {project.title}
              </p>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {project.description}
              </p>
            </Link>
          )}
        />
      </div>
    </div>
  );
};

// 4. المكون الرئيسي الموحد (DashboardPage) - يبقى كما هو
const DashboardPage = () => {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FiLoader className="animate-spin text-cyan-600 text-4xl" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <FiAlertTriangle className="text-red-500 text-4xl mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">خطأ في الوصول</h2>
        <p className="text-gray-600 mt-2">
          يجب عليك تسجيل الدخول لعرض هذه الصفحة.
        </p>
      </div>
    );
  }

  const ADMIN_ROLES = ["admin", "super-admin", "moderator"];
  const userRole = user.role ? user.role.toLowerCase() : "";

  if (ADMIN_ROLES.includes(userRole)) {
    return <AdminDashboard />;
  }

  if (user.accountType === "seller") {
    return <SellerDashboard />;
  }

  if (user.accountType === "buyer") {
    return <BuyerDashboard />;
  }

  return <div>نوع حساب غير معروف.</div>;
};

export default DashboardPage;
