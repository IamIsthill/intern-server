/**
 * Middleware to validate user access based on their account type.
 *
 * @param {string} access - The required account type (e.g., "intern", "supervisor", "admin").
 * @returns {Function} Express middleware function that checks if the user has the required access.
 *
 * @example
 * // Allow only supervisors to access a route
 * app.get('/supervisor/dashboard', validateAccess('supervisor'), (req, res) => {
 *     res.send('Welcome, Supervisor!');
 * });
 */
export const validateAccess = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.accountType)) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    next();
  };
};
