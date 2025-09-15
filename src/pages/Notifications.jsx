import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import NotificationHeader from "../components/notifications/NotificationHeader";
import NotificationList from "../components/notifications/NotificationList";
import EmptyState from "../components/notifications/EmptyState";

const Notifications = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      // استخدام الرابط الصحيح لجلب الإشعارات الخاصة بالمستخدم الحالي فقط
      const response = await apiClient.get(
        `/notifications?userId=${user.id}&_sort=createdAt&_order=desc`
      );
      setNotifications(response.data);
    } catch (err) {
      setError("فشل في تحميل الإشعارات.");
      console.error("Fetch notifications error:", err);
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
    fetchNotifications();
  }, [user, authLoading, navigate, fetchNotifications]);

  const handleMarkAsRead = useCallback(
    async (notificationId) => {
      const originalNotifications = [...notifications];
      setNotifications(
        (prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)) // استخدام `read` بدلاً من `read_at` للتبسيط
      );
      try {
        // استخدام الرابط الصحيح لتحديث إشعار واحد
        await apiClient.patch(`/notifications/${notificationId}`, {
          read: true,
        });
      } catch (error) {
        console.error(`فشل في تحديث الإشعار ${notificationId}:`, error);
        setNotifications(originalNotifications);
        alert("حدث خطأ أثناء تحديث الإشعار.");
      }
    },
    [notifications]
  );

  const handleMarkAllAsRead = useCallback(async () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    if (unreadIds.length === 0) return;

    const originalNotifications = [...notifications];
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      // إرسال طلبات متعددة لتحديث كل الإشعارات غير المقروءة
      await Promise.all(
        unreadIds.map((id) =>
          apiClient.patch(`/notifications/${id}`, { read: true })
        )
      );
    } catch (error) {
      console.error("فشل في تحديث كل الإشعارات:", error);
      setNotifications(originalNotifications);
      alert("حدث خطأ أثناء تحديث جميع الإشعارات.");
    }
  }, [notifications]);

  const handleDeleteAll = useCallback(async () => {
    if (
      !window.confirm(
        "هل أنت متأكد من حذف جميع الإشعارات؟ لا يمكن التراجع عن هذا الإجراء."
      )
    )
      return;

    const originalNotifications = [...notifications];
    const idsToDelete = notifications.map((n) => n.id);
    setNotifications([]);
    try {
      // إرسال طلبات حذف متعددة
      await Promise.all(
        idsToDelete.map((id) => apiClient.delete(`/notifications/${id}`))
      );
    } catch (error) {
      console.error("فشل في حذف الإشعارات:", error);
      setNotifications(originalNotifications);
      alert("حدث خطأ أثناء حذف الإشعارات.");
    }
  }, [notifications]);

  const handleNotificationClick = useCallback(
    (notification) => {
      if (!notification.read) {
        handleMarkAsRead(notification.id);
      }
      if (notification.data?.link) {
        navigate(notification.data.link);
      }
    },
    [handleMarkAsRead, navigate]
  );

  if (authLoading || loading)
    return <LoadingState message="جاري تحميل الإشعارات..." />;
  if (error) return <ErrorState message={error} onRetry={fetchNotifications} />;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        <NotificationHeader
          onMarkAllAsRead={handleMarkAllAsRead}
          onDeleteAll={handleDeleteAll}
          hasNotifications={notifications.length > 0}
        />
        <main>
          {notifications.length > 0 ? (
            <NotificationList
              notifications={notifications}
              onNotificationClick={handleNotificationClick}
            />
          ) : (
            <EmptyState />
          )}
        </main>
      </div>
    </div>
  );
};

export default Notifications;
