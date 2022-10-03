// Import dependencies
const passport = require('passport')
const express = require('express')
const brandsCtl = require('../controller/brands')
const clientsCtl = require('../controller/clients')
// Set up middleware
var requireAuth = passport.authenticate('jwt', {session: false})
// Creating a connection object for connecting to mysql database
require("../config/connection")

module.exports = function (app) {
    // Initialize passport for use
    app.use(passport.initialize())

    // Bring in defined Passport Strategy
    require('../config/passport')(passport)

    const brandRoutes = express.Router()

    brandRoutes.get('/', requireAuth, function(request,response){
        brandsCtl.getBrands(function (res) {
            response.status(200).json(res)
        }, function (err) {
            return response.status(200).json({success: true, message: err})
        })
    })
    brandRoutes.get('/mybrands', requireAuth, function(request,response){
        if(request.user.role == 1 || request.user.role == 2){
            return response.status(404).json({success: false, message: "You cannot access this!"})
        }else{
            clientsCtl.findClients({
                username: request.user.username
            }, function(res){
                brandsCtl.findBrands({
                    client_id: res.id
                },function(res){
                    response.status(200).json(res)
                },function(err){
                    response.status(400).json({success: false, message: err})
                })
            },function (err) {
                return response.status(400).json({success: false, message: err})
            })
        }
    })
    brandRoutes.post('/store', requireAuth, function(request,response){
        if(request.user.role == 1 || request.user.role == 2){
            return response.status(401).json({success: false, message: "Unauthorized!"})
        }else{
            clientsCtl.findClients({
                username: request.user.username
            }, function(res){
                brandsCtl.storeBrands({
                    client_id: res.id,
                    brand_name: request.body.brand_name,
                    brand_desc: request.body.brand_desc
                },function(res){
                    response.status(200).json({success: true, message: "Brand stored!"})
                },function(err){
                    response.status(400).json({success: false, message: err})
                })
            },function (err) {
                return response.status(400).json({success: false, message: err})
            })
        }
    })
    brandRoutes.put('/update/:id',requireAuth, function(request, response){
        if(request.user.role == 1 || request.user.role == 2){
            return response.status(401).json({success: false, message: "Unauthorized!"})
        }else{
            if(!request.body.brand_name || !request.body.brand_desc){
                return response.status(400).json({success: false, message: "Fill all the data!"})
            }
            else{
                clientsCtl.findClients({
                    username: request.user.username
                }, function(res){
                    brandsCtl.updateBrands({
                        brand_id: request.params.id,
                        client_id: res.id,
                        brand_name: request.body.brand_name,
                        brand_desc: request.body.brand_desc
                    },function(res){
                        response.status(200).json({success: true, message: "Brand updated!"})
                    },function(err){
                        response.status(400).json({success: false, message: err})
                    })
                },function (err) {
                    return response.status(400).json({success: false, message: err})
                })
            }
        }
    })
    brandRoutes.delete('/delete/:id',requireAuth, function(request, response){
        if(request.user.role == 1 || request.user.role == 2){
            return response.status(401).json({success: false, message: "Unauthorized!"})
        }else{
            clientsCtl.findClients({
                username: request.user.username
            }, function(res){
                brandsCtl.deleteBrands({
                    brand_id: request.params.id,
                    client_id: res.id,
                    brand_name: request.body.brand_name,
                    brand_desc: request.body.brand_desc
                },function(res){
                    response.status(200).json({success: true, message: "Brand deleted!"})
                },function(err){
                    response.status(400).json({success: false, message: err})
                })
            },function (err) {
                return response.status(400).json({success: false, message: err})
            })
        }
    })

    app.use('/api/brands', brandRoutes)
}