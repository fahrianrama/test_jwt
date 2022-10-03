// Import dependencies
const passport = require('passport')
const express = require('express')
const clientsCtl = require('../controller/clients')
// Set up middleware
var requireAuth = passport.authenticate('jwt', {session: false})

// Export the routes for our app to use
module.exports = function (app) {
    // Initialize passport for use
    app.use(passport.initialize())
    // Bring in defined Passport Strategy
    require('../config/passport')(passport)
    const clientRoutes = express.Router()

    clientRoutes.get('/', requireAuth, function(request,response){
        if(request.user.role == 1 || request.user.role == 2){
            clientsCtl.getClients(function (res) {
                response.status(200).json(res)
            }, function (err) {
                return response.status(400).json({success: false, message: err})
            })
        }else{
            clientsCtl.findClients({
                username: request.user.username
            }, function(res){
                response.status(200).json(res)
            },function (err) {
                response.status(404).json({success: false, message: err})
            })
        }
    })
    
    clientRoutes.put('/update', requireAuth, function(request,response){
        if (!request.body.client_name || !request.user.username) {
            response.status(400).json({success: false, message: 'Please enter the all the data!.'})
        } else {
            if(request.user.role == 3){
                clientsCtl.findClients({
                    username: request.user.username
                }, function(res){
                    clientsCtl.updateClients({user_id: res.user_id, client_name: request.body.client_name},function(res){
                        response.status(200).json({success: true, message: "success update client data"})
                    },function(err){
                        response.status(404).json({success: false, message: err})    
                    })
                },function (err) {
                    response.status(404).json({success: false, message: err})
                })
            }else{
                response.status(401).json({success: false, message: "Unautorized!"})
            }
        }
    })

    clientRoutes.delete('/delete', requireAuth, function(request,response){
        if(request.user.role == 3){
            clientsCtl.findClients({
                username: request.user.username
            }, function(res){
                clientsCtl.deleteClients({user_id: res.user_id},function(res){
                    response.status(200).json({success: true, message: "success delete client data"})
                },function(err){
                    response.status(404).json({success: false, message: err})    
                })
            },function (err) {
                response.status(404).json({success: false, message: err})
            })
        }else{
            response.status(401).json({success: false, message: "Unautorized!"})
        }
    })

    app.use('/api/clients', clientRoutes)
}