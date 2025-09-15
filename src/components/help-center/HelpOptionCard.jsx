import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const HelpOptionCard = ({
  to,
  onClick,
  icon,
  title,
  description,
  ariaLabel,
}) => {
  const cardContent = (
    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow hover:shadow-md transition-shadow duration-300 flex flex-col items-center min-h-[180px] text-center">
      <div className="text-cyan-600 text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2 text-neutral-800">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );

  if (to) {
    return (
      <Link to={to} aria-label={ariaLabel} title={description}>
        {cardContent}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left"
      aria-label={ariaLabel}
      title={description}
    >
      {cardContent}
    </button>
  );
};

HelpOptionCard.propTypes = {
  to: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string,
};

export default HelpOptionCard;
