import React from "react";
import PropTypes from "prop-types";

const PaymentMethods = ({ title, methods }) => (
  <div>
    <h3 className="text-cyan-600 text-lg mb-3 font-semibold">{title}</h3>
    <div className="flex flex-wrap gap-3">
      {methods.map((method) => (
        <a
          key={method.name}
          href={method.link}
          target="_blank"
          rel="noopener noreferrer"
          title={method.name}
        >
          <img
            src={method.image}
            alt={method.name}
            className="w-10 h-10 object-contain"
          />
        </a>
      ))}
    </div>
  </div>
);

PaymentMethods.propTypes = {
  title: PropTypes.string.isRequired,
  methods: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    })
  ).isRequired,
};
export default PaymentMethods;
