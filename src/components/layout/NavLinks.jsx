import React from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";

const NavLinks = ({ items, onItemClick = () => {}, isMobile = false }) => {
  const location = useLocation();

  const baseLinkClass =
    "block transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 rounded-md";

  const mobileLinkClass = "py-3 px-4 text-lg font-medium";
  const desktopLinkClass = "py-2 px-3 text-base font-semibold";

  return (
    <ul
      className={
        isMobile
          ? "flex flex-col gap-2 p-4"
          : "hidden lg:flex flex-row items-center gap-1"
      }
    >
      {items.map((item) => {
        const isActive = location.pathname === item.path;

        return (
          <li key={item.id}>
            <Link
              to={item.path}
              className={`
                ${baseLinkClass}
                ${isMobile ? mobileLinkClass : desktopLinkClass}
                ${
                  isActive
                    ? "text-sky-700 bg-sky-100"
                    : "text-neutral-700 hover:bg-gray-100"
                }
              `}
              onClick={onItemClick}
              aria-current={isActive ? "page" : undefined}
            >
              {item.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

NavLinks.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })
  ).isRequired,
  onItemClick: PropTypes.func,
  isMobile: PropTypes.bool,
};

export default NavLinks;
