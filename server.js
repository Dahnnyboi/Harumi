const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const cors = require('cors')
const app = express()
const PORT = 5000

require('dotenv').config()
const corsOption = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": true,
  "optionsSuccessStatus": 204
}
app.use(cors(corsOption))
const isProduction = process.env.NODE_ENV === 'production'

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true , useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('We are connected to database')
})
mongoose.set('useCreateIndex', true);

// development mode
if(!isProduction){
  app.use(function(err, req, res, next){
    console.log(err.stack)

    res.json({ 'errors' : {
      message: err.message,
      error: err
    }})
  })
}

// production mode
if(isProduction){
  app.use(function(err, req, res, next){
    res.status(err.status || 500)
    res.json({ 'errors' : {
      message: err.message,
      error: {}
    }})
  })
}

app.use(express.json())
app.use(express.urlencoded({ extended: false}))
app.use(passport.initialize());
app.use(passport.session());
app.use('/public', express.static('public'))
require('./config/passport.config')

app.use('/api/users', require('./api/routes/user.routes'))
app.use('/api/posts', require('./api/routes/post.routes'))
app.use('/api/profiles', require('./api/routes/profile.routes'))
app.use('/', function(req, res){
  res.json({ message: 'welcome to social media backend'})
})


app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}...`)
})