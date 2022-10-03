const crypt = require('../app/crypt')
const connection = require("../config/connection")
const clientsCtl = {}

clientsCtl.getClients = function(successCallback, failureCallback){
    let sqlQuery = "SELECT * FROM clients"
    connection.query(sqlQuery, function (err, rows, fields, res) {
        if (rows.length > 0) {
            successCallback(rows)
        }else if(rows.length==0){
            failureCallback("no client")
        }else{
            failureCallback(err)
        }
    })
}

clientsCtl.findClients = function (client, successCallback, failureCallback) {
    connection.query("SELECT id FROM users WHERE username = '" + client.username + "'", function (err, rows, fields, res) {
        if(rows.length>0){
            connection.query("SELECT * FROM clients WHERE user_id = '" + rows[0].id + "'", function (err, rows2, fields, res) {
                if(rows2.length>0){
                    var sqlQuery = "SELECT * FROM clients WHERE user_id = '" + rows[0].id + "'"
                    connection.query(sqlQuery, function (err, rows4, fields, res) {
                        if (rows4.length > 0) {
                            successCallback(rows4[0])
                        } else {
                            failureCallback(err)
                            return
                        }
                    })
                }else{
                    connection.query("INSERT INTO clients (user_id,client_name) VALUES (?,?)",[rows[0].id,"default"], function (err, rows4, fields, res) {
                        var sqlQuery = "SELECT * FROM clients WHERE user_id = '" + rows[0].id + "'"
                        connection.query(sqlQuery, function (err, rows3, fields, res) {
                            if (rows3.length > 0) {
                                successCallback(rows3[0])
                            } else {
                                failureCallback(err)
                                return
                            }
                        })
                    })
                }
            })
        }else{
            failureCallback(err)
        }
    })
}

clientsCtl.updateClients = function (client, successCallback, failureCallback) {
    var sqlQuery = `UPDATE clients set client_name= '${client.client_name}' WHERE user_id = '${client.user_id}'`
    connection.query(sqlQuery, function (err, rows, fields, res) {
        if (err) {
            failureCallback(err)
            return
        }else {
            successCallback()
        }
    })
}

clientsCtl.deleteClients = function (client, successCallback, failureCallback) {
    var sqlQuery = `DELETE FROM clients WHERE user_id = '${client.user_id}'`
    connection.query(sqlQuery, function (err, rows, fields, res) {
        if (err) {
            failureCallback(err)
            return
        }else {
            successCallback()
        }
    })
}

module.exports = clientsCtl
