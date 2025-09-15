import React, { useEffect } from "react"; // 1. استيراد useEffect
import PropTypes from "prop-types"; // 5. استيراد PropTypes
import { Link } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { FiBookOpen } from "react-icons/fi";
import NavLinks from "./NavLinks";
import AuthButtons from "./AuthButtons";

const MobileMenu = ({ isOpen, onClose, navItems, authProps }) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 visible bg-black/20" : "opacity-0 invisible"
        }`}
        aria-hidden="true" 
      />
      <div
        id="sidebar-menu"
        className={`fixed top-0 right-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 md:hidden shadow-xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="القائمة الجانبية"
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <Link
            to="/"
            className="text-lg font-semibold text-sky-700 flex items-center gap-x-2"
            onClick={onClose}
          >
            <FiBookOpen size={24} /> <span>المنصة اليمنية</span>
          </Link>
          <button
            onClick={onClose}
            className="text-neutral-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded"
            aria-label="إغلاق القائمة"
          >
            <IoMdClose size={24} />
          </button>
        </div>
        <NavLinks items={navItems} onItemClick={onClose} isMobile={true} />
        <div className="absolute bottom-0 left-0 w-full p-4 border-t">
          <AuthButtons {...authProps} isMobile={true} />
        </div>
      </div>
    </>
  );
};

MobileMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  navItems: PropTypes.array.isRequired,
  authProps: PropTypes.object.isRequired,
};

export default MobileMenu;
