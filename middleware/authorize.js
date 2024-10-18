
module.exports = (roles) => {
    return (req, res, next) => {
        console.log(req.user.role);
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ status: 'error', message: 'Access denied' });
        }
        next();
    };
};
