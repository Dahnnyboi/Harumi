const passport = require('passport')
const {UserModel} = require('../models/User.model')
const LocalStrategy = require('passport-local').Strategy

passport.use(new LocalStrategy({
  usernameField: 'user[email]',
  passwordField: 'user[password]'
}, function(email, password, done) {
    UserModel.findOne({ email: email}, function(err, user){
      if(err) { return done(err, false, { message: 'Error in passport'}) }
      if(!user) { return done(err, false, { message: 'User doesnt exist'}) }
      if(!user.verifyPassword(password)) { return done(err, false, { message: 'Invalid password' }) }

      return done(null, user)
    }).catch(done)
  }
))