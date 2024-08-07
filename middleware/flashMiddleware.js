module.exports = (req, res, next) => {
    res.locals.flash = req.flash();
    next();
};
