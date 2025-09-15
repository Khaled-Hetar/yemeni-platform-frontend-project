import React from "react";
import PropTypes from "prop-types";
import TransactionItem from "./TransactionItem";

const generateUniqueId = () =>
  `loader-${Math.random().toString(36).slice(2, 11)}`;

const TransactionsSection = ({ transactions }) => {
  if (!transactions) {
    const loaderItems = Array.from({ length: 3 }, () => ({
      id: generateUniqueId(),
    }));

    return (
      <section className="bg-white border border-gray-200 rounded-2xl shadow p-6 animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
        <div className="space-y-5">
          {loaderItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                <div>
                  <div className="h-5 bg-gray-300 rounded w-32 mb-1"></div>
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-300 rounded w-16"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white border border-gray-200 rounded-2xl shadow p-6">
      <h2 className="text-lg font-semibold text-neutral-700 mb-4">
        سجل المعاملات
      </h2>
      <div className="space-y-5">
        {transactions.length > 0 ? (
          transactions.map((tx) => (
            <TransactionItem key={tx.id} transaction={tx} />
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">
            لا توجد معاملات لعرضها.
          </p>
        )}
      </div>
    </section>
  );
};

TransactionsSection.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ),
};

export default TransactionsSection;
