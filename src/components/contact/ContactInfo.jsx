import React from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import PropTypes from "prop-types";

const InfoItem = ({ icon, title, children }) => (
  <div className="flex items-start gap-4">
    <div className="text-cyan-600 text-2xl mt-1 flex-shrink-0">{icon}</div>
    <div>
      <h3 className="font-semibold text-neutral-700 text-lg">{title}</h3>
      <div className="text-sm text-neutral-600">{children}</div>
    </div>
  </div>
);

InfoItem.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const ContactInfo = () => (
  <div className="space-y-8">
    <InfoItem icon={<FaPhoneAlt />} title="رقم الهاتف">
      <a href="tel:+96777000***" className="hover:underline" dir="ltr">
        +967 770 000 ***
      </a>
    </InfoItem>
    <InfoItem icon={<FaEnvelope />} title="البريد الإلكتروني">
      <a href="mailto:support@example.com" className="hover:underline">
        support@example.com
      </a>
    </InfoItem>
    <InfoItem icon={<FaMapMarkerAlt />} title="العنوان">
      <p>الحديدة، اليمن</p>
    </InfoItem>
  </div>
);

export default ContactInfo;
