import React from "react";
import PropTypes from "prop-types";

const ReviewHeader = ({ project, freelancer }) => (
  <header className="text-center">
    <h1 className="text-2xl font-bold text-sky-700">تقييم الخدمة المقدمة</h1>
    <p className="text-gray-600 mt-2">
      لقد أكملت مشروع <span className="font-semibold">"{project.title}"</span>.
      ما هو تقييمك للمستقل{" "}
      <span className="font-semibold">{freelancer.name}</span>؟
    </p>
  </header>
);

ReviewHeader.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string,
  }),
  freelancer: PropTypes.shape({
    name: PropTypes.string,
  }),
};

export default ReviewHeader;
