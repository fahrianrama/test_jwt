// Include our packages in our main server file
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const passport = require('passport')
const config = require('./config/main')
const cors = require('cors')
const port = process.env.PORT | 8080

// Use body-parser to get POST requests for API use
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())

// Log requests to console
app.use(morgan('tiny'))

// Home route. We'll end up changing this to our main front end index later.
app.get('/', function (req, res) {
    res.send('This Route is not yet defined.')
})

require('./routers/users')(app)
require('./routers/clients')(app)
require('./routers/brands')(app)

// Start the server
app.listen(port)
console.log('Your server is running on port ' + port + '.')
