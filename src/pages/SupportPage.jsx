import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/axiosConfig";
import AdminLayout from "../components/AdminLayout";
import {
  FiLoader,
  FiAlertTriangle,
  FiInbox,
  FiMessageSquare,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

const SupportPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get("/supportTickets");

      const sortedTickets = response.data.sort((a, b) => {
        const statusOrder = { new: 1, in_progress: 2, closed: 3 };
        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[a.status] - statusOrder[b.status];
        }
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });

      setTickets(sortedTickets);
    } catch (err) {
      setError("فشل في جلب تذاكر الدعم الفني.");
      console.error("Error fetching support tickets:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const getStatusPill = (status) => {
    switch (status) {
      case "new":
        return (
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
            <FiMessageSquare className="inline-block ml-1" /> جديدة
          </span>
        );
      case "in_progress":
        return (
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">
            <FiClock className="inline-block ml-1" /> قيد المعالجة
          </span>
        );
      case "closed":
        return (
          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">
            <FiCheckCircle className="inline-block ml-1" /> مغلقة
          </span>
        );
      default:
        return null;
    }
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
    if (tickets.length === 0)
      return (
        <div className="text-center p-16 text-gray-500">
          <FiInbox size={48} className="mx-auto mb-4" />
          <h3 className="text-xl font-semibold">صندوق الدعم فارغ</h3>
          <p>لا توجد تذاكر دعم فني حالياً.</p>
        </div>
      );

    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {tickets.map(
            (ticket) =>
              ticket?.user && (
                <li key={ticket.id}>
                  <Link
                    to={`/dashboard/support/${ticket.id}`}
                    className="block p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 px-2">
                        <img
                          src={ticket.user.avatar_url}
                          alt={ticket.user.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                        />
                        <div>
                          <p className="font-bold text-gray-800">
                            {ticket.subject}
                          </p>
                          <p className="text-sm text-gray-600">
                            من:{" "}
                            <span className="font-semibold">
                              {ticket.user.name}
                            </span>
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            آخر تحديث:{" "}
                            {format(
                              new Date(ticket.updatedAt),
                              "d MMMM yyyy, hh:mm a",
                              { locale: ar }
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 px-5">
                        {getStatusPill(ticket.status)}
                      </div>
                    </div>
                  </Link>
                </li>
              )
          )}
        </ul>
      </div>
    );
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        تذاكر الدعم الفني
      </h1>
      {renderContent()}
    </AdminLayout>
  );
};

export default SupportPage;
