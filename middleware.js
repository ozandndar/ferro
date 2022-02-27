const { makeSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/');
    }
    if(req.user.isActive === false){
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must activate your account first!');
        return res.redirect('/');
    }

    next();
}

const validateMake = (req, res, next) => {
    const { error } = makeSchema.validate(req.body);
    console.log(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports = {
    isLoggedIn,
    validateMake
}