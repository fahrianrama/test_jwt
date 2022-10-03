const bcryptjs = require('bcryptjs')
var crypt = {}

crypt.createHash = function (data, successCallback, failureCallback) {
    bcryptjs.genSalt(10, function (err, salt) {
        bcryptjs.hash(data, salt, function (err, hash) {
            if (err) {
                failureCallback(err)
                return
            }
            successCallback(hash)
        });
      });
}

crypt.compareHash = function (password, encrypted, successCallback, failureCallback) {
    bcryptjs.compare(password, encrypted, function (err, isMatch) {
        if (err) {
            failureCallback(err)
            return
        }
        successCallback(isMatch)
    });
}

module.exports = crypt