import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/axiosConfig";
import AdminLayout from "../components/AdminLayout";
import {
  FiLoader,
  FiAlertTriangle,
  FiShield,
  FiClock,
  FiCheck,
  FiX,
  FiPhone,
} from "react-icons/fi";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

const VerificationsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get("/verificationRequests");
      const sorted = response.data.sort((a, b) => {
        const statusOrder = { pending: 1, approved: 2, rejected: 3 };
        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[a.status] - statusOrder[b.status];
        }
        return new Date(b.submittedAt) - new Date(a.submittedAt);
      });
      setRequests(sorted);
    } catch (err) {
      setError("فشل في جلب طلبات التحقق.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const getStatusPill = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    const icons = {
      pending: <FiClock className="inline-block ml-1" />,
      approved: <FiCheck className="inline-block ml-1" />,
      rejected: <FiX className="inline-block ml-1" />,
    };
    const text = {
      pending: "قيد المراجعة",
      approved: "تم التحقق",
      rejected: "مرفوض",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status]}`}
      >
        {icons[status]} {text[status]}
      </span>
    );
  };

  const renderContent = () => {
    if (loading)
      return (
        <div className="flex justify-center p-10">
          <FiLoader className="animate-spin text-3xl" />
        </div>
      );
    if (error)
      return (
        <div className="text-center p-10 text-red-500">
          <FiAlertTriangle size={24} className="inline-block ml-2" /> {error}
        </div>
      );
    if (requests.length === 0)
      return (
        <div className="text-center p-16 text-gray-500">
          <FiShield size={48} className="mx-auto mb-4" />
          <h3 className="text-xl font-semibold">لا توجد طلبات تحقق</h3>
        </div>
      );

    return (
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-right font-semibold">المستخدم</th>
              <th className="p-4 text-right font-semibold">رقم الهاتف</th>
              <th className="p-4 text-right font-semibold">نوع الهوية</th>
              <th className="p-4 text-center font-semibold">تاريخ التقديم</th>
              <th className="p-4 text-center font-semibold">الحالة</th>
              <th className="p-4 text-center font-semibold">الإجراء</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requests.map(
              (req) =>
                req.user && (
                  <tr key={req.id}>
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={req.user.avatar_url}
                        alt={req.user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <span className="font-medium">{req.user.name}</span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`flex items-center gap-2 ${
                          req.user.phone?.verified
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        <FiPhone /> {req.user.phone?.number || "غير متوفر"}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {req.documentType}
                    </td>
                    <td className="p-4 text-center text-sm text-gray-500">
                      {format(new Date(req.submittedAt), "d MMMM yyyy", {
                        locale: ar,
                      })}
                    </td>
                    <td className="p-4 text-center">
                      {getStatusPill(req.status)}
                    </td>
                    <td className="p-4 text-center">
                      <Link
                        to={`/dashboard/verifications/${req.id}`}
                        className="px-4 py-2 text-sm bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition inline-block"
                      >
                        مراجعة الطلب
                      </Link>
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        طلبات التحقق من الهوية
      </h1>
      {renderContent()}
    </AdminLayout>
  );
};

export default VerificationsPage;
