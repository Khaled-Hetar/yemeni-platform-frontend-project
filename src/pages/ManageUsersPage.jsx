import React, { useState, useEffect, useMemo } from "react";
import apiClient from "../api/axiosConfig";
import AdminLayout from "../components/AdminLayout";
import {
  FiLoader,
  FiAlertTriangle,
  FiCheckCircle,
  FiSlash,
  FiSearch,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import Can from "../components/Can";

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/users");
        setUsers(response.data.filter((user) => user.role !== "admin"));
      } catch (err) {
        setError("فشل في جلب بيانات المستخدمين.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "banned" : "active";
    try {
      await apiClient.patch(`/users/${userId}`, { status: newStatus });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
      );
    } catch (err) {
      alert("فشل في تحديث حالة المستخدم.");
      console.error(err);
    }
  };

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (user) =>
          (user.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
      ),
    [users, searchTerm]
  );

  const renderContent = () => {
    if (loading)
      return (
        <div className="text-center p-10">
          <FiLoader className="animate-spin text-3xl mx-auto" />
        </div>
      );
    if (error)
      return (
        <div className="text-center p-10 text-red-500">
          <FiAlertTriangle className="inline-block" /> {error}
        </div>
      );

    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* --- حقل البحث --- */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث بالاسم، البريد الإلكتروني، أو نوع الحساب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />
          </div>
        </div>

        {/* --- الجدول العملي والكلاسيكي --- */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  المستخدم
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  البريد الإلكتروني
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  نوع الحساب
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  تاريخ الانضمام
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
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* عمود المستخدم (مع رابط) */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/profile/${user.id}`}
                      className="flex items-center group"
                    >
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={user.avatar_url}
                          alt={user.name}
                        />
                      </div>
                      <div className="mr-4">
                        <div className="text-sm font-medium text-gray-900 group-hover:text-cyan-600 transition-colors">
                          {user.name}
                        </div>
                      </div>
                    </Link>
                  </td>

                  {/* عمود البريد الإلكتروني */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.email}
                  </td>

                  {/* عمود نوع الحساب */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                    {user.accountType === "freelancer" ? "بائع" : "مشتري"}
                  </td>

                  {/* عمود تاريخ الانضمام */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("ar-EG")
                      : "غير معروف"}
                  </td>

                  {/* عمود الحالة */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status === "active" ? "نشط" : "محظور"}
                    </span>
                  </td>

                  {/* عمود الإجراءات */}
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex items-center justify-center">
                      <Can perform="users">
                        <button
                          onClick={() =>
                            toggleUserStatus(user.id, user.status || "active")
                          }
                          className={`flex items-center justify-center gap-2 w-24 px-3 py-2 text-xs rounded-md transition-all ${
                            (user.status || "active") === "active"
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          {(user.status || "active") === "active" ? (
                            <FiSlash />
                          ) : (
                            <FiCheckCircle />
                          )}
                          <span>
                            {(user.status || "active") === "active"
                              ? "حظر"
                              : "تفعيل"}
                          </span>
                        </button>
                      </Can>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* رسالة في حالة عدم وجود نتائج */}
          {filteredUsers.length === 0 && !loading && (
            <div className="text-center py-16 text-gray-500">
              <FiSearch size={40} className="mx-auto mb-3" />
              <h3 className="text-lg font-semibold">لا توجد نتائج</h3>
              <p>لم يتم العثور على مستخدمين يطابقون بحثك.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        إدارة المستخدمين
      </h1>
      {renderContent()}
    </AdminLayout>
  );
};

export default ManageUsersPage;
