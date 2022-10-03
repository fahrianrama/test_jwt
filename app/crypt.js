const bcrypt = require('bcrypt')
var crypt = {}

crypt.createHash = function (data, successCallback, failureCallback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(data, salt, function (err, hash) {
            if (err) {
                failureCallback(err)
                return
            }
            successCallback(hash)
        });
      });
}

crypt.compareHash = function (password, encrypted, successCallback, failureCallback) {
    bcrypt.compare(password, encrypted, function (err, isMatch) {
        if (err) {
            failureCallback(err)
            return
        }
        successCallback(isMatch)
    });
}

module.exports = crypt