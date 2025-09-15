import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// --- المكونات الأساسية ---
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { AuthProvider } from "./context/AuthContext";

// 1. صفحات المصادقة والتسجيل
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AccountTypePage from "./pages/AccountTypePage";
import VerifyOtpPage from "./pages/VerifyOtpPage";

// 2. صفحات التحقق (هوية، بريد، هاتف)
import EmailVerification from "./pages/EmailVerification";
import VerifyIdentityPage from "./pages/VerifyIdentityPage";
import VerifyPhonePage from "./pages/VerifyPhonePage";

// 3. صفحات عامة وتصفح المحتوى
import Home from "./pages/Home";
import ServicesPage from "./pages/ServicesPage";
import ServiceDetails from "./pages/ServiceDetails";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import UserProfile from "./pages/UserProfile";

// 4. صفحات معلوماتية ثابتة
import ContactUs from "./pages/ConcateUs";
import AboutUs from "./pages/AboutUs";
import TermsAndPrivacy from "./pages/TermsAndPrivacy";
import FAQPage from "./pages/FAQPage";
import HelpCenter from "./pages/HelpCenter";
import TermsofService from "./pages/TermsofService";

// 5. صفحات لوحة التحكم والإعدادات (للمستخدم المسجل)
import DashboardPage from "./pages/DashboardPage";
import EditUserProfile from "./pages/EditUserProfile";
import ChangePassword from "./pages/ChangePassword";
import SettingsPage from "./pages/SettingsPage";
import PaymentsPage from "./pages/PaymentsPage";
import NotificationsSettingsPage from "./pages/NotificationsSettingsPage";
import LanguageRegionPage from "./pages/LanguageRegionPage";
import ThemeSettingsPage from "./pages/ThemeSettingsPage";
import Notifications from "./pages/Notifications";

// 6. صفحات المحادثات والرسائل
import ConversationsPage from "./api/ConversationsPage";
import ConversationPage from "./pages/ConversationPage";
import Chat from "./pages/chat";

// 7. صفحات الطلبات والمبيعات والدفع
import MyOrdersPage from "./pages/MyOrdersPage";
import MySalesPage from "./pages/MySalesPage";
import OrderDetailPage from "./pages/OrderDetailPage"; // مكرر، تم استخدام النسخة الصحيحة
import Checkout from "./pages/Checkout";
import EarningsPage from "./pages/EarningsPage";
import SubmitReviewPage from "./pages/SubmitReviewPage";

// 8. صفحات خاصة بالبائع (Freelancer)
import ServiceFormPage from "./pages/ServiceFormPage";
import ServiceManagement from "./pages/ServiceManagement";
import OrdersManagement from "./pages/OrdersManagement"; // (قد يكون مكررًا لـ MySalesPage)

// 9. صفحات خاصة بالمشتري (Buyer)
import NewProjectPage from "./pages/NewProjectPage";
import EditProjectPage from "./pages/EditProjectPage";
import ProjectManagementPage from "./pages/ProjectManagementPage";
import SubmitProposalPage from "./pages/SubmitProposalPage";

// 10. صفحات الدعم الفني للمستخدم
import UserSupportPage from "./pages/UserSupportPage";

// 11. صفحات لوحة تحكم الأدمن
import ManageUsersPage from "./pages/ManageUsersPage";
import TransactionsPage from "./pages/TransactionsPage";
import SupportPage from "./pages/SupportPage";
import VerificationsPage from "./pages/VerificationsPage";
import VerificationDetailPage from "./pages/VerificationDetailPage";
import TicketDetailPage from "./pages/TicketDetailPage";
import PlatformSettingsPage from "./pages/PlatformSettingsPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";

