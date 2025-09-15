import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ProposalCard = ({ proposal }) => {
  if (!proposal?.user) {
    return (
      <div className="border rounded-lg p-4 bg-gray-50 animate-pulse">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            <div>
              <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-16"></div>
            </div>
          </div>
          <div className="text-left">
            <div className="h-5 bg-gray-300 rounded w-12 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-20"></div>
          </div>
        </div>
        <div className="h-10 bg-gray-300 rounded mt-3 pt-3 border-t"></div>
      </div>
    );
  }

  const userName =
    `${proposal.user.firstname || ""} ${proposal.user.lastname || ""}`.trim() ||
    "مستقل";

  return (
    <div className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex justify-between items-start">
        <Link
          to={`/profile/${proposal.user.id}`}
          className="flex items-center gap-3"
        >
          <img
            src={proposal.user.avatar_url}
            alt={userName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-neutral-800 hover:underline">
              {userName}
            </p>
            <p className="text-xs text-gray-500">
              {proposal.user.jobTitle || "مستقل"}
            </p>
          </div>
        </Link>
        <div className="text-left">
          <p className="font-bold text-green-600 text-lg">${proposal.price}</p>
          <p className="text-xs text-gray-500">في {proposal.duration} أيام</p>
        </div>
      </div>
      <p className="text-gray-700 mt-3 pt-3 border-t whitespace-pre-wrap">
        {proposal.message}
      </p>
    </div>
  );
};

ProposalCard.propTypes = {
  proposal: PropTypes.shape({
    user: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      firstname: PropTypes.string,
      lastname: PropTypes.string,
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
