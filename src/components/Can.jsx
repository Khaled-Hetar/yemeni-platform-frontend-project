import { useAuth } from "../context/AuthContext";
import PropTypes from "prop-types";

const Can = ({ perform, children }) => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  if (user.role === "super-admin") {
    return <>{children}</>;
  }

  if (!user.permissions) {
    return null;
  }

  if (user.permissions.includes(perform)) {
    return <>{children}</>;
  }

  return null;
};

Can.propTypes = {
  perform: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
export default Can;
