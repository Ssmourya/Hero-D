// Role-based authorization middleware
const authorize = (roles = []) => {
  // If roles is a single string, convert to array
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    // Check if user exists and has a role
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource' });
    }

    // Check if user's role is in the allowed roles
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Your role does not have permission to perform this action' });
    }

    // User has required role, proceed
    next();
  };
};

module.exports = { authorize };
