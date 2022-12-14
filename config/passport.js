const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const db = require('../controller/users')
const config = require('../config/main')

// Setup work and export for the JWT passport strategy
module.exports = function (passport) {
    var opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
        secretOrKey: config.secret
    }
    passport.use(new JwtStrategy(opts, function (jwt_payload, callback) {
        db.findUser({username: jwt_payload.username}, function (res) {
            var user = res
            delete user.password
            callback(null, user)
        }, function (err) {
            return callback(err, false)
        })
    }))
}
