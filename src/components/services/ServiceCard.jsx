import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const ServiceCard = ({ service }) => {
  // عرض حالة تحميل مبسطة إذا كانت البيانات غير متوفرة
  if (!service?.user) {
    return (
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden flex flex-col animate-pulse">
        <div className="w-full h-48 bg-gray-300"></div>
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-300"></div>
              <div className="h-4 bg-gray-300 rounded w-24"></div>
            </div>
            <div className="h-4 bg-gray-300 rounded w-12"></div>
          </div>
          <div className="h-10 bg-gray-300 rounded mb-4"></div>
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
            <div className="h-6 bg-gray-300 rounded w-16"></div>
            <div className="h-4 bg-gray-300 rounded w-20"></div>
          </div>
        </div>
      </div>
    );
  }

  const {
    id,
    title,
    price,
    main_image_url,
    user,
    average_rating = 0,
    reviews_count = 0,
  } = service;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden flex flex-col group"
    >
      <Link to={`/services/${id}`} className="block">
        <div className="relative">
          <img
            src={
              main_image_url ||
              "https://via.placeholder.com/400x250?text=No+Image"
            }
            alt={title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3">
          <Link
            to={`/profile/${user.id}`}
            className="flex items-center gap-2 min-w-0"
          >
            <img
              src={user.avatar_url || "https://via.placeholder.com/40?text=U"}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
            />
            <span className="text-sm font-medium text-gray-600 hover:text-cyan-600 transition-colors truncate">
              {user.name}
            </span>
          </Link>

          <div className="flex items-center gap-1 text-sm text-gray-500 flex-shrink-0">
            <FaStar className="text-yellow-400" />
            <span className="font-bold text-gray-700">
              {Number(average_rating).toFixed(1)}
            </span>
            <span className="hidden sm:inline">({reviews_count})</span>
          </div>
        </div>

        <Link to={`/services/${id}`} className="block flex-grow">
          <h3 className="text-md font-semibold text-gray-800 hover:text-cyan-700 transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <p className="text-lg font-bold text-cyan-600">
            ${Number(price).toFixed(2)}
          </p>
          <Link
            to={`/checkout/${id}`}
            className="text-sm font-semibold text-cyan-700 hover:underline"
          >
            اطلب الآن
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

ServiceCard.propTypes = {
  service: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    main_image_url: PropTypes.string,
    user: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string,
      avatar_url: PropTypes.string,
    }),
    average_rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    reviews_count: PropTypes.number,
  }),
};

export default ServiceCard;
