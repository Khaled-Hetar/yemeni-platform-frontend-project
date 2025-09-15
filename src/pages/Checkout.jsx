import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaCreditCard, FaPaypal, FaWallet, FaCheckCircle, FaStar } from "react-icons/fa";
import { FiLoader, FiAlertCircle, FiShoppingCart, FiUser, FiTag, FiShield, FiArrowLeft } from "react-icons/fi";
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
const KarimiBankIcon = () => ( 
  <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="#003A70"/>
    <path d="M50 15L75 37.5L50 60L25 37.5L50 15Z" fill="#FFFFFF" />
    <path d="M50 65L75 87.5L50 87.5L25 87.5L50 65Z" fill="#00AEEF" />
  </svg>
);
const OneCashIcon = () => ( 
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#E40000"/>
    <path d="M12 5L16 12L12 19L8 12L12 5Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);
const JeebWalletIcon = () => ( 
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#2D3748"/>
    <path d="M7 8H17M7 12H17M7 16H12" stroke="#4FD1C5" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const LoadingState = () => (
  <div className="flex items-center justify-center min-h-screen">
    <FiLoader className="animate-spin text-sky-600 text-4xl" />
  </div>
);
const ErrorState = ({ message }) => (
  <div className="flex items-center justify-center min-h-screen text-center">
    <div><FiAlertCircle className="text-red-500 text-5xl mx-auto mb-4" />
      <p className="text-red-600 font-semibold">{message}</p>
    </div>
  </div>
);
const SuccessState = ({ orderId }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => navigate(`/orders/${orderId}`), 3000);
    return () => clearTimeout(timer);
  }, [orderId, navigate]);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md p-8 text-center bg-white rounded-2xl shadow-lg">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">تم إنشاء طلبك بنجاح!</h2>
        <p className="text-gray-600 mt-2 mb-6">سيتم الآن توجيهك لصفحة الطلب...</p>
        <FiLoader className="animate-spin text-gray-400 mx-auto" />
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [createdOrder, setCreatedOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("karimi");
  const [paymentData, setPaymentData] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [view, setView] = useState('payment');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/checkout/${serviceId}` } });
      return;
    }
    const fetchService = async () => {
      try {
        const response = await apiClient.get(`/services/${serviceId}?_expand=user`);
        setService(response.data);
      } catch {
        setError("لا يمكن العثور على الخدمة المطلوبة.");
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [serviceId, isAuthenticated, navigate]);

  useEffect(() => {
    let valid = false;
    switch (paymentMethod) {
        case 'karimi': valid = !!(paymentData.karimiAccount?.trim() && paymentData.karimiPhone?.trim()); break;
        case 'onecash': valid = !!paymentData.oneCashPhone?.trim(); break;
        case 'jeeb': valid = !!paymentData.jeebPhone?.trim(); break;
        case 'card': valid = !!(paymentData.cardNumber?.trim() && paymentData.cardExpiry?.trim() && paymentData.cardCVC?.trim()); break;
        case 'paypal': case 'wallet': valid = true; break;
        default: valid = false;
    }
    setIsFormValid(valid);
  }, [paymentMethod, paymentData]);

  const handleProceedToConfirmation = () => {
      if (!isFormValid) return;
      setView('confirmation');
  };

  const handleFinalConfirm = async () => {
    if (!service) return;
    setProcessing(true);
    setError("");
    try {
      const price = service.price;
      const totalPrice = price + (price * 0.10);
      const orderPayload = {
        buyerId: user.id, sellerId: service.userId, serviceId: parseInt(serviceId),
        totalAmount: totalPrice, status: 'new', createdAt: new Date().toISOString(),
        paymentMethod: paymentMethod, paymentDetails: paymentData,
      };
      const response = await apiClient.post('/orders', orderPayload);
      setCreatedOrder(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "فشل في إنشاء الطلب.");
      setProcessing(false);
      setView('payment');
    }
  };

  const servicePrice = service?.price || 0;
  const commission = servicePrice * 0.10;
  const totalPrice = servicePrice + commission;

  if (loading) return <LoadingState />;
  if (error && !service) return <ErrorState message={error} />;
  if (createdOrder) return <SuccessState orderId={createdOrder.id} />;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900">إتمام الشراء</h1>
          <p className="mt-2 text-lg text-gray-600">أنت على بعد خطوات قليلة من الحصول على خدمتك.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-md border p-5">
              <img src={service?.main_image_url} alt={service?.title}
                className="w-full h-40 object-cover rounded-lg mb-4" />
              <h3 className="text-xl font-bold text-gray-800">{service?.title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                <FiTag /> <span>{service?.category?.name || 'فئة غير محددة'}</span>
                <span className="mx-1">|</span>
                <FaStar className="text-yellow-400" />
                <span>{service?.rating || 'N/A'} ({service?.reviews_count || 0} مراجعة)</span>
              </div>
            </div>

            {service?.user && (
              <div className="bg-white rounded-xl shadow-md border p-5 flex items-center gap-4">
                <img src={service.user.avatar_url} alt={service.user.name} className="w-16 h-16 rounded-full object-cover" />
                <div>
                  <p className="text-sm text-gray-500">مقدم الخدمة</p>
                  <p className="text-lg font-semibold text-gray-900">{service.user.name}</p>
                  <Link to={`/profile/${service.user.id}`}
                    className="text-sm text-sky-600 hover:underline">عرض الملف الشخصي</Link>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-3 bg-white rounded-xl shadow-md border p-8">
            {view === 'payment' ? (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">1. اختر طريقة الدفع</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <PaymentChoiceButton icon={<KarimiBankIcon />} label="بنك الكريمي" method="karimi" activeMethod={paymentMethod} onClick={setPaymentMethod} />
                    <PaymentChoiceButton icon={<OneCashIcon />} label="ون كاش" method="onecash" activeMethod={paymentMethod} onClick={setPaymentMethod} />
                    <PaymentChoiceButton icon={<JeebWalletIcon />} label="محفظة جيب" method="jeeb" activeMethod={paymentMethod} onClick={setPaymentMethod} />
                    <PaymentChoiceButton icon={<FaWallet />} label="المحفظة" method="wallet" activeMethod={paymentMethod} onClick={setPaymentMethod} />
                    <PaymentChoiceButton icon={<FaPaypal />} label="PayPal" method="paypal" activeMethod={paymentMethod} onClick={setPaymentMethod} />
                    <PaymentChoiceButton icon={<FaCreditCard />} label="بطاقة ائتمان" method="card" activeMethod={paymentMethod} onClick={setPaymentMethod} />
                </div>

                <div className="min-h-[150px]">
                    {paymentMethod === 'karimi' && <KarimiPaymentForm data={paymentData} setData={setPaymentData} />}
                    {paymentMethod === 'onecash' && <OneCashPaymentForm data={paymentData} setData={setPaymentData} />}
                    {paymentMethod === 'jeeb' && <JeebPaymentForm data={paymentData} setData={setPaymentData} />}
                    {paymentMethod === 'card' && <CardPaymentForm data={paymentData} setData={setPaymentData} />}
                    {paymentMethod === 'paypal' && <PayPalPaymentForm />}
                    {paymentMethod === 'wallet' && <WalletPaymentInfo balance={user?.walletBalance || 0} needed={totalPrice} />}
                </div>

                <hr className="my-8" />

                <h2 className="text-2xl font-bold text-gray-800 mb-6">2. ملخص الفاتورة</h2>
                <InvoiceSummary servicePrice={servicePrice} commission={commission} totalPrice={totalPrice} />

                <button onClick={handleProceedToConfirmation} disabled={!isFormValid || !service} className="w-full flex items-center justify-center gap-3 bg-sky-600 text-white font-bold py-4 rounded-lg text-lg hover:bg-sky-700 transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                    <FiShield />
                    <span>{`المتابعة للدفع ${totalPrice.toFixed(2)}$`}</span>
                </button>
                <p className="text-xs text-gray-500 mt-3 text-center">بالنقر على "المتابعة"، أنت توافق على شروط الخدمة.</p>
              </>
            ) : (
              <>
                <div className="flex items-center mb-6">
                    <button onClick={() => setView('payment')} className="p-2 rounded-full hover:bg-gray-100 mr-4">
                        <FiArrowLeft className="text-gray-600" />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800">تأكيد الدفع</h2>
                </div>
                
                <div className="p-6 bg-gray-50 rounded-lg border">
                    <h3 className="font-bold text-lg mb-4">هل أنت متأكد من إتمام هذه العملية؟</h3>
                    <InvoiceSummary servicePrice={servicePrice} commission={commission} totalPrice={totalPrice} />
                </div>

                {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}

                <button onClick={handleFinalConfirm} disabled={processing} className="w-full mt-8 flex items-center justify-center gap-3 bg-green-600 text-white font-bold py-4 rounded-lg text-lg hover:bg-green-700 transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                  {processing ? <FiLoader className="animate-spin" /> : <FaCheckCircle />}
                  <span>{processing ? 'جاري التأكيد...' : `تأكيد ودفع ${totalPrice.toFixed(2)}$`}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const InvoiceSummary = ({ servicePrice, commission, totalPrice }) => (
    <div className="space-y-3 text-gray-700 mb-8">
        <div className="flex justify-between"><p>سعر الخدمة:</p> <p className="font-medium">${servicePrice.toFixed(2)}</p></div>
        <div className="flex justify-between"><p>عمولة المنصة (10%):</p> <p className="font-medium">${commission.toFixed(2)}</p></div>
        <div className="border-t my-3"></div>
        <div className="flex justify-between text-xl font-bold text-gray-900">
            <p>الإجمالي للدفع:</p>
            <p>${totalPrice.toFixed(2)}</p>
        </div>
    </div>
);

const PaymentChoiceButton = ({ icon, label, method, activeMethod, onClick }) => ( <button onClick={() => onClick(method)} className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center gap-2 transition-all ${activeMethod === method ? 'border-sky-500 bg-sky-50' : 'border-gray-200 hover:border-gray-300'}`}><div className="h-6 flex items-center">{icon}</div><span className="text-sm font-semibold text-center mt-2">{label}</span></button> );
const KarimiPaymentForm = ({ data, setData }) => ( <div className="p-4 bg-gray-100 rounded-lg space-y-3"><h4 className="font-semibold">الدفع عبر حاسب (بنك الكريمي)</h4><div><label className="text-sm font-medium">رقم الحساب</label><input type="text" placeholder="123-xxxxxx-xxxx" value={data.karimiAccount || ''} onChange={e => setData({...data, karimiAccount: e.target.value})} className="w-full p-2 border rounded-md mt-1" /></div><div><label className="text-sm font-medium">رقم الهاتف المسجل</label><input type="text" placeholder="77xxxxxxx" value={data.karimiPhone || ''} onChange={e => setData({...data, karimiPhone: e.target.value})} className="w-full p-2 border rounded-md mt-1" /></div></div> );
const OneCashPaymentForm = ({ data, setData }) => ( <div className="p-4 bg-gray-100 rounded-lg space-y-3"><h4 className="font-semibold">الدفع عبر ون كاش</h4><div><label className="text-sm font-medium">رقم الهاتف</label><input type="text" placeholder="77xxxxxxx" value={data.oneCashPhone || ''} onChange={e => setData({...data, oneCashPhone: e.target.value})} className="w-full p-2 border rounded-md mt-1" /></div><p className="text-xs text-gray-500">سيتم إرسال طلب دفع إلى هذا الرقم لإتمام العملية.</p></div> );
const JeebPaymentForm = ({ data, setData }) => ( <div className="p-4 bg-gray-100 rounded-lg space-y-3"><h4 className="font-semibold">الدفع عبر محفظة جيب</h4><div><label className="text-sm font-medium">رقم هاتف المحفظة</label><input type="text" placeholder="7xxxxxxxx" value={data.jeebPhone || ''} onChange={e => setData({...data, jeebPhone: e.target.value})} className="w-full p-2 border rounded-md mt-1" /></div></div> );
const CardPaymentForm = ({ data, setData }) => ( <div className="p-4 bg-gray-100 rounded-lg space-y-3"><h4 className="font-semibold">الدفع بالبطاقة الائتمانية</h4><div><label className="text-sm font-medium">رقم البطاقة</label><input type="text" placeholder="•••• •••• •••• ••••" value={data.cardNumber || ''} onChange={e => setData({...data, cardNumber: e.target.value})} className="w-full p-2 border rounded-md mt-1" /></div><div className="flex gap-3"><div className="flex-1"><label className="text-sm font-medium">تاريخ الانتهاء</label><input type="text" placeholder="MM/YY" value={data.cardExpiry || ''} onChange={e => setData({...data, cardExpiry: e.target.value})} className="w-full p-2 border rounded-md mt-1" /></div><div className="flex-1"><label className="text-sm font-medium">CVC</label><input type="text" placeholder="•••" className="w-full p-2 border rounded-md mt-1" /></div></div></div> );
const PayPalPaymentForm = () => ( <div className="p-4 bg-gray-100 rounded-lg text-center"><h4 className="font-semibold mb-3">الدفع عبر PayPal</h4><p className="text-sm text-gray-600 mb-4">سيتم توجيهك إلى موقع PayPal لإتمام عملية الدفع بأمان.</p><a href="https://www.paypal.com/support" target="_blank" rel="noopener noreferrer" className="inline-block bg-[#0070BA] text-white font-bold py-2 px-6 rounded-full hover:bg-[#005ea6] transition">المتابعة إلى PayPal</a></div>  );
const WalletPaymentInfo = ({ balance, needed }) => ( <div className="p-4 bg-gray-100 rounded-lg text-center"><h4 className="font-semibold mb-2">الدفع من رصيد المحفظة</h4><p className="text-lg">رصيدك الحالي: <span className="font-bold text-green-600">${balance.toFixed(2)}</span></p>{balance < needed && (<p className="text-sm text-red-600 mt-2">رصيدك غير كافٍ. يرجى شحن محفظتك أو اختيار طريقة دفع أخرى.</p>)}</div> );

export default CheckoutPage;
