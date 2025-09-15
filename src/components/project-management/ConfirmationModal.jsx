import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { AnimatePresence } from "framer-motion";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "تأكيد",
  cancelText = "إلغاء",
  isLoading = false,
}) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialogNode = dialogRef.current;
    if (isOpen) {
      dialogNode?.showModal();
    } else {
      dialogNode?.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialogNode = dialogRef.current;
    const handleClickOutside = (event) => {
      if (dialogNode && event.target === dialogNode) {
        onClose();
      }
    };
    dialogNode?.addEventListener("click", handleClickOutside);
    return () => {
      dialogNode?.removeEventListener("click", handleClickOutside);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.dialog
          ref={dialogRef}
          onClose={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="p-0 bg-transparent rounded-xl backdrop:bg-black/40 backdrop:backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl p-6 max-w-sm w-full text-center shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              {title}
            </h3>
            <p className="text-sm text-gray-600 mb-6">{message}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition disabled:opacity-50"
              >
                {isLoading ? "لحظة..." : confirmText}
              </button>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 transition"
              >
                {cancelText}
              </button>
            </div>
          </motion.div>
        </motion.dialog>
      )}
    </AnimatePresence>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  isLoading: PropTypes.bool,
};

export default ConfirmationModal;
