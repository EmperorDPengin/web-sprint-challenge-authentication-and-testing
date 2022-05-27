const bodySchema = require('./auth-yupSchema');
const Users = require('../users/users-model');

function checkBodyContent(req, res, next) {
    bodySchema.validate(req.body, {
        strict: true,
        stripUnknown: true,
    })
    .then( validated => {
        req.body = validated;
        next();
    })
    .catch(err => {
        next({status: 422, message: err.message})
    })
}

function checkUniqueUsername(req, res, next) {
    const {username} = req.body;

    Users.findBy({username})
        .then( userFound => {
            if (userFound.length > 0) {
                next({status: 422, message: 'username taken'})
                return;
            }

            next();
        })
}

function checkUsernameExists(req, res, next) {
    const {username} = req.body;

    Users.findBy({username}).first()
        .then( userFound => {
            if (!userFound) {
                next({status: 401, message: 'invalid credentials'})
                return;
            }
            req.body.user = userFound;
            next();
        })
        .catch(next)
}

module.exports = {
    checkBodyContent,
    checkUniqueUsername,
    checkUsernameExists
}