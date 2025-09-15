import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
// import DisplayStars from "@/components/profile/DisplayStars";

const DEFAULT_AVATAR = "https://i.pravatar.cc/150?u=default";

const ReviewCard = ({ review }) => {
  if (!review?.reviewer) {
    return (
      <div className="border-b py-4 last:border-b-0 animate-pulse">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-300"></div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="h-5 bg-gray-300 rounded w-32"></div>
              <div className="h-4 bg-gray-300 rounded w-20"></div>
            </div>
            <div className="h-5 bg-gray-200 rounded w-24 my-2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const { reviewer, rating, comment, created_at } = review;

  return (
    <div className="border-b py-4 last:border-b-0">
      <div className="flex items-start gap-4">
        <Link to={`/profile/${reviewer.id}`}>
          <img
            src={reviewer.avatar_url || DEFAULT_AVATAR}
            alt={reviewer.name}
            className="w-12 h-12 rounded-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = DEFAULT_AVATAR;
            }}
          />
        </Link>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <Link to={`/profile/${reviewer.id}`}>
              <h4 className="font-semibold text-gray-800 hover:underline">
                {reviewer.name}
              </h4>
            </Link>
            <span className="text-xs text-gray-500">
              {new Date(created_at).toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="my-1">
            <DisplayStars rating={rating} />
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{comment}</p>
        </div>
      </div>
    </div>
  );
};

ReviewCard.propTypes = {
  review: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    rating: PropTypes.number.isRequired,
    comment: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    reviewer: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string,
      avatar_url: PropTypes.string,
    }),
  }).isRequired,
};

export default ReviewCard;
