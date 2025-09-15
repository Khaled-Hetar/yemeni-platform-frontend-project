import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ProposalCard from "./ProposalCard";

const ProjectActions = ({ project, isOwner }) => {
  if (!project) {
    return (
      <div className="pt-6 animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
        <div className="h-24 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="pt-6">
      {isOwner ? (
        <>
          <h2 className="text-xl font-semibold text-neutral-700 mb-4">
            العروض المستلمة ({project.proposals_count || 0})
          </h2>
          {project.proposals && project.proposals.length > 0 ? (
            <div className="space-y-4">
              {project.proposals.map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
              لم يتم تقديم أي عروض لهذا المشروع بعد.
            </p>
          )}
        </>
      ) : (
        <div className="text-center pt-6">
          <Link
            to={`/submit-proposal/${project.id}`}
            className="bg-sky-600 text-white font-bold py-3 px-10 rounded-full hover:bg-sky-700 transition-transform transform hover:scale-105 inline-block"
          >
            تقديم عرض الآن
          </Link>
        </div>
      )}
    </div>
  );
};

ProjectActions.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    proposals: PropTypes.array,
    proposals_count: PropTypes.number,
  }),
  isOwner: PropTypes.bool,
};

export default ProjectActions;
