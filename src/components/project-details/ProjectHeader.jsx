import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ProjectHeader = ({ title, createdAt, user }) => {
  if (!title || !createdAt) {
    return (
      <header className="border-b pb-4 mb-6 animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      </header>
    );
  }

  const ownerName = user
    ? `${user.firstname || ""} ${user.lastname || ""}`.trim()
    : "صاحب المشروع";

  return (
    <header className="border-b pb-4 mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-neutral-800">{title}</h1>
        <p className="text-sm text-gray-500 mt-2">
          نُشر في: {new Date(createdAt).toLocaleDateString("ar-EG")}
        </p>
      </div>
      {user && (
        <Link
          to={`/profile/${user.id}`}
          className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition flex-shrink-0"
        >
          <img
            src={user.avatar_url}
            alt={ownerName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm text-gray-500">صاحب المشروع</p>
            <p className="font-semibold text-neutral-700">{ownerName}</p>
          </div>
        </Link>
      )}
    </header>
  );
};

ProjectHeader.propTypes = {
  title: PropTypes.string,
  createdAt: PropTypes.string,
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    avatar_url: PropTypes.string,
  }),
};

export default ProjectHeader;
