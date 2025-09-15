import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiUploadCloud,
  FiTrash2,
  FiCamera,
  FiLoader,
  FiArrowLeft,
} from "react-icons/fi";
import apiClient from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";

const ServiceFormPage = () => {
  const { serviceId } = useParams();
  const isEditMode = Boolean(serviceId);

  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ type: "", message: "" });

  const IMGBB_API_KEY = "1618b416ecb7d8e496e4d5d459e47cae";

  const fetchServiceData = useCallback(async () => {
    if (!isEditMode) return;
    setLoading(true);
    try {
      const response = await apiClient.get(`/services/${serviceId}`);
      const service = response.data;

      setServiceName(service.title || "");
      setPrice(service.price || "");
      setDescription(service.description || "");
      setSelectedCategory(service.category_name || "");
      setSelectedSubCategory(service.subcategory_name || "");

      if (service.main_image_url) {
        setMainImagePreview(service.main_image_url);
      }
      if (
        service.gallery_images_urls &&
        Array.isArray(service.gallery_images_urls)
      ) {
        setGalleryImages(
          service.gallery_images_urls.map((url) => ({
            preview: url,
            isUploaded: true,
          }))
        );
      }
    } catch (err) {
      setNotification({
        type: "error",
        message: "فشل في تحميل بيانات الخدمة.",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [serviceId, isEditMode]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (isEditMode) {
      fetchServiceData();
    }
  }, [isAuthenticated, navigate, isEditMode, fetchServiceData]);

  const categories = {
    تصميم: [
      "تصميم شعار",
      "تصميم واجهات",
      "تصميم جرافيك",
      "تصميم هوية بصرية",
      "تصميم إعلانات",
      "تصميم سوشيال ميديا",
      "تصميم عروض تقديمية",
      "تصميم مطبوعات",
      "تصميم تيشرتات ومنتجات",
      "تصميم 3D",
      "تصميم موشن جرافيك",
      "تصميم داخلي وديكور",
      "تصميم ألعاب",
      "تصوير فوتوغرافي",
      "مونتاج فيديو",
      "تحرير صور",
    ],
    برمجة: [
      "برمجة مواقع",
      "برمجة تطبيقات",
      "برمجة ألعاب",
      "تطوير برمجيات مخصصة",
      "أنظمة إدارة المحتوى (WordPress, Joomla)",
      "برمجة واجهات برمجية (APIs)",
      "تطوير متاجر إلكترونية",
      "تطوير تطبيقات جوال (Android, iOS)",
      "الذكاء الاصطناعي وتعلم الآلة",
      "الأمن السيبراني",
      "البلوك تشين والعملات الرقمية",
      "اختبار البرمجيات (QA)",
      "DevOps",
      "الحوسبة السحابية (AWS, Azure, GCP)",
      "تحليل البيانات والذكاء الاصطناعي",
      "الأتمتة والروبوتات البرمجية (RPA)",
    ],
    تسويق: [
      "تحسين محركات البحث (SEO)",
      "إعلانات ممولة (Google, Facebook, TikTok)",
      "التسويق عبر البريد الإلكتروني",
      "التسويق بالمحتوى",
      "إدارة حسابات السوشيال ميديا",
      "إعلانات الفيديو",
      "التسويق عبر المؤثرين",
      "أبحاث السوق",
      "إدارة المتاجر الإلكترونية",
      "تحليل حملات تسويقية",
      "العلاقات العامة",
      "إدارة الحملات الإعلانية",
    ],
    "كتابة وترجمة": [
      "كتابة مقالات",
      "ترجمة نصوص",
      "كتابة محتوى إبداعي",
      "كتابة سيناريو",
      "كتابة إعلانات (Copywriting)",
      "تدقيق لغوي",
      "ترجمة فورية",
      "ترجمة تقنية",
      "ترجمة قانونية",
      "مدونات وتدوين",
      "كتابة كتب إلكترونية",
      "كتابة أبحاث وتقارير",
    ],
    "تعليم وتدريب": [
      "تدريس خصوصي",
      "إعداد دورات",
      "كورسات أونلاين",
      "تدريب برمجة",
      "تدريب لغات",
      "إعداد عروض تعليمية",
      "تنمية بشرية وتطوير الذات",
      "إعداد اختبارات ومناهج",
    ],
    "إدارة وأعمال": [
      "إدارة مشاريع",
      "إدارة موارد بشرية",
      "مساعد إداري",
      "إدخال بيانات",
      "خدمة عملاء",
      "إدارة بريد إلكتروني",
      "إدارة مهام وجدولة",
      "الاستشارات الإدارية",
      "إدارة فعاليات",
    ],
    "محاسبة ومالية": [
      "محاسبة مالية",
      "تدقيق حسابات",
      "إعداد تقارير مالية",
      "تحليل مالي",
      "استشارات استثمارية",
      "إدارة ضرائب",
      "إدارة ميزانيات",
    ],
    قانون: [
      "صياغة عقود",
      "استشارات قانونية",
      "إعداد لوائح قانونية",
      "ترجمة قانونية",
      "أبحاث قانونية",
    ],
    صحة: [
      "استشارات تغذية",
      "متابعة صحية",
      "خدمات تمريض عن بعد",
      "إعداد خطط غذائية",
      "دعم نفسي",
      "تدريب لياقة بدنية",
    ],
    "فن وموسيقى": [
      "تأليف موسيقي",
      "تلحين",
      "منتج صوتي",
      "تعليق صوتي",
      "بودكاست",
      "أداء صوتي (Voice Over)",
    ],
    "خدمات أخرى": [
      "إدارة لوجستيات",
      "تنظيم فعاليات",
      "مساعد شخصي",
      "أبحاث",
      "تخطيط سفر",
      "كتابة سيرة ذاتية",
      "إدخال بيانات بسيطة",
    ],
  };

  const MAX_GALLERY_IMAGES = 15;
  const MAX_FILE_SIZE_MB = 7;
  const MIN_DESCRIPTION_LENGTH = 100;
  const MAX_DESCRIPTION_LENGTH = 2000;

  const handleImageValidation = (file) => {
    if (!file.type.startsWith("image/"))
      return "يجب أن يكون الملف المرفوع صورة.";
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024)
      return `يجب أن يكون حجم الصورة أقل من ${MAX_FILE_SIZE_MB} ميجابايت.`;
    return null;
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const error = handleImageValidation(file);
      if (error) {
        setErrors((prev) => ({ ...prev, mainImage: error }));
        return;
      }
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, mainImage: null }));
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (galleryImages.length + files.length > MAX_GALLERY_IMAGES) {
      setErrors((prev) => ({
        ...prev,
        galleryImages: `لا يمكن إضافة أكثر من ${MAX_GALLERY_IMAGES} صور للمعرض.`,
      }));
      return;
    }
    const validFiles = [];
    for (const file of files) {
      const error = handleImageValidation(file);
      if (error) {
        setErrors((prev) => ({ ...prev, galleryImages: error }));
        return;
      }
      validFiles.push({
        file,
        preview: URL.createObjectURL(file),
        isUploaded: false,
      });
    }
    setGalleryImages((prev) => [...prev, ...validFiles]);
    setErrors((prev) => ({ ...prev, galleryImages: null }));
  };

  const handleRemoveGalleryImage = (index) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!serviceName.trim()) newErrors.serviceName = "اسم الخدمة مطلوب.";
    if (!selectedCategory) newErrors.category = "يجب اختيار القسم الرئيسي.";
    if (!selectedSubCategory)
      newErrors.subCategory = "يجب اختيار القسم الفرعي.";
    if (!price) newErrors.price = "السعر مطلوب.";
    if (description.trim().length < MIN_DESCRIPTION_LENGTH)
      newErrors.description = `الوصف يجب أن يكون ${MIN_DESCRIPTION_LENGTH} حرف على الأقل.`;
    if (!mainImagePreview) newErrors.mainImage = "الصورة الرئيسية مطلوبة.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setNotification({ type: "", message: "" });
    setErrors({});

    try {
      let mainImageUrl = mainImagePreview;
      if (mainImage instanceof File) {
        const mainImageData = new FormData();
        mainImageData.append("image", mainImage);
        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
          { method: "POST", body: mainImageData }
        );
        const json = await res.json();
        if (!json.success) throw new Error("فشل رفع الصورة الرئيسية.");
        mainImageUrl = json.data.url;
      }

      const galleryImageUrls = await Promise.all(
        galleryImages.map(async (img) => {
          if (img.isUploaded) return img.preview;
          const galleryImageData = new FormData();
          galleryImageData.append("image", img.file);
          const res = await fetch(
            `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
            { method: "POST", body: galleryImageData }
          );
          const json = await res.json();
          if (!json.success) throw new Error("فشل رفع إحدى صور المعرض.");
          return json.data.url;
        })
      );

      const servicePayload = {
        title: serviceName,
        category_name: selectedCategory,
        subcategory_name: selectedSubCategory,
        price: parseFloat(price),
        description: description,
        main_image_url: mainImageUrl,
        gallery_images_urls: galleryImageUrls,
        userId: user.id,
      };

      if (isEditMode) {
        await apiClient.patch(`/services/${serviceId}`, servicePayload);
        setNotification({ type: "success", message: "تم تعديل خدمتك بنجاح!" });
      } else {
        await apiClient.post("/services", servicePayload);
        setNotification({ type: "success", message: "تم نشر خدمتك بنجاح!" });
      }

      setTimeout(() => navigate("/service-management"), 1500);
    } catch (error) {
      console.error("فشل في حفظ الخدمة:", error);
      setNotification({
        type: "error",
        message: error.message || "حدث خطأ أثناء حفظ الخدمة.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderError = (fieldName) =>
    errors[fieldName] && (
      <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
    );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FiLoader className="animate-spin text-sky-600 text-4xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 my-8">
      <header className="mb-6">
        <button
          onClick={() => navigate("/service-management")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-4"
        >
          <FiArrowLeft /> العودة إلى إدارة الخدمات
        </button>
        <h2 className="text-2xl font-bold text-sky-700 mb-6 text-center">
          {isEditMode ? "تعديل الخدمة" : "إضافة خدمة جديدة"}
        </h2>
      </header>

      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <label
              htmlFor="serviceName"
              className="block mb-1 text-sm text-neutral-700 font-medium"
            >
              اسم الخدمة:
            </label>
            <input
              type="text"
              id="serviceName"
              name="serviceName"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className={`w-full border rounded-lg p-2 focus:outline-none ${
                errors.serviceName
                  ? "border-red-500"
                  : "border-gray-300 focus:border-cyan-500"
              }`}
              placeholder="مثلاً: تصميم شعار احترافي"
            />
            {renderError("serviceName")}
          </div>

          <div>
            <label
              htmlFor="price"
              className="block mb-1 text-sm text-neutral-700 font-medium"
            >
              السعر (بالريال اليمني):
            </label>
            <input
              type="number"
              id="price"
              name="price"
              placeholder="مثلاً: 1000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={`w-full border rounded-lg p-2 focus:outline-none ${
                errors.price
                  ? "border-red-500"
                  : "border-gray-300 focus:border-cyan-500"
              }`}
            />
            {renderError("price")}
          </div>

          <div>
            <label
              htmlFor="category"
              className="block mb-1 text-sm text-neutral-700 font-medium"
            >
              القسم:
            </label>
            <select
              id="category"
              name="category"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubCategory("");
              }}
              className={`w-full border rounded-lg p-2 focus:outline-none ${
                errors.category
                  ? "border-red-500"
                  : "border-gray-300 focus:border-cyan-500"
              }`}
            >
              <option value="" disabled>
                اختر القسم
              </option>
              {Object.keys(categories).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {renderError("category")}
          </div>

          <div>
            <label
              htmlFor="subCategory"
              className="block mb-1 text-sm text-neutral-700 font-medium"
            >
              القسم الفرعي:
            </label>
            <select
              id="subCategory"
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              className={`w-full border rounded-lg p-2 focus:outline-none ${
                errors.subCategory
                  ? "border-red-500"
                  : "border-gray-300 focus:border-cyan-500"
              }`}
              disabled={!selectedCategory}
            >
              <option value="" disabled>
                اختر قسماً فرعياً
              </option>
              {categories[selectedCategory]?.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
            {renderError("subCategory")}
          </div>
        </div>

        <div className="space-y-6">
          <label
            htmlFor="description"
            className="block mb-1 text-sm text-neutral-700 font-medium"
          >
            وصف الخدمة:
          </label>
          <textarea
            id="description"
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={`اكتب وصفاً مفصلاً عن خدمتك (${MIN_DESCRIPTION_LENGTH} حرف على الأقل)`}
            maxLength={MAX_DESCRIPTION_LENGTH}
            className={`w-full border resize-none rounded-lg p-2 focus:outline-none ${
              errors.description
                ? "border-red-500"
                : "border-gray-300 focus:border-cyan-500"
            }`}
          ></textarea>

          <div className="flex justify-between items-start mt-1">
            <div className="flex-grow">{renderError("description")}</div>
            <p
              className={`text-xs flex-shrink-0 ${
                description.length > MAX_DESCRIPTION_LENGTH
                  ? "text-red-500"
                  : "text-gray-400"
              }`}
            >
              {description.length} / {MAX_DESCRIPTION_LENGTH}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-sm text-neutral-700 font-medium">
              الصورة الرئيسية للخدمة:
            </label>
            <div
              className={`relative w-full h-96 border-2 ${
                errors.mainImage ? "border-red-500" : "border-gray-300"
              } border-dashed rounded-lg flex items-center justify-center text-center`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="main-image-upload"
              />
              {mainImagePreview ? (
                <img
                  src={mainImagePreview}
                  alt="Main Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-gray-500">
                  <FiUploadCloud className="mx-auto text-4xl mb-2" />
                  <p>اسحب وأفلت الصورة هنا، أو انقر للاختيار</p>
                </div>
              )}
            </div>
            {renderError("mainImage")}
          </div>

          <div>
            <label className="block mb-2 text-sm text-neutral-700 font-medium">
              معرض الصور (اختياري، بحد أقصى {MAX_GALLERY_IMAGES}):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {galleryImages.map((img, i) => (
                <div key={i} className="relative group aspect-square">
                  <img
                    src={img.preview}
                    alt={`gallery-${i}`}
                    className="w-full h-full object-cover rounded-md border-2 border-gray-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(i)}
                      className="text-white text-2xl hover:text-red-500 transition-colors"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
              {galleryImages.length < MAX_GALLERY_IMAGES && (
                <label
                  htmlFor="gallery-upload"
                  className="relative aspect-square border-2 border-gray-300 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <FiCamera className="text-3xl mb-1" />
                  <span className="text-xs text-center">إضافة صورة</span>
                  <input
                    type="file"
                    id="gallery-upload"
                    name="gallery-upload"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryChange}
                    className="absolute inset-0 w-full h-full opacity-0"
                  />
                </label>
              )}
            </div>
            {renderError("galleryImages")}
          </div>
        </div>

        <div className="space-y-4 pt-4">
          {notification.message && (
            <div
              className={`p-3 rounded-md text-center text-sm font-semibold ${
                notification.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {notification.message}
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 text-white font-semibold rounded-full bg-gradient-to-r from-blue-700 via-cyan-600 to-cyan-200 hover:opacity-90 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? isEditMode
                ? "جاري حفظ التعديلات..."
                : "جارٍ نشر الخدمة..."
              : isEditMode
              ? "حفظ التعديلات"
              : "إضافة الخدمة"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceFormPage;
