
export const adminOnly = (req, res, next) => {
    try {
        // Check whether the authenticated user is an admin
        if (req.user && req.user.role === "admin") {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "Access denied. Admin privileges required."
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Authorization error"
        });
    }
};
