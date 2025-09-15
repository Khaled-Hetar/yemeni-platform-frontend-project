import React, { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// ==================================================================
// مكونات الأيقونات (لا تحتاج لتعديل)
// ==================================================================
const UploadIcon = () => (
  <svg
    className="w-8 h-8 text-gray-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 16v-4a4 4 0 014-4h10a4 4 0 014 4v4m-4-4l-4-4m-4 4l4-4"
    ></path>
  </svg>
);

const CameraIcon = () => (
  <svg
    className="w-5 h-5 ml-2"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
    ></path>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
    ></path>
  </svg>
);

// ==================================================================
// مكون CameraModal (النسخة النهائية والمصححة)
// ==================================================================
const CameraModal = ({ isOpen, onClose, onCapture }) => {
  const dialogRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  // Hook #1: للتحكم في فتح/إغلاق عنصر <dialog>
  useEffect(() => {
    const dialogNode = dialogRef.current;
    if (isOpen) {
      dialogNode?.showModal();
    } else {
      dialogNode?.close();
    }
  }, [isOpen]);

  // Hook #2: لتشغيل الكاميرا عند الفتح وتنظيفها عند الإغلاق
  useEffect(() => {
    if (!isOpen) {
      // التأكد من تنظيف الصورة الملتقطة عند الإغلاق
      setCapturedImage(null);
      return;
    }

    let mediaStream;
    const startCamera = async () => {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("لا يمكن الوصول إلى الكاميرا. يرجى التحقق من الأذونات.");
        onClose();
      }
    };

    startCamera();

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
      setStream(null);
    };
  }, [isOpen, onClose]);

  const handleCapture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      setCapturedImage(canvas.toDataURL("image/jpeg"));

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }
  }, [stream]);

  const handleConfirmCapture = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `capture-${Date.now()}.jpg`, {
            type: "image/jpeg",
          });
          onCapture(file);
          onClose();
        }
      }, "image/jpeg");
    }
  }, [onCapture, onClose]);

  const handleRetake = useCallback(() => {
    setCapturedImage(null);
    // لا حاجة لفعل أي شيء آخر، useEffect سيهتم بإعادة تشغيل الكاميرا
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="camera-modal-title"
      className="p-0 bg-transparent rounded-lg backdrop:bg-black backdrop:bg-opacity-75"
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-lg text-center">
        <h3 id="camera-modal-title" className="text-xl font-bold mb-4">
          {capturedImage ? "معاينة الصورة" : "التقط صورة"}
        </h3>
        <div className="relative mb-4 bg-gray-200 rounded-md overflow-hidden">
          {capturedImage ? (
            <img
              src={capturedImage}
              alt="الصورة الملتقطة"
              className="w-full h-auto"
            />
          ) : (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-auto"
              aria-label="بث مباشر من الكاميرا لالتقاط صورة"
            />
          )}
          <canvas
            ref={canvasRef}
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
          ></canvas>
        </div>
        <div className="flex justify-center gap-4">
          {capturedImage ? (
            <>
              <button
                type="button"
                onClick={handleConfirmCapture}
                className="bg-cyan-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-cyan-700 transition"
              >
                استخدام الصورة
              </button>
              <button
                type="button"
                onClick={handleRetake}
                className="bg-gray-300 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                إعادة الالتقاط
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleCapture}
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              التقاط
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            إلغاء
          </button>
        </div>
      </div>
    </dialog>
  );
};

CameraModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCapture: PropTypes.func.isRequired,
};

