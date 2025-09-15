import React from "react";
import ReviewCard from "../profile/ReviewCard";
import PropTypes from "prop-types";

const ReviewsSection = ({ reviews }) => (
  <div className="mt-10">
    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
      التقييمات
    </h2>
    {reviews && reviews.length > 0 ? (
      <div className="space-y-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    ) : (
      <p className="text-gray-500">لا توجد تقييمات لهذه الخدمة بعد.</p>
    )}
  </div>
);

ReviewsSection.propTypes = {
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ),
};
export default ReviewsSection;