// 12. صفحة الخطأ
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow pt-25">
            <Routes>
              {/* ===================   1. المسارات العامة   ===================== */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-otp" element={<VerifyOtpPage />} />

              {/* --- مسارات تصفح المحتوى (خدمات، مشاريع، ملفات شخصية) --- */}
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:id" element={<ServiceDetails />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailsPage />} />
              <Route path="/profile/:userId" element={<UserProfile />} />

              {/* --- مسارات الصفحات المعلوماتية --- */}
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/termsandprivacy" element={<TermsAndPrivacy />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/help-center" element={<HelpCenter />} />
              <Route path="/termsof-service" element={<TermsofService />} />

              {/* 2. المسارات المحمية (تتطلب تسجيل دخول) */}
              {/* --- مسارات الإعداد والتحقق بعد التسجيل --- */}
              {/* <ProtectedRoute> */}
                <Route path="/account-type" element={<AccountTypePage />} />
                <Route
                  path="/email-verification"
                  element={<EmailVerification />}
                />
                <Route
                  path="/verify/identity"
                  element={<VerifyIdentityPage />}
                />
                <Route path="/verify/phone" element={<VerifyPhonePage />} />
                {/* --- مسارات لوحة التحكم والإعدادات الشخصية --- */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/edit-profile" element={<EditUserProfile />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/settings/payments" element={<PaymentsPage />} />
                <Route
                  path="/settings/notifications"
                  element={<NotificationsSettingsPage />}
                />
                <Route
                  path="/settings/language"
                  element={<LanguageRegionPage />}
                />
                <Route path="/settings/theme" element={<ThemeSettingsPage />} />
                <Route path="/notifications" element={<Notifications />} />
                {/* --- مسارات المحادثات والرسائل --- */}
                <Route path="/conversations" element={<ConversationsPage />} />
                <Route path="/conversation" element={<ConversationPage />} />
                <Route
                  path="/conversation/:conversationId"
                  element={<ConversationPage />}
                />
                <Route path="/chat/:conversationId" element={<Chat />} />
                {/* --- مسارات الطلبات، المبيعات، والدفع --- */}
                <Route path="/my-orders" element={<MyOrdersPage />} />
                <Route path="/my-sales" element={<MySalesPage />} />
                <Route path="/orders/:orderId" element={<OrderDetailPage />} />
                <Route path="/checkout/:serviceId" element={<Checkout />} />
                <Route path="/earnings" element={<EarningsPage />} />
                <Route
                  path="/projects/:projectId/review"
                  element={<SubmitReviewPage />}
                />
                {/* --- مسارات خاصة بالبائع (Freelancer) --- */}
                <Route path="/add-service" element={<ServiceFormPage />} />
                <Route
                  path="/edit-service/:serviceId"
                  element={<ServiceFormPage />}
                />
                <Route
                  path="/service-management"
                  element={<ServiceManagement />}
                />
                <Route
                  path="/orders-management"
                  element={<OrdersManagement />}
                />
                {/* --- مسارات خاصة بالمشتري (Buyer) --- */}
                <Route path="/projects/new" element={<NewProjectPage />} />
                <Route
                  path="/projects/edit/:id"
                  element={<EditProjectPage />}
                />
                <Route
                  path="/project-management"
                  element={<ProjectManagementPage />}
                />
                <Route
                  path="/submit-proposal/:projectId"
                  element={<SubmitProposalPage />}
                />
                {/* --- مسارات الدعم الفني للمستخدم --- */}
                <Route
                  path="/support/:ticketId"
                  element={<UserSupportPage />}
                />
                {/* 3. مسارات الأدمن (محمية)  */}
                {/* <AdminProtectedRoute> */}
                  <Route
                    path="/dashboard/users"
                    element={<ManageUsersPage />}
                  />
                  <Route
                    path="/dashboard/transactions"
                    element={<TransactionsPage />}
                  />
                  <Route path="/dashboard/support" element={<SupportPage />} />
                  <Route
                    path="/dashboard/support/:ticketId"
                    element={<TicketDetailPage />}
                  />
                  <Route
                    path="/dashboard/verifications"
                    element={<VerificationsPage />}
                  />
                  <Route
                    path="/dashboard/verifications/:id"
                    element={<VerificationDetailPage />}
                  />
                  <Route path="/dashboard/orders" element={<OrdersPage />} />
                  <Route
                    path="/dashboard/orders/:orderId"
                    element={<OrderDetailsPage />}
                  />
                  <Route
                    path="/dashboard/platform-settings"
                    element={<PlatformSettingsPage />}
                  />
                {/* </AdminProtectedRoute> */}
                {/* 4. مسار صفحة "غير موجود" (404) */}
                <Route path="*" element={<NotFoundPage />} />
              {/* </ProtectedRoute> */}
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
