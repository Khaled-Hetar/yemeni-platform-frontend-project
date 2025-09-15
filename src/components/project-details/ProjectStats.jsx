import React from "react";
import PropTypes from "prop-types";
import { FaRegClock, FaDollarSign, FaUserTie } from "react-icons/fa";

const StatCard = ({ icon, label, value }) => (
  <div className="bg-sky-50 p-4 rounded-lg border border-sky-100">
    {icon}
    <p className="font-semibold text-neutral-700 mt-1">{label}</p>
    <p className="text-sm text-neutral-600">{value}</p>
  </div>
);

StatCard.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

const ProjectStats = ({ project }) => {
  if (!project) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center animate-pulse">
        <div className="bg-gray-200 h-24 rounded-lg"></div>
        <div className="bg-gray-200 h-24 rounded-lg"></div>
        <div className="bg-gray-200 h-24 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
      <StatCard
        icon={<FaDollarSign className="mx-auto text-2xl text-green-600 mb-1" />}
        label="الميزانية"
        value={`$${project.budget_min} - $${project.budget_max}`}
      />
      <StatCard
        icon={<FaRegClock className="mx-auto text-2xl text-red-600 mb-1" />}
        label="الموعد النهائي"
        value={new Date(project.deadline).toLocaleDateString("ar-EG")}
      />
      <StatCard
        icon={<FaUserTie className="mx-auto text-2xl text-blue-600 mb-1" />}
        label="العروض المقدمة"
        value={`${project.proposals_count || 0} عروض`}
      />
    </div>
  );
};

ProjectStats.propTypes = {
  project: PropTypes.shape({
    budget_min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    budget_max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    deadline: PropTypes.string,
    proposals_count: PropTypes.number,
  }),
};

export default ProjectStats;
