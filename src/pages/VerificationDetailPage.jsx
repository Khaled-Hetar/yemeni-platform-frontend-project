import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import apiClient from "../api/axiosConfig";
import AdminLayout from "../components/AdminLayout";
import { useAuth } from "../context/AuthContext";
import {
  FiLoader,
  FiAlertTriangle,
  FiFileText,
  FiPhone,
  FiCheck,
  FiX,
  FiArrowRight,
  FiMail,
  FiShield,
  FiEye,
  FiXCircle,
  FiChevronLeft,
  FiChevronRight,
  FiExternalLink,
} from "react-icons/fi";

const ImageViewer = ({ images, startIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  const goToPrevious = () => {
    const isFirst = currentIndex === 0;
    const newIndex = isFirst ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLast = currentIndex === images.length - 1;
    const newIndex = isLast ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 transition-colors"
      >
        <FiXCircle />
      </button>
      <button
        onClick={goToPrevious}
        className="absolute left-4 text-white text-4xl p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75"
      >
        <FiChevronLeft />
      </button>
      <div className="relative max-w-4xl max-h-full">
        <img
          src={images[currentIndex].url}
          alt={images[currentIndex].label}
          className="max-h-[85vh] object-contain"
        />
        <p className="text-center text-white mt-2 font-semibold">
          {images[currentIndex].label}
        </p>
      </div>
      <button
        onClick={goToNext}
        className="absolute right-4 text-white text-4xl p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75"
      >
        <FiChevronRight />
      </button>
    </div>
  );
};

const VerificationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: adminUser } = useAuth();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerStartIndex, setViewerStartIndex] = useState(0);

  const fetchRequest = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/verificationRequests/${id}`);
      setRequest(response.data);
      setNotes(response.data.reviewerNotes || "");
    } catch (err) {
      setError("فشل في جلب تفاصيل الطلب.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRequest();
  }, [fetchRequest]);

  const handleDecision = async (newStatus) => {
    if (newStatus === "rejected" && !notes.trim()) {
      alert("يرجى كتابة سبب الرفض في الملاحظات.");
      return;
    }
    setIsSubmitting(true);
    try {
      await apiClient.patch(`/verificationRequests/${id}`, {
        status: newStatus,
        reviewerNotes: notes,
        reviewedAt: new Date().toISOString(),
        reviewedBy: adminUser.id,
      });
      if (newStatus === "approved" && request.user) {
        await apiClient.patch(`/users/${request.user.id}`, {
          isVerified: true,
        });
      }
      alert(`تم ${newStatus === "approved" ? "قبول" : "رفض"} الطلب بنجاح.`);
      navigate("/dashboard/verifications");
    } catch (err) {
      alert("حدث خطأ أثناء تحديث حالة الطلب.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const documents = request
    ? [
        { url: request.documentFrontUrl, label: "وجه الهوية" },
        ...(request.documentBackUrl
          ? [{ url: request.documentBackUrl, label: "خلفية الهوية" }]
          : []),
        { url: request.selfieUrl, label: "صورة شخصية مع الهوية" },
      ]
    : [];

  if (loading)
    return (
      <AdminLayout>
        <div className="flex justify-center p-10">
          <FiLoader className="animate-spin text-3xl" />
        </div>
      </AdminLayout>
    );
  if (error)
    return (
      <AdminLayout>
        <div className="text-center p-10 text-red-500">
          <FiAlertTriangle size={24} /> {error}
        </div>
      </AdminLayout>
    );
  if (!request || !request.user)
    return (
      <AdminLayout>
        <div>لم يتم العثور على الطلب أو بيانات المستخدم.</div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      {isViewerOpen && (
        <ImageViewer
          images={documents}
          startIndex={viewerStartIndex}
          onClose={() => setIsViewerOpen(false)}
        />
      )}

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-cyan-600 hover:underline mb-6"
      >
        <FiArrowRight /> العودة إلى القائمة
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          {/* --- بطاقة معلومات المستخدم --- */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-3">
              معلومات المستخدم
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <img
                src={request.user.avatar_url}
                alt={request.user.name}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
              <div className="space-y-2 text-center sm:text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {request.user.name}
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-500">
                  <FiMail />
                  <span>{request.user.email}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  {request.user.isVerified ? (
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-cyan-100 text-cyan-800 flex items-center gap-1">
                      <FiShield /> موثق
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-700 flex items-center gap-1">
                      غير موثق
                    </span>
                  )}
                  <Link
                    to={`/profile/${request.user.id}`}
                    className="text-xs text-cyan-600 hover:underline flex items-center gap-1"
                  >
                    عرض الملف الشخصي <FiExternalLink />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* --- بطاقة المستندات --- */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-3">
              المستندات المقدمة
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => {
                    setViewerStartIndex(index);
                    setIsViewerOpen(true);
                  }}
                  className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer text-left w-full"
                >
                  <div className="relative bg-gray-100 h-40 flex items-center justify-center">
                    <img
                      src={doc.url}
                      alt={doc.label}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all">
                      <FiEye className="text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <div className="p-3 bg-white">
                    <p className="text-sm font-semibold text-gray-800 text-center">
                      {doc.label}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- بطاقة اتخاذ القرار --- */}
        <div className="bg-white p-6 rounded-xl shadow-md h-fit sticky top-24">
          <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-3">
            اتخاذ القرار
          </h3>
          {request.status === "pending" ? (
            <>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                ملاحظات المراجع (إلزامي في حالة الرفض)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="5"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                placeholder="اكتب سبب الرفض أو أي ملاحظات أخرى..."
              ></textarea>
              <div className="mt-4 space-y-3">
                <button
                  onClick={() => handleDecision("approved")}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
                >
                  <FiCheck />{" "}
                  {isSubmitting ? "جاري الحفظ..." : "موافقة وتوثيق الحساب"}
                </button>
                <button
                  onClick={() => handleDecision("rejected")}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
                >
                  <FiX /> {isSubmitting ? "جاري الحفظ..." : "رفض الطلب"}
                </button>
              </div>
            </>
          ) : (
            <div className="mt-4 p-4 bg-gray-100 rounded-md text-center">
              <FiShield className="mx-auto text-3xl text-gray-500 mb-2" />
              <p className="font-semibold text-gray-700">
                تمت مراجعة هذا الطلب بالفعل
              </p>
              <p
                className={`text-sm font-bold mt-1 ${
                  request.status === "approved"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                الحالة: {request.status === "approved" ? "مقبول" : "مرفوض"}
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default VerificationDetailPage;
