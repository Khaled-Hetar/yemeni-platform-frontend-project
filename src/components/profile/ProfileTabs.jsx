import React from "react";
import PropTypes from "prop-types";

const TabButton = ({ children, isActive, onClick, controlsId }) => (
  <button
    onClick={onClick}
    className={`px-4 sm:px-6 py-3 text-sm sm:text-base font-semibold border-b-2 transition-colors duration-300 
      ${
        isActive
          ? "text-cyan-600 border-cyan-600"
          : "text-gray-500 border-transparent hover:text-cyan-500 hover:border-cyan-500"
      }`}
    role="tab"
    aria-selected={isActive}
    aria-controls={controlsId}
  >
    {children}
  </button>
);

TabButton.propTypes = {
  children: PropTypes.node.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  controlsId: PropTypes.string.isRequired,
};

const ProfileTabs = ({ activeTab, setActiveTab, counts }) => (
  <div className="bg-white p-2 rounded-xl shadow-md border border-gray-200">
    <div
      className="border-b border-gray-200 flex space-x-2 space-x-reverse"
      role="tablist"
      aria-label="أقسام ملف المستخدم"
    >
      <TabButton
        isActive={activeTab === "overview"}
        onClick={() => setActiveTab("overview")}
        controlsId="overview-panel"
      >
        نظرة عامة
      </TabButton>
      <TabButton
        isActive={activeTab === "services"}
        onClick={() => setActiveTab("services")}
        controlsId="services-panel"
      >
        الخدمات ({counts.services})
      </TabButton>
      <TabButton
        isActive={activeTab === "portfolio"}
        onClick={() => setActiveTab("portfolio")}
        controlsId="portfolio-panel"
      >
        معرض الأعمال ({counts.projects})
      </TabButton>
      <TabButton
        isActive={activeTab === "reviews"}
        onClick={() => setActiveTab("reviews")}
        controlsId="reviews-panel"
      >
        التقييمات ({counts.reviews})
      </TabButton>
    </div>
  </div>
);

ProfileTabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  counts: PropTypes.shape({
    services: PropTypes.number,
    projects: PropTypes.number,
    reviews: PropTypes.number,
  }).isRequired,
};

export default ProfileTabs;
