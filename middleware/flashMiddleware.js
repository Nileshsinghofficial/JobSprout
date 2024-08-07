module.exports = (req, res, next) => {
    if (!req.session.flash) {
        req.session.flash = {};
    }
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
};
