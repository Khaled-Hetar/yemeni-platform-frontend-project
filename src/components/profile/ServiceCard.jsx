import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ServiceCard = ({ service }) => {
  if (!service) {
    return (
      <div className="border rounded-lg p-4 animate-pulse">
        <div className="w-full h-36 bg-gray-300 rounded-md mb-3"></div>
        <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-6 bg-gray-300 rounded w-1/4"></div>
      </div>
    );
  }

  return (
    <Link
      to={`/services/${service.id}`}
      className="border rounded-lg p-4 hover:shadow-md transition-shadow block group bg-white"
    >
      <div className="w-full h-36 overflow-hidden rounded-md mb-3">
        <img
          src={
            service.main_image_url ||
            "https://via.placeholder.com/400x225?text=No+Image"
          }
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h4 className="font-semibold text-gray-800 truncate group-hover:text-sky-600 transition-colors">
        {service.title}
      </h4>
      <p className="text-sm text-green-600 font-bold mt-1">
        ${Number(service.price).toFixed(2)}
      </p>
    </Link>
  );
};

ServiceCard.propTypes = {
  service: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    main_image_url: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }),
};

export default ServiceCard;
