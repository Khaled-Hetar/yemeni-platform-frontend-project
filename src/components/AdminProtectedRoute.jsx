import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiLoader, FiSlash } from "react-icons/fi";

const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
    <FiLoader className="animate-spin text-cyan-600 text-5xl mb-4" />
    <p className="text-lg text-gray-700">جاري التحقق من صلاحيات الوصول...</p>
  </div>
);

const ForbiddenScreen = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-red-50 text-center p-4">
    <FiSlash className="text-red-500 text-6xl mb-4" />
    <h1 className="text-3xl font-bold text-red-700">الوصول مرفوض</h1>
    <p className="mt-2 text-lg text-red-600">
      ليس لديك الصلاحيات اللازمة للوصول إلى هذه الصفحة.
    </p>
    <a
      href="/"
      className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
    >
      العودة إلى الصفحة الرئيسية
    </a>
  </div>
);

const AdminProtectedRoute = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isAuthenticated && user?.role !== "admin") {
    return <ForbiddenScreen />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
