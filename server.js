const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('express-flash')
const logger = require('morgan')
const connectDB = require('./config/database')
const methodOverride = require("method-override");
const mainRoutes = require('./routes/main')
const plantRoutes = require('./routes/plants')
const idRoutes = require('./routes/ids')

require('dotenv').config({path: './config/.env'})

// Passport config
require('./config/passport')(passport)

connectDB()

app.set('view engine', 'ejs')
app.use(express.static('public'))

//set up static routes to serve leaflet css and js
// app.use('/scripts', express.static(__dirname + '/node_modules/leaflet/dist/'));

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//ts
const bodyParser = require('body-parser');            
app.use(bodyParser.json({limit:'50mb'}));
//ts
 
app.use(bodyParser.urlencoded({extended:true, limit:'50mb'})); 

app.use(logger('dev'))
app.use(methodOverride("_method"));
// Sessions
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  )
  
// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
  
app.use('/', mainRoutes)
app.use('/plants', plantRoutes)
app.use('/id', idRoutes)
 
app.listen(process.env.PORT || 3000, ()=>{
    console.log('Server is running, you better catch it!')
})    