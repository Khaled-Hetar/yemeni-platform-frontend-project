import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { FiLoader, FiDollarSign, FiCheckCircle, FiClock, FiArrowLeft, FiInbox } from 'react-icons/fi';

const StatCard = ({ title, amount, icon, color, note }) => (
  <div className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${color}`}>
    <div className="flex items-center gap-4">
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">${amount.toFixed(2)}</p>
      </div>
    </div>
    {note && <p className="text-xs text-gray-400 mt-2">{note}</p>}
  </div>
);

const TransactionRow = ({ transaction }) => {
    const isIncome = ['sale_completed', 'refund_cancelled'].includes(transaction.type);
    const amountStyle = isIncome ? 'text-green-600' : 'text-red-600';
    const amountPrefix = isIncome ? '+' : '-';

    const descriptions = {
        sale_completed: `أرباح من إكمال الطلب #${transaction.orderId}`,
        payout_request: `طلب سحب أرباح إلى ${transaction.details?.method || 'وسيلة غير محددة'}`,
        payout_completed: `تم إرسال سحوبات بقيمة ${transaction.amount}`,
        payout_fee: `رسوم معالجة السحب`,
        refund_initiated: `خصم مؤقت بسبب نزاع على الطلب #${transaction.orderId}`,
    };

    return (
        <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="p-4">
                <p className="font-medium text-gray-800">{descriptions[transaction.type] || 'معاملة غير معروفة'}</p>
                <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleString('ar-EG')}</p>
            </td>
            <td className={`p-4 font-bold text-lg text-right ${amountStyle}`}>
                {amountPrefix} ${transaction.amount.toFixed(2)}
            </td>
        </tr>
    );
};

const EarningsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- جلب بيانات المعاملات ---
  const fetchTransactions = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/transactions?userId=${user.id}&_sort=date&_order=desc`);
      setTransactions(response.data);
    } catch (err) {
      setError("فشل في تحميل سجل المعاملات.");
      console.error("Fetch transactions error:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login'); return; }
    fetchTransactions();
  }, [user, authLoading, navigate, fetchTransactions]);

  const financials = useMemo(() => {
      let availableForPayout = 0;
      let pendingClearance = 0;
      let withdrawn = 0;

      transactions.forEach(tx => {
        switch (tx.type) {
          case 'sale_completed': {
            const clearanceDate = new Date(tx.date);
            clearanceDate.setDate(clearanceDate.getDate() + 7);
            if (new Date() > clearanceDate) {
              availableForPayout += tx.amount;
            } else {
              pendingClearance += tx.amount;
            }
            break;
          }

          case 'payout_request':
          case 'payout_fee':
            availableForPayout -= tx.amount;
            break;
          
          case 'payout_completed':
              withdrawn += tx.amount;
              break;

          default:
            break;
        }
      });
      return { availableForPayout, pendingClearance, withdrawn };
  }, [transactions]);

  const handlePayoutRequest = async (e) => {
    e.preventDefault();
    const amount = parseFloat(payoutAmount);
    if (isNaN(amount) || amount <= 0 || amount > financials.availableForPayout) {
      alert("الرجاء إدخال مبلغ صحيح ومتاح للسحب.");
      return;
    }
    if (!window.confirm(`هل أنت متأكد من طلب سحب مبلغ ${amount.toFixed(2)}$؟`)) return;

    setIsSubmitting(true);
    try {
      await apiClient.post('/payout-requests', { userId: user.id, amount });
      alert("تم إرسال طلب السحب بنجاح وسيتم مراجعته قريباً.");
      setPayoutAmount('');
      fetchTransactions();
    } catch (err) {
      alert("فشل في إرسال طلب السحب.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return <div className="flex items-center justify-center min-h-screen"><FiLoader className="animate-spin text-sky-600 text-4xl" /></div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-4">
            <FiArrowLeft />
            العودة إلى لوحة التحكم
          </button>
          <h1 className="text-3xl font-extrabold text-gray-800">الرصيد والأرباح</h1>
          <p className="text-gray-500 mt-1">إدارة أرباحك وطلبات السحب من هنا.</p>
        </header>

        {/* بطاقات الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard title="الرصيد القابل للسحب" amount={financials.availableForPayout} icon={<FiCheckCircle />} color="border-green-500" note="الأرباح التي يمكنك سحبها الآن." />
          <StatCard title="الرصيد المعلق" amount={financials.pendingClearance} icon={<FiClock />} color="border-yellow-500" note="أرباح قيد المراجعة (تستغرق 7 أيام)." />
          <StatCard title="إجمالي المسحوبات" amount={financials.withdrawn} icon={<FiDollarSign />} color="border-blue-500" note="مجموع المبالغ التي سحبتها." />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* العمود الأيمن: طلب السحب */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-lg font-bold text-gray-800 mb-4">طلب سحب الأرباح</h2>
              <form onSubmit={handlePayoutRequest}>
                <label htmlFor="payoutAmount" className="block text-sm font-medium text-gray-700 mb-1">المبلغ (بالدولار)</label>
                <input
                  type="number"
                  id="payoutAmount"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  placeholder="0.00"
                  min="50" // الحد الأدنى للسحب
                  max={financials.availableForPayout.toFixed(2)}
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                  required
                />
                <p className="text-xs text-gray-500 mb-4">الحد الأدنى للسحب هو 50$. سيتم خصم رسوم المعالجة.</p>
                <button type="submit" disabled={isSubmitting || financials.availableForPayout < 50} className="w-full bg-sky-600 text-white font-bold py-3 rounded-lg hover:bg-sky-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? 'جاري الإرسال...' : 'إرسال طلب السحب'}
                </button>
              </form>
            </div>
          </div>

          {/* العمود الأيسر: سجل المعاملات */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border">
              <h2 className="text-lg font-bold text-gray-800 p-6 border-b">سجل المعاملات</h2>
              {error && <p className="p-6 text-red-500">{error}</p>}
              {transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody>
                      {transactions.map(tx => <TransactionRow key={tx.id} transaction={tx} />)}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16">
                  <FiInbox size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">لا توجد أي معاملات في حسابك بعد.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsPage;
