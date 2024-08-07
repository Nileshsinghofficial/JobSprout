// middleware/flashMiddleware.js
module.exports = (req, res, next) => {
    if (!req.flash) {
        req.flash = {
            success_msg: '',
            error_msg: ''
        };
    }
    res.locals.flash = req.flash;
    next();
};
