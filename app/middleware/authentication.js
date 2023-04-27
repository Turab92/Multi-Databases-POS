module.exports = function(req, res, next) {
    if(!req.cookies['auth-token']) {
        return res.redirect('/login');
    }
return next();
};