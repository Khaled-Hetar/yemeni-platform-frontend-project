import React from "react";
import PropTypes from "prop-types";
import AboutMeWidget from "../widgets/AboutMeWidget";
import VerificationWidget from "../widgets/VerificationWidget";
import CompletionWidget from "../widgets/CompletionWidget";

const OverviewTab = ({ profile, servicesCount, projectsCount, isOwner }) => {
  if (!profile) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
        {isOwner && <div className="h-48 bg-gray-200 rounded-lg"></div>}
        {isOwner && <div className="h-48 bg-gray-200 rounded-lg"></div>}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AboutMeWidget aboutYou={profile.aboutYou} />
      {isOwner && (
        <VerificationWidget
          verifications={profile.verifications || {}}
          isOwner={isOwner}
        />
      )}
      {isOwner && (
        <CompletionWidget
          profile={profile}
          servicesCount={servicesCount}
          projectsCount={projectsCount}
          isOwner={isOwner}
        />
      )}
    </div>
  );
};

OverviewTab.propTypes = {
  profile: PropTypes.shape({
    aboutYou: PropTypes.string,
    verifications: PropTypes.object,
  }),
  servicesCount: PropTypes.number,
  projectsCount: PropTypes.number,
  isOwner: PropTypes.bool,
};

export default OverviewTab;
