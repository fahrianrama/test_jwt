const connection = require("../config/connection")
const crypt = require('../app/crypt')
const usersCtl = {}

usersCtl.getUsers = function(successCallback, failureCallback){
    let sqlQuery = "SELECT id,username,email,role FROM users"
    connection.query(sqlQuery, function (err, rows, fields, res) {
        if (rows.length > 0) {
            successCallback(rows)
        }else if(rows.length==0){
            failureCallback("no user")
        }else{
            failureCallback(err)
        }
    })
}

usersCtl.createUser = function (user, successCallback, failureCallback) {
    var sqlQuery = "SELECT * FROM users WHERE username = '" + user.username + "'"
    connection.query(sqlQuery, function (err, rows, fields, res) {
        if (rows.length > 0) {
            failureCallback(err)
        }
        else{
            var passwordHash
            crypt.createHash(user.password, function (res) {
                passwordHash = res
                connection.query("INSERT INTO users (username, email, password, role, create_at) VALUES (?,?,?,?,CURRENT_TIMESTAMP())",[user.username,user.email,passwordHash,user.role],
                    function (err, rows, fields, res) {
                        if (err) {
                            failureCallback(err)
                            return
                        }
                        successCallback()
                    })
            }, function (err) {
                failureCallback()
            })
        }
    })
}

usersCtl.findUser = function (user, successCallback, failureCallback) {
    var sqlQuery = "SELECT * FROM users WHERE username = '" + user.username + "'"
    connection.query(sqlQuery, function (err, rows, fields, res) {
        if (err) {
            failureCallback(err)
            return
        }
        if (rows.length > 0) {
            successCallback(rows[0])
        } else {
            failureCallback('User not found.')
        }
    })
}

usersCtl.updateUser = function (user, successCallback, failureCallback) {
    var passwordHash
    crypt.createHash(user.password, function (res) {
        passwordHash = res
        var sqlQuery = `UPDATE users set email = '${user.email}' , password = '${passwordHash}', role = '${user.role}' WHERE username = '${user.username}'`
        connection.query(sqlQuery, function (err, rows, fields, res) {
            if (err) {
                failureCallback(err)
                return
            }else {
                successCallback()
            }
        })
    }, function (err) {
        failureCallback()
    })
}

usersCtl.deleteUser = function (user, successCallback, failureCallback){
    var sqlQuery = `DELETE FROM users WHERE username = '${user.username}'`
    connection.query(sqlQuery, function (err, rows, fields, res) {
        if (err) {
            failureCallback(err)
            return
        }else {
            successCallback()
        }
    })
}

module.exports = usersCtl