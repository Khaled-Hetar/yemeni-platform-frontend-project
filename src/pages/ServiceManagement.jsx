import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import {
  FiLoader,
  FiAlertTriangle,
  FiPlusCircle,
  FiEdit,
  FiTrash2,
  FiEyeOff,
  FiEye,
  FiStar,
  FiClipboard,
  FiDollarSign,
  FiActivity,
  FiMessageSquare,
} from "react-icons/fi";

const ServiceManagementCard = ({ service, onDelete, onToggleStatus }) => {
  const isActive = service.status !== "paused";

  const averageRating =
    service.reviews && service.reviews.length > 0
      ? (
          service.reviews.reduce((acc, r) => acc + r.rating, 0) /
          service.reviews.length
        ).toFixed(1)
      : "جديد";

  return (
    <div
      className={`flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-300 ${
        !isActive ? "opacity-60" : "hover:shadow-lg hover:border-sky-300"
      }`}
    >
      {/* --- الجزء العلوي: الصورة والحالة --- */}
      <div className="relative">
        <img
          src={
            service.main_image_url ||
            "https://via.placeholder.com/400x200?text=No+Image"
          }
          alt={service.title}
          className="w-full h-40 object-cover rounded-t-xl"
        />
        <span
          className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-bold rounded-full text-white ${
            isActive ? "bg-green-500" : "bg-gray-500"
          }`}
        >
          {isActive ? "نشط" : "مُعلق"}
        </span>
      </div>

      {/* --- الجزء الأوسط: المحتوى الرئيسي --- */}
      <div className="p-4 flex-grow">
        <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 h-14">
          {service.title}
        </h3>
        <p className="text-lg font-extrabold text-sky-600 mb-4">
          ${service.price}
        </p>

        {/* --- الإحصائيات --- */}
        <div className="grid grid-cols-3 gap-2 text-center text-sm text-gray-600">
          <StatItem
            icon={<FiActivity className="text-blue-500" />}
            value={service.orders?.length || 0}
            label="طلبات"
          />
          <StatItem
            icon={<FiMessageSquare className="text-purple-500" />}
            value={service.reviews?.length || 0}
            label="تقييمات"
          />
          <StatItem
            icon={<FiStar className="text-yellow-500" />}
            value={averageRating}
            label="تقييم"
          />
        </div>
      </div>

      {/* --- الجزء السفلي: أزرار التحكم --- */}
      <div className="bg-gray-50 px-4 py-2 flex justify-end gap-2 rounded-b-xl border-t">
        <ActionButton
          icon={isActive ? <FiEyeOff /> : <FiEye />}
          onClick={() =>
            onToggleStatus(service.id, isActive ? "paused" : "active")
          }
          title={isActive ? "إيقاف مؤقت" : "إعادة تفعيل"}
          className="hover:bg-gray-200"
        />
        <Link to={`/edit-service/${service.id}`}>
          <ActionButton
            icon={<FiEdit />}
            title="تعديل"
            className="hover:bg-blue-100 text-blue-600"
          />
        </Link>
        <ActionButton
          icon={<FiTrash2 />}
          onClick={() => onDelete(service.id)}
          title="حذف"
          className="hover:bg-red-100 text-red-600"
        />
      </div>
    </div>
  );
};

const StatItem = ({ icon, value, label }) => (
  <div className="flex flex-col items-center">
    <div className="flex items-center gap-1 font-bold text-gray-800">
      {icon}
      <span>{value}</span>
    </div>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
);

const ActionButton = ({ icon, onClick, title, className = "" }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-full transition-colors duration-200 ${className}`}
    title={title}
  >
    {icon}
  </button>
);

const ServiceManagement = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSellerServices = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(
        `/services?userId=${user.id}&_embed=reviews&_embed=orders`
      );
      setServices(response.data);
    } catch (err) {
      setError("فشل في تحميل قائمة خدماتك.");
      console.error("Fetch services error:", err);
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
    fetchSellerServices();
  }, [user, authLoading, navigate, fetchSellerServices]);

  const handleDeleteService = async (serviceId) => {
    if (
      !window.confirm(
        "هل أنت متأكد من حذف هذه الخدمة؟ لا يمكن التراجع عن هذا الإجراء."
      )
    )
      return;
    try {
      await apiClient.delete(`/services/${serviceId}`);
      setServices((prevServices) =>
        prevServices.filter((s) => s.id !== serviceId)
      );
    } catch (error) {
      alert("حدث خطأ أثناء محاولة حذف الخدمة.");
      console.error(error);
    }
  };

  const handleToggleStatus = async (serviceId, newStatus) => {
    const originalServices = [...services];
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, status: newStatus } : s))
    );
    try {
      await apiClient.patch(`/services/${serviceId}`, { status: newStatus });
    } catch (error) {
      setServices(originalServices);
      alert("حدث خطأ أثناء تحديث حالة الخدمة.");
      console.error(error);
    }
  };

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
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">
              إدارة خدماتي
            </h1>
            <p className="text-gray-500 mt-1">
              قم بإدارة، تعديل، وإضافة خدمات جديدة من هنا.
            </p>
          </div>
          <Link
            to="/add-service"
            className="flex items-center gap-2 bg-sky-600 text-white px-5 py-2.5 rounded-lg hover:bg-sky-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
          >
            <FiPlusCircle />
            <span className="font-semibold">إضافة خدمة جديدة</span>
          </Link>
        </header>

        {error && (
          <div className="flex flex-col items-center justify-center text-center p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
            <FiAlertTriangle className="text-red-500 text-3xl mb-2" />
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        )}

        {services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service) => (
              <ServiceManagementCard
                key={service.id}
                service={service}
                onDelete={handleDeleteService}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border mt-12">
            <FiClipboard size={56} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">
              لا توجد خدمات لعرضها
            </h2>
            <p className="text-gray-500 mt-2 mb-6">
              ابدأ رحلتك كبائع بإضافة خدمتك الأولى الآن.
            </p>
            <Link
              to="/add-service"
              className="inline-block bg-sky-600 text-white px-8 py-3 rounded-lg hover:bg-sky-700 transition-transform hover:scale-105 font-semibold"
            >
              أضف خدمتك الأولى
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceManagement;
