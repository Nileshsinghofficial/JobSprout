// middleware/flashMiddleware.js
module.exports = (req, res, next) => {
    res.locals.flash = req.cookies.flash || {};
    res.clearCookie('flash');

    req.flash = (type, message) => {
        const flash = req.cookies.flash || {};
        flash[type] = message;
        res.cookie('flash', flash, { httpOnly: true });
    };

    next();
};
