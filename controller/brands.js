const connection = require("../config/connection")
const brandsCtl = {}

brandsCtl.getBrands = function(successCallback, failureCallback){
    let sqlQuery = "SELECT brands.id, brands.client_id, clients.client_name, brands.brand_name, brands.brand_desc FROM brands JOIN clients ON brands.client_id = clients.id"
    connection.query(sqlQuery, function (err, rows, fields, res) {
        if (rows.length > 0) {
            successCallback(rows)
        }else if(rows.length==0){
            failureCallback("no brands")
        }else{
            failureCallback(err)
        }
    })
}
brandsCtl.findBrands = function (client, successCallback, failureCallback) {
    var sqlQuery = "SELECT * FROM brands WHERE client_id = '" + client.client_id + "'"
    connection.query(sqlQuery, function (err, rows, fields, res) {
        if (err) {
            failureCallback(err)
            return
        }
        if (rows.length > 0) {
            successCallback(rows)
        } else {
            failureCallback('Brands not found.')
        }
    })
}

brandsCtl.storeBrands = function (data, successCallback, failureCallback){
    connection.query("INSERT INTO brands (client_id,brand_name,brand_desc) VALUES (?,?,?)",[data.client_id,data.brand_name,data.brand_desc], function(err,rows){
        if (err) {
            failureCallback(err)
            return
        }
        else {
            successCallback()
        }
    })
}
brandsCtl.updateBrands = function (data, successCallback, failureCallback){
    connection.query("SELECT * FROM brands WHERE client_id = '"+ data.client_id + "' AND id = '"+ data.brand_id +"'", function(err,rows){
        if (err) {
            failureCallback(err)
            return
        }
        else if (rows.length>0){
            connection.query("UPDATE brands SET brand_name = '" + data.brand_name +"', brand_desc = '"+ data.brand_desc +"' WHERE id = '"+ data.brand_id +"'", function(err,rows){
                if (err) {
                    failureCallback(err)
                    return
                }else{
                    successCallback()
                }
            })
        }else{
            failureCallback("No brand found")
        }
    })
}
brandsCtl.deleteBrands = function (data, successCallback, failureCallback){
    connection.query("SELECT * FROM brands WHERE client_id = '"+ data.client_id + "' AND id = '"+ data.brand_id +"'", function(err,rows){
        if (err) {
            failureCallback(err)
            return
        }
        else if (rows.length>0){
            connection.query("DELETE FROM brands WHERE id = '"+ data.brand_id +"'", function(err,rows){
                if (err) {
                    failureCallback(err)
                    return
                }else{
                    successCallback()
                }
            })
        }else{
            failureCallback("No brand found")
        }
    })
}
module.exports = brandsCtl