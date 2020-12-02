const mongoose = require('mongoose')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema
require('dotenv').config()

const ImageSchema = require('./schema/image.schema')

const UserSchema = new Schema({
  username: { 
    type: String, 
    lowercase: true,
    required: true,
  },
  email: {
    type: String, 
    lowercase: true,
    required: true,
  },
  bio: { type: String, default: '' },
  profileImg: ImageSchema,
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  followersCount: { type: Number, default: 0 },
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  salt: String,
  hash: String
})

UserSchema.plugin(uniqueValidator, { message: ' is already taken'})
// set password
UserSchema.methods.setPassword = function(password){
  // encryption
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
}
// valid password
UserSchema.methods.verifyPassword = function(password){
  // decryption
  let hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
  return this.hash === hash
}
// authtojson
UserSchema.methods.toAuthJSON = function(){
  return {
    user: {
      username: this.username,
      email: this.email,
      bio: this.bio,
      token: this.generateToken(),
      profileImg: this.profileImg
    }
  }
}

UserSchema.methods.generateToken = function(){
  let today = new Date()
  let exp = new Date(today)
  exp.setDate(today.getDate() + 60)

  return jwt.sign({
    id: this._id,
    username: this.username,
  }, process.env.SECRET_KEY, { algorithm: 'HS256' })
}


UserSchema.methods.addFollowers = function(id){
  this.followers.push(id)
  this.followersCount += 1

  this.save()
}

UserSchema.methods.removeFollowers = function(id){
  this.followers.remove(id)
  this.followersCount -= 1

  this.save()
}

UserSchema.methods.follow = function(id){
  this.following.push(id)

  return this.save()
}

UserSchema.methods.unfollow = function(id){
  this.following.remove(id)

  return this.save()
}

UserSchema.methods.toProfileJSON = function(user){
  return{
    username: this.username,
    bio: this.bio,
    profileImg: this.profileImg,
    followers: this.followers,
    followersCount: this.followersCount,
    isFollowing: user.isFollowing(this._id),
    isYourProfile: this.isYourProfile(user.id)
  }
}

UserSchema.methods.isYourProfile = function(id){
  return this._id.toString() === id.toString()
}

UserSchema.methods.isFollowing = function(id){
  let following = this.following

  for(let i = 0; i < following.length; i++){
    if(following[i]._id.toString() === id.toString()){
      return true
    }
  }

  return false
}

UserSchema.methods.isYourComment = function(user){
  if(this._id.toString() === user._id.toString()){
    return true
  } else {
    return false
  }
}

UserSchema.methods.updateUser = function(creds){
  if(creds.username){ this.username = creds.username }
  if(creds.password){ this.setPassword(creds.password) }
  if(creds.email){ this.email = creds.email }
  if(creds.bio){ this.bio = creds.bio}
  if(creds.profileImg){ this.profileImg = creds.profileImg }

  return this.save()
}

UserSchema.methods.getResources = function(){
  return {
    profileImg: this.profileImg,
    bio: this.bio,
    email: this.email,
    username: this.username
  }
}

module.exports = {
  UserSchema,
  UserModel: new mongoose.model('User', UserSchema)
}