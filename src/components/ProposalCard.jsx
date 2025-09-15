import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FiMessageSquare } from "react-icons/fi";

const ProposalCard = ({ proposal }) => {
  if (!proposal?.user) {
    return (
      <div className="bg-white border rounded-lg p-4 animate-pulse">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-300"></div>
            <div>
              <div className="h-5 bg-gray-300 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
          <div className="text-left flex-shrink-0">
            <div className="h-6 bg-gray-300 rounded w-16 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-20"></div>
          </div>
        </div>
        <div className="h-16 bg-gray-200 rounded my-4"></div>
        <div className="flex items-center gap-3 border-t pt-3">
          <div className="flex-1 h-10 bg-gray-300 rounded-lg"></div>
          <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={
              proposal.user.avatar_url ||
              `https://i.pravatar.cc/150?u=${proposal.user.email}`
            }
            alt={proposal.user.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <Link
              to={`/profile/${proposal.user.id}`}
              className="font-bold text-gray-800 hover:text-sky-600 transition-colors"
            >
              {proposal.user.name}
            </Link>
            <p className="text-sm text-gray-500">
              {proposal.user.jobTitle || "مستقل محترف"}
            </p>
          </div>
        </div>

        <div className="text-left flex-shrink-0">
          <p className="font-bold text-green-600 text-lg">
            ${Number(proposal.price).toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">{proposal.duration} أيام</p>
        </div>
      </div>

      <p className="text-gray-700 my-4 leading-relaxed line-clamp-4">
        {proposal.message}
      </p>

      <div className="flex items-center gap-3 border-t pt-3">
        <button
          type="button"
          className="flex-1 bg-sky-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-sky-700 transition"
        >
          قبول العرض
        </button>
        <button
          type="button"
          className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-2"
        >
          <FiMessageSquare />
          مراسلة
        </button>
      </div>
    </div>
  );
};

ProposalCard.propTypes = {
  proposal: PropTypes.shape({
    user: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      email: PropTypes.string,
      name: PropTypes.string,
      avatar_url: PropTypes.string,
      jobTitle: PropTypes.string,
    }),
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    message: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProposalCard;
