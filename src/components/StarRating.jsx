import React, { useState } from "react";
import PropTypes from "prop-types";
import { FaStar } from "react-icons/fa";

const StarRating = ({ rating, onRatingChange, size = 40 }) => {
  const [hover, setHover] = useState(null);

  return (
    <div className="flex justify-center my-4" dir="rtl">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;

        return (
          <label key={ratingValue} title={`${ratingValue} نجوم`}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => onRatingChange(ratingValue)}
              className="hidden"
            />
            <FaStar
              className="cursor-pointer transition-colors duration-200"
              color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
              size={size}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
            />
          </label>
        );
      })}
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
  onRatingChange: PropTypes.func.isRequired,
  size: PropTypes.number,
};

export default StarRating;
