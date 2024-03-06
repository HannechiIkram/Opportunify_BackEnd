
// middleware/accessControl.js

const accessControl = (requiredPermissions) => {
    return (req, res, next) => {
      const userPermissions = req.user.permissions; // Supposons que les permissions sont stockées dans req.user après l'authentification
  
      // Vérifie si l'utilisateur a les autorisations requises
      const hasPermission = requiredPermissions.every(permission => userPermissions.includes(permission));
  
      if (!hasPermission) {
        return res.status(403).json({ error: "You don't have permission to access this resource" });
      }
  
      // Si l'utilisateur a les autorisations requises, continuez
      next();
    };
  };
  
  module.exports = accessControl;
  