// ==================================================================
// مكون ImageUploadBox (النسخة النهائية والمصححة)
// ==================================================================
const ImageUploadBox = ({
  title,
  onFileSelect,
  file,
  onOpenCamera,
  acceptedFileTypes = "image/png, image/jpeg",
}) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const processFile = useCallback(
    (selectedFile) => {
      if (!selectedFile) return;

      const allowedTypes = acceptedFileTypes.split(",").map((t) => t.trim());
      if (!allowedTypes.includes(selectedFile.type)) {
        alert(
          `نوع الملف غير مدعوم. يرجى اختيار ملف من نوع: ${allowedTypes.join(
            ", "
          )}`
        );
        return;
      }
      onFileSelect(selectedFile);
    },
    [acceptedFileTypes, onFileSelect]
  );

  const handleFileChange = useCallback(
    (e) => {
      if (e.target?.files[0]) {
        processFile(e.target.files[0]);
      }
    },
    [processFile]
  );

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer?.files[0]) {
        processFile(e.dataTransfer.files[0]);
      }
    },
    [processFile]
  );

  const handleRemove = useCallback(() => {
    onFileSelect(null);
  }, [onFileSelect]);

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-4 text-center transition-all duration-300 ${
        isDragging ? "border-cyan-500 bg-cyan-50" : "border-gray-300"
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      role="group"
      aria-labelledby="upload-box-label"
    >
      {file && preview ? (
        <div className="flex flex-col items-center">
          <img
            src={preview}
            alt="معاينة"
            className="w-full max-h-40 object-contain rounded-lg mb-4"
          />
          <p className="text-sm text-gray-600 font-semibold truncate max-w-full">
            {file.name}
          </p>
          <div className="flex gap-4 mt-3">
            <button
              type="button"
              onClick={() => inputRef.current.click()}
              className="text-sm text-cyan-600 hover:underline"
            >
              تغيير الصورة
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="text-sm text-red-500 hover:underline"
            >
              إلغاء
            </button>
          </div>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={acceptedFileTypes}
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center py-4">
          <UploadIcon />
          <p className="font-semibold text-gray-600 mt-2">
            اسحب الملف إلى هنا، أو
          </p>
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={() => inputRef.current.click()}
              className="bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              رفع ملف
            </button>
            <button
              type="button"
              onClick={onOpenCamera}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center"
            >
              <CameraIcon />
              <span>الكاميرا</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">{title}</p>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={acceptedFileTypes}
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
};

ImageUploadBox.propTypes = {
  title: PropTypes.string.isRequired,
  onFileSelect: PropTypes.func.isRequired,
  file: PropTypes.object,
  onOpenCamera: PropTypes.func.isRequired,
  acceptedFileTypes: PropTypes.string,
};

// ==================================================================
// المكون الرئيسي للصفحة (النسخة النهائية والمصححة)
// ==================================================================
const VerifyIdentityPage = () => {
  const navigate = useNavigate();
  const [idFront, setIdFront] = useState(null);
  const [idBack, setIdBack] = useState(null);
  const [selfieWithId, setSelfieWithId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [activeCameraTarget, setActiveCameraTarget] = useState(null);

  const handleOpenCamera = useCallback((setter) => {
    setActiveCameraTarget(() => setter);
    setIsCameraOpen(true);
  }, []);

  const handleCapture = useCallback(
    (file) => {
      if (activeCameraTarget) {
        activeCameraTarget(file);
      }
      setIsCameraOpen(false);
    },
    [activeCameraTarget]
  );

  const handleCloseCamera = useCallback(() => {
    setIsCameraOpen(false);
  }, []);

  const isFormComplete = Boolean(idFront && idBack && selfieWithId);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!isFormComplete) {
        setError("الرجاء رفع جميع الصور المطلوبة.");
        return;
      }
      setLoading(true);
      setError("");

      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Submitting:", { idFront, idBack, selfieWithId });

      setLoading(false);
      alert("تم إرسال المستندات بنجاح! ستتم مراجعتها قريبًا.");
      navigate("/dashboard");
    },
    [idFront, idBack, selfieWithId, isFormComplete, navigate]
  );

  return (
    <>
      <CameraModal
        isOpen={isCameraOpen}
        onClose={handleCloseCamera}
        onCapture={handleCapture}
      />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                التحقق من الهوية
              </h1>
              <p className="text-gray-500 mt-2">
                لحماية حسابك، يرجى رفع المستندات التالية.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-600 text-white font-bold rounded-full flex items-center justify-center">
                  1
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg text-gray-700 mb-2">
                    صورة الوجه الأمامي للهوية
                  </h3>
                  <ImageUploadBox
                    title="بطاقة الهوية / جواز السفر"
                    file={idFront}
                    onFileSelect={setIdFront}
                    onOpenCamera={() => handleOpenCamera(setIdFront)}
                  />
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-600 text-white font-bold rounded-full flex items-center justify-center">
                  2
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg text-gray-700 mb-2">
                    صورة الوجه الخلفي للهوية
                  </h3>
                  <ImageUploadBox
                    title="بطاقة الهوية (الوجه الخلفي)"
                    file={idBack}
                    onFileSelect={setIdBack}
                    onOpenCamera={() => handleOpenCamera(setIdBack)}
                  />
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-600 text-white font-bold rounded-full flex items-center justify-center">
                  3
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg text-gray-700 mb-2">
                    صورة شخصية (سيلفي) مع الهوية
                  </h3>
                  <ImageUploadBox
                    title="صورة لك وأنت تحمل الهوية"
                    file={selfieWithId}
                    onFileSelect={setSelfieWithId}
                    onOpenCamera={() => handleOpenCamera(setSelfieWithId)}
                  />
                </div>
              </div>
              {error && (
                <p className="text-red-500 text-sm text-center font-semibold">
                  {error}
                </p>
              )}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={!isFormComplete || loading}
                  className="w-full bg-cyan-600 text-white py-3 rounded-lg text-lg font-semibold transition hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? "جاري الرفع..." : "إرسال للتحقق"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyIdentityPage;
