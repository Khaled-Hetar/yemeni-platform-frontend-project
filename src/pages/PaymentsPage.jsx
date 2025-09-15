import React from "react";
import { FiPlus, FiArrowUp, FiShoppingCart, FiRefreshCw } from "react-icons/fi";
import SettingsLayout from "../components/SettingsLayout";

const PaymentsPage = () => {
  const transactions = [
    {
      id: 1,
      type: "deposit",
      description: "إيداع عبر PayPal",
      amount: 200.0,
      date: "2025-09-10",
    },
    {
      id: 2,
      type: "purchase",
      description: 'شراء خدمة "تصميم شعار"',
      amount: -50.0,
      date: "2025-09-08",
    },
    {
      id: 3,
      type: "withdrawal",
      description: "سحب أرباح",
      amount: -150.0,
      date: "2025-09-05",
    },
    {
      id: 4,
      type: "refund",
      description: "إرجاع مبلغ خدمة ملغاة",
      amount: 25.0,
      date: "2025-09-02",
    },
  ];

  const getTransactionIcon = (type) => {
    const icons = {
      deposit: <FiPlus className="text-green-500" />,
      purchase: <FiShoppingCart className="text-blue-500" />,
      withdrawal: <FiArrowUp className="text-red-500" />,
      refund: <FiRefreshCw className="text-orange-500" />,
    };
    return <div className="p-2 bg-gray-100 rounded-full">{icons[type]}</div>;
  };

  return (
    <SettingsLayout
      title="الرصيد والمدفوعات"
      description="إدارة أموالك وعرض سجل معاملاتك."
    >
      <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-6 rounded-xl mb-8 shadow-lg">
        <p className="text-lg opacity-80">رصيدك الحالي</p>
        <p className="text-4xl font-bold mt-2">125.00 $</p>
        <div className="flex gap-4 mt-6">
          <button className="flex-1 bg-white text-cyan-600 font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition">
            إضافة رصيد
          </button>
          <button className="flex-1 bg-black bg-opacity-20 text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-30 transition">
            سحب الأرباح
          </button>
        </div>
      </div>

      {/* سجل المعاملات */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">سجل المعاملات</h3>
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <div className="flex items-center gap-4">
                {getTransactionIcon(tx.type)}
                <div>
                  <p className="font-semibold text-gray-800">
                    {tx.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(tx.date).toLocaleDateString("ar-EG", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <p
                className={`font-bold text-lg ${
                  tx.amount > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {tx.amount > 0 ? "+" : ""}
                {tx.amount.toFixed(2)}$
              </p>
            </div>
          ))}
        </div>
      </div>
    </SettingsLayout>
  );
};

export default PaymentsPage;
