const accessControl = (requiredRoles) => {
  return (req, res, next) => {
      // Ensure req.user exists (set by authMiddleware) and retrieve the user's role
      const userRole = req.user && req.user.role;

      // Check if the user's role matches any of the required roles
      const hasRole = userRole && requiredRoles.includes(userRole);

      if (!hasRole) {
          // User does not have the required role, return a 403 Forbidden error
          return res.status(403).json({ error: "You don't have permission to access this resource" });
      }

      // User has the required role, proceed to the next middleware or route handler
      next();
  };
};

module.exports = accessControl;
