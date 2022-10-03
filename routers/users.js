// Import dependencies
const passport = require('passport')
const express = require('express')
const config = require('../config/main')
const jwt = require('jsonwebtoken')
const crypt = require('../app/crypt')
const usersCtl = require('../controller/users')
// Set up middleware
var requireAuth = passport.authenticate('jwt', {session: false})

// Export the routes for our app to use
module.exports = function (app) {
    // Initialize passport for use
    app.use(passport.initialize())

    // Bring in defined Passport Strategy
    require('../config/passport')(passport)

    // Create API group routes
    const apiRoutes = express.Router()
    const userRoutes = express.Router()

    userRoutes.get('/', requireAuth, function(request,response){
        if(request.user.role == 1 || request.user.role == 2){
            usersCtl.getUsers(function (res) {
                response.status(200).json(res)
            }, function (err) {
                return response.status(400).json({success: false, message: err})
            })
        }else{
            console.log(request.user.username)
            usersCtl.findUser({
                username: request.user.username
            }, function(res){
                response.status(200).json(res)
            },function (err) {
                response.status(404).json({success: false, message: err})
            })
        }
    })
    // Register new users
    userRoutes.post('/register', requireAuth, function (request, response) {
        if(request.user.role == 3){
            response.status(401).json({success: false, message: 'Unauthorized!'})
        } else{
            if (!request.body.username || !request.body.email || !request.body.password) {
                response.status(400).json({success: false, message: 'Please enter all the data!.'})
            } else {
                var newUser = request.body
                if(!request.body.role){
                    newUser.role = 3
                }
                if(request.user.role == 2){
                    newUser.role = 3
                }
                // Attempt to save the user
                usersCtl.createUser(newUser, function (res) {
                    response.status(201).json({success: true, message: 'Successfully created new user.'})
                }, function (err) {
                    return response.status(400).json({success: false, message: 'This username already exists.'})
                })
            }
        }
    })

    // Authenticate the user and get a JSON Web Token to include in the header of future requests.
    userRoutes.post('/authenticate', function (request, response) {
        usersCtl.findUser({
            username: request.body.username
        }, function (res) {
            var user = {
                user_id: res.id,
                username: res.username,
                email: res.email,
                role: res.role
            }
            // Check if password matches
            crypt.compareHash(request.body.password, res.password, function (isMatch) {
                if (isMatch) {
                    // Create token if the password matched and no error was thrown
                    var token = jwt.sign(user, config.secret, {
                        expiresIn: 10080 // in seconds
                    })
                    response.status(200).json({success: true, token: 'JWT ' + token})
                } else {
                    response.status(401).json({
                        success: false,
                        message: 'Authentication failed. Passwords did not match.'
                    })
                }
            })
        }, function (err) {
            response.status(401).json({success: false, message: 'Authentication failed. User not found.'})
        })
    })

    userRoutes.put('/update', requireAuth, function(request,response){
        if (!request.body.username || !request.body.email || !request.body.password || !request.body.role) {
            response.status(400).json({success: false, message: 'Please enter the all the data!.'})
        } else {
            if(request.user.role != 1){
                response.status(401).json({success: false, message: 'Unauthorized!'})
            } else{
                var updateUser = request.body
                // Attempt to update the user
                usersCtl.updateUser(updateUser, function (res) {
                    response.status(200).json({success: true, message: `Successfully update user with username : ${updateUser.username}.`})
                }, function (err) {
                    return response.status(400).json({success: false, message: 'This username already exists.'})
                })
            }
        }
    })

    userRoutes.delete('/delete', requireAuth, function(request,response){
        if(request.user.role == 1){
            usersCtl.deleteUser({username: request.body.username
            },function (res) {
                response.status(200).json({success:true, message: `user with username : ${request.body.username} deleted`})
            }, function (err) {
                return response.status(400).json({success: false, message: err})
            })
        }else{
            response.status(401).json({success: false, message: "Unauthorized"})
        }
    })

    //Protected authenticated route with JWT
    apiRoutes.get('/dashboard', requireAuth, function (request, response) {
        response.send('It worked! username is ' + request.user.username + ', Role is: ' + request.user.role + '.')
    })

    // Set url for API group routes
    app.use('/api/users', userRoutes)
    app.use('/api', apiRoutes)
}
