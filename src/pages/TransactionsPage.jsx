import React, { useState, useEffect, useCallback } from "react";
import apiClient from "../api/axiosConfig";
import AdminLayout from "../components/AdminLayout";
import {
  FiLoader,
  FiAlertTriangle,
  FiCheckCircle,
  FiRefreshCw,
  FiArrowDown,
  FiArrowUp,
  FiShoppingCart,
  FiDollarSign,
  FiXCircle,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(
        "/transactions?_sort=date&_order=desc"
      );
      setTransactions(response.data);
    } catch (err) {
      setError("فشل في جلب بيانات المعاملات.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const updateTransactionType = async (transactionId, newType) => {
    if (
      !window.confirm(
        `هل أنت متأكد من أنك تريد تغيير حالة هذه المعاملة إلى "${newType}"؟`
      )
    ) {
      return;
    }

    try {
      await apiClient.patch(`/transactions/${transactionId}`, {
        type: newType,
      });

      setTransactions((prev) =>
        prev.map((t) => (t.id === transactionId ? { ...t, type: newType } : t))
      );
      alert("تم تحديث حالة المعاملة بنجاح!");
    } catch (err) {
      alert("فشل في تحديث حالة المعاملة.");
      console.error(err);
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filter === "all") return true;
    return t.type === filter;
  });

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
    if (filteredTransactions.length === 0)
      return (
        <div className="text-center p-16 text-gray-500">
          <FiDollarSign size={48} className="mx-auto mb-4" />
          <h3 className="text-xl font-semibold">لا توجد معاملات</h3>
          <p>لم يتم العثور على معاملات تطابق الفلتر المحدد.</p>
        </div>
      );

    const getTransactionIcon = (type) => {
      const icons = {
        sale_completed: <FiShoppingCart className="text-blue-500" />,
        deposit: <FiArrowDown className="text-green-500" />,
        payout_request: <FiArrowUp className="text-red-500" />,
        refund_initiated: <FiRefreshCw className="text-orange-500" />,
      };
      return (
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          {icons[type] || <FiDollarSign />}
        </div>
      );
    };

    const getStatusInfo = (type) => {
      const statusMap = {
        sale_completed: {
          text: "بيع مكتمل",
          style: "bg-green-100 text-green-800",
        },
        deposit: { text: "إيداع", style: "bg-blue-100 text-blue-800" },
        payout_request: {
          text: "طلب سحب",
          style: "bg-yellow-100 text-yellow-800",
        },
        refund_initiated: {
          text: "نزاع (مُعلق)",
          style: "bg-orange-100 text-orange-800",
        },
      };
      return (
        statusMap[type] || { text: type, style: "bg-gray-100 text-gray-800" }
      );
    };

    return (
      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                تفاصيل المعاملة
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                البائع
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                المشتري
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                التاريخ
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                المبلغ
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                الحالة
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransactions.map((tx) => {
              const statusInfo = getStatusInfo(tx.type);
              return (
                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getTransactionIcon(tx.type)}
                      <div className="mr-4">
                        <div className="text-sm font-medium text-gray-900">
                          {tx.details?.description || "لا يوجد وصف"}
                        </div>
                        {tx.orderId && (
                          <div className="text-sm text-gray-500">
                            طلب رقم:{" "}
                            <Link
                              to={`/orders/${tx.orderId}`}
                              className="hover:underline text-cyan-600"
                            >
                              #{tx.orderId}
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* عمود البائع */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {tx.fromUser ? (
                      <Link
                        to={`/profile/${tx.fromUser.id}`}
                        className="font-semibold text-gray-700 hover:text-cyan-600"
                      >
                        {tx.fromUser.name}
                      </Link>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>

                  {/* عمود المشتري */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {tx.toUser ? (
                      <Link
                        to={`/profile/${tx.toUser.id}`}
                        className="font-semibold text-gray-700 hover:text-cyan-600"
                      >
                        {tx.toUser.name}
                      </Link>
                    ) : (
                      <span className="text-gray-400">
                        ــــــــــــــــــــــــــــــــ
                      </span>
                    )}
                  </td>

                  {/* عمود التاريخ */}
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                    {new Date(tx.date).toLocaleDateString("ar-EG", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>

                  {/* عمود المبلغ */}
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center text-lg font-mono font-bold ${
                      tx.type === "deposit" || tx.type === "sale_completed"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {tx.type === "deposit" || tx.type === "sale_completed"
                      ? "+"
                      : "-"}
                    ${tx.amount.toFixed(2)}
                  </td>

                  {/* عمود الحالة */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.style}`}
                    >
                      {statusInfo.text}
                    </span>
                  </td>

                  {/* عمود الإجراءات */}
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    {tx.type === "payout_request" ? (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            updateTransactionType(tx.id, "payout_completed")
                          }
                          className="p-2 rounded-full text-green-500 hover:bg-green-100"
                          title="الموافقة على السحب"
                        >
                          <FiCheckCircle size={18} />
                        </button>

                        <button
                          onClick={() => {}}
                          className="p-2 rounded-full text-red-500 hover:bg-red-100"
                          title="رفض طلب السحب"
                        >
                          <FiXCircle size={18} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">
                        لا يوجد إجراء
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">الإدارة المالية</h1>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">فلترة حسب:</p>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="all">الكل</option>
            <option value="sale_completed">بيع مكتمل</option>
            <option value="deposit">إيداع</option>
            <option value="payout_request">طلب سحب</option>
            <option value="refund_initiated">نزاع</option>
          </select>
        </div>
      </div>
      {renderContent()}
    </AdminLayout>
  );
};

export default TransactionsPage;
