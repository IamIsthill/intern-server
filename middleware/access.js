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
export const validateAccess = (access) => {
    return async (req, res, next) => {
        if (req.user.accountType !== access) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        next();
    };
};